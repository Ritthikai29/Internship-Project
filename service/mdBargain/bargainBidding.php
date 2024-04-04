<?php

session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../middleware/authentication.php");

include_once(__DIR__ . "/mdBargainService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$mail = new Mailing();

$service = new MdBargainService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * 1. authorize 
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

// -------------------------- START CHECK ROLE OF THE USER STAFF -----------------------------
/**
 * find a user is a MD or Plant Manager ? 
 */
$isOk = false;
$roleCheck = [
    "MD","Plant Manager"
 ];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $service->getUserByIdAndRole($userId, $roleCheck[$i],$roleCheck[$i+1]);
    if ($user) {
        $isOk = true;
     }
    $i++;
} while (!$isOk && $countRole > $i);
 
if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในการเสนอเจรจาต่อรอง",
            "status" => 401
        ]
    );
}
// -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------

$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");
$project = $service->getProjectByKey($projectKey);
if (!$project){
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการ",
            "status" => 404
        ]
    );
}

$secretarys = $service->getAllSecretary();
if (!$secretarys){
    $http->NotFound(
        [
            "err" => "ไม่พบ user secretary",
            "status" => 404
        ]
    );
}


$service->startTransaction();

$prepareProject = [
    "statusId" => 25,
    "projectId" => $project["id"]
];
$projectUpdate = $service->updateProjectStatusById($prepareProject);
if (!$projectUpdate) {
    $http->Forbidden(
        [
            "err" => "ไม่สามารถอัพเดตสถานะโครงการได้",
            "status" => 403
        ]
    );
}

require_once(__DIR__ . "/mails/funcMailSendtoSecretary.php");
foreach ($secretarys as $secretary) {
    $mail->sendTo($secretary["email"]);
}
$mail->addSubject("แจ้งเสนอเจรจาต่อรอง โครงการ$project[name] เลขที่เอกสาร $project[key]");
$mail->addBody(htmlMailToSecretary($project));
if ($_ENV["DEV"] === false) {
    $success = $mail->sending();
    if (!$success) {
        $service->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "ส่งอีเมลไม่สำเร็จ",
                "status" => 403
            ]
        );
    }
}
$mail->clearAddress();

$service->commitTransaction();

$http->Ok(
    [
        "data" => "เสนอเจรจาสำเร็จ",
        "status" => 200
    ]
);