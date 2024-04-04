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


if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$offset = $template->valNumberVariable(isset($_GET["ofs"]) ? $_GET["ofs"] : 0);
$limit = $template->valNumberVariable(isset($_GET["lim"]) ? $_GET["lim"] : 5);
$statusProject = $template->valVariable(isset($_GET["st"]) ? $_GET["st"] : null, "status");


$verifyProjectService = new VerifyProjectService();
/**
 * list all project in the database
 * 
 * @var array
 */
$project = $verifyProjectService->listProjectWithStatus($statusProject,$offset, $limit);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พยโครงการ กรุณาลองใหม่ในภายหลัง",
            "status" => 404
        ]
    );
}

/**
 * cache query from database
 */
$departments = [];
$divisions = [];
$projectTypes = [];
$jobTypes = [];
$statuses = [];

foreach ($project as $index => $value) {
    /**
     * check this department is have in cache
     */
    if (!array_key_exists($project[$index]["department"], $departments)) {
        // query data and save in cache
        $departments[$project[$index]["department"]] = $verifyProjectService->getDepartmentById($project[$index]["department"]);
    }

    /**
     * check this division is have in cache
     */
    if (!array_key_exists($project[$index]["division"], $divisions)) {
        // query data and save in cache
        $divisions[$project[$index]["division"]] = $verifyProjectService->getDivisionById($project[$index]["division"]);
    }

    /**
     * check Project type is in cache ?
     */
    if (!array_key_exists($project[$index]["project_type"], $projectTypes)) {
        // query data and save in cache
        $projectTypes[$project[$index]["project_type"]] = $verifyProjectService->getProjectTypeById($project[$index]["project_type"]);
    }

    /**
     * check job Types is in cache ?
     */
    if (!array_key_exists($project[$index]["job_type"], $jobTypes)) {
        // query proejct job type in cache
        $jobTypes[$project[$index]["job_type"]] = $verifyProjectService->getJobTypeById($project[$index]["job_type"]);
    }

    /**
     * check status is in cache ?
     */
    if (!array_key_exists($project[$index]["status_id"], $statuses)) {
        // query proejct job type in cache
        $statuses[$project[$index]["status_id"]] = $verifyProjectService->getStatusById($project[$index]["status_id"]);
    }

    $project[$index]["department"] = $departments[$project[$index]["department"]];
    $project[$index]["division"] = $divisions[$project[$index]["division"]];
    $project[$index]["project_type"] = $projectTypes[$project[$index]["project_type"]];
    $project[$index]["job_type"] = $jobTypes[$project[$index]["job_type"]];
    $project[$index]["status"] = $statuses[$project[$index]["status_id"]];
}

$http->Ok([
    "data" => $project,
    "status" => 200
]);