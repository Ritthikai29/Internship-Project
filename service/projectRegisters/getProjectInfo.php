<?php 
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");

include_once("./registerProjectService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$registerProjectService = new RegisterService();

// IF REQUEST_METHOD IS NOT 'GET' -> MethodNotAllowed
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


// * Get Project Info (start,end datetime,deposit_money and Employees Info)
$projectInfo = $registerProjectService->getProjectSettingByProjectId($project["id"]);


$http->Ok([
    "data" => $projectInfo,
    "data2" => $project,
    "status" => 200
]);




