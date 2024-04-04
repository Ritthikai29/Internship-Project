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


$biddingResultService->startTransaction();

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

/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);
$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");
$openId = $template->valVariable(isset($body["open_id"]) ? $body["open_id"] : null, "open_id");

$topicId = $template->valVariable(isset($body["topic_id"]) ? $body["topic_id"] : null, "topic id");
$comment = $template->valVariable(isset($body["comment"]) ? $body["comment"] : null, "comment");

$passcode = $template->valFilter(isset($body["passcode"]) ? $body["passcode"] : null);


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

// check a passcode 
if (!password_verify($passcode, $director["passcode"])) {
    $http->Unauthorize(
        [
            "err" => "การเข้าถึงของคุณไม่ถูกต้อง กรุณาลองใหม่",
            "status" => 401
        ]
    );
}

$project = $biddingResultService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่ต้องการสรุปผล กรุณาลองใหม่",
            "status" => 404
        ]
    );
}

/**
 * check a project status is ready to save result
 * 
 */
$projectStatus = $biddingResultService->getProjectStatusById($project["status_id"]);
if(!$projectStatus || $projectStatus["status_name"] !== "กำลังเปิดซอง"){
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
$topic = $biddingResultService->getTopicCommentById($topicId);
if (!$topic) {
    $http->NotFound(
        [
            "err" => "ไม่พบหัวข้อการบันทึกผล",
            "status" => 404
        ]
    );
}

if((float)$enc->apDecode($project["price"]) > 500000){
    $approver = $biddingResultService->getUserStaffByRole("Plant Manager");
}else{
    $approver = $biddingResultService->getUserStaffByRole("MD");
}
if(!$approver){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลผู้อนุมัติที่ต้องการ",
            "status" => 404
        ]
    );
}

$submit_datetime = date("Y-m-d H:i:s");
$data = [
    "topic_id" => $topic["id"],
    "comment" => $comment,
    "project_id" => $project["id"],
    "secretary_id" => $director["id"],
    "is_success" => null,
    "is_approve" => null,
    "approver_id" => $approver["id"],
    "order" => 1,
    "submit_datetime" => $submit_datetime
];


$listCommitteeComments = $biddingResultService->listDirectorCommentByProjectId($project["id"]);
if(!$listCommitteeComments || count($listCommitteeComments) !== 4 ){
    $http->BadRequest(
        [
            "err" => "คณะกรรมการยังไม่ลงมติครบทุกราย",
            "status" => 400
        ]
    );
}

$insertedResult = $biddingResultService->insertedFinalResult($data);
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
$projectStatus = $biddingResultService->getProjectStatusByName("รอเจรจาต่อรอง");
if(!$projectStatus){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลสถาะนะโครงการ",
            "status" => 404
        ]
    );
}

$projectUpdate = $biddingResultService->updateProjectStatusById(
    [
        "statusId" => $projectStatus["id"],
        "projectId" => $project["id"]
    ]
);


/**
 * check found a more project in this open id
 */
$projectOpen = $biddingResultService->getAllProjectWaitFinalCommentBtOpenId($openId);
if(!$projectOpen){
    // is mean not found a project wait for comment
    /**
     * update open project by open id
     */
    $updatedOpenConsult = $biddingResultService->updateOpenBiddingStatusById(
        [
            "status" => 0,
            "open_id" => $openId
        ]
    );
    if(!$updatedOpenConsult){
        $http->Forbidden(
            [
                "err" => "ไม่สามารถอัพเดตไอดีโครงการได้",
                "status" => 403
            ]
        );
    }
}


$biddingResultService->commitTransaction();
$http->Ok(
    [
        "data" => $insertedResult,
        "status" => 200
    ]
);



