<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include_once("../middleware/authentication.php");

include_once("../Template/SettingMailSend.php");
include("./approveService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$approveService = new ApproveService();
$mail = new Mailing();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * get data in JWT Token [Middleware decode a JWT Token and valify Token]
 * 
 * @var object
 */
$tokenObject = JWTAuthorize($enc, $http);

/**
 * get a user id from token 
 */
$tokenUserId = $tokenObject->userId;



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
$project = $approveService->getProjectByKey($projectKey);
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

// response a project to client in post message
$http->Ok(
    [
        "data" => $project,
        "status" => 200
    ]
);