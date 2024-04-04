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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$userHS = $template->valVariable(isset($_GET["user_code"]) ? $_GET["user_code"] : null, "user code");

$info = $resetService->getInfoOfEmp($userHS);
if (!$info) {
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูล",
            "status" => 404
        ]
    );
}

if ($info['expired_time'] < date("Y-m-d H:i:s")) {
    $http->BadRequest(
        [
            "err" => "Token หมดอายุ",
            "status" => 400
        ]
    );
}

$http->Ok(
    [
        "data" => $info,
        "status" => 200
    ]
);