<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include("./../middleware/authentication.php");
include("./vendorProjectService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$vendorProjectService = new VendorProjectService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

// auth
$token = JWTAuthorize($enc, $http);
// userID
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ได้ Login เข้าสู่ระบบ",
            "status" => 401
        ]
    );
}




$vendorProjectId = isset($_GET["vendor_project_id"]) ? $_GET["vendor_project_id"] : null;
//$vendorProjectId = $template->valVariable($vendorProjectId, "vendor project id");

/**
 * checking vendor project is have?
 * 
 * @var array
 */
$vendorProject = $vendorProjectService->getVendorProjectById($vendorProjectId);
if (!$vendorProject) {
    $http->NotFound(
        [
            "err" => "not found a vendor project",
            "status" => 404
        ]
    );
}

$vendorProjectService->startTransaction();
$deleteSuccess = $vendorProjectService->deleteVendorOfProjectById($vendorProjectId);
if (!$deleteSuccess) {
    $vendorProjectService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "can't delete vendor in the project",
            "status" => 403
        ]
    );
}

$vendorProjectService->commitTransaction();
$http->Ok(
    [
        "data" => "delete successful",
        "status" => 200
    ]
);