<?php
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingDatabase.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");

include("../calculatorTemplate.php");

// import for authorize
include_once("../../middleware/authentication.php");
include_once("../authorize.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();


if($_SERVER["REQUEST_METHOD"] !== 'GET'){
    $http->MethodNotAllowed([
        "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW(s)",
        "status" => 405
    ]);
}

/**
 * 
 * Object for calculator Service
 * 
 * @var object
 */
$calculateService = new CalculateService();


/**
 * *user id will be have in token decode
 * ! Dont Trust a client
 * 
 * @var string
 */
$userId = AuthorizeByKey();

/**
 * 
 * GET a project id from Parameter in endpoint
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project ID");

$project = $calculateService->getProjectByKey($projectKey);

$projectId = $project["id"];



/**
 * get a ref price manager using projectId , userID and role of manager(calculator)
 * 
 * @var array
 */
try {
    $refPriceManagerCalculator = $calculateService->getRefPriceManagerByProjectAndUserWithRole($projectId, $userId, 'calculator');
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}
/**
 * check is haved ?
 */
if (!$refPriceManagerCalculator) {
    $http->NotFound(
        [
            "err" => "you not allowed in this project",
            "status" => 404
        ]
    );
}

/**
 * use a ref price manager to find a budget calculator in project
 * By $refPriceManagerCalculator["id"]
 * 
 * @var array
 */
try {
    $mainBudgetLatest = $calculateService->getLatestBudgetCalculate($refPriceManagerCalculator["id"]);
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}

/**
 * 
 * In this section i will release a load to a database because 
 * i easy to codeing and min check for backend
 * 
 */


$subBudgetCalculator = false;
/**
 * if Have a main budget in this project
 */
if ($mainBudgetLatest) {
    /**
     * use a main budget id to find a sub budget in calculated
     * 
     * @var array
     */
    try {
        $subBudgetCalculator = $calculateService->getSubBudgetCalculate($mainBudgetLatest["id"]);
        $mainBudgetLatest["Budget"] = $enc->apDecode($mainBudgetLatest["Budget"]);
    } catch (PDOException | Exception $e) {
        $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
        $http->BadRequest([
            "err" => $e->getMessage(),
            "status" => 400
        ]);
    }
    $subBudgetResponse = [];
    foreach($subBudgetCalculator as $key => $value){
        $subBudgetResponse[$key]["detail_price"] = $value["name"];
        $subBudgetResponse[$key]["price"] = $enc->apDecode($value["price"]);
    }

}

/**
 * Get old unit from project 
 */
$PrevUnit = $calculateService->getPrevUnitProjectByKey($projectKey);

$label = $PrevUnit['project_unit_price'];

if ($PrevUnit['project_unit_price'] !== "บาท / โครงการ" && $PrevUnit['project_unit_price'] !== "บาท / ชั่วโมง" && $PrevUnit['project_unit_price'] !== "บาท / ตัน") {
    $label = "อื่นๆ";
}

$unit = [
    "label" => $label,
    "value" => $PrevUnit['project_unit_price']
];

$http->Ok(
    [
        "projectId" => $projectId,
        "userId" => $userId,
        "refPriceManager" => $refPriceManagerCalculator,
        "mainBudget" => $mainBudgetLatest,
        "subBudget" => $subBudgetResponse,
        "unit" => $unit,
        "status" => 200
    ]
);
