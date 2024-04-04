<?php
// ใช้ในการ list ข้อมูลการเปิดซองที่ต้องเปิดในวันนี้
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");

include_once("./biddingVerifyService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$biddingVerifyService = new BiddingVerifyService();

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
$user = $biddingVerifyService->getUserById($userId);
if (!$user || ($user["role_name"] !== "chairman" && $user["role_name"] !== "committee" && $user["role_name"] !== "secretary")) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่กลุ่มกรรมการในระบบ",
            "status" => 401
        ]
    );
}

$allConsultingInday = $biddingVerifyService->getAllOpenBiddingWaitingStart($userId);

// find total of the project
forEach($allConsultingInday as $index => $value){
    $allConsultingInday[$index]["totalProject"] = (int) ($biddingVerifyService->getTotalProjectByOpenBiddingId($value["id"]))["total"];
}

$http->Ok(
    [
        "data" => $allConsultingInday,
        "status" => 200
    ]
);

