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
            "err" => "not found a user id",
            "status" => 401
        ]
    );
}

$listblacklist = $vendorProjectService->listBlacklistVendorProject();
$countByRegisterStatusretreat = [];
$countByRegisterStatusnotsomething = [];

foreach ($listblacklist as $vendorProject) {
    $id = $vendorProject["id"];
    $registersStatus = $vendorProject["registers_status_id"];
    if($registersStatus === "11"){
        if (!isset($countByRegisterStatusretreat[$id])) {
            $countByRegisterStatusretreat[$id] = 0;
        }
    
        $countByRegisterStatusretreat[$id]++;
    }else if($registersStatus === "12"){
        if (!isset($countByRegisterStatusnotsomething[$id])) {
            $countByRegisterStatusnotsomething[$id] = 0;
        }
    
        $countByRegisterStatusnotsomething[$id]++;
    }
    
}
$http->Ok(
    [
        "data1" => $countByRegisterStatusretreat,
        "data2" => $countByRegisterStatusnotsomething,
        "status" => 200
    ]
);