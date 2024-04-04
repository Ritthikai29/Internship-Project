<?php 
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");

include_once("./registerProjectService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$registerProjectService = new RegisterService();

// authorization
$auth = new Userauth();
$token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;
// Check token validate?
try {
    $decode = $enc->jwtDecode($token);
} catch (Exception $e) {
    $http->Unauthorize(["err" => "your token is expired"]);
}

// Get vendor id from Token
$userId = isset($decode->vendorId) ? $decode->vendorId : null;

// Check is a post methods
if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

// Read and decode JSON data from the request body
$body = json_decode(file_get_contents('php://input'), true);

// * Get Project ID By project key
$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "project key" );
$project = $registerProjectService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project key",
            "status" => 404
        ]
    );
}

// * Get passcode from Vendor
$passCode = $template->valVariable(isset($body["passcode"]) ? $body["passcode"] : null, "pass code");

// Check pass code from DB
$checkPassCode = $registerProjectService->checkPassCode($userId,$project['id']);
if($checkPassCode["passcode"] == NULL){
    $http->NotFound(
        [
            "err" => "not found a passcode of user",
            "status" => 404
        ]
    );
}

// Verify passcode is match with DB
$verify = password_verify($passCode,$checkPassCode["passcode"]);

// Check is passcode correct
if($verify == false){
    $http->BadRequest(
        [
            "err" => "your passcode is incorrect",
            "status" => 400
        ]
    );
}

$http->Ok([
    "data" => $verify,
    "status" => 200
]);