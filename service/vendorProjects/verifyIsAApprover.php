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

$approveVendorProjectId = isset($_GET["avpId"]) ? $_GET["avpId"] : null;
$approveVendorProjectId = $template->valVariable($approveVendorProjectId, "approve vendor project id");

/**
 * find a approve vendor project by id
 * 
 * @var array
 */
$approveVendorProject = $vendorProjectService->getApproveVendorProjectById($approveVendorProjectId);


// check a approve vendor project is null
if(!$approveVendorProject || !is_null($approveVendorProject["approve2"])){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลการขออนุมัตินี้ หรือเคยอนุมัติไปแล้ว",
            "status" => 404
        ]
    );
}

/**
 * check this verifier is a correct user
 */
if($approveVendorProject["approver2_id"] !== $userId){
    // if approve vendor project is not correct
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่ผู้อนุมัติของโครงการนี้",
            "status" => 401
        ]
    );
}

$http->Ok(
    [
        "data" => $approveVendorProject,
        "status" => 200
    ]
);