<?php
session_start();

include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../middleware/authentication.php");
include_once(__DIR__ . "/./projectService.php");

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

$key = $template->valVariable(isset($_GET["project_key"]) ? $_GET["project_key"] : null);

$projectUnit = $projectService->getUnitPriceWithProjectKey($key);
if (!$projectUnit) {
    $http->NotFound(
        [
            "err" => "not found a project unit from project",
            "status" => 404
        ]
    );
}

$label = $projectUnit['project_unit_price'];

if ($projectUnit['project_unit_price'] !== "บาท / โครงการ" && $projectUnit['project_unit_price'] !== "บาท / ชั่วโมง" && $projectUnit['project_unit_price'] !== "บาท / ตัน") {
    $label = "อื่นๆ";
}

$data = [
    "label" => $label,
    "value" => $projectUnit['project_unit_price']
];

$http->Ok(
    [
        "data" => $data,
        "status" => 200
    ]
);
