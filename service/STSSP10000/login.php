<?php

// Query project by project id
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

/**
 * 
 * This Endpoint will be run on POST Method 
 * 
 */

if ($_SERVER["REQUEST_METHOD"] !== 'POST') {
    $http->MethodNotAllowed(
        [
            "err" => [
                "data" => "link is not allow a method"
            ]
        ]
    );
}

/**
 * 
 * Decode a body json from payload of POST method
 * 
 * @var array
 * 
 */

$body = json_decode(file_get_contents('php://input'), true);


/**
 * 
 * validate employeeNO payloads from json array 
 * 
 * @var string
 * 
 */
$employeeNO = $template->valVariable(isset($body["employee_no"]) ? $body["employee_no"] : null, "Employee No.");

/**
 * 
 * validate password payloads from json array 
 * 
 * @var string
 * 
 */
$password = $template->valVariable(isset($body["password"]) ? $body["password"] : null, "password");

/**
 * 
 * validate projectKey payloads from json array 
 * 
 * @var string
 * 
 */
$project_key = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "โปรเจคคีย์");


/**
 * in this code is mean user can be key a employee id 5 number or 10 number of employee
 */

if (strlen($employeeNO) === 10) {
    $employeeNO = substr($employeeNO, 5);
} elseif (strlen($employeeNO) !== 5) {
    $http->BadRequest(
        [
            "err" => "your employee id is wrong",
            "status" => 400
        ]
    );
}


/**
 * 
 * * First get a employee from employeeNO  
 * 
 * @var array
 */
try {
    $employee = $calculateService->getEmployeeByEmpNO($employeeNO);
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest($e->getMessage());
}

if (!$employee) {
    $http->NotFound([
        "err" => "not found a employee",
        "status" => 404
    ]);
}

/**
 * 
 * Find a user staffs from EmployeeID
 * 
 * @var array
 * 
 */
try {
    $userStaff = $calculateService->getUserByEmployeeID($employee["id"]);
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest($e->getMessage());
}

if (!$userStaff) {
    $http->NotFound([
        "err" => "not found a user",
        "status" => 404
    ]);
}

/**
 * 
 * find role of user from userStaff array
 * 
 * @var array
 * 
 */
try {
    $role = $calculateService->getUserStaffRoleById($userStaff["user_staff_role"]);
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest($e->getMessage());
}

if (!$role) {
    $http->NotFound([
        "err" => "not found a role of user",
        "status" => 404
    ]);
}

/**
 * 
 * add a employee array to a user staff array
 * 
 * @var array
 * 
 */
$userStaff["employee"] = $employee;
$userStaff["user_role"] = $role;


/**
 * 
 * validate a password if pass will mean is correct a password
 * 
 * @param string $password
 * @param array $userStaff
 * 
 */

if (!password_verify($password, $userStaff["password"])) {
    $http->Unauthorize(
        [
            "err" => "your password is wrong",
            "status" => 401
        ]
    );
}


/**
 * 
 * find a project by poroject key
 * 
 * @var array
 */
try {
    $project = $calculateService->getProjectByKey($project_key);
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest($e->getMessage());
}

if (!$project) {
    $http->NotFound(
        [
            "err" => "Not found a project by this key",
            "status" => 404
        ]
    );
}

/**
 * 
 * find a refPriceManager in role calculator 
 * By project id and user id 
 * 
 * @var array
 */
try {
    $refPriceManagerCalculator = $calculateService->getRefPriceManagerByProjectAndUserWithRole($project["id"], $userStaff["id"], 'calculator');
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest($e->getMessage());
}

if(!$refPriceManagerCalculator){
    $http->NotFound(
        [
            "err" => "Not found a calculator in this project | you is not allowed",
            "status" => 404
        ]
    );
}


/**
 * 
 * IF your have a permission to calculate in this project
 * 
 * Your will have a new token and can access to calculate this project
 * 
 * @var string
 */
$token = $enc->jwtEncode($userStaff["user_role"]["role_name"], $userStaff["id"]);
$_SESSION["token"] = $token;


$http->Ok(
    [
        "data" => [
            "userStaff" => $userStaff,
            "project" => $project,
            "manager" => $refPriceManagerCalculator
        ],
        "token"=> $_SESSION["token"],
        "access_token" => $token,
        "status" => 200
    ]
);
