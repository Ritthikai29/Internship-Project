<?php
// ใช้ในการ Login เข้าโครงการเพื่อให้เลขารอเปิดซอง
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

/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);
$openDateId = $template->valVariable(isset($body["open_id"]) ? $body["open_id"] : null, "ไอดีโครงการ");
$passcode = $template->valVariable(isset($body["passcode"]) ? $body["passcode"] : null, "passcode");

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

// ถ้าไม่ตรงกับวันที่ต้องการ ให้ทำการไม่อนุญาตหให้เข้า
if(date('Y-m-d', strtotime($openDate["open_datetime"])) != date('Y-m-d')){
    $http->Unauthorize(
        [
            "err" => "ไม่สามารถเข้าได้เนื่องจากวันนี้ไม่ใช่วันเปิดซอง",
            "status" => 401
        ]
    );
}



/**
 * 3. check this user is a committee in this project?
 */
$committee = $biddingVerifyService->getCommitteeByOpenIdAndUserId(
    $openDate["id"],
    $user["id"]
);

if (!$committee) {
    $http->Unauthorize(
        [
            "err" => "You're not include in this project",
            "status" => 401
        ]
    );
}

/**
 * get data director to check passcode and prepare before update
 * 
 */
$directorClient = $biddingVerifyService->getDirectorByOpenIdAndUserId(
    $openDate["id"], 
    $user["id"]
);

// Check a passcode is correct?
if(is_null($directorClient["passcode"]) || !password_verify($passcode,$directorClient["passcode"])){
    $http->Unauthorize(
        [
            "err" => "passcode ไม่ถูกต้อง กรุณาลองใหม่",
            "status" => 401
        ]
    );
}


$biddingVerifyService->startTransaction();



/**
 * update a status of the director in this project
 * to 1 is mean is connected to this project...
 */
$prepare = [
    "director_staff" => $directorClient["director_staff_id"],
    "open_id" => $directorClient["open_id"],
    "director_role_id" => $directorClient["director_role_id"],
    "is_join" => 1, // update this to say to all user is join in 
    "last_active" => date('Y-m-d H:i:s'),
    "director_id" => $directorClient["id"]
];
$updateDirectorStatus = $biddingVerifyService->updateDirectorById($prepare);


/**
 * update project status to กำลังเปิดซอง
 */

$biddingVerifyService->commitTransaction();

$http->Ok(
    [
        "data" => $updateDirectorStatus,
        "status" => 200
    ]
);
