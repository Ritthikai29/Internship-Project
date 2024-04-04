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

$remindService->startTransaction();

$startDate = strtotime(date('Y-m-d')) + (24 * 60 * 60);
$endDate = strtotime(date('Y-m-d')) + (24 * 60 * 60) + (24 * 60 * 60 - 1);

$listOpenBidding = $remindService->getOpenBiddingByDayRange(
    date('Y-m-d H:i:s', $startDate),
    date('Y-m-d H:i:s', $endDate)
);



$didrect = array();
foreach ($listOpenBidding as $openBidding) {

    /**
     * get total of the project 
     */
    $total = $remindService->getTotalProjectByOpenId($openBidding["id"]);
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
     * find all director of open bidding id
     */
    $directors = $remindService->getAllDirectorByOpenId($openBidding["id"]);
    if (!$directors && count($directors) <= 0) {
        // if not found a director in this project
        $http->NotFound(
            [
                "err" => "ไม่พบข้อมูลกรรมการในระบบ",
                "status" => 404
            ]
        );
    }

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
        $mail->addSubject("เรียนคณะกรรมการ ขอเชิญชวนเข้าร่วมการเปิดซอง วันที่ $openBidding[open_datetime]");
        $mail->addBody(
            htmlMailRemind(
                $passcode,
                $openBidding,
                $director
            )
        );
        if (!$_ENV["DEV"]) {
            $success = $mail->sending();
            if (!$success) {
                $http->BadRequest(
                    [
                        "err" => "ไม่สามารถส่งอีเมล์ได้",
                        "status" => 400
                    ]
                );
            }
        }
        $mail->clearAddress();
    }
}

$remindService->commitTransaction();

$http->Ok(
    [
        "data" => $director
    ]
);