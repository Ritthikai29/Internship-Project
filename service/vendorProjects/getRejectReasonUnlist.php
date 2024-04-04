<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");

include("./vendorProjectService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$vendorProjectService = new VendorProjectService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

// Get Project Key
$project_key = $template->valVariable(
    isset($_GET["project_key"]) ? 
    $_GET["project_key"]: 
    null,
    "ไม่พบข้อมูล project key"
);

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

// Get Project Info
$project = $vendorProjectService->getProjectByKey($project_key);
if($project['status_id'] == 6){
    $http->BadRequest(
        [
            "err" => "ไม่สามารถแก้ไขรายการได้ในขณะนี้",
            "status" => 400
        ]
    );
}

// Get reject reason from verify or approve
$isReject = $vendorProjectService->getHaveRejectUnlistByProjectKey($project_key);
if(!$isReject){
    $http->NotFound(
        [
            "err" => "ไม่พบเหตุผลการปฏิเสธนอกลิสต์",
            "status" => 404
        ]
    );
}

if($isReject['approve1'] == 0){
    $title = 'ผู้ตรวจสอบ';
    // Get Reject Detail
    $detailReject = $vendorProjectService->getRejectUnlistByRejectId($isReject['reject1_id']);
} else {
    $title = 'ผู้อนุมัติ';
    // Get Reject Detail
    $detailReject = $vendorProjectService->getRejectUnlistByRejectId($isReject['reject2_id']);
}

//Prepare Data
$data = [
    "title" => $title,
    "detail" => $detailReject
];

$http->Ok(
    [
        "data" => $data,
        "status" => 200
    ]
);