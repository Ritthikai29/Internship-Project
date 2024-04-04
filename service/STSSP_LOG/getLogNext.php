<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include("./logTemplate.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();


$logService = new GetLogTemplate();

/**
 * Check a methods of the code
 */
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "This methods is not allows",
            "status" => 405
        ]
    );
}

/**
 * get a project by project key from body 
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");
$offset = $template->valNumberVariable(isset($_GET["ofs"]) ? $_GET["ofs"] : null, "offset");
$limit = $template->valNumberVariable(isset($_GET["lim"]) ? $_GET["lim"] : null, "limit");


/**
 * get all log of the project
 */
$logCalculate = $logService->getAllLogByProjectKeyWithLimit($projectKey, (int)$offset, (int)$limit);
$total = $logService->getCountLogByProjectKey($projectKey);

$http->Ok(
    [
        "data" => $logCalculate,
        "total" =>(int) $total["total"],
        "status" => 200
    ]
);