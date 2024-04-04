<?php
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");

include("./../middleware/authentication.php");

include_once("./registerProjectService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$registerProjectService = new RegisterService();

if ($_SERVER["REQUEST_METHOD"] != 'GET')
    $http->MethodNotAllowed();

/**
 * Recieve data from GET body
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key" );

$project = $registerProjectService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project id",
            "status" => 404
        ]
    );
}

$InlistVendor = $registerProjectService->getInListVendorRegisterInfoByProjectId((int)$project['id']);

$http->Ok([
    "data" => $InlistVendor,
    "status" => 200
]);