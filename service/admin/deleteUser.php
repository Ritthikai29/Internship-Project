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


//ไม่ได้ลบ User จริงๆ แค่เปลี่ยนสถานะ user

// เช็ค HTTP request methods ว่าเป็น PATCH methods ไหม
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
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

$body = json_decode(file_get_contents('php://input'), true);
$empId = $template->valVariable(isset($body["empId"]) ? $body["empId"] : null, "empId");
$service->startTransaction();
$suscess = $service->updateUserIsActive(0,$empId);
if (!$suscess) {
    $service->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "ลบ User ไม่สำเร็จ",
            "status" => 403
        ]
    );
}

$service->commitTransaction();
$http->Ok(
    [
        "data" => "ลบ User สำเร็จ",
        "status" => 200
    ]
);
