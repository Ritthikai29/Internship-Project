<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include_once("../middleware/authentication.php");

include_once("../Template/SettingMailSend.php");
include("./approveService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$approveService = new ApproveService();
$mail = new Mailing();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * get data in JWT Token [Middleware decode a JWT Token and valify Token]
 * 
 * @var object
 */
$tokenObject = JWTAuthorize($enc, $http);

/**
 * get a user id from token 
 */
$tokenUserId = $tokenObject->userId;

$reasons = $approveService->listReasonCalculate();

if(!$reasons){
    $http->NotFound(
        [
            "data" => "Not found a reasons",
            "status" => 404
        ]
    );
}

$http->Ok(
    [
        "data" => $reasons,
        "status" => 200
    ]
);