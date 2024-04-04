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

$email = $template->valVariable(isset($_POST["email_input"]) ? $_POST["email_input"] : null, "email");

// Check Have E-mail in Database
$res = $resetService->getUserInfoByEmailUser(trim($email));
if (!$res){
    $http->NotFound(
        [
            "err" => "ไม่พบ E-mail ในระบบ",
            "status" => 404
        ]
    );
}

// Encode User
$length = 16;
$token = bin2hex(random_bytes($length));
$expire = date("Y-m-d H:i:s", strtotime("+15 minutes"));

$prepare = [
    "user_staff_id" => $res['user_id'],
    "secure_token" => $token,
    "expired_time" => $expire
];

$Ctoken = $resetService->createResetToken($prepare);
if (!$Ctoken) {
    $http->BadRequest(
        [
            "err" => "ไม่สามารดำเนินการได้",
            "status" => 400
        ]
    );
}

$res['user_type'] = "scg";

$res['encUser'] = $token;

require_once(__DIR__ . "/mails/funcMailResetPassword.php");
$mail->sendTo($res["email"]);
$mail->addSubject("ตั้งค่ารหัสผ่านใหม่ E-bidding");
$mail->addBody(htmlMailResetPassword($res));
if ($_ENV["DEV"] == false) {
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

$http->Ok(
    [
        "data" => "ดำเนินการสำเร็จ",
        "status" => 200
    ]
);