<?php

// Query project by project id
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingDatabase.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");

// import for authorize
include_once("../../middleware/authentication.php");
include("../authorize.php");

include('../calculatorTemplate.php');

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$calculateService = new CalculateService();

if ($_SERVER["REQUEST_METHOD"] != 'GET') {
    $http->MethodNotAllowed([
        "err" => "link is not allow a method",
        "status" => 405
    ]);
}

/**
 * user authorize middleware of route (to user can )
 */
$userId = Authorize();
/**
 * 
 * get a project id from $_GET parameter
 * 
 * @var string
 */
$project_id = $template->valFilter($_GET["pj_id"]);


/**
 * 
 * get a project by id
 * 
 * @var array
 */
try {
    $project = $calculateService->getProjectById($project_id);
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}

$clientManager = $calculateService->getRefPriceManagerByProjectAndUser($project["id"], $userId);
if (!$clientManager || $clientManager["role_name"] != "calculator") {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์เข้าถึงโครงการนี้",
            "status" => 401
        ]
    );
}

/**
 * 
 * get a project Status from id in project
 * 
 * @var array
 */
try {
    $projectStatus = $calculateService->getStatusProjectById($project["status_id"]);
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}

/**
 * assign a array to array project 
 * 
 * @var array
 */
$project["status"] = $projectStatus;

/**
 * check a status of the project is a waiting for calculating
 * 
 */
if ($projectStatus["status_name"] !== "รอคำนวณราคากลาง") {
    $http->BadRequest([
        "err" => "you don't have a permission for this project",
        "status" => 400
    ]);
}


$http->Ok(
    [
        "data" => $project,
        "status" => 200
    ]
);