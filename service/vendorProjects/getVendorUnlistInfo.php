<?php
session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/./../middleware/authentication.php");
include_once(__DIR__ . "/./vendorProjectService.php");

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

$body = json_decode(file_get_contents('php://input'), true);

$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");
$project = $vendorProjectService->getProjectByKey($projectKey);
if (!$project){
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการ",
            "status" => 404
        ]
    );
}

// list current unlist vendor 
$vendorNon = $vendorProjectService->listVendorUnlistByProjectId($project['id']);

// list verify and approve for vendor
$vaUnlist = $vendorProjectService->listVAforVendorUnlistByProjectId($project['id']);

if($vaUnlist !== false){
    // list cc for vendor
    $vaUnlist['cc'] = $vendorProjectService->listCCforVendorUnlistByAvpId($vaUnlist['id']);
} else {
    $vaUnlist = [];
}

$http->Ok(
    [
        "va_data" => $vaUnlist,
        "un_data" => $vendorNon,
        "status" => 200
    ]
);