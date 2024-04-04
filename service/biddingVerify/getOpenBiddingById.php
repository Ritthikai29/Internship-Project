<?php
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

// -------------------------- START CHECK ROLE OF THE USER STAFF -----------------------------
/**
 * find a user is a committee or chairman or secretary ? 
 */

 $isOk = false;
 $roleCheck = [
     "chairman",
     "committee",
     "secretary"
 ];
 $countRole = count($roleCheck);
 $i = 0;
 do {
     $user = $biddingVerifyService->getUserByIdAndRole($userId, $roleCheck[$i]);
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

$openId = $template->valVariable(isset($_GET["open_id"]) ? $_GET["open_id"] : null);

$detail = $biddingVerifyService->getOpenDateById($openId);

$detail["totalProject"] = ($biddingVerifyService->getTotalProjectByOpenBiddingId($detail["id"]))["total"];

$empInfo = $biddingVerifyService->getUserEmployeeByUserId($userId);

$detail['email'] = $empInfo['email'];

$http->Ok(
    [
        "data" => $detail,
        "status" => 200
    ]
);