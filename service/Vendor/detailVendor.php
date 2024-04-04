<?php

session_start();

include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");
include_once("./vendorService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$vendorService = new vendorService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

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

$detailVendor = $vendorService->getDetailVendor($vendorId);
if(!$detailVendor){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูล vendor ",
            "status" => 404
        ]
    );
}

$http->OK(
    [
        "data" => $detailVendor,
        "status" => 200
    ]
);

