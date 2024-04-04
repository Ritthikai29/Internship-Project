<?php
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingDatabase.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");

// import for authorize
include_once("../../middleware/authentication.php");
include_once("../authorize.php");

include("../calculatorTemplate.php");

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
$userId = AuthorizeByKey();

/**
 * 
 * Object for calculator Service
 * 
 * @var object
 */
$calculateService = new CalculateService();

$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "Project Key");

$project = $calculateService->getProjectByKey($projectKey);
if(!$project){
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

$managers = $calculateService->listManagerByProjectId($project["id"]);
if(!$managers){
    $http->NotFound(
        [
            "err" => "not found a managers in this project",
            "status" => 404
        ]
    );
}

/**
 * for loop for get and merge a data to manager
 */
foreach($managers as $key => $value){
    /**
     * first of loop is a get user staff id for get employee
     * 
     * @var array
     */
    $user = $calculateService-> getUserById($value["user_staff_id"]);
    if(!$user){
        $http->NotFound(
            [
                "err" => "not found a user staff",
                "status" => 404
            ]
        );
    }

    /**
     * use a user id for find a employee
     * 
     * @var array
     */
    $employee = $calculateService->getEmployeeById($user["employee_id"]);
    if(!$employee){
        $http->NotFound(
            [
                "err" => "not found a employee",
                "status" => 404
            ]
        );
    }
    $userRole = $calculateService->getManagerRoleById($value["manager_role_id"]);
    if(!$userRole){
        $http->NotFound(
            [
                "err" => "not found a user role",
                "status" => 404
            ]
        );
    }

    $managers[$key]["employee"] = $employee;
    $managers[$key]["user_role"] = $userRole;
}
$http->Ok(
    [
        "data" => $managers,
        "status" => 200
    ]
);