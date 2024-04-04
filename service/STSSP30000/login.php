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


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * decode a json of body from POST Method
 * 
 * @var array
 */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * get a project key from body
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "project Key");

/**
 * get a employee No from body
 * 
 * @var string
 */
$employeeNO = $template->valVariable(isset($body["employee_no"]) ? $body["employee_no"] : null, "employee NO");

/**
 * get a password from body
 * 
 * @var string
 */
$password = $template->valVariable(isset($body["password"]) ? $body["password"] : null, "Password");

/**
 * find a project from project key
 * 
 * @var array
 */
$project = $approveService->getProjectByKey($projectKey);
// check is found a project ?
if (!$project) {
    // if not found a project
    $http->NotFound(
        [
            "err" => "Not found a project",
            "status" => 404
        ]
    );
}
/**
 * find a project status by project status ID
 * 
 * @var array
 */
$projectStatus = $approveService->getProjectStatusById($project["status_id"]);
// check a project status is found?
if (!$projectStatus) {
    // if not found a project status
    $http->NotFound(
        [
            "err" => "not found a project status",
            "status" => 404
        ]
    );
}
// check a status is a calculating
if ($projectStatus["status_name"] !== "รอคำนวณราคากลาง") {
    // if a status is a calculating
    $http->Forbidden(
        [
            "err" => "this project is a will be calculated",
            "status" => 403
        ]
    );
}

/**
 * find a ref price manager in role calculator
 * 
 * @var array
 */
$managerCalculator = $approveService->getManagerByProjectIdAndRoleName($project["id"], 'calculator');
// check if not found a manager in role calculator
if (!$managerCalculator) {
    // if not found a manager in role manager
    $http->NotFound(
        [
            "err" => "not found a manager in role calculator | please contract to admin",
            "status" => 404
        ]
    );
}



/**
 * find a latest budget calculator by manager calculator id
 * 
 * @var array
 */
$latestBudgetCalculate = $approveService->getBudgetCalculatorByRefId($managerCalculator["id"]);
// check is found a latest budget calculator 
if (!$latestBudgetCalculate) {
    // if found a latest budget calculator
    $http->NotFound(
        [
            "err" => "not found a latest budget calculator",
            "status" => 404
        ]
    );
}


/**
 * find a employee from employee NO
 * 
 * @var array
 */
$employee = $approveService->getEmployeeByNO($employeeNO);
// check is have a employee
if (!$employee) {
    // if employee is not found 
    $http->NotFound(
        [
            "err" => "not found a employee",
            "status" => 404
        ]
    );
}

/**
 * find a user staff by user id
 * 
 * @var array
 */
$userClient = $approveService->getUserStaffByEmpId($employee["id"]);
// check is have a user staff
if (!$userClient) {
    // if user staff is not found
    $http->NotFound(
        [
            "err" => "not found a user staff",
            "status" => 404
        ]
    );
}

/**
 * find a user staff role by id
 * 
 * @var array
 */
$userRole = $approveService->getUserStaffRoleById($userClient["user_staff_role"]);
if (!$userRole) {
    $http->NotFound(
        [
            "err" => "not found a user role",
            "status" => 404
        ]
    );
}
$userClient["user_role"] = $userRole;

// verify password from user client
if (!password_verify($password, $userClient["password"])) {
    // if password is incorrent
    $http->Unauthorize(
        [
            "err" => "password is invalid | please check a password",
            "status" => 401
        ]
    );
}

/**
 * find a manager of the project is a you ?
 * 
 * @var array
 */
$manager = $approveService->getManagerByProjectIdAndUserId($project["id"], $userClient["id"]);
if (!$manager) {
    $http->NotFound(
        [
            "err" => "you is not included in this project",
            "status" => 404
        ]
    );
}

/**
 * check user is in what role?
 */
if ($manager["role_name"] === "approver 1") {
    // if user is a approver 1

    /**
     * check a latest budget status is in verify or approver 2
     */
    if ($latestBudgetCalculate["status_name"] !== "verify" && $latestBudgetCalculate["status_name"] !== "reject by approve 1") {
        // if a latest budget is not in status verify and reject by approver 2
        $http->Unauthorize([
            "err" => "your role is a $manager[role_name] but this project is in a status $latestBudgetCalculate[status_name]",
            "status" => 401
        ]);
    }

    /**
     * set token to sesstion token for user can be run
     */
    $token = $enc->jwtEncode($userClient["user_role"]["role_name"], $userClient["id"]);
    $_SESSION["token"] = $token;

    /**
     * response to client is approver 1 and can be contiunue
     * 
     * @var array
     */
    $http->Ok(
        [
            "data" => [
                "manager" => $manager,
                "project" => $project,
                "latest_budget" => $latestBudgetCalculate,
                "role" => "approver 1"
            ],
            "status" => 200
        ]
    );
}elseif($manager["role_name"] === "approver 2"){
    // if user is a approver 2

    /**
     * check a latest budget is a status approve 1 yep?
     */
    if($latestBudgetCalculate["status_name"] !== "approve 1"){
        // if a latest budget status is not in approve 1
        $http->Unauthorize(
            [
                "err" => "your role is a $manager[role_name] but this project is in a status $latestBudgetCalculate[status_name]",
                "status" => 401
            ]
        );
    }

    /**
     * set token to sesstion token for user can be run
     */
    $token = $enc->jwtEncode($userClient["user_role"]["role_name"], $userClient["id"]);
    $_SESSION["token"] = $token;

    /**
     * response to client is approver 1 and can be contiunue
     * 
     * @var array
     */
    $http->Ok(
        [
            "data" => [
                "manager" => $manager,
                "project" => $project,
                "latest_budget" => $latestBudgetCalculate,
                "role" => "approver 2"
            ],
            "status" => 200
        ]
    );
}else{
    $http->BadRequest(
        [
            "err" => "this project is not for you",
            "status" => 400
        ]
    );
}