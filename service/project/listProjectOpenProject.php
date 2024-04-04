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
$offset = $template->valNumberVariable(isset($_GET["ofs"]) ? $_GET["ofs"] : 0);
$limit = $template->valNumberVariable(isset($_GET["lim"]) ? $_GET["lim"] : 5);

$listProjects = $projectService->listProjectsByManyStatusName($offset, $limit, ["รอเปิดโครงการ", "รออนุมัติรับเหมานอก List", "อนุมัติผู้รับเหมานอก List แล้ว", "รอแก้ไขรับเหมานอก List"]);

$totalProject = $projectService->getCountProjectByManyStatusName(["รอเปิดโครงการ", "รออนุมัติรับเหมานอก List", "อนุมัติผู้รับเหมานอก List แล้ว", "รอแก้ไขรับเหมานอก List"]);

$http->Ok(
    [
        "data" => $listProjects,
        "total" => $totalProject["count"],
        "status" => 200
    ]
);