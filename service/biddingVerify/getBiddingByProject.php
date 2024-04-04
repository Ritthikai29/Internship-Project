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

$openId = $template->valVariable(isset($_GET["op_id"]) ? $_GET["op_id"] : null, "openId");
$projectId = $template->valVariable(isset($_GET["pj_id"]) ? $_GET["pj_id"] : null, "project Id");
// get open Bidding Date By id
$openDate = $biddingVerifyService->getOpenDateById($openId);
if (!$openDate || $openDate["open_status"] != 1) {
    $http->BadRequest(
        [
            "err" => "ซองเปิดตัวนี้ยังไม่เปิด กรุณาติดต่อเลขา",
            "status" => 400
        ]
    );
}

// check this client is can access to this project
// เช็คว่าผู้กดเปิดเป็น คนในโครงการหรือไม่ 
$biddingVerifyClient = $biddingVerifyService->getDirectorByOpenIdAndUserId($openDate["id"], $user["id"]);
if (
    !$biddingVerifyClient
) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่คนของโครงการนี้ กรุณาลองใหม่ในภายหลัง",
            "status" => 401
        ]
    );
}

$project = $biddingVerifyService->getProjectById($projectId);
if(!$project){
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการจาก ไอดีโครงการ",
            "status" => 404
        ]
    );
}
$project["price"] = (float) $enc->apDecode($project["price"]);

$subProject = $biddingVerifyService->getSubPriceProjectByProjectId($project["id"]);
foreach( $subProject as $index => $subProjectItem ){
    $subProject[$index]["price"] = (float)$enc->apDecode($subProjectItem["price"]);
}

// เช็คว่าผู้กดเปิดเป็น คนในโครงการหรือไม่ 
$biddingVerifyClient = $biddingVerifyService->getDirectorByOpenIdAndUserId($openDate["id"], $userId);
if (
    !$biddingVerifyClient
) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่คนของโครงการนี้ กรุณาลองใหม่ในภายหลัง",
            "status" => 401
        ]
    );
}

$comment = $biddingVerifyService->directorCommentByProjectIdAndDirectorId($project["id"],$biddingVerifyClient["id"]);
    if($comment){
        $project["is_have"] = true;
    }else{
        $project["is_have"] = false;
    }


$project["subPrice"] = $subProject;

$http->Ok(
    [
        "data" => $project,
        "status" => 200
    ]
);
