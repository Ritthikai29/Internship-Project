<?php

session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("./calculatorTemplate.php");
$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$calculateService = new CalculateService();

if ($_SERVER["REQUEST_METHOD"] !== 'GET'){
    $http->MethodNotAllowed([
        "err" => "link is not allow a method",
        "status" => 405
    ]);
}

/**
 * get data $projectKey from params
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($_GET["project_key"]) ? $_GET["project_key"] : null, "คีย์โปรเจค");


/**
 * first i will search a project in database by project key
 * 
 * if i found i will run a next state
 * 
 * @param string $projectKey
 * @var array 
 * 
 */

$project = $calculateService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project by key you key is invalid",
            "status" => 404
        ]
    );
}


/**
 * search a Ref price manager(กลุ่มคำนวณราคากลาง) in role calculator(ตำแหน่ง) of the project
 * 
 * * in this case should be have if project is don't have a price 
 * @param int $project['id']
 * @var array
 */
$refPriceManagerCalculator = $calculateService->getRefPriceManagerByProjectAndRole($project["id"], 'calculator');

if (!$refPriceManagerCalculator) {
    $http->NotFound([
        "err" => "not found a ref price manager in this project please contract to admin",
        "status" => 404
    ]);
}

/**
 * search a latest budget calculate by refPriceCalculator Id
 * 
 * @var array $budget
 */

$budgetCal = $calculateService->getLatestBudgetCalculate($refPriceManagerCalculator["id"]);

/**
 * incase this project is have in the database and is not status to editing
 * 
 * @return string
 */
if (
    $budgetCal && // For create
    $budgetCal["status_name"] !== "reject by verify" && // For edit
    $budgetCal["status_name"] !== "reject by approve 1" &&
    $budgetCal["status_name"] !== "reject by verify 2"// for edit
) {
    $http->BadRequest([
        "err" => "โปรเจคนี้เคยถูกการบันทึกและไม่อยู่ในสถานะรอแก้ไข",
        "status" => 400
    ]);
}

/**
 * if in case allow to access project
 * @return string
 */
$http->Ok(
    [
        "data" => [
            "project" => $project,
            "manager" => $refPriceManagerCalculator
        ],
        "status" => 200
    ]
);