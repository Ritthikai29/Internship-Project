<?php
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");
include('../../Template/SettingDatabase.php');
include("./projectEditService.php");

include("./../../middleware/authentication.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$projectEditService = new ProjectEditService();

/**
 * check a method of the code 
 */
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed([
        "err" => [
            "data" => "this link method is not allow your method"
        ]
    ]);
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

$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project Key");

/**
 * GET Project By Key
 */
$project = $projectEditService->getProjectByKey($projectKey);
if(!$project){
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}


/**
 * check a project is created by this user?
 */
if((string)$project["adder_user_staff_id"] !== (string)$user_id){
    $http->Unauthorize(
        [
            "err" => "You don't have a permission in this project",
            "status" => 401
        ]
    );
}

/**
 * get all manager data of the project 
 */
$managers = $projectEditService->getAllManagerOfProjectByKey($project["key"]);


$http->Ok(
    [
        "data" => $managers,
        "status" => 200
    ]
);