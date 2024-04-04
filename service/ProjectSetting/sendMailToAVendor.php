<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");

include_once("../middleware/authentication.php");
include_once("./projectSettingService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$projectSettingService = new ProjectSettingService();


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
$user = $projectSettingService->getUserStaffById($userId);
if (!$user) {
    $http->NotFound(
        [
            "err" => "not found a user by user id",
            "status" => 404
        ]
    );
}
$body = json_decode(file_get_contents('php://input'), true);
$projectId = isset($body["project_id"]) ? $body["project_id"] : null;
$projectId = $template->valVariable($projectId, "ไอดีโครงการ");

$vendorId = isset($body["vendor_id"]) ? $body["vendor_id"] : null;
$vendorId = $template->valVariable($vendorId, "vendor id");

$project = $projectSettingService->getProjectbyId($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project by id",
            "status" => 404
        ]
    );
}

/**
 * when send a data it will be generate a new passcode to every user
 */
$listVendorOfProject = $projectSettingService->listVendorsHasApproveByProjectId($project["id"]);
if (!$listVendorOfProject || count($listVendorOfProject) < 5) {
    $http->BadRequest(
        [
            "err" => "you can't send a email to vendor",
            "status" => 400
        ]
    );
}

$vendorToSend = $projectSettingService->getVendorProjectByProjectIdAndVendorId(
    $project["id"],
    $vendorId
);

// check this project is approve for sending?
$projectSetting = $projectSettingService->getProjectSettingByProjectId($project["id"]);
if (!$projectSetting || (int) $projectSetting["approve"] !== 1) {
    $http->NotFound(
        [
            "err" => "not found a project setting",
            "status" => 404
        ]
    );
}

$projectSettingService->startTransaction();



$passcode = $projectSettingService->getRandomString(5);
$passcodeHash = password_hash($passcode, PASSWORD_BCRYPT);

// update a passcode to project
$data = [
    "vp_id" => $vendorToSend["id"],
    "passcode" => $passcodeHash
];
$vendorUpdate = $projectSettingService->updateVendorProjectById($data);
if (!$vendorUpdate) {
    $http->NotFound(
        [
            "err" => "can't update a vendor",
            "status" => 404
        ]
    );
}

/**
 * send a email to vendor 
 */
$mail->sendTo($vendor["email"]);
$subjectEmail = "(resend) เชิญมาประกวดราคานะ";
$mail->addSubject($subjectEmail);

$bodyEmail = "ใช้ passcode อันนี้นะ เพราะว่าคุณ resend หน่ะ";
$mail->addBody($bodyEmail);

$mail->sending();

$http->Ok(
    [
        "data" => $listVendorUpdate,
        "status" => 200
    ]
);