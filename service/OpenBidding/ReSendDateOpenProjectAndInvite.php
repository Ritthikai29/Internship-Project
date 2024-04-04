<?php

session_start();

include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");
include("./OpenBiddingService.php");
include("../SetDirector/setDirectorService.php");
include("../Template/SettingMailSend.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$openBiddingService = new OpenBiddingService();
$setDirectorService = new SetDirectorService();
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

// authen is a secretary

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

// Get Open Bidding Id
$obInfo = $openBiddingService->getOpenBiddingInfoByOpenId($opId);

// Get List Project
$projectList = $openBiddingService->listProjectByOpenId($opId);

$openBiddingService->startTransaction();

$committeeGroups = $openBiddingService->getAllCommitteeGroup();

$joinedCommittee = $openBiddingService->getAllCommitteeJoined($opId);

$NoJoinBid = [];
foreach ($committeeGroups as $committeeMember) {
    $joined = false;
    foreach ($joinedCommittee as $joinedMember) {
        if ($committeeMember['employeeNO'] === $joinedMember['employeeNO']) {
            $joined = true;
            break;
        }
    }
    if (!$joined) {
        $NoJoinBid[] = $committeeMember;
    }
}

$openBidding = $openBiddingService->getProjectCountByOpenId($NewDateOpenProject['id']);

include(__DIR__ . "/functionEmailbody2.php");

foreach ($NoJoinBid as $index => $value) {
    $mail->sendTo($value["email"]);
    $mail->addSubject("เชิญคุณ $value[firstname_t] $value[lastname_t] สมัครเข้าร่วมเป็นกรรมการในการเปิดซอง");
    $mail->addBody(htmlMaill($obInfo, $projectList, $openBidding));
    $success = !$_ENV["DEV"] ? $mail->sending() : true;

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
        "data" => "send successful",
        "status" => 200
    ]
);