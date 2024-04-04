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


$id=$template->valVariable(isset($_GET["project_id"]) ? $_GET["project_id"] : null);

$detailProject = $projectService->getProjectById($id);

$detailProject["price"] = $enc->apDecode($detailProject["price"]);

$subPrice = $projectService->getSubPriceProjectByProjectId($id);
if($subPrice){
    foreach ($subPrice as $index => $value) {
        $subPrice[$index]["price"] = $enc->apDecode($value["price"]);
    }
    $detailProject["subPrice"] = $subPrice;
}

$http->Ok(
    [
        "data" => $detailProject,     
        "status" => 200
    ]
);




