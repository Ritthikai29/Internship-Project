<?php

session_start();
include_once( __DIR__ . "/../Template/SettingApi.php");
include_once( __DIR__ . "/../Template/SettingTemplate.php");
include_once( __DIR__ . "/../Template/SettingAuth.php");
include_once( __DIR__ . "/../Template/SettingDatabase.php");
include_once( __DIR__ . "/../Template/SettingEncryption.php");
include_once( __DIR__ . "/../Template/SettingMailSend.php");
include_once( __DIR__ . "/../middleware/authentication.php");

include_once( __DIR__ . "/resetService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$resetService = new ResetPasswordService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$token = $template->valVariable(isset($_POST["token"]) ? $_POST["token"] : null, "token");
$password = $template->valVariable(isset($_POST["password"]) ? $_POST["password"] : null, "password");

// Check is password is old password
$info = $resetService->getInfoOfVendor($token);
if(!$info){
    $http->BadRequest([
        "err" => "Token หมดอายุ"
    ]);
};

$check = password_verify($password, $info["password"]);
if($check){
    $http->Unauthorize([
        "err" => "ไม่สามารถตั้งโดยใช้รหัสผ่านก่อนหน้าได้"
    ]);
};

$password_hash = password_hash($password, PASSWORD_BCRYPT);

$resetService->startTransaction();

$pre_data = [
    "id" => $info['id'],
    "password" => $password_hash
];

$update = $resetService->updatePasswordByVendId($pre_data,$token);
if(!$update){
    $resetService->rollbackTransaction();
    $http->BadRequest([
        "err" => "ไม่สามารถอัพเดตรหัสผ่านได้",
        "status" => 400
    ]);
}

$del_token = $resetService->deleteVendorToken($info['id']);
if(!$del_token){
    $resetService->rollbackTransaction();
    $http->BadRequest([
        "err" => "ไม่สามารถอัพเดตข้อมูลได้",
        "status" => 400
    ]);
}

$resetService->commitTransaction();

$http->Ok([
    "data" => $update,
    "status" => 200
]);