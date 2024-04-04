<?php
session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../middleware/authentication.php");

include_once(__DIR__ . "/projectEditService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$projectEditService = new ProjectEditService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

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

$project_id = $template->valVariable(isset($_GET["project_id"]) ? $_GET["project_id"] : null);
$reasonProjectEdit = $projectEditService->getReasonProjectEdit($project_id);
$http->Ok(
    [
        "data" => $reasonProjectEdit,
        "status" => 200
    ]
);