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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}


$offset = $template->valFilter(isset($_GET["offset"]) ? $_GET["offset"] : null);
$limit = $template->valFilter(isset($_GET["limit"]) ? $_GET["limit"] : null);

if(empty($offset)){
    $offset = 0;
}
if(empty($limit)){
    $limit = 5;
}

$vendorProjectService = new VendorProjectService();

$listVendors = $vendorProjectService->listVendorPagination( "list", $limit, $offset);

$http->Ok(
    [
        "data" => $listVendors,
        "status" => 200
    ]
);