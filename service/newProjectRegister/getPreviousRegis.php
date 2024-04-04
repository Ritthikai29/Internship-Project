<?php 
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");

include("./../middleware/authentication.php");

include_once("./newRegisterService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$newRegisterService = new NewRegisterService();

// Allow GET Method to Access
if ($_SERVER["REQUEST_METHOD"] != 'GET')
    $http->MethodNotAllowed();

// Check have token
try {
    $tokenDecode = JWTAuthorize($enc, $http);
} catch (Exception $e) {
    $http->Unauthorize(
        [
            "err" => "token is unauthorize",
            "status" => 401
        ]
    );
}

// Check User from token
$user_id = $template->valVariable(isset($tokenDecode->vendorId) ? $tokenDecode->vendorId : null, "user ID");
if (!$user_id) {
    $http->NotFound(
        [
            "err" => "not found vendor from vendor id",
            "status" => 404
        ]
    );
}

/**
 * Recieve data from GET body
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key" );
$project = $newRegisterService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project id",
            "status" => 404
        ]
    );
}

// Get Vendor Register info
$vendorRegisterInfo = $newRegisterService->getVendorRegisterInfoByVdIdAndPjId($user_id,$project['id']);

$http->Ok([
    "data" => $vendorRegisterInfo,
    "status" => 200
]);

