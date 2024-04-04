<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");

include_once("./newRegisterService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$newRegisterService = new NewRegisterService();

if ($_SERVER["REQUEST_METHOD"] != 'GET')
    $http->MethodNotAllowed();

/**
 * get Offered detail from Vendor
 * 
 */

$body = json_decode(file_get_contents('php://input'), true);

function check($array)
{
    return isset($array) ? $array : null;
}

// Check is projectKey is exist 
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

// * Array contain Data(name) of SubBudget
$SubBudgetName = $newRegisterService->getListSubBudgetByProjectId($project["id"]);

$http->Ok([
    "data" => $SubBudgetName,
    "status" => 200
]);