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
$vendorProjectService->startTransaction();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
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

$approveVendorProjectId = isset($_GET["avpId"]) ? $_GET["avpId"] : null;
$approveVendorProjectId = $template->valVariable($approveVendorProjectId, "approve vendor project id");

/**
 * find a approve vendor project by id
 * 
 * @var array
 */
$approveVendorProject = $vendorProjectService->getApproveVendorProjectById($approveVendorProjectId);

// check a approve vendor project is null
if (!$approveVendorProject || !is_null($approveVendorProject["approve1"])) {
    $http->NotFound(
        [
            "err" => "ท่านเคยอนุมัติไปแล้ว หรือไม่พบข้อมูลการขออนุมัติ",
            "status" => 404
        ]
    );
}

/**
 * check this verifier is a correct user
 */
if ($approveVendorProject["approver1_id"] !== $userId) {
    // if approve vendor project is not correct
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่ผู้อนุมัติของโครงการนี้",
            "status" => 401
        ]
    );
}

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
    "approve1" => 1,
    "approve2" => $approveVendorProject["approve2"],
    "reason_to_approve" => $approveVendorProject["reason_to_approve"]
];

$vendorProjectService->updateApproveVendorProjectById($data);
if (!$vendorProjectService) {
    $http->Forbidden(
        [
            "err" => "cannot update this project please use it next time",
            "status" => 403
        ]
    );
}

$approver2UserStaff = $vendorProjectService->getUserStaffById($approveVendorProject["approver2_id"]);

/**
 * list vendor wait to approve 
 */
$listVendorWaitApprove = $vendorProjectService->getAllVendorByApId($approveVendorProjectId);
foreach ($listVendorWaitApprove as $index => $value) {
    $listVendorWaitApprove[$index]["location_main"] = $vendorProjectService->getLocationMainById($listVendorWaitApprove[$index]["location_main_id"]);
}

// send mail ไปหา ผร
$project = $vendorProjectService->getProjectByApproveVendorProjectId($approveVendorProjectId);
$mail->sendTo($approver2UserStaff["email"]);
$mail->addSubject("ขอเรียนเชิญผู้จัดการโรงงาน เข้าสู่การอนุมัติกลุ่มจ้างเหมานอกลิสต์ทะเบียน ในโครงการ" .$project['name'] . ' เลขที่เอกสาร '.$project['key']);
require(__DIR__ . "/mails/funcApproveMail.php");
$mail->addBody(
    htmlMail(
        $project,
        $approveVendorProjectId,
        $listVendorWaitApprove,
        $approveVendorProject["reason_to_approve"],
        $approver2UserStaff
    )
);
if ($_ENV["DEV"] === false) {
    $success = $mail->sending();
    if (!$success) {
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
        "data" => $data,
        "status" => 200
    ]
);