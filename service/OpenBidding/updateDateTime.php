<?php

session_start();

include_once( __DIR__ . "/../Template/SettingApi.php");
include_once( __DIR__ . "/../Template/SettingAuth.php");
include_once( __DIR__ . "/../Template/SettingDatabase.php");
include_once( __DIR__ . "/../Template/SettingEncryption.php");
include_once( __DIR__ . "/../Template/SettingTemplate.php");
include_once( __DIR__ . "/../middleware/authentication.php");
include_once( __DIR__ . "/./OpenBiddingService.php");
include_once( __DIR__ . "/../Template/SettingMailSend.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$openBiddingService = new OpenBiddingService();
$mail = new Mailing();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

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
 * get a data of the user by user id
 */
$user = $openBiddingService->getUserEmployeeByUserId($userId);
if (!$user) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบ user id คนนี้",
            "status" => 401
        ]
    );
}

$user["role"] = $openBiddingService->getUserRoleByUserId($user["id"]);
if (!$user["role"]) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้่",
            "status" => 401
        ]
    );
}

/**
 * check you is a secretary of the project 
 */
$permission = false;
foreach ($user["role"] as $index => $value) {
    if ($value["role_name"] === "secretary") {
        $permission = true;
    }
}
if (!$permission) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้่",
            "status" => 401
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true); //ส่งไปเป็น Json

$opId = $template->valVariable(isset($body["op_id"]) ? $body["op_id"] : null, "Open Bidding Id");
$Date = isset($body["open_datetime"]) ? $body["open_datetime"] : null;
$Place = isset($body["open_place"]) ? $body["open_place"] : null;


$openId = ["openId" => $opId];

$preData = $openBiddingService->detailOpenBidding($openId);

if ($Date == null) {
    $timestamp = strtotime($preData[0]['open_datetime']);
    $DateAndPlace = [
        "id" => $opId,
        "open_datetime" => date('Y-m-d H:i', $timestamp), 
        "open_place" => $Place
    ];
} else if ($Place == null) {
    $dateTime = new DateTime($Date);
    $DateAndPlace = [
        "id" => $opId,
        "open_datetime" => date('Y-m-d H:i', $dateTime->getTimestamp()),
        "open_place" => $preData[0]['openplace']
    ];
} else {
    $dateTime = new DateTime($Date);
    $DateAndPlace = [
        "id" => $opId,
        "open_datetime" => date('Y-m-d H:i', $dateTime->getTimestamp()),
        "open_place" => $Place
    ];
}

$openBiddingService->startTransaction();

// Update Openbidding DateTime
$res = $openBiddingService->updateOpenBiddingById($DateAndPlace);
if(!$res){
    $openBiddingService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "ไม่สามารถอัพเดตได้",
            "status" => 400
        ]
    );
}

$openBidding = $openBiddingService->getProjectCountByOpenId($opId);
$openBidInfo = $openBiddingService->getOpenBiddingInfoByOpenId($opId);

// Send Change Date To All Committee Group
$committeeGroups = $openBiddingService->getAllCommitteeGroup();
include(__DIR__ . "/functionEmailbody.php");

// Get All Project In Open Bidding
$prepare = [
    "openId" => $opId
];
$listOpenBidding = $openBiddingService->listProjectInOpenBidding($prepare);
foreach ($committeeGroups as $index => $value) {
    $mail->sendTo($value["email"]);
    $mail->addSubject("เชิญคุณ $value[firstname_t] $value[lastname_t] สมัครเข้าร่วมเป็นกรรมการในการเปิดซอง");
    $mail->addBody(htmlMaill($openBidInfo, $listOpenBidding, $openBidding));
    $success = $_ENV["DEV"] === false ? $mail->sending() : true;
    if ($success === null) {
        $openBiddingService->rollbackTransaction();
        $http->Forbidden([
            "err" => "ไม่สามารถส่งอีเมลได้",
            "status" => 403
        ]);
    }
    $mail->clearAddress();
}

$openBiddingService->commitTransaction();

$http->Ok(
    [
        "data" => "updatesuccessful",
        "status" => 200
    ]
);
