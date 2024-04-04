<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");
include_once("./funcVendorFixMail.php");

include_once("../middleware/authentication.php");
include_once("./checkRegisterService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$checkService = new CheckService();

$tokenObject = JWTAuthorize($enc, $http);
$userId = isset($tokenObject->userId) ? $tokenObject->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "not found a user by user id",
            "status" => 401
        ]
    );
}

/**
 * check user is have in database (get all data of user)
 */
$user = $checkService->getUserStaffById($userId);

if (!$user) {
    $http->NotFound(
        [
            "err" => "not found a user by user id",
            "status" => 404
        ]
    );
}

/**
 * check is user is contractor
 * 
 */

 $userRole = $checkService->getUserRoleByUserId($userId);

 if ($userRole["role_name"] !== "Contractor"){
     $http->Forbidden(
         [
             "err" => "your account can not be access",
             "status" => 403
         ]
     );
 }

 // Check is a post methods
if ($_SERVER["REQUEST_METHOD"] != 'POST')
$http->MethodNotAllowed();

$body = json_decode(file_get_contents('php://input'), true);

$projectId = isset($body["project_id"]) ? $body["project_id"] : null;
$projectId = $template->valVariable($projectId, "ไอดีโครงการ");

$vendorId = isset($body["vendor_id"]) ? $body["vendor_id"] : null;
$vendorId = $template->valVariable($vendorId, "vendor id");

$reasonId = isset($body["reason_id"]) ? $body["reason_id"] : null;
$reasonId = $template->valVariable($reasonId, "reason id");

$message = isset($body["message"]) ? $body["message"] : null;
$message = $template->valVariable($message, "message");

// Check is projectKey is exist 
$project = $checkService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project id",
            "status" => 404
        ]
    );
}

$vendor = $checkService->getVendorInfoByVendId($vendorId);

$vendorToSend = $checkService->getVendorProjectInfoByVendIdAndProjId($vendorId,$projectId);

$projectSetting = $checkService->getProjectSettingByProjectId($project["id"]);
if (!$projectSetting || (int) $projectSetting["approve"] !== 1) {
    $http->NotFound(
        [
            "err" => "not found a project setting",
            "status" => 404
        ]
    );
}

$checkService->startTransaction();

$passcode = $checkService->getRandomString(5);
$passcodeHash = password_hash($passcode, PASSWORD_BCRYPT);


// update a passcode to project
$data = [
    "vp_id" => $vendorToSend["id"],
    "passcode" => $passcodeHash
];

$vendorUpdate = $checkService->updateVendorProjectById($data);
if (!$vendorUpdate) {
    $http->NotFound(
        [
            "err" => "can't update a vendor",
            "status" => 404
        ]
    );
}

$reason_id = $checkService->getReasonToFixFormById($reasonId);

/**
 * send a email to vendor 
 */
$mail->sendTo($vendor["email"]);
$subjectEmail = "แจ้งรายละเอียดเกี่ยวกับการลงทะเบียนโครงการ$project[name] เลขที่เอกสาร $project[key]";
$mail->addSubject($subjectEmail);

// ! Check Content Again //
/**
 * File name & Issue
 * 
 */

$body = file_get_contents("./funcVendorFixMail.php"); 

$mail->addBody($body);
$mail->addBody(htmlMail($project["name"], $reason_id[0]["msg_th"], $message, $vendor));

$mail->sending();

$http->Ok(
    [
        "data" => "Send Success",
        "status" => 200
    ]
);

