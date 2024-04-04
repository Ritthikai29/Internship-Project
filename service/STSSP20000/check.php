<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("./verifyService.php");


$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$verifyService = new VerifyService();


if($_SERVER["REQUEST_METHOD"] !== 'GET'){
    $http->MethodNotAllowed([
        "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW(s)",
        "status" => 405
    ]);
}

/**
 * GET a project Key from GET parameter
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project Key");

/**
 * get a project by projectkey 
 * 
 * @var array An array containing a project information
 *            The array will be return following keys:
 *            - 'id' project ID
 *            - 'key' project Key
 *            - 'Tor_uri' file location of TOR
 *            - 'Job_description_uri' file location of JOB DESCRIPTION
 *            - 'price' price of project
 * .....
 */
$project = $verifyService->getProjectByKey($projectKey);
// Check a project is found ?
if(!$project){
    // response to client is not found a project
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการนี้จาก project Key",
            "status" => 404
        ]
    );
}

// Check a status of the project is a will be calculate yep?
if($project["status_name"] !== "รอคำนวณราคากลาง"){
    // response to client is not have a permission
    $http->Forbidden(
        [
            "err" => "โครงการนี้ไม่อยู่ในสถานะ \"รอคำนวณราคากลาง\"",
            "status" => 403
        ]
    );
}

/**
 * get a Ref Price Manager by project Id and role name
 * 
 * @param int $projectId
 * @param string 'calculator'
 * @var array
 */
$calculatorManager = $verifyService->getManagerByProjectIdAndRoleName($project["id"], 'calculator');
// check found a manager
if(!$calculatorManager){
    // response to client not found
    $http->NotFound(
        [
            "err" => "ไม่พบผู่คำนวณ ระบบอาจมีปัญหา โปรดติดต่อ Admin",
            "status" => 404
        ]
    );
}

/**
 * find a latest budget calculator of manager calculator 
 * 
 * @param int $calculatorManager["id"]
 * @var array
 */
$budgetCalculateLatest = $verifyService->getBudgetCalculatorByRefId($calculatorManager["id"]);
// check found a budget calculate
if(!$budgetCalculateLatest){
    // if not found a budget calculate
    $http->NotFound(
        [
            "err" => "ไม่พบราคากลางที่รอการตรวจสอบ",
            "status" => 404
        ]
    );
}
// Check status is a waiting verify ? 
if($budgetCalculateLatest["status_name"] !== 'waiting verify 2' && $budgetCalculateLatest["status_name"] !== 'waiting verify'){
    // if status is not waiting for verify.
    $http->Forbidden(
        [
            "err" => "โครงการนี้ไม่ได้รอการตรวจสอบราคากลาง",
            "status" => 403
        ]
    );
}

// Response to FE is successful can be access to budget calculate for verify
$http->Ok(
    [
        "data" => [
            "project" => $project,
            "budget_caluclate" => $budgetCalculateLatest,
            "calculate_manager" => $calculatorManager
        ],
        "status" => 200
    ]
);