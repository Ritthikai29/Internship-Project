<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");

include_once("./projectService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$projectService = new ProjectService();
// start transections 
$projectService->startTransaction();

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

$offset = $template->valNumberVariable(isset($_GET["ofs"]) ? $_GET["ofs"] : 0);
$limit = $template->valNumberVariable(isset($_GET["lim"]) ? $_GET["lim"] : 5);

$project = $projectService->listProjectsHistoryByUserId(
    userId: $userId,
    offset: $offset,
    limit: $limit,
);


$http->Ok(
    [
        "data" => $project,
        "status" => 200
    ]
);