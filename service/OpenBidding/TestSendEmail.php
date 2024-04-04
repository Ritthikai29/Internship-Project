<?php
include("../Template/SettingApi.php");
include("../Template/SettingMailSend.php");
include("../Template/SettingDatabase.php");
include("./OpenBiddingService.php");
include("./funcEmailbody.php");


$mail = new Mailing();
$http = new Http_Response();

$openBiddingService = new OpenBiddingService();
$allUserRoleChairAndCom = $openBiddingService->getAllChairmanAndCommittee();

  //$openDateTimePlace = $openBiddingService->detailOpenBidding($NewDateOpenProject["id"]);
// $listOpenBidding = $openBiddingService->listProjectInOpenBidding($NewDateOpenProject["id"]);
$openDateTimePlace = $openBiddingService->detailOpenBidding(6);
$listOpenBidding = $openBiddingService->listProjectInOpenBidding(6);

 foreach($allUserRoleChairAndCom as $index => $data){
     $mail->sendTo($data["email"]);
     }
     $mail->addSubject("ทดสอบส่งEmailไปยังผู้บริหาร");
 // Body of the email
    $body = file_get_contents("./funcEmailbody.php"); $mail->addBody($body);
   
    $mail->addBody(htmlMaill($openDateTimePlace,$listOpenBidding));
    

    $success = $mail->sending();

$http->Ok(
     [
        // "data" => $openDateTimePlace[0]["opentime"],
         "data" => $listOpenBidding[0],
         "status" => 200
     ]
 );