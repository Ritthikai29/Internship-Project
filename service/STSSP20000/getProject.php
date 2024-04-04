<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

// auth 
include_once("../middleware/authentication.php");
include_once("./middleware/authorize.php");

include("./verifyService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

/**
 * create a object for use a service in verify service object
 * 
 * @var object
 */
$verifyService = new VerifyService();

/**
 * check a method of the code 
 */
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed([
        "err" => [
            "data" => "this link method is not allow your method",
            "status" => 405
        ]
    ]);
}
$userId = AuthorizeByKey();

/**
 * get a project key from params 
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project Key");

/**
 * query a project from project key 
 * 
 * @var object
 */
$project = $verifyService->getProjectByKey($projectKey);
// check a project is have ?
if(!$project){
    // if project not have
    $http->NotFound(
        [
            "err" => "not found a project in code",
            "status" => 404
        ]
    );
}

/**
 * find a status of the project 
 * 
 * @var array
 */
$project["status"] = $verifyService->getProjectStatus($project["status_id"]);

// response a project to client in post message
$http->Ok(
    [
        "data" => $project,
        "status" => 200
    ]
);

