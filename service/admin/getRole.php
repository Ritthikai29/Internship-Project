<?php
session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../middleware/authentication.php");
include_once("../Template/SettingEncryption.php");

include_once(__DIR__ . "/adminService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$service = new AdminService();


// เช็ค HTTP request methods ว่าเป็น GET methods ไหม
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

// เช็ค authorize
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบข้อมูล user นี้",
            "status" => 401
        ]
    );
}


// เช็คว่าเป็น admin จริงไหม
$user = $service->getUserByIdAndRole($userId,"admin");
if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่ Admin ไม่มีสิทธิ์ในการกระทำดังกล่าว",
            "status" => 401
        ]
    );
}

$userall = $service -> getAllRole();

$http->Ok(
    [
        "data" => $userall,
        "status" => 200
    ]
);
