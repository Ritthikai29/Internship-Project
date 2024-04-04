<?php
session_start();

include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../middleware/authentication.php");
include_once(__DIR__ . "/./biddingWaitSendService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$biddingWaitSend = new BiddingWaitSendService();
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
$user = $biddingWaitSend->getUserById($userId);
if ($user["role_name"] !== "secretary") {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่กลุ่มกรรมการในระบบได้โปรดอย่าทำร้ายกันเลย ขอร้องหละ!",
            "status" => 401
        ]
    );
}


// Read and decode JSON data from the request body
$body = json_decode(file_get_contents('php://input'), true);

$chaman = $template->valVariable(isset($body["chaman"]) ? $body["chaman"] : null, "chaman" );
$commitee1 = $template->valVariable(isset($body["committee1"]) ? $body["committee1"] : null, "committee1" );
$commitee2 = $template->valVariable(isset($body["committee2"]) ? $body["committee2"] : null, "committee2" );
$secretary = $template->valVariable(isset($body["secretary"]) ? $body["secretary"] : null, "secretary" );
$open_id = $template->valVariable(isset($body["open_id"]) ? $body["open_id"] : null, "open_id" );

$status_pj = $biddingWaitSend->getStatusProjectByOpenid($open_id);

if ($status_pj['status_id'] !== '10') {
    if ($status_pj['status_id'] !== '11') {
        $http->Forbidden(
            [
                "err" => "ไม่สามารถเปลี่ยนคณะกรรมการได้ เนื่องจากไม่ได้อยู่ในขั้นรอเปิดซอง",
                "status" => 403
            ]
        );
    }
}

$data_diretorid = $biddingWaitSend->getComDirectorByopenIDandroleID(2,$open_id);
$commitee1_diretorid = $data_diretorid[0];
$commitee2_diretorid = $data_diretorid[1];

/**
 * prepare Data
 */

 $data = [
    "chaman" => $chaman,
    "committee1" => $commitee1,
    "committee2" => $commitee2,
    "secretary" => $secretary,
    "open_id" => $open_id,
    "c1_diretorid" => $commitee1_diretorid['id'],
    "c2_diretorid" => $commitee2_diretorid['id'],
];
$biddingWaitSend->startTransaction();



$res = $biddingWaitSend->updateCommittees($data);
// if insert Failed

if (!$res) {
    $biddingWaitSend->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "job type update failed",
            "status" => 400
        ]
    );
}

$directors = $biddingWaitSend->getAllDirectorByOpenId($open_id);
if (!$directors && count($directors) <= 0) {
    // if not found a director in this project
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลกรรมการในระบบ",
            "status" => 404
        ]
    );
}

//email send to new committee
if($status_pj['status_id'] === '11'){
    foreach ($directors as $director) {
        /**
         * update passcode director and send email 
         */
    
        // update passcode
        $passcode = $biddingWaitSend->getRandomString(5);
    
        $passcodeHash = password_hash($passcode, PASSWORD_BCRYPT);
        $prepare = [
            "id" => $director['id'],
            "passcode" => $passcodeHash
        ];
        $dirUp = $biddingWaitSend->updatePasscodeDirector($prepare);
    
        /**
         * send email to all committee with passcode
         */
        require_once(__DIR__ . "/../sendRemindAgain/mails/funcEmailRemind.php");
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
}


$biddingWaitSend->commitTransaction();

$http->Ok(
    [
        "data" => $res,        
        "status" => 200
    ]
);




