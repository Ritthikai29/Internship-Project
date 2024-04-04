<?php
// เพื่อใช้ในการตรวจสอบว่ากรรมการมาครบทุกคนหรือไม่

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

/**
 * Get a params from client user
 */
$openDateId = $template->valVariable(isset($_GET["op_id"]) ? $_GET["op_id"] : null, "ไอดีโครงการ");

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

$listCommitteeofProject = $biddingVerifyService->listCommitteeOfOpenDateByDateId($openDate["id"]);
if (!$listCommitteeofProject) {
    $http->NotFound(
        [
            "err" => "ไม่พบคนในช่วงเวลาเปิดซองนี้",
            "status" => 404
        ]
    );
}

$numCommittee = 0;
$numCommitteeIsActive = 0;
$numChairman = 0;
$numChairmanIsActive = 0;
$numSecretary = 0;
$numSecretaryIsActive = 0;



foreach ($listCommitteeofProject as $committee) {
    if ($committee["role_name"] == "chairman") {
        $numChairman += 1;
        if ($committee["is_join"] == 1) {
            $numChairmanIsActive += 1;
        }
    } else if ($committee["role_name"] == "committee") {
        $numCommittee += 1;
        if ($committee["is_join"] == 1) {
            $numCommitteeIsActive += 1;
        }
    } else {
        $numSecretary += 1;
        if ($committee["is_join"] == 1) {
            $numSecretaryIsActive += 1;
        }
    }
}

$http->Ok(
    [
        "data" => [
            "chairman" => [
                "is_active" => $numChairmanIsActive,
                "total" => $numChairman
            ],
            "secretary" => [
                "is_active" => $numSecretaryIsActive,
                "total" => $numSecretary
            ],
            "committee" => [
                "is_active" => $numCommitteeIsActive,
                "total" => $numCommittee
            ],
            "user_committee" => $listCommitteeofProject,
            "is_start" => $openDate["open_status"] // this state can be null or number..
        ],
        "status" => 200
    ]
);
