<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include("./approveService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$approveService = new ApproveService();


if($_SERVER["REQUEST_METHOD"] !== "GET"){
    $http->MethodNotAllowed(
        [
            "err" => "$SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * GET a project key from parameter GET[key]
 * 
 * @var string
 */
$projectKey = $template->valVariable( isset($_GET["key"]) ? $_GET["key"] : null, "project Key" );

$project = $approveService->getProjectByKey($projectKey);
if(!$project){
    $http->NotFound(
        [
            "err" => "not found a project from this key",
            "status" => 404
        ]
    );
}

$calculatorManager = $approveService->getManagerByProjectIdAndRoleName($project["id"], "calculator");
if(!$calculatorManager){
    $http->NotFound(
        [
            "err" => "not found a manager of project in role calculator",
            "status" => 404
        ]
    );
}

/**
 * find a latest budget for check a budget status 
 * 
 * @var array
 */
$latestBudget = $approveService->getBudgetCalculatorByRefId($calculatorManager["id"]);
if(!$latestBudget){
    $http->NotFound(
        [
            "err" => "not found a budget from this project",
            "status" => 404
        ]
    );
}
if($latestBudget["status_name"] !== "reject by approve 2"){
    $http->NotFound(
        [
            "err" => "the status is incorrect",
            "status" => 404
        ]
    );
}

/**
 * find a approver 2 to find a latest un approve calculate
 * 
 * @var array
 */
$approver2Manager = $approveService->getManagerByProjectIdAndRoleName($project["id"], "approver 2");
if(!$approver2Manager){
    $http->NotFound(
        [
            "err" => "this project is not found approver 2",
            "status" => 404
        ]
    );
}
$approveComment = $approveService->getUnapproveCommentByRefId($approver2Manager["id"]);
if(!$approveComment){
    $http->NotFound(
        [
            "err" => "not found a approver 2 comment",
            "status" => 404
        ]
    );
}
$http->Ok(
    [
        "data" => $approveComment,
        "status" => 404
    ]
);
