<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("../Template/SettingMailSend.php");

include_once("./approveResultService.php");

// ini_set('display_errors', 1);
$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$approveResultService = new ApproveResultService();
// start transections 
$approveResultService->startTransaction();

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
 * find a user is a MD or Plant Manager ? 
 */
$isOk = false;
$roleCheck = [
    "MD","Plant Manager"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $approveResultService->getUserByIdAndRole($userId, $roleCheck[$i],$roleCheck[$i+1]);
    if ($user) {
        $isOk = true;
    }
    $i++;
} while (!$isOk && $countRole > $i);
 
if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในการอนุมัติ",
            "status" => 401
        ]
    );
}
// -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------


$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");
$project = $approveResultService->getProjectByKey($projectKey);
if (!$project){
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการ",
            "status" => 404
        ]
    );
}

$secretaryResult = $approveResultService->getSecretaryResultBiddingByPId($project["id"]);
if (!$secretaryResult){
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่สรุปผลการประกวดราคา",
            "status" => 404
        ]
    );
}

$is_approve = $template->valVariable(isset($_GET["is_approve"]) ? $_GET["is_approve"] : null, "is_approve");
$approve_datetime = date("Y-m-d H:i:s");

$data = [
    "is_approve" => $is_approve,
    "approver_id" => $userId,
    "approve_datetime" => $approve_datetime,
    "project_id" => $project["id"]
];
$secretaryData = $approveResultService->updateSecretaryResultBiddingByPId($data);
if (!$secretaryData){
    $http->NotFound(
        [
            "err" => "ไม่สามารถอัพเดตโครงการที่สรุปผลการประกวดราคาได้",
            "status" => 404
        ]
    );
}


$vendorProject = $approveResultService->listVendorApproveProjectByProjectId($project["id"]);
foreach ($vendorProject as $index => $value) {
    $price = $approveResultService->getBidPriceByVendorProjectId($value["id"]);
    $vendorProject[$index]["price"] = $price ? (float) $enc->bidDecode($price["price"]) : null;
    $new = $approveResultService->getNewBidPriceByVendorProjectId($value["id"]);
    $vendorProject[$index]["newPrice"] = $new ? (float) $enc->bidDecode($new["price"]) : null;
    $vendorProject[$index]["compare"] = $new ? (float) $enc->bidDecode($new["price"]) : ($price ? (float) $enc->bidDecode($price["price"]) : null);

    if ($vendorProject[$index]["vendor_type"] == "list") {
        $vendorProject[$index]["vendor_type_name"] = "ใน List ทะเบียน";
    } else {
        $vendorProject[$index]["vendor_type_name"] = "นอก List ทะเบียน";
    }
}
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

function findAWinner($vendorProject)
{
    $approveResultService = new ApproveResultService();
    $http = new Http_Response();
    
    $count = count($vendorProject);
    $vendorProject[0]["result"] = "ชนะการประกวด";
    $result = $approveResultService->updateVendorStatusById($vendorProject[0]["id"],1);
    if (!$result) {
        $http->Forbidden(
            [
                "err" => "ไม่สามารถอัพเดตสถานะ Vendor ได้",
                "status" => 403
            ]
        );
    }

    for ($i = 1; $i < $count; $i++) {
            $vendorProject[$i]["result"] = "แพ้การประกวด";
            $result = $approveResultService->updateVendorStatusById($vendorProject[$i]["id"],2);
            if (!$result) {
                $http->Forbidden(
                    [
                        "err" => "ไม่สามารถอัพเดตสถานะ Vendor ได้",
                        "status" => 403
                    ]
                );
            }
    }
    return $vendorProject;
}

function setToLoseAll($vendorProject)
{
    $approveResultService = new ApproveResultService();
    $http = new Http_Response();

    foreach ($vendorProject as $index => $value) {
        $vendorProject[$index]["result"] = "แพ้การประกวด";
        $result = $approveResultService->updateVendorStatusById($vendorProject[$index]["id"],2);
        if (!$result) {
            $http->Forbidden(
                [
                    "err" => "ไม่สามารถอัพเดตสถานะ Vendor ได้",
                    "status" => 403
                ]
            );
        }
    }
    return $vendorProject;
}

if ($secretaryResult["is_success"] === "1") {
    $status = $approveResultService->getProjectStatusByName("อนุมัติผลการประกวดราคาแล้ว");
    $vendorProject = findAWinner($vendorProject);
} else if ($secretaryResult["is_success"] === "0") {
    $status = $approveResultService->getProjectStatusByName("อนุมัติผลการประกวดราคาแล้ว");
    $vendorProject = setToLoseAll($vendorProject);
} else {
    $status = $approveResultService->getProjectStatusByName("รอเจรจาต่อรอง");
}

// Update a project status to success / waiting to discuse / failed bidding
$prepareProject = [
    "statusId" => $status["id"],
    "projectId" => $project["id"]
];
$projectUpdate = $approveResultService->updateProjectStatusById($prepareProject);
if (!$projectUpdate) {
    $http->Forbidden(
        [
            "err" => "ไม่สามารถอัพเดตสถานะโครงการได้",
            "status" => 403
        ]
    );
}

//Get Approver Email
$ApproverEmail = $approveResultService->getApproveProjectEmail($project['id']);

$htmlContent = '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <title>Email-แจ้งมีการ อนุมัติผล</title>
    <style>
        .first-table {
            width: 1000px; 
            margin: 0 auto; 
            padding-bottom: 20px; 
            background: #ffffff; 
            box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25); 
            border-radius: 10px; 
            border: 1px rgba(0, 0, 0, 0.20) solid;
            font-family: Tahoma;

        }

        .first-td {
            position: relative; 
            padding-left: 30px; 
            padding-right: 30px;
        }

        .second-td {
            background-color: #2B3467; 
            padding: 10px; 
            border-radius: 8px;
        }

        h1{
            color: #000000; 
            font-size: 20px; 
            margin-left: 20px; 
            font-weight: 500; 
            word-wrap: break-word;
        }

        a {
            color: #ffffff; 
            font-size: 20px; 
            font-weight: 500; 
            text-decoration: none; 
            display: inline-block; 
            text-align: center;
        }
    </style>
</head>
<body>
    <br>
    <br>
    <table class="first-table">
        <tr>
            <td class="first-td">
                <br>
                <h1>
                    
                        โครงการ ' . $project['name'] . ' ได้รับการอนุมัติแล้ว แจ้งเพื่อทราบ
                        <br>
                    
                </h1>
                <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="left" class="second-td">
                            <a href="http://137.116.132.150/STSBidding/frontend/">
                                &nbsp;&nbsp;เข้าสู่ระบบ&nbsp;&nbsp;
                            </a>
                        </td>
                    </tr>
                </table>
                <br>
            </td>
        </tr>
    </table>
    <br>
</body>
</html>
';

$mail->sendCc($ApproverEmail["email"]);
$mail->addSubject("โครงการ $project[name] ได้รับการอนุมัติจาก MD");
$mail->addBody($htmlContent);

if (!$_ENV["DEV"]) {
    $success = $mail->sending();
    if (!$success) {
        $http->BadRequest(
            [
                "err" => "ไม่สามารถส่ง Email ได้",
                "status" => 400
            ]
        );
    }
}


$approveResultService->commitTransaction();

$http->Ok(
    [
        "data" => "อนุมัติสำเร็จ",
        "status" => 200
    ]
);