<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include("./approveService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$approveService = new ApproveService();

$body = json_decode(file_get_contents('php://input'), true);
$subPriceString = isset($_POST["subPrice"]) ? $_POST["subPrice"] : null; // not filter because will filter before save to database

$data = json_decode($subPriceString, true);
$http->Ok(
    [
        "data" => $data,
        "status" => 200
    ]
);