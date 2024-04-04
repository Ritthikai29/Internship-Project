<?php
// from a link should be have a stsbidding_approve_vendor_projects id 
// for look a data is a for this user or not ?
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include("./../middleware/authentication.php");
include("./vendorProjectService.php");
include_once("../Template/SettingMailSend.php");
$mail = new Mailing();

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$vendorProjectService = new VendorProjectService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);


$rejectTopicId = isset($body["reject_topic_id"]) ? $body["reject_topic_id"] : null;
$rejectTopicId = $template->valVariable($rejectTopicId, "หัวข้อการปฏิเสธ");

$rejectDetail = isset($body["reject_detail"]) ? $body["reject_detail"] : null;
$rejectDetail = $template->valVariable($rejectDetail, "เนื้อหาการปฏิเสธ");

$approveVendorProjectId = isset($body["avp_id"]) ? $body["avp_id"] : null;
$approveVendorProjectId = $template->valVariable($approveVendorProjectId, "ไอดีการอนุมัติโครงการ");

// ---------- AUTHENTICATION  UPDATE
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
// ---------- END AUTHENTICATION UPDATE

/**
 * find a reject topic from reject topic id
 * 
 * @var array
 */
$rejectTopic = $vendorProjectService->getRejectTopicById($rejectTopicId);
if(!$rejectTopic){
    $http->NotFound(
        [
            "err" => "Not found a reject topic",
            "status" => 404
        ]
    );
}

$vendorProjectService->startTransaction();

/**
 * create a reject vendor project 
 * 
 * @var array
 */
$rejectVendorProject = $vendorProjectService->createRejectVendorProject(
    [
        "reject_topic_id" => $rejectTopic["id"],
        "reject_detail" => $rejectDetail
    ]
);

/**
 * find a approve Vendor Project
 */
$approveVendorProject = $vendorProjectService->getApproveVendorProjectById($approveVendorProjectId);
// check a approve vendor project is null
if(!$approveVendorProject || !is_null($approveVendorProject["approve1"])){
    $vendorProjectService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a approve vendor or you is have be approve this ?",
            "status" => 404
        ]
    );
}

/**
 * check this verifier is a correct user
 */
if($approveVendorProject["approver1_id"] !== $userId){
    // if approve vendor project is not correct
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่ผู้อนุมัติของโครงการนี้",
            "status" => 401
        ]
    );
}

/**
 * change a status to 0 (is mean reject) and add a reject reason
 * send a mail to verified
 */
$data = [
    "avp_id" => $approveVendorProject["id"],
    "reject1_id" => $rejectVendorProject["id"], // reject from created
    "reject2_id" => $approveVendorProject["reject2_id"],
    "approver1_id" => $approveVendorProject["approver1_id"],
    "approver2_id" => $approveVendorProject["approver2_id"],
    "approve1" => 0, // un approve this project => end process 
    "approve2"  => $approveVendorProject["approve2"],
    "reason_to_approve" => $approveVendorProject["reason_to_approve"]
];

$approveVendorProjectUpdated = $vendorProjectService->updateApproveVendorProjectById($data);
if(!$approveVendorProjectUpdated){
    $vendorProjectService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "cannot update a approve vendor project",
            "status" => 403
        ]
    );
}

/**
 * list all vendor projct of the approve vendor project
 * 
 * @var array
 */
$vendorProjects = $vendorProjectService->listVendorProjectByApproveVendorProjectId($approveVendorProjectUpdated["id"]);
if(!$vendorProjects){
    $vendorProjectService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a vendor project",
            "status" => 404
        ]
    );
}
$vendorProjectUpdates = [];
foreach($vendorProjects as $vendorProject){
    $data = [
        "vp_id" => $vendorProject["id"],
        "project_id" => $vendorProject["project_id"],
        "vendor_id" => $vendorProject["vendor_id"],
        "passcode" => null,
        "approve" => 0,
        "adder_user_staff_id" => $vendorProject["adder_user_staff_id"]
    ];
    $vendorProjectUpdated = $vendorProjectService->updateVendorProject($data);
    if(!$vendorProjectUpdated){
        $http->Forbidden(
            [
                "err" => "can't update a vendor project",
                "status" => 403
            ]
        );
    }
    array_push($vendorProjectUpdates, $vendorProjectUpdated);
}

/**
 * Update Project Status
 * 
 */
$prepareProject = [
    "status_id" => 30,
    "pj_id" => $vendorProject["project_id"]
];
$projectUpdate = $vendorProjectService->updateProjectStatusById($prepareProject);
if(!$projectUpdate){
    $http->BadRequest(
        [
            "err" => "ไม่สามารถอัพเดตสถานะโครงการได้",
            "status" => 400
        ]
    );
}
/**
 * send mail to หน่วยงานจ้างเหมาที่ทำการเพิ่ม vendor นี้
 */
$project = $vendorProjectService->getProjectByApproveVendorProjectId($approveVendorProjectId);
$contractor = $vendorProjectService->getUserStaffById($vendorProject["adder_user_staff_id"]);
require(__DIR__ . "/mails/funcRejectMail.php");
$mail->sendTo($contractor["email"]);
$mail->addSubject("กลุ่มผู้รับเหมานอกลิสต์ทะเบียนที่ขออนุมัติได้รับการปฏิเสธ จาก โครงการ$project[name] เลขที่เอกสาร $project[key]");
$mail->addBody(
    funcMailReject(
        $rejectTopic["reject_topic"] . " " . $rejectDetail,
        $project,
        $contractor
    )
);
if($_ENV["DEV"] === false){
    $success = $mail->sending();
    if(!$success){
        $vendorProjectService->rollbackTransaction();
        $http->BadRequest(
            [
                "err" => "ไม่สามารถส่งอีเมล์ได้",
                "status" => 400
            ]
        );
    }
}

$vendorProjectService->commitTransaction();

$http->Ok(
    [
        "data" => $vendorProjectUpdates,
        "status" => 200
    ]
);

