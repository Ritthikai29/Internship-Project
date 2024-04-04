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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}


// Read and decode JSON data from the request body
$body = json_decode(file_get_contents('php://input'), true);

$id = isset($_GET["id"]) ? $_GET["id"] : null;


$projectsetting = $projectSettingService->getProjectSettingByProjectId($id);

$http->Ok(
    [
        "data" => $projectsetting,
     
        "status" => 200
    ]
);

