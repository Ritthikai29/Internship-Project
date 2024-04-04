<?php
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

// start transections 
$biddingResultService->startTransaction();

if ($_SERVER["REQUEST_METHOD"] !== "UPDATE") {
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
 * find a user is a secretary ? 
 */

$isOk = false;
$roleCheck = [
    "secretary"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $biddingResultService->getUserByIdAndRole($userId, $roleCheck[$i]);
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


$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");
$topicId = $template->valVariable(isset($body["topic_id"]) ? $body["topic_id"] : null, "topic id");
$comment = $template->valFilter(isset($body["comment"]) ? $body["comment"] : null);

// start transection 
$biddingResultService->startTransaction();

$project = $biddingResultService->getProjectById($projectId);
if($project["status_name"] !== "กำลังเจรจาต่อรองราคาใหม่"){
    $http->BadRequest(
        [
            "err" => "โครงการไม่อยู่ในสถานะกำลังเจรจาต่อรอง",
            "status" => 400
        ]
    );
}

/**
 * find director_secretary_result by project id 
 * 
 */
$secretaryComment = $biddingResultService->getSecretaryCommmentByProjectId($projectId);
if(!$secretaryComment){
    $http->NotFound(
        [
            "err" => "ไม่พบความคิดเห็นสรุปของเลขา กรุณาลองใหม่",
            "status" => 404
        ]
    );
}


/**
 * get topic of the comment from combobox 
 */
$topic = $biddingResultService->getTopicCommentById($topicId);
if(!$topic){
    $http->NotFound(
        [
            "err" => "ไม่พบหัวข้อโครงการของระบบ",
            "status" => 404
        ]
    );
}

/**
 * check a status of topic is a approve / reject / waiting bidding again
 * 
 */
if($topic["status_comment"] === "success"){
    $is_success = true;
}else if($topic["status_comment"] === "failed"){
    $is_success = false;
}else{
    $is_success = null;
}


/**
 * update result comment of the project
 */
$prepare = [
    "topic_id" => $topic["id"],
    "comment" => $comment,
    "is_success" => $is_success,
    "is_approve" => $secretaryComment["is_approve"],
    "approver_id" => $approverId,
    "project_id" => $secretaryComment["project_id"],
    "result_id" => $secretaryComment["id"]
];
$updateComment = $biddingResultService->updateSecretaryFinalCommentById($prepare);
if(!$updateComment){
    $http->Forbidden(
        [
            "err" => "ไม่สามารถอัพเดตข้อมูลได้",
            "status" => 403
        ]
    );
}


/**
 * send email to 1. ผร if it approve
 * 2. หน่วยงานจ้างเหมา if it not approve 
 * 3. not send email if unsuccessful
 */

 // get all Director comment to send email of the project
$listCommentOfCommittee = $biddingResultService->listDirectorCommentByProjectId($project["id"]);
if(!$listCommentOfCommittee || count($listCommentOfCommittee) !== 4 ){
    $http->BadRequest(
        [
            "err" => "คณะกรรมการยังไม่ลงมติครบทุกราย",
            "status" => 400
        ]
    );
}

if($is_success === true){
    /**
     * send a email to a ผร or MD to approveing
     */

}else if(!$is_success === false){
    /**
     * send email to หน่วยงานจ้างเหมา if it not approve 
     */
}


/**
 * send email to all committee to get know this update
 */
// get all committee of the project 


// for loop to send a email to alert a update of the project

$biddingResultService->commitTransaction();


$http->Ok(
    [
        "data" => $updateComment,
        "status" => 200
    ]
);

