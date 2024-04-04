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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
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

/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);
$topicId = $template->valVariable(isset($body["topic_id"]) ? $body["topic_id"] : null, "topic id");
$comment = $template->valVariable(isset($body["comment"]) ? $body["comment"] : null, "comment");

$passcode = $template->valFilter(isset($body["passcode"]) ? $body["passcode"] : null);

$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");

// check this user is include to this project

// start transections
$biddingVerifyService->startTransaction();

// get project by project id
$project = $biddingVerifyService->getProjectById($projectId);
if(!$project){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลโครงการ",
            "status" => 404
        ]
    );
}
if($project["status_name"] !== "กำลังเปิดซอง"){
    $http->Forbidden(
        [
            "err" => "โครงการนี้ไม่ได้เป็นโครงการที่กำลังเปิดซอง",
            "status" => 403
        ]
    );
}

/**
 * find director by open_id id and user_id
 */
$director = $biddingVerifyService->getDirectorByOpenIdAndUserId($project["opendate_id"], $userId);
if(!$director){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูล Director ของโครงการนี้",
            "status" => 404
        ]
    );
}

// get director by id to get passcode to check before send data
if(!$director || $director["director_staff_id"] != $user["id"]){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลของกรรมการในกลุ่ม คุณอาจจะไม่อยู่ในกลุ่มหรือรหัสโครงการไม่ถูกต้อง",
            "status" => 404
        ]
    );
}
if(!password_verify($passcode, $director["passcode"])){
    $http->Unauthorize(
        [
            "err" => "รหัสการเข้าถึงไม่ถูกต้อง",
            "status" => 401
        ]
    );
}



// ค้นหาว่าคนนี้เคยคอมเม้นไปแล้วหรือยัง
$directorOldComment = $biddingVerifyService->getCommentByDirectorIdAndProjectId($director["id"], $project["id"]);


// find a topic of the project by id
$topic = $biddingVerifyService->getDirectorTopicById($topicId);
if(!$topic){
    $http->NotFound(
        [
            "err" => "ไม่พบ Topic ที่ผู้ใช้ต้องการเพิ่ม",
            "status" => 404
        ]
    );
}

/**
 * update a data to comment of the user 
 */
$prepareUpdate = [
    "comment_id" => $topic["id"],
    "detail_comment" => $comment,
    "submit_datetime" => date("Y-m-d H:i:s"),
    "director_id" => $director["id"],
    "project_id" => $project["id"]
];

$commentUpdate = $biddingVerifyService->updateCommentCommittee($prepareUpdate);
if(!$commentUpdate){
    $biddingVerifyService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "ไม่สามารถอัพเดตคอมเม้นของกรรมการได้",
            "status" => 403
        ]
    );
}

$biddingVerifyService->commitTransaction();

// if comment is successful 
$http->Ok(
    [
        "data" => $commentUpdate,
        "status" => 200
    ]
);