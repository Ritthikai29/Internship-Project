<?php
// for get a data to combobox (when user will reject a budget)
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include("./verifyService.php");


$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$verifyService = new VerifyService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed([
        "err" => "this link method is not allow your method",
        "status" => 401
    ]);
}

$reasons = $verifyService->listReason();

if (!$reasons) {
    $http->NotFound([
        "err" => "Not found a reason",
        "status" => 404
    ]);
}

$http->Ok([
    "data" => $reasons,
    "status" => 200
]);
