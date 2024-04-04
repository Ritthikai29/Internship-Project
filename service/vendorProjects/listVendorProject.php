<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include("./../middleware/authentication.php");
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


$projectId = $template->valFilter(isset($_GET["projectId"]) ? $_GET["projectId"] : null);
$type = $template->valVariable(isset($_GET["type"]) ? $_GET["type"] : null);




$listVendorsProject = $vendorProjectService->listVendorProject($projectId,$type);

$http->Ok(
    [
        "data" => $listVendorsProject,
        "status" => 200
    ]
);