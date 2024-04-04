<?php

session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");
include('./TemplateProject.php');
$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();


$projectService = new ProjectService();


if ($_SERVER["REQUEST_METHOD"] != 'GET') $http->MethodNotAllowed();

try{
    $projectTypes = $projectService->ListProjectTypes();
    $http->Ok(
        ["data" => $projectTypes]
    );
}catch(PDOException | Exception $e){
    $cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
    $http->BadRequest(["err" => "get error"]);
}