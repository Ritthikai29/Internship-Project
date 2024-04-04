<?php
session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../middleware/authentication.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");

include_once(__DIR__ . "/biddingVerifyService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

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

$openId = $template->valVariable(isset($body["open_id"]) ? $body["open_id"] : null , "open id");

// update passcode
$passcode = $biddingVerifyService->generateRandomString(5);
$passcodeHash = password_hash($passcode, PASSWORD_BCRYPT);
$prepare = [
    "id" => $userId,
    "passcode" => $passcodeHash,
    "open_id" => $openId
];

$biddingVerifyService->startTransaction();

$res = $biddingVerifyService->updatePasscodeDirector($prepare);
if(!$res){
    $http->BadRequest(
        [
            "err" => "ไม่สามารถสร้าง passcode ใหม่ได้",
            "status" => 400
        ]
    );
}
// Get OpenBid Info
$openBidding = $biddingVerifyService->getOpenBiddingByOpenId($openId);

// E-mail New Passcode
$director = $biddingVerifyService->getUserEmployeeByUserId($userId);
require_once(__DIR__ . "/mails/funcEmailRemind.php");
$mail->sendTo($director["email"]);
$mail->addSubject($passcode . " - รหัส Passcode ใหม่ วันที่ " . date('d-m-Y'));
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

$biddingVerifyService->commitTransaction();

$http->Ok(
    [
        "data" => $res,
        "status" => 200
    ]
);