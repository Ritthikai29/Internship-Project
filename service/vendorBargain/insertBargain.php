<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("../Template/SettingMailSend.php");

include_once("./bargainService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$bargainService = new BargainService();

$bargainService->startTransaction();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}
/**
 * 1. authorize a vendor of the project
 */
$token = JWTAuthorize($enc, $http);
$vendorId = isset($token->vendorId) ? $token->vendorId : null;
if (!$vendorId) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบข้อมูล Vendor กรุณา Login ใหม่",
            "status" => 401
        ]
    );
}

/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);

$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");

$price = $template->valVariable(isset($body["price"]) ? $body["price"] : null, "price");
$subPrice = isset($body["subPrice"]) ? $body["subPrice"] : null;

$project = $bargainService->getProjectById($projectId);
if(!$project){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลโครงการที่กำหนด",
            "status" => 404
        ]
    );
}

$vendor = $bargainService->getVendorById($vendorId);
if(!$vendor){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูล vendor ",
            "status" => 404
        ]
    );
}

$vendorProject = $bargainService->getVendorProjectByVendorIdAndProjectId(
    $vendor["id"],
    $project["id"]
);



