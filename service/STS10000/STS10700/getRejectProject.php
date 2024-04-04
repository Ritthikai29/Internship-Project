<?php
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");
include('./TemplateProject.php');

include("./../../middleware/authentication.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();


$projectService = new ProjectService();

/**
 * GET METHOD 
 */
if ($_SERVER["REQUEST_METHOD"] != 'GET') {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] method is not allows",
            "status" => 401
        ]
    );
}

//------------------------------------AUTH-----------------------------------
try {
    $tokenDecode = JWTAuthorize($enc, $http);
} catch (Exception $e) {
    $http->Unauthorize(
        [
            "err" => "token is unauthorize",
            "status" => 401
        ]
    );
}
//---------------------------------END---AUTH-----------------------------------
$user_id = $template->valVariable(isset($tokenDecode->userId) ? $tokenDecode->userId : null, "user ID"); //find a [userId] from access token 


/**
 * Recive data from GET body
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null);

/**
 * find a project  
 * By projectKey
 */
$project = $projectEditService->getProjectByKey($projectKey);
if(!$project){
    $http->NotFound(
        [
            "err" => "not found a project by project key",
            "status" => 404
        ]
    );
}


/**
 * find a lastest project is validated
 * By project Id
 */
$projectValidate = $projectEditService->getProjectValidateByProjectId($project["id"]);
if(!$projectValidate){
    $http->NotFound(
        [
            "err" => "not found a validated",
            "status" => 404
        ]
    );
}

if($projectValidate["approve"] === 0){
    $http->Ok(
        [
            "data" => "you project is will be approve can't edit",
            "status" => 200
        ]
    );
}

/**
 * find a reject of the project with reject reason
 * by validate id 
 */
$reject = $projectEditService->getRejectProjectByValidateId($projectValidate["id"]);
if(!$reject){
    $http->NotFound(
        [
            "err" => "not found a reject project from contractor",
            "status" => 404
        ]
    );
}

$http->Ok(
    [
        "data" => $reject,
        "status" => 200
    ]
);
