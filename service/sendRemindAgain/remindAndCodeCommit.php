<?php
session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../middleware/authentication.php");

include_once(__DIR__ . "/sendRemindService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$remindService = new SendRemindService();


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
$user = $remindService ->getUserEmployeeByUserId($userId);
if (!$user) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบ user id คนนี้",
            "status" => 401
        ]
    );
}

$user["role"] = $remindService->getUserRoleByUserId($user["id"]);
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

// Read and decode JSON data from the request body
$body = json_decode(file_get_contents('php://input'), true);

$openId = $template->valVariable(isset($body["op_id"]) ? $body["op_id"] : null, "open id");

$remindService->startTransaction();

/**
 * find all director of open bidding id
 */
$directors = $remindService->getAllDirectorByOpenId($openId);
if (!$directors && count($directors) <= 0) {
    // if not found a director in this project
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลกรรมการในระบบ",
            "status" => 404
        ]
    );
}

$openBidding = $remindService->getOpenBiddingByOpenId($openId);
/**
 * get total of the project 
 */
$total = $remindService->getTotalProjectByOpenId($openId);
if (!$total) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการในระบบ",
            "status" => 404
        ]
    );
}
$openBidding["total"] = $total["total"];

/**
 * loop director of the project 
 */

foreach ($directors as $director) {
    /**
     * update passcode director and send email 
     */

    // update passcode
    $passcode = $remindService->getRandomString(5);

    $passcodeHash = password_hash($passcode, PASSWORD_BCRYPT);
    $prepare = [
        "id" => $director['id'],
        "passcode" => $passcodeHash
    ];
    $dirUp = $remindService->updatePasscodeDirector($prepare);

    /**
     * send email to all committee with passcode
     */
    require_once(__DIR__ . "/mails/funcEmailRemind.php");
    $mail->sendTo($director["email"]);
    $mail->addSubject("เรียนคณะกรรมการ ขอเชิญชวนเข้าร่วมการเปิดซอง วันที่ " . date('d-m-Y'));
    $mail->addBody(
        htmlMailRemind(
            $passcode,
            $openBidding,
            $director
        )
    );
    if ($_ENV["DEV"] === false) {
        $success = $mail->sending();
        if ($success === null) {
            $http->BadRequest(
                [
                    "err" => "ไม่สามารถส่งอีเมลได้",
                    "status" => 400
                ]
            );
        }
    }
    $mail->clearAddress();
}


$remindService->commitTransaction();

$http->Ok(
    [
        "data" => $director,
        "status" => 200
    ]
);
