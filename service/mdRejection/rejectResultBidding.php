<?php

session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../middleware/authentication.php");

include_once(__DIR__ . "/mdRejectionService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$service = new MdRejectionService();

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
    $user = $service->getUserByIdAndRole($userId, $roleCheck[$i],$roleCheck[$i+1]);
    if ($user) {
        $isOk = true;
     }
    $i++;
} while (!$isOk && $countRole > $i);
 
if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในการไม่อนุมัติ",
            "status" => 401
        ]
    );
}
// -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------


$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");
$project = $service->getProjectByKey($projectKey);
if (!$project){
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการ",
            "status" => 404
        ]
    );
}

$secretaryResult = $service->getSecretaryResultBiddingByPId($project["id"]);
if (!$secretaryResult){
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่สรุปผลการประกวดราคา",
            "status" => 404
        ]
    );
}

$is_approve = $template->valNumberVariable(isset($_GET["is_approve"]) ? $_GET["is_approve"] : null, "is_approve");
$approve_datetime = date("Y-m-d H:i:s");

$data = [
    "is_approve" => $is_approve,
    "approver_id" => $userId,
    "approve_datetime" => $approve_datetime,
    "project_id" => $project["id"]
];

$service->startTransaction();

$secretaryData = $service->updateSecretaryResultBiddingByPId($data);
if (!$secretaryData){
    $http->NotFound(
        [
            "err" => "ไม่สามารถอัพเดตโครงการที่สรุปผลการประกวดราคาได้",
            "status" => 404
        ]
    );
}

$vendorProject = $service->listVendorApproveProjectByProjectId($project["id"]);
$count = count($vendorProject);
for ($i = 0; $i < $count; $i++) {
    $result = $service->updateVendorStatusById($vendorProject[$i]["id"],2);
    if (!$result) {
        $http->Forbidden(
            [
                "err" => "ไม่สามารถอัพเดตสถานะ Vendor ได้",
                "status" => 403
            ]
        );
    }
}


$prepareProject = [
    "statusId" => 16,
    "projectId" => $project["id"]
];
$projectUpdate = $service->updateProjectStatusById($prepareProject);
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
                    
                        โครงการ ' . $project['name'] . ' ได้รับการปฏิเสธแล้ว แจ้งเพื่อทราบ
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
$mail->addSubject("โครงการ $project[name] ได้รับการปฏิเสธจาก MD");
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

$service->commitTransaction();

$http->Ok(
    [
        "data" => "ไม่อนุมัติสำเร็จ",
        "status" => 200
    ]
);