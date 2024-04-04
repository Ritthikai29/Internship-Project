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
 * create a verify service object 
 * 
 * @var object
 */
$verifyService = new VerifyService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed([
        "err" => [
            "data" => "this link method is not allow your method"
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
 * find a project from project key
 * 
 * @var array
 */
$project = $verifyService->getProjectByKey($projectKey);
// check is found a project
if(!$project){
    // if not found a project
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

/**
 * found a manager by project id and role = "calculator"
 * 
 * @var array
 */
$managerCalculator = $verifyService->getManagerByProjectIdAndRoleName($project["id"], 'calculator');
// check if not found a user
if(!$managerCalculator){
    // if not found a manager calculator
    $http->NotFound(
        [
            "err" => "not found a manager calculator",
            "status" => 404
        ]
    );
}

/**
 * get a latest of the budget from managerCalculator
 * 
 * @var array
 */
$latestBudget = $verifyService->getBudgetCalculatorByRefId($managerCalculator["id"]);
// check if not found a latest budget
if(!$latestBudget){
    // if not found a latest budget from manager id
    $http->NotFound(
        [
            "err" => "not found a latest budget from this project",
            "status" => 404
        ]
    );
}

$have_verify_2 = isset($_GET["haveVerify_2"]) ? $_GET["haveVerify_2"] : false;

// check latestBudget status is a waiting verify
if ($have_verify_2 === "true") {
    if($latestBudget["status_name"] !== "waiting verify 2"){
        // if status is not waiting for your verify
        $http->Forbidden(
            [
                "err" => "โครงการนี้ไม่ได้อยู่ในสถานะ รอตรวจสอบ 2",
                "status" => 403
            ]
        );
    }
}else {
    if($latestBudget["status_name"] !== "waiting verify"){
        // if status is not waiting for your verify
        $http->Forbidden(
            [
                "err" => "โครงการนี้ไม่ได้อยู่ในสถานะ รอตรวจสอบ",
                "status" => 403
            ]
        );
    }
}


/**
 * decode a price to human readable
 */
$latestBudget["Budget"] = $enc->apDecode($latestBudget["Budget"]);

/**
 * find a sub budget from latest budget id
 * 
 * @var array
 */
$subBudgets = $verifyService->listSubBudgetByBudgetId($latestBudget["id"]);
// check a sub budget is have?
if($subBudgets){
    // if found a sub budget 
    foreach($subBudgets as $index => $value){
        $subBudgets[$index]["price"] = $enc->apDecode($subBudgets[$index]["price"]);
    }
    $latestBudget["sub_budgets"] = $subBudgets;
}


/**
 * response a budget to client 
 * 
 * @var array
 */
$http->Ok(
    [
        "data" => $latestBudget,
        "status" => 200
    ]
);