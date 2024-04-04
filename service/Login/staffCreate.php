<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");

include('./LoginService.php');

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$loginService = new StaffLogin();

// authentications

// end authentication

if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

$body = json_decode(file_get_contents('php://input'), true);


// to create a staff should be have 3 relationShip

$email = $template->valVariable($body["email"]);
$password = $template->valVariable($body["password"]);
$employeeNO = $template->valVariable($body["employee_NO"]);

// relations
$roleId = $template->valVariable($body["role_id"]);
$statusId = $template->valVariable($body["status_id"]);

// find all of relation
try {
    // get role
    $role = $loginService->getRoleByID($roleId);

    // find status
    $status = $loginService->getStatusById($statusId);

    /**
     * to query a employee by employee id
     * 
     * id should be unique
     * 
     * @var array $employee
     */
    $employee = $loginService->getEmployeeByNO($employeeNO);
    if(!$employee){
        $http->NotFound([
            "err" => "not foound a employee in database"
        ]);
    }

} catch (PDOException | Exception $e) {
    $cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
    $http->BadRequest(["err" => $e->getMessage()]);
}

// hash Password (BCRYPT)
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// create a user staff

$loginService->startTransaction();
// prepare data
$data = [
    "email" => $email,
    "password" => $password_hash,
    "role_id" => $role["id"],
    "status_id" => $status["id"],
    "employee_id" => $employee["id"]
];

try {
    $user = $loginService->createUserStaff($data);
} catch (PDOException | Exception $e) {
    $loginService->rollbackTransaction();
    $cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
    $http->BadRequest(["err" => $e->getMessage()]);
}

$loginService->commitTransaction();

$http->Ok([
    "data" => $user
]);