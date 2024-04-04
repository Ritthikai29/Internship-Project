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


if ($_SERVER["REQUEST_METHOD"] !== "GET") {
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
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project Key");

/**
 * get a project by project Key 
 * 
 * @var array An array is contain to project database information
 */
$project = $approveService->getProjectByKey($projectKey);
// check is found a project ?
if (!$project) {
    // if not found a project 
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

/**
 * use a project id and role = calculate to find a manager
 * manager is a ref price manager in database
 * 
 * @var array
 */
$calculatorManager = $approveService->getManagerByProjectIdAndRoleName($project["id"], 'calculator');
// check a manager in role calculator is found 
if (!$calculatorManager) {
    // if not found a manager in role calculator
    $http->NotFound(
        [
            "err" => "not found a manager in role calculator",
            "status" => 404
        ]
    );
}

/**
 * find a lastest of budget calculate
 * @var array
 */
$latestBudgetCalculate = $approveService->getBudgetCalculatorByRefId($calculatorManager["id"]);
// check a latest budget is found?
if (!$latestBudgetCalculate) {
    // if not found a latest budget
    $http->NotFound(
        [
            "err" => "not found a latest budget",
            "status" => 404
        ]
    );
}
// check a status is a verify?
if (
    $latestBudgetCalculate["status_name"] !== "verify" &&
    $latestBudgetCalculate["status_name"] !== "waiting approve 2" &&
    $latestBudgetCalculate["status_name"] !== "reject by approve 2"
) {
    // if status is un eq to verify and approve 1 (status not include to add a approve)
    $http->Forbidden(
        [
            "err" => "this project is not for you approve",
            "test" => $latestBudgetCalculate["status_name"],
            "status" => 403
        ]
    );
}

/**
 * check a status is a verify or approve 1
 * if verify do first if
 * if approve 1 do second if
 * else return can't be access
 */
if (
    $latestBudgetCalculate["status_name"] === "verify" ||
    $latestBudgetCalculate["status_name"] === "reject by approve 2"
) {
    // if status is eq verify (is verified)
    $http->Ok(
        [
            "data" => [
                "clientRole" => "approver 1",
                "project" => $project
            ],
            "status" => 200
        ]
    );
} elseif ($latestBudgetCalculate["status_name"] === "waiting approve 2") {
    /**
     * check a project is have a manager in role approver 2 ?
     * because in the project if not have a approver 2 is will be successful
     * 
     * get all of ref price manager in the project
     * 
     * @var array
     */
    $approver2Manager = $approveService->getManagerByProjectIdAndRoleName($project["id"], 'approver 2');
    // check is found?
    if (!$approver2Manager) {
        // if not found a approver 2 
        $http->NotFound(
            [
                "err" => "this project is not have a approver 2 please contract to admin",
                "status" => 404
            ]
        );
    }

    /**
     * Response to client is can be access to approve 2
     */
    $http->Ok(
        [
            "data" => [
                "clientRole" => "approver 2",
                "project" => $project
            ],
            "status" => 200
        ]
    );
} else {
    // if this project is not include to two condition
    $http->Forbidden(
        [
            "err" => $latestBudgetCalculate["status_name"] ,
            "status" => 403
        ]
    );
}