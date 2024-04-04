<?php
// เรียกใช้งานเพื่อ ป้องกันการเข้าถึง เมื่อ committee กดเข้ามาหน้าโปรเจคเปิดซอง หลังจากมีการเปิดซองอีกครั้ง
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");

include_once("./biddingResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$biddingResultService = new BiddingReasultService();

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
    "committee"
];
$countRole = count($roleCheck);
$i = 0;
do{
    $user = $biddingResultService->getUserByIdAndRole($userId, $roleCheck[$i]);
    if($user){
        $isOk = true;
    }
    $i++;
}while(!$isOk && $countRole > $i);

if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่กลุ่มกรรมการในระบบ",
            "status" => 401
        ]
    );
}

// -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------

$projectId = $template->valVariable(isset($_GET["pj_id"]) ? $_GET["pj_id"] : null, "ไอดีโครงการ");
$openId = $template->valVariable(isset($_GET["op_id"]) ? $_GET["op_id"] : null, "ไอดีเปิดโครงการ");

/**
 * find a director by open_id and userId
 */
$director = $biddingResultService->getDirectorByOpenIDNUID($openId, $user["id"]);
if (!$director) {
    $htttp->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้",
            "status" => 401
        ]
    );
}

$project = $biddingResultService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่กำลังเข้าร่วม กรุณาลองใหม่",
            "status" => 404
        ]
    );
}

/**
 * check a project status is not in bidding process
 * 
 */
$projectStatus = $biddingResultService->getProjectStatusById($project["status_id"]);
if(!$projectStatus || $projectStatus["status_name"] !== "กำลังเปิดซอง"){
    $http->Forbidden(
        [
            "err" => "ไม่อยู่ในช่วงการเปิดซอง ไม่สามารถแก้ไขความคิดเห็นได้",
            "status" => 403
        ]
    );
}

$http->Ok(
    [
        "data" => "สามารถคอมเมนต์ได้",
        "status" => 200
    ]
);

