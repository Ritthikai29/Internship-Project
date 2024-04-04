<?php
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");

include_once("./registerProjectService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$registerProjectService = new RegisterService();

if ($_SERVER["REQUEST_METHOD"] != 'GET') $http->MethodNotAllowed();

try{
    $regis_reason = $registerProjectService->getReasonToFixForm();
    $http->Ok(
        ["data" => $regis_reason]
    );
}catch(PDOException | Exception $e){
    $cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
    $http->BadRequest(["err" => "get error"]);
}