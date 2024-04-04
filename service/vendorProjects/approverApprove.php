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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}
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

$approveVendorProjectId = isset($_GET["avpId"]) ? $_GET["avpId"] : null;
$approveVendorProjectId = $template->valVariable($approveVendorProjectId, "approve vendor project id");

/**
 * find a approve vendor project by id
 * 
 * @var array
 */
$approveVendorProject = $vendorProjectService->getApproveVendorProjectById($approveVendorProjectId);

// check a approve vendor project is null
if(!$approveVendorProject || 
(int)($approveVendorProject["approve1"]) !== 1 ||
!is_null($approveVendorProject["approve2"])
){
    $http->NotFound(
        [
            "err" => "not found a approve vendor or you don't have permission ?",
            "status" => 404
        ]
    );
}

// start the transection for ready insert database
$vendorProjectService->startTransaction();

/**
 * change a status to 1 (is mean approve)
 * send a mail to verified
 */
$data = [
    "avp_id" => $approveVendorProject["id"],
    "reject1_id" => $approveVendorProject["reject1_id"],
    "reject2_id" => $approveVendorProject["reject2_id"],
    "approver1_id" => $approveVendorProject["approver1_id"],
    "approver2_id" => $approveVendorProject["approver2_id"],
    "approve1" => $approveVendorProject["approve1"],
    "approve2"  => 1,
    "reason_to_approve" => $approveVendorProject["reason_to_approve"]
];
$approveVendorProjectUpdated = $vendorProjectService->updateApproveVendorProjectById($data);
if(!$approveVendorProjectUpdated){
    $vendorProjectService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "this project is can't update",
            "status" => 403
        ]
    );
}

// list all of vendor project of this approve file
$listVendorProjects = $vendorProjectService->listVendorProjectByApproveVendorProjectId($approveVendorProjectUpdated["id"]);

$vendorProjectsUpdated = [];
$projectId = "";
foreach($listVendorProjects as $vendorProject){
    $data = [
        "vp_id" => $vendorProject["id"],
        "project_id" => $vendorProject["project_id"],
        "vendor_id" => $vendorProject["vendor_id"],
        "passcode" => $vendorProject["passcode"],
        "approve" => 1,
        "adder_user_staff_id" => $vendorProject["adder_user_staff_id"]
    ];
    $vendorProjectUpdated = $vendorProjectService->updateVendorProject($data);
    if(!$vendorProjectUpdated){
        $vendorProjectService->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "can't update vendor project",
                "status" => 403
            ]
        );
    }
    array_push($vendorProjectsUpdated, $vendorProjectUpdated);
    $projectId = $vendorProject["project_id"];
}

/**
 * update status project by project id
 */
$statusUpdate = $vendorProjectService->getProjectStatusByName(
    "อนุมัติผู้รับเหมานอก List แล้ว"
);
$data = [
    "pj_id" => $projectId,
    "status_id" => $statusUpdate["id"]
];
$project = $vendorProjectService->updateProjectStatusById($data);
if(!$project){
    $vendorProjectService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "can't update status project",
            "status" => 400
        ]
    );
}


require(__DIR__ . "/mails/funcContractorMail.php");
// send mail ไปหา ผู้เพิ่ม vendor นี้ ว่า success นะ
$contractor = $vendorProjectService->getUserStaffById($vendorProject["adder_user_staff_id"]);
$mail->sendTo($contractor["email"]);
$mail->addSubject('ผลการอนุมัติผู้เข้าร่วมประกวดราคานอก List ทะเบียน โครงการ' . $project['name'] . ' เลขที่เอกสาร ' . $project['key']);
$mail->addBody(
    htmlMailtoContractorSuccess($project,$contractor)
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
        "update" => $approveVendorProjectUpdated,
        "listVendor" => $listVendorProjects,
        "vendor" => $vendorProjectsUpdated,
        "data" => "successful update the vendor project",
        "status" => 200
    ]
);
