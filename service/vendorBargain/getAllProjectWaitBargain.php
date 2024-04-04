<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("../Template/SettingMailSend.php");

include_once("./bargainService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$bargainService = new BargainService();

$bargainService->startTransaction();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}
/**
 * 1. authorize a vendor of the project
 */
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบข้อมูล Vendor กรุณา Login ใหม่",
            "status" => 401
        ]
    );
}
// -------------------------- START CHECK ROLE OF THE USER STAFF -----------------------------
/**
 * find a user is a secretary ? 
 */

$isOk = false;
$roleCheck = [
    "secretary"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $bargainService->getUserByIdAndRole($userId, $roleCheck[$i]);
    if ($user) {
        $isOk = true;
    }
    $i++;
} while (!$isOk && $countRole > $i);

if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่กลุ่มกรรมการในระบบ",
            "status" => 401
        ]
    );
}

// -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------

$projects = $bargainService->getAllProjectWaitBargain();

$http->Ok(
    [
        "data" => $projects,
        "status" => 200
    ]
);