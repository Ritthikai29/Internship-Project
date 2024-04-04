<?php
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingMailSend.php");

include("./biddingVerifyService.php");

$http = new Http_Response();
$mail = new Mailing();

$biddingVerifyService = new BiddingVerifyService();

// Key 1. need to protect some spam mail to committee group
// Key 2. authorize a system user when system is contain to process

$startDay = mktime(0, 0, 0, date('m'), date("d"), date('Y'));
$startDay = date('Y-m-d H:i:s', $startDay + (24*60*60*1000));

$endDay = mktime(23, 59, 59, date('m'), date("d"), date('Y'));
$endDay = date('Y-m-d H:i:s', $endDay + (24*60*60*1000));

$listOpens = $biddingVerifyService->listOpenDateTime($startDay, $endDay);
$biddingVerifyService->startTransaction();
foreach($listOpens as $index => $openBid){
    $passcode = $biddingVerifyService->generateRandomString(8);

    $passcodeHash = password_hash($passcode, PASSWORD_BCRYPT);

    $prepare = [
        "passcode" => $passcodeHash,
        "director_id" => $openBid["director_id"]
    ];
    $updateCommittee = $biddingVerifyService->updateDirectorPasscode(
        $prepare
    );
    if(!$updateCommittee){
        $biddingVerifyService->rollbackTransaction();
    }

    $mail->sendTo($openBid["email"]);
    $mail->addSubject("เชิญเข้าร่วมการเปิดซองการประมูล");
    $mail->addBody("เชิญเข้าร่วมการเปิดซอง");
    // $success = $mail->sending();
    $mail->clearAddress();
}

$biddingVerifyService->commitTransaction();


$http->Ok(
    $listOpens
);

// to send mail use curl of the server to run command and send mailing