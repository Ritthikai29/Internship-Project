<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include('verifyService.php');

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$verifyService = new VerifyService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed([
        "err" => [
            "data" => "this link method is not allow your method"
        ]
    ]);
}


/**
 * decode a json of body from POST Method
 * 
 * @var array
 */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * validate a employeeNO
 * 
 * @var string 
 */
$employeeNO = $template->valVariable(isset($body["employee_no"]) ? $body["employee_no"] : null, "Employee NO");

/**
 * validate a password
 * 
 * @var string
 */
$password = $template->valVariable(isset($body["password"]) ? $body["password"] : null, "Password");

/**
 * validate  a project key
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "project Key");


/**
 *  get a employee by Employee NO 
 * 
 * @var array
 */
$employee = $verifyService->getEmployeeByEmployeeNO($employeeNO);
if (!$employee) {
    $http->NotFound(
        [
            "err" => "not found employee"
        ]
    );
}


/**
 * use a employee id to find a user staff and password
 * 
 * @var array
 */
$userStaff = $verifyService->getuserStaffByEmpId($employee["id"]);
if (!$userStaff) {
    $http->NotFound(
        [
            "err" => "not found your user please contract to admin",
            "status" => 404
        ]
    );
}


/**
 * use a user staff password to validate password from frontend
 * 
 */
if (!password_verify($password, $userStaff["password"])) {
    $http->BadRequest(
        [
            "err" => "your password is in valid please check your password",
            "status" => 400
        ]
    );
}

/**
 * find a role of the user
 */
$role = $verifyService->getUserRoleById($userStaff["user_staff_role"]);
if(!$role){
    $http->NotFound(
        [
            "err" => "not found a role of user",
            "status" => 404
        ]
    );
}

/**
 * prepare project to userStaff array
 * 
 * @var array
 */
$userStaff["user_role"] = $role;


/**
 * find a project from project key 
 * 
 * @var array
 */
$project = $verifyService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

/**
 * find a ref price manager by user id and project id to validate role
 * 
 * @var array
 */
$managerVerify = $verifyService->getManagerByProjectIdAndUserId($project["id"], $userStaff["id"]);
if (!$managerVerify || $managerVerify["role_name"] !== "verifier") {
    $http->NotFound(
        [
            "err" => "you is not include to this project",
            "status" => 404
        ]
    );
}

/**
 * find a ref price manager of project with role "calculator"
 */
$managerCalculator = $verifyService->getManagerByProjectIdAndRoleName($project["id"], 'calculator');
if (!$managerCalculator) {
    $http->NotFound(
        [
            "err" => "Not Foound a Manager Calculator",
            "status" => 404
        ]
    );
}

/**
 * check a budget calculator in status waiting for your verify by RefPriceManager in calculator role
 */
$budgetCalculatorLatest = $verifyService->getBudgetCalculatorByRefId($managerCalculator["id"]);
if (!$budgetCalculatorLatest) {
    $http->NotFound(
        [
            "err" => "Not found a Budget Calculator",
            "status" => 404
        ]
    );
}

/**
 * check if this budget is waiting for verify 
 */
if ($budgetCalculatorLatest["status_name"] !== 'waiting verify') {
    $http->BadRequest(
        [
            "err" => "โปรเจคนี้ไม่ได้อยู่ในสถานะรอการตรวจสอบ",
            "status" => 400
        ]
    );
}


$token = $enc->jwtEncode($userStaff["user_role"]["role_name"], $userStaff["id"]);
$_SESSION["token"] = $token;

$http->Ok([
    "data" => [
        "userStaff" => $userStaff,
        "project" => $project,
        "manager" => $managerVerify
    ],
    "status" => 200,
    "access_token" => $token
]);
