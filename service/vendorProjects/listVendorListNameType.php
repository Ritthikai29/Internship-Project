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

$search = $template->valVariable(isset($_GET["search"]) ? $_GET["search"] : null, "search");
$project_id = $template->valVariable(isset($_GET["project_id"]) ? $_GET["project_id"] : null, "project_id");

$listVendorSearch = $vendorProjectService->listVendorByNameOrType($search,$project_id,"list");
if(!$listVendorSearch){
    $http->NotFound(
        [
            "err" => "not found a vendor | Should be to add a new",
            "status" => 404
        ]
    );
}

$http->Ok(
    [
        "data" => $listVendorSearch,
        "status" => 200
    ]
);
