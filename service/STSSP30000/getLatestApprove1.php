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
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
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
$tokenUserId = isset($tokenObject->userId) ? $tokenObject->userId : null;


$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");

$project = $approveService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project key",
            "status" => 404
        ]
    );
}

// get budget is a waiting for you approve?
$calculatorManager = $approveService->getManagerByProjectIdAndRoleName($project["id"], "calculator");
if (!$calculatorManager) {
    $http->NotFound([
        "err" => "โครงการนี้ไม่มีผู้คำนวณ",
        "status" => 404
    ]);
}

$calculatePrice = $approveService->getBudgetCalculatorByRefId($calculatorManager["id"]);
if(!$calculatePrice){
    $http->NotFound([
        "err" => "โครงการนี้ไม่มีการคำนวณ",
        "status" => 404
    ]);
}

// check you are a approver 2 ใช่ไหม 
$clientManager = $approveService->getManagerByProjectIdAndUserId($project["id"], $tokenUserId);
if (!$clientManager || $clientManager["role_name"] != "approver 2") {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่ approver 2 ไม่สามารถเข้าถึงได้",
            "status" => 401
        ]
    );
}




$approve1Manager = $approveService->getManagerByProjectIdAndRoleName($project["id"], "approver 1");


/**
 * a manager in role approver 1 id => search a latest approve 1 
 * ค้นหาว่า approve ราคากลางอะไรไป และมีการแก้ไขหรือไม่
 */
$approve1Price = $approveService->getLatestApprovedByManagerId($approve1Manager["id"]);
// check is found a latest approve 1
if (!$approve1Price) {
    $http->NotFound(
        [
            "err" => "not found a approve 1 from manager id",
            "status" => 404
        ]
    );
}

/**
 * find a subPrice of approve in this project 
 * 
 */
$approve1Price["old_price"] = $enc->apDecode($calculatePrice["Budget"]);
$approve1Price["price"] = $enc->apDecode($approve1Price["price"]);
$approve1SubPrice = $approveService->getSubPriceApproveByApproveId($approve1Price["id"]);
if ($approve1SubPrice) {
    foreach ($approve1SubPrice as $index => $subPrice) {
        $approve1SubPrice[$index]["price"] = $enc->apDecode($subPrice["price"]);
        if (!is_null($subPrice["new_price"])) {
            $approve1SubPrice[$index]["new_price"] = $enc->apDecode($subPrice["new_price"]);
        }
    }
}
$approve1Price["sub_prices"] = $approve1SubPrice;

$http->Ok(
    [
        "data" => $approve1Price,
        "test" => $calculatorManager,
        "status" => 200
    ]
);

/**
 * return style 
 * 
 * 
 */