<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include_once("../Template/SettingMailSend.php");

$http = new Http_Response();
$mail = new Mailing();


if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

// $mail->sendTo('b6325855@gmail.com');

// $mail->addSubject('test');

// $mail->addBody("test");
   
// $mail->sending();

$http->Ok(
    [
        "data" => 'susscees',
        "status" => 200
    ]
);