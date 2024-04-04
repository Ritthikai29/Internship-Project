<?php
session_start();
include_once(__DIR__ ."/../Template/SettingTemplate.php");
include_once(__DIR__ ."/../Template/SettingApi.php");
include_once(__DIR__ ."/../Template/SettingAuth.php");
include_once(__DIR__ ."/../Template/SettingDatabase.php");
include_once(__DIR__ ."/../Template/SettingEncryption.php");
include_once(__DIR__ ."/../middleware/authentication.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ ."/./projectSettingService.php");

define("FILEURI", "/STSBidding/projectSetting");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$projectSettingService = new ProjectSettingService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * authentication 
 */
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


// Read and decode JSON data from the request body
$body = json_decode(file_get_contents('php://input'), true);

$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");
// Get Detail From Project Setting
$projectSettingInfo = $projectSettingService->getProjectSettingByProjectId($projectId);

// Get job type
$job_type = $projectSettingService->getProjectJobTypeByProjectId($projectId);

/**
 * find a project by project id (to check is have a project)
 */
$project = $projectSettingService->getProjectbyId($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found project",
            "status" => 404
        ]
    );
}

/**
 * check all vendor is more than 5 yep?
 */
$listVendorProjectApproveds = $projectSettingService->listVendorsHasApproveByProjectId($projectId);
if (!$listVendorProjectApproveds || count($listVendorProjectApproveds) < 5) {
    // when vendor is not found or less than 5 vendor approve in project
    $http->BadRequest(
        [
            "err" => "not found a vendor in list or vendor is less than 5",
            "status" => 400
        ]
    );
}

/**
 * find a project setting is have and approve is a null?
 * 1. if find is mean this project is ready to send a mail to vendor
 * 2. if approve = null is mean this data for send to vendor join bidding waiting for approve (ready to send mail to approver)
 * 3. if is_approver_send = null or 1 ,it mean approver is not do something or approve this project setting (mean can't send to approver)
 */
if (
    !$projectSettingInfo ||
    $projectSettingInfo["approve"] != null
) {
    $http->BadRequest(
        [
            "err" => "not found a project setting or project setting is waiting for approve",
            "status" => 400
        ]
    );
}

// Get Approve Info*
$approverInfo = $projectSettingService->getEmployeeInfoByUserstaffId((int)$projectSettingInfo['approver_id']);

/**
 * send email to ผจส for approve project setting 
 */
require(__DIR__ . "/mails/funcMailApprove.php");
$mail->sendTo($approverInfo["email"]);
$mail->addSubject("โปรดอนุมัติหนังสือเชิญ โครงการ$project[name] เลขที่เอกสาร $project[key]");
$mail->addBody(htmlMailSendToApproverTest($projectSettingInfo, $listVendorProjectApproveds, $approverInfo));

if (!$_ENV["DEV"]) {
    $success = $mail->sending();
    if (!$success) {
        $http->BadRequest(
            [
                "err" => "ไม่สามารถส่ง Email ได้",
                "status" => 400
            ]
        );
    }
}

/**
 * send a mail to ผจส ขออนุมัติส่งหนังสือเชิญ
 */

$http->Ok(
    [
        "data" => $projectSettingUpdated,
        "status" => 200
    ]
);