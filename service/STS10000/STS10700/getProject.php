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
 * Find a division by id in the project
 */
$project["division_id"] = $project["division"];
$project["division"] = $projectEditService->getDivisionById($project["division_id"]);

/**
 * find a creator in the project
 */
$project["adder_user_staff"] = $projectEditService->getUserStaffById($project["adder_user_staff_id"]);

/**
 * find a department in the project by id
 */
$project["department_id"] = $project["department"];
$project["department"] = $projectEditService->getDepartmentById($project["department_id"]);

/**
 * find a project type in the project by id
 */
$project["project_type_id"] = $project["project_type"];
$project["project_type"] = $projectEditService->getProjectTypeById($project["project_type_id"]);

/**
 * find a job type of the project by id
 */
$project["job_type_id"] = $project["job_type"];
$project["job_type"] = $projectEditService->getJobTypeById($project["job_type_id"]);

$project["status"] = $projectEditService->getStatusProjectById($project["status_id"]);

unset($project["price"]);
unset($project["calculate_uri"]);

$http->Ok(
    [
        "data" => $project,
        "status" => 200
    ]
);

