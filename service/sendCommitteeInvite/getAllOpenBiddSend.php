<?php
// ใช้ในการ list ข้อมูลการเปิดซองที่ต้องเปิดในวันนี้
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");

include_once("./biddingWaitSendService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$biddingWaitSend = new BiddingWaitSendService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
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

/**
 * find a user is a committee or chairman or secretary ? 
 */
$user = $biddingWaitSend->getUserById($userId);
if (!$user || ($user["role_name"] !== "secretary")) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่กลุ่มกรรมการในระบบ",
            "status" => 401
        ]
    );
}

$allOpenBidSend = $biddingWaitSend->getAllOpenBiddingWaitingToSend();

// find total of the project
forEach($allOpenBidSend as $index => $value){
    $allOpenBidSend[$index]["totalProject"] = (int) ($biddingWaitSend->getTotalProjectByOpenBiddingId($value["id"]))["total"];
}

$http->Ok(
    [
        "data" => $allOpenBidSend,
        "status" => 200
    ]
);

