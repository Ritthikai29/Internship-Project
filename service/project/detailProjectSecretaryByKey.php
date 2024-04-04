<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");

include("./projectService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$projectService = new ProjectService();
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}


$key=$template->valVariable($_GET["key"]);

$detailProject = $projectService->detailProjectSecretaryByKey($key);
$detailProject['price'] = $enc->apDecode($detailProject['price']);

$subProject = $projectService->getSubPriceProjectByProjectId($detailProject["id"]);
foreach( $subProject as $index => $subProjectItem ){
    $subProject[$index]["price"] = (float)$enc->apDecode($subProjectItem["price"]);
}

$detailProject["subPrice"] = $subProject;

$http->Ok(
    [
        "data" => $detailProject,        
        "status" => 200
    ]
);




