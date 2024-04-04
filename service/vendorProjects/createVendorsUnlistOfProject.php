<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include("./../middleware/authentication.php");
include("./vendorProjectService.php");
include_once("../Template/SettingMailSend.php");
include_once(__DIR__ . "/mails/funcVerifyMail.php");
include_once(__DIR__ . "/mails/funcCCVerifyMail.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();
$vendorProjectService = new VendorProjectService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "not found a user id ",
            "status" => 401
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);

$unlistVendorsInput = isset($body["unlistVendor"]) ? $body["unlistVendor"] : null;
// $unlistVendorsInput = $template->ValArrVariable($unlistVendorsInput);

$reasonToApprove = isset($body["reason"]) ? $body["reason"] : null;
$reasonToApprove = $template->valVariable($reasonToApprove, "เหตุผลการขอ approve");

// ผู้จัดการจ้างเหมา
$verifierId = isset($body["verifier_id"]) ? $body["verifier_id"] : null;
$verifierId = $template->valVariable($verifierId, "ไม่พบ id ของผู้ตรวจสอบ");

// ผู้จัดการโรงงาน (ผร)
$approverId = isset($body["approver_id"]) ? $body["approver_id"] : null;
$approverId = $template->valVariable($approverId, "ไม่พบข้อมูลของผู้อนุมัติ");

$ccSendId = isset($body["cc_send_id"]) ? $body["cc_send_id"] : null;
// $ccSendId = $template->valFilter($ccSendId);

$projectId = isset($body["project_id"]) ? $body["project_id"] : null;
$projectId = $template->valVariable($projectId, "ไอดีโครงการ");

$vendorProjects = [];
$vendorProjectService->startTransaction();

/**
 * checking before insert a new approve vendor 
 * ต้องเช็คว่ามี vendor นอกลิสต์ที่ยังไม่ได้รับการ approve หรือไม่ 
 * ถ้ามี ต้องสร้างอันใหม่ไม่ได้
 */
// $checkAVendor = $vendorProjectService->listVendorNonApproveByProjectId($projectId);
// if ($checkAVendor) {
//     $http->Forbidden(
//         [
//             "err" => "กำลังรอการอนุมัติจากผู้ตรวจสอบ และอนุมัติ",
//             "status" => 403
//         ]
//     );
// }


$vendorAdded = [];
/**
 * loop for check all vendor is have or not 
 * 1. if have will get a id and use it to save to database
 * 2. if haven't will create before use id to save to database
 */
foreach ($unlistVendorsInput as $body) {
    $vendorKey = $template->valFilter(isset($body["vendor_key"]) ? $body["vendor_key"] : null);
    $companyName = $template->valVariable(isset($body["company_name"]) ? $body["company_name"] : null, "ชื่อบริษััท");
    $email = $template->valVariable(isset($body["email"]) ? $body["email"] : null, "email");
    $managerName = $template->valVariable(isset($body["manager_name"]) ? $body["manager_name"] : null, "ชื่อผู้รับผิดชอบ");
    $managerRole = $template->valVariable(isset($body["manager_role"]) ? $body["manager_role"] : null, "ตำแหน่งของผู้รับผิดชอบ");
    $phoneNumber = $template->valVariable(isset($body["phone_number"]) ? $body["phone_number"] : null, "เบอร์โทร");
    $affiliated = $template->valVariable(isset($body["affiliated"]) ? $body["affiliated"] : null, "สังกัด");
    $location = $template->valVariable(isset($body["location_detail"]) ? $body["location_detail"] : null, "ที่อยู่");
    $locationMainId = $template->valVariable(isset($body["location_main_id"]) ? $body["location_main_id"] : null, "ข้อมูลตามเลข zip");
    $note = $template->valFilter(isset($body["note"]) ? $body["note"] : null);


    /**
     * first check is have a vendor ?
     * 
     * @var array
     */
    if (!$vendorKey) {
        // not have a vendor key is mean vendor is a first time
        // create a vendor
        do {
            $prevVendor = $vendorProjectService->getLatestVendor();
            $vendorKeyRandom = ++$prevVendor["vendor_key"];
            $vendor = $vendorProjectService->getVendorByVendorKey($vendorKeyRandom);
        } while ($vendor); // if found a vendor is mean vendor is duplicate gen again

        $data = [
            "vendor_key" => $vendorKeyRandom,
            "password" => null,
            "company_name" => $companyName,
            "add_datetime" => date("Y-m-d H:i:s"),
            "email" => $email,
            "manager_name" => $managerName,
            "manager_role" => $managerRole,
            "phone_number" => $phoneNumber,
            "affiliated" => $affiliated,
            "vendor_type" => "unlist",
            "location_detail" => $location,
            "note" => $note,
            "vendor_level" => null,
            "location_main_id" => $locationMainId
        ];
        $unlistVendor = $vendorProjectService->createVendor($data);
    } else {
        // if have a vendor key is mean old vendor is registering
        $unlistVendor = $vendorProjectService->getVendorByVendorKey($vendorKey);
        if (!$unlistVendor) {
            $http->NotFound(
                [
                    "err" => "vendor is not found please check your vendor key",
                    "status" => 404
                ]
            );
        }

        // check this vendor is join in the project ?
        /**
         * list vendor project by project id
         * @var array
         */
        // $oldVendor = $vendorProjectService->listVendorProjectByProjectId($projectId);
        // foreach ($oldVendor as $value) {
        //     if ($value["vendor_id"] == $unlistVendor["id"]) {
        //         $http->Forbidden(
        //             [
        //                 "err" => "it duplicate vendor please fix it",
        //                 "status" => 403
        //             ]
        //         );
        //     }
        // }
        // update a unlist vendor by vendor id
        $unlistVendor = $vendorProjectService->updateVendorById(
            [
                "vendor_id" => $unlistVendor["id"],
                "company_name" => $companyName,
                "email" => $email,
                "manager_name" => $managerName,
                "manager_role" => $managerRole,
                "phone_number" => $phoneNumber,
                "affiliated" => $affiliated,
                "vendor_type" => "unlist",
                "location_detail" => $location,
                "note" => $note,
                "vendor_level" => null,
                "location_main_id" => $locationMainId
            ]
        );

    }
    // vendor project in database
    $vendorProject = $vendorProjectService->createVendorProject(
        [
            "project_id" => $projectId,
            "vendor_id" => $unlistVendor["id"],
            "passcode" => null,
            "approve" => null,
            "adder_user_staff_id" => $userId,
            // will use a user id from token user
        ]
    );
    $unlistVendor["location_main"] = $vendorProjectService->getVendorLocationMainById($unlistVendor["location_main_id"]);
    array_push($vendorAdded, $unlistVendor);

    // for vendor project id 
    array_push($vendorProjects, $vendorProject);

}

/**
 * insert a stsbidding_approve_vendor_projects to database
 * 
 * @var array
 */
$data = [
    "approver1_id" => $verifierId,
    "approver2_id" => $approverId,
    "reason_to_approve" => $reasonToApprove
];
$approveVendorProject = $vendorProjectService->createApproveVendorProject($data);


$vendorProjectHasApproveVendorProjects = [];
foreach ($vendorProjects as $value) {
    $data = [
        "approve_vendor_project_id" => $approveVendorProject["id"],
        "vendor_project_id" => $value["id"]
    ];
    $link = $vendorProjectService->createLinkVendorProjectToApprove($data);
    array_push(
        $vendorProjectHasApproveVendorProjects,
        $link
    );

}


/**
 * change project status 
 */
$projectStatusForUpdate = $vendorProjectService->getProjectStatusByName(
    "รออนุมัติรับเหมานอก List"
);
$data = [
    "pj_id" => $projectId,
    "status_id" => $projectStatusForUpdate["id"]
];
$projectUpdated = $vendorProjectService->updateProjectStatusById($data);
if (!$projectUpdated) {
    $vendorProjectService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "can't update project",
            'status' => 404
        ]
    );
}


/**
 * send a mail to ผู้จัดการจ้างเหมา
 */
// 1. ค้นหา email ของผู้จัดการจ้างเหมา (ชื่อ นามสกุล)
$headContractor = $vendorProjectService->getUserStaffById($verifierId);

$project = $vendorProjectService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลโครงการ",
            "status" => 404
        ]
    );
}

// 2. เพิ่ม Email ของผู่จัดการจ้างเหมาเป็นผู้รับ Email
$departmentProject = $vendorProjectService->getDepartmentById($project["department"]);
$project["department"] = $departmentProject["department_name"];
$mail->sendTo($headContractor["email"]);
$mail->sendCc($headContractor["email"]);
$mail->addSubject('โปรดอนุมัติการชออนุมัติผู้เข้าร่วมประกวดราคานอก List ทะเบียน ชื่อโครงการ ' . $project['name'] . ' เลขที่ ' . $project['key']);
$mail->addBody(
    htmlMailApproveVendor(
        $project,
        $approveVendorProject,
        $vendorAdded,
        $reasonToApprove,
        $headContractor
    )
);
if ($_ENV["DEV"] === false) {
    $success = $mail->sending();
    if ($success === null) {
        $vendorProjectService->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "ไม่สามารถส่งอีเมล์ถึงผู้จัดการจ้างเหมาได้",
                "status" => 403
            ]
        );
    }
}

$mail->clearAddress();


// /**
//  * send mail to CC user
//  */
if ($ccSendId !== null) {
    foreach($ccSendId as $value){
    
    /**
     * บันทึก CC เลือกนอกลิสต์
     * 
     */
    $data = [
        "approve_vendor_project_id" => $approveVendorProject["id"],
        "cc_id" => $value
    ];
    $ccInsert = $vendorProjectService->insertCCUnlist($data);

    $ccUser = $vendorProjectService->getUserStaffById($value);
    if (!$ccUser) {
        $http->Forbidden(
            [
                "err" => "ไม่พบรายชื่อผู้รับ CC",
                "status" => 403
            ]
        );
    }
    $mail->sendCc($ccUser["email"]);
}
    $mail->addSubject(
        "(CC) แจ้งขออนุมัติ ผู้เข้าร่วมการประมูลนอกทะเบียนโครงการ $project[name]"
    );
    $mail->addBody(
        htmlMailCCVerifyMail(
            $project,
            $approveVendorProject,
            $vendorAdded,
            $reasonToApprove,
            $headContractor
        )
    );

    if ($_ENV["DEV"] === false) {
        $success = $mail->sending();
        if ($success === null) {
            $vendorProjectService->rollbackTransaction();
            $http->Forbidden(
                [
                    "err" => "ไม่สามารถส่งอีเมล์ถึงผู้จัดการจ้างเหมาได้",
                    "status" => 403
                ]
            );
        }
    }


    $mail->clearAddress();
}

$vendorProjectService->commitTransaction();



$http->Ok(
    [
        "data" => [
            "vendorIds" => $vendorAdded,
            "vendorProjectId" => $vendorProjects,
            // it mean vendor 
            "approve_vendor_projects" => $approveVendorProject,
            "project" => $projectUpdated,
            "email" => isset($success) ? $success : false,
            "vendor_project_has_approve_vendor_project" => $vendorProjectHasApproveVendorProjects
        ],
        "status" => 200
    ]
);