<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("./projectSettingService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$projectSettingService = new ProjectSettingService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * authentication 
 */
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if(!$userId){
    $http->Unauthorize(
        [
            "err" => "not found a user id ",
            "status" => 401
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);

$name = isset($body["name"]) ? $body["name"] : null;

if ($name) {
    // Split the "name" field by the "/" character and get the first part
    $nameParts = explode('/', $name);
    $name = trim($nameParts[0]); // Get the first part and remove leading/trailing whitespace
}

$name = $template->valVariable($name, "ชื่อ");
$ืUserIdByName = $projectSettingService->getUserIdByName($name);
    $http->ok(
        [
            "data" => $ืUserIdByName,
            "status" => 200
        ]
    );

