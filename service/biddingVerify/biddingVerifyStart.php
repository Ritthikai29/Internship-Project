<?php
// เรียกใช้งานเมื่อ secretary กดยืนยัน เริ่มเปิดซอง
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
    "secretary"
];
$countRole = count($roleCheck);
$i = 0;
do{
    $user = $biddingVerifyService->getUserByIdAndRole($userId, $roleCheck[$i]);
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

$biddingVerifyService->startTransaction();

/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);
$openDateId = $template->valVariable(isset($body["open_id"]) ? $body["open_id"] : null, "ไอดีโครงการ");


/**
 * 2. check date in this day
 * 
 * find a openDate by open id
 */
$openDate = $biddingVerifyService->getOpenDateById($openDateId);
if (!$openDate) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่รอการเปิดซอง",
            "status" => 404
        ]
    );
}

// เช็คว่าผู้กดเปิดเป็น เลขาของโครงการหรือไม่ 
$biddingVerifyClient = $biddingVerifyService->getDirectorByOpenIdAndUserId($openDate["id"], $user["id"]);
if($biddingVerifyClient["role_name"] !== "secretary"){
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่เลขาของโครงการนี้ กรุณาลองใหม่ในภายหลัง",
            "status" => 401
        ]
    );
}


$listCommitteeofProject = $biddingVerifyService->listCommitteeOfOpenDateByDateId($openDate["id"]);
if (!$listCommitteeofProject) {
    $http->NotFound(
        [
            "err" => "ไม่พบคนในช่วงเวลาเปิดซองนี้",
            "status" => 404
        ]
    );
}

// ถ้าไม่ตรงกับวันที่เปิดซอง ให้ทำการไม่อนุญาตให้เข้า
if(date('Y-m-d', strtotime($openDate["open_datetime"])) != date('Y-m-d')){
    $http->Unauthorize(
        [
            "err" => "ไม่สามารถเข้าได้เนื่องจากวันที่เปิดซองไม่ใช่วันนี้",
            "status" => 401
        ]
    );
}

// check all committee is join?
$listCommitteeofProject = $biddingVerifyService->listCommitteeOfOpenDateByDateId($openDate["id"]);
$listCommitteeOfProjectIsActive = $biddingVerifyService->listCommitteeOfOpenDateIsActive($openDate["id"]);
// check all committees is join to this open bidding

if(count($listCommitteeofProject) != count($listCommitteeOfProjectIsActive)){
    // if is join is not eq all committee
    $http->Unauthorize(
        [
            "err" => "กรรมการยังไม่กดอนุมัติครบทุกคน",
            "status" => 401
        ]
    );
}



// ถ้ากรรมการกดครบทุกคนแล้ว ปรับสถานะวันที่เปิดซองเป็น พร้อมเปิดซอง
$prepare = [
    "open_id" => $openDate["id"],
    "open_datetime" => $openDate["open_datetime"],
    "open_place" => $openDate["open_place"],
    "open_status" => 1
];
$updateOpenBidding = $biddingVerifyService->updateOpenBiddingById($prepare);
if(!$updateOpenBidding){
    $http->BadRequest(
        [
            "err" => "ไม่สามารถอัพเดตสถานะโครงการได้",
            "status" => 400
        ]
    );
}

/**
 * update status of all project to "กำลังเปิดซอง"
 */
$projects = $biddingVerifyService->listProjectByOpenId($updateOpenBidding["id"]);

$projectStatusWaitOpen = $biddingVerifyService->getProjectStatusByName("กำลังเปิดซอง");

foreach($projects as $project){
    $updatedProject = $biddingVerifyService->updateProjectStatus($project["id"], $projectStatusWaitOpen["id"]);
}


$biddingVerifyService->commitTransaction();

$http->Ok(
    [
        "data" => $updateOpenBidding,
        "status" => 200
    ]
);