<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");

include("./employeeService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$employeeService = new EmployeeService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$search = isset($_GET["search"]) ? $_GET["search"] : null;
$search = $template->valVariable($search);

$listEmployees = $employeeService->searchEmployeeBySearch($search);

$http->Ok(
    [
        "data" => $listEmployees,
        "status" => 200
    ]
);

