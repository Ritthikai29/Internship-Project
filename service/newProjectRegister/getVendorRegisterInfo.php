<?php
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");

include("./../middleware/authentication.php");

include_once("./newRegisterService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$newRegisterService = new NewRegisterService();

if ($_SERVER["REQUEST_METHOD"] != 'GET')
    $http->MethodNotAllowed();

//------------------------------------AUTH-----------------------------------
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

//---------------------------------END---AUTH-----------------------------------
$user_id = $template->valVariable(isset($tokenDecode->vendorId) ? $tokenDecode->vendorId : null, "user ID"); //find a [userId] from access token 

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

$body = json_decode(file_get_contents('php://input'), true);

// * get parameter 'id' of vendor id
$vendorId = $user_id;
if (!$vendorId) {
    $http->NotFound(
        [
            "err" => "not found vendor from vendor id",
            "status" => 404
        ]
    );
}

// Get Vendor info
$vendorRegisterInfo = $newRegisterService->getVendorRegisterInfoByVdIdAndPjId($vendorId,$projectId);

$http->Ok([
    "data" => $vendorRegisterInfo,
    "status" => 200
]);