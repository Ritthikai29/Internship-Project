<?php
session_start();

include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/newBiddingService.php");
include_once(__DIR__ . "/../middleware/authentication.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

// Create a new instance of the NewBidService class
$newBidService = new NewBidService();



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
 * find a user is a secretary ? 
 */

$isOk = false;
$roleCheck = [
    "secretary"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $newBidService->getUserByIdAndRole($userId, $roleCheck[$i]);
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
$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");
$topicId = $template->valVariable(isset($body["topic_id"]) ? $body["topic_id"] : null, "topic id");
$comment = $template->valVariable(isset($body["comment"]) ? $body["comment"] : null, "comment");

$newBidService->startTransaction();

/**
 * get Project by project id
 */
$project = $newBidService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลโครงการ",
            "status" => 404
        ]
    );
}

$director = $newBidService->getDirectorByOpenIDNUID($project["opendate_id"], $user["id"]);
if (!$director) {
    $htttp->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้",
            "status" => 401
        ]
    );
}
/**
 * check a project status is ready to save result
 * 
 */
$projectStatus = $newBidService->getProjectStatusById($project["status_id"]);
if(!$projectStatus || $projectStatus["status_name"] !== "กำลังเจรจาต่อรองราคาใหม่"){
    $http->Forbidden(
        [
            "err" => "ไม่สามารถสร้างผลลัพท์การเปิดซองได้เนื่องจากยังไม่เสร็จสิ้น",
            "status" => 403
        ]
    );
}
/**
 * get topic by topic id
 */
$topic = $newBidService->getTopicCommentById($topicId);
if (!$topic) {
    $http->NotFound(
        [
            "err" => "ไม่พบหัวข้อการบันทึกผล",
            "status" => 404
        ]
    );
}

if((float)$enc->apDecode($project["price"]) > 500000){
    $approver = $newBidService->getUserStaffByRole("Plant Manager");
}else{
    $approver = $newBidService->getUserStaffByRole("MD");
}
if(!$approver){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลผู้อนุมัติที่ต้องการ",
            "status" => 404
        ]
    );
}

$secretaryResult = $newBidService->getSecretaryCommmentByProjectId($project['id']);
$count = $secretaryResult['order'] + 1;

$submit_datetime = date("Y-m-d H:i:s");
$data = [
    "topic_id" => $topic["id"],
    "comment" => $comment,
    "project_id" => $project["id"],
    "secretary_id" => $director["id"],
    "is_success" => null,
    "is_approve" => null,
    "approver_id" => $approver["id"],
    "order" => $count,
    "submit_datetime" => $submit_datetime
];

$insertedResult = $newBidService->insertedFinalResult($data);
if (!$insertedResult) {
    $http->Forbidden(
        [
            "err" => "ไม่สามารถเพิ่มข้อมูลลงในระบบได้",
            "status" => 403
        ]
    );
}
/**
 * update status to "รอเจรจาต่อรอง"
 */
$projectStatus = $newBidService->getProjectStatusByName("รอเจรจาต่อรอง");
if(!$projectStatus){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลสถาะนะโครงการ",
            "status" => 404
        ]
    );
}

$projectUpdate = $newBidService->updateProjectStatusById(
    [
        "statusId" => $projectStatus["id"],
        "projectId" => $project["id"]
    ]
);

$newBidService->commitTransaction();

$http->Ok(
    [
        "data" => $insertedResult,
        "status" => 200
    ]
);
