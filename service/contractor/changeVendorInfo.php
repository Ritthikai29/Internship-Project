<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");
include_once("./contractorservice.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$projectService = new contractorservice();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * 1. authorize 
 */
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "not found a user id ",
            "status" => 401
        ]
    );
}

//Check Role of User
$role = $projectService->getRoleByUserId($userId);
if ($role['role_name'] !== "Contractor"){
    $http->Forbidden(
        [
            "err" => "ไม่สามารถแก้ไขด้วยบัญชี" + $role,
            "status" => 403
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);
$vendorId = $template->valVariable(isset($_POST["vendor_id"]) ? $_POST["vendor_id"] : null, "vendor id");
$vendorEmail = $template->valVariable(isset($_POST["email"]) ? $_POST["email"] : null, "email vendor");

//Prepare Data
$data = [
    "vendor_id" => $vendorId,
    "email" => $vendorEmail
];

$projectService->startTransaction();

$res = $projectService->updateEmailVendorById($data);
if (!$res) {
    $projectService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "vendor update email failed",
            "status" => 400
        ]
    );
}

$projectService->commitTransaction();

$http->Ok([
    "data" => $res,
    "status" => 200
]);