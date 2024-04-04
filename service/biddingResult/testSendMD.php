<?php
// เพื่อส่ง email เพื่อเชญ Vendor ในการขอประกวดราคาอีกครั้ง
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");
include_once("../middleware/authentication.php");

include_once("./biddingResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$mail = new Mailing();

$biddingResultService = new BiddingReasultService();

$biddingResultService->startTransaction();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);
$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");
$openId = $template->valVariable(isset($body["open_id"]) ? $body["open_id"] : null, "open_id");
$topicId = $template->valVariable(isset($body["topic_id"]) ? $body["topic_id"] : null, "topic id");
$comment = $template->valFilter(isset($body["comment"]) ? $body["comment"] : null);
$passcode = $template->valFilter(isset($body["passcode"]) ? $body["passcode"] : null);

$project = $biddingResultService->getProjectById($projectId);
$vendorProject = $biddingResultService->listVendorsHasApproveByProjectId($project["id"]);

foreach ($vendorProject as $index => $value) {
    $price = $biddingResultService->getBidPriceByVendorProjectId($value["id"]);
    $vendorProject[$index]["price"] = $price ? (float) $enc->bidDecode($price["price"]) : null;
    $new = $biddingResultService->getNewBidPriceByVendorProjectId($value["id"]);
    $vendorProject[$index]["newPrice"] = $new ? (float) $enc->bidDecode($new["price"]) : null;
    $vendorProject[$index]["compare"] = $new ? (float) $enc->bidDecode($new["price"]) : ($price ? (float) $enc->bidDecode($price["price"]) : null);

    if ($vendorProject[$index]["vendor_type"] == "list") {
        $vendorProject[$index]["vendor_type_name"] = "ใน List ทะเบียน";
    } else {
        $vendorProject[$index]["vendor_type_name"] = "นอก List ทะเบียน";
    }
}
// usort($vendorProject, function ($a, $b) {
//     if (!$a["compare"] || $a["compare"] === 0) {
//         return 1;
//     } else if (!$b["compare"] || $b["compare"] === 0) {
//         return -1;
//     } else {
//         return $a > $b;
//     }
// });


usort($vendorProject, function ($a, $b) {
    if(!$a["compare"] && $b["compare"]){
        return 1;
    }elseif($a["compare"] && !$b["compare"]){
        return -1;
    }
    elseif($a["compare"] < $b["compare"]){
        return -1;
    }else{
        return 1;
    };

});

function setToLoseAll($vendorProject)
{
    foreach ($vendorProject as $index => $value) {
        $vendorProject[$index]["result"] = "แพ้การประกวด";
    }
    return $vendorProject;
}


function findAWinner($vendorProject)
{
    $count = count($vendorProject);
    $vendorProject[0]["result"] = "ชนะการประกวด";

    // if ($vendorProject[0]["compare"] === $vendorProject[1]["compare"]) {
    //     $vendorProject[0]["result"] = "เสมอกัน";
    // }

    for ($i = 1; $i < $count; $i++) {
        // if ($vendorProject[$i - 1]["result"] == "เสมอกัน") {
        //     $vendorProject[$i]["result"] = $vendorProject[$i - 1]["compare"] == $vendorProject[$i]["compare"] ? "เสมอกัน" : "แพ้การประกวด";
        // } else {
            $vendorProject[$i]["result"] = "แพ้การประกวด";
        // }
    }
    return $vendorProject;
}

$vendorProject = setToLoseAll($vendorProject);

// require_once(__DIR__ . "/mails/funcMailToMdApprove.php");

//     if ($vendorProject[0]["compare"] > 500000) {
//         // find a  ผร to send mail approve (Plant Manager)
//         $approver = $biddingResultService->getUserStaffByRoleName(
//             "Plant Manager"
//         );
//         $mail->sendTo($approver["email"]);

//     } else {
//         // find a MD to send mail to approve (MD)
//         $approver = $biddingResultService->getUserStaffByRoleName(
//             "MD"
//         );
//         $mail->sendTo($approver["email"]);
//     }
//     $mail->addSubject("พิจารณาอนุมัติผลการประกวดราคา");
//     $mail->addBody(htmlMailToMDApprove2($project, $vendorProject));

//     if (!$_ENV["DEV"]) {
//         $success = $mail->sending();
//         if (!$success) {
//             $http->BadRequest(
//                 [
//                     "err" => "ไม่สามารถส่งอีเมล์ได้",
//                     "status" => 400
//                 ]
//             );
//         }
//         $mail->clearAddress();
//     }

$biddingResultService->commitTransaction();
$http->Ok(
    [
        "data" => date("Y-m-d H:i:s"),
        "status" => 200
    ]
);