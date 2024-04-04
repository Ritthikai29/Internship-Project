<?php
session_start();

include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../middleware/authentication.php");
include_once(__DIR__ . "/./projectService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$projectService = new ProjectService();
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

// Read and decode JSON data from the request body
$body = json_decode(file_get_contents('php://input'), true);

$projectId = $template->valVariable(isset($body["pj_id"]) ? $body["pj_id"] : null, "project id" );
$unit = $template->valVariable(isset($body["unit"]) ? $body["unit"] : null, "unit");

$data = [
    "project_id" => $projectId,
    "projectUnitPrice" => $unit
];

$projectService->startTransaction();

// Update UnitPrice into Project
$res = $projectService->updateUnitProject($data);
if (!$res) {
    $projectService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "project update failed",
            "status" => 400
        ]
    );
}

$projectService->commitTransaction();

$http->Ok([
    "data" => $res,
    "status" => 200
]);