<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include("./../middleware/authentication.php");
include("./vendorProjectService.php");
include_once("../Template/SettingMailSend.php");

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

$project_key = $template->valVariable(
    isset($_GET["project_key"]) ? 
    $_GET["project_key"]: 
    null,
    "ไม่พบข้อมูล project key"
);

$project = $vendorProjectService->getProjectByKey($project_key);

if(!$project){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมููลโครงการที่ต้องการ",
            "status" => 404
        ]
    );
}


$http->Ok(
    [
        "data" => $project,
        "status" => 200
    ]
);
