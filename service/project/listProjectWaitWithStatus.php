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
$status = $template->valVariable(isset($_GET["project_status"]) ? $_GET["project_status"] : null);
$searchInput = $_GET["search_input"];

switch ($searchInput) {
    case "ม.ค.":
    case "มกราคม":
        $searchInput = "MoNtH_1";
        break;
    case "ก.พ.":
    case "กุมภาพันธ์":
        $searchInput = "MoNtH_2";
        break;
    case "มี.ค.":
    case "มีนาคม":
        $searchInput = "MoNtH_3";
        break;
    case "เม.ย.":
    case "เมษายน":
        $searchInput = "MoNtH_4";
        break;
    case "พ.ค.":
    case "พฤษภาคม":
        $searchInput = "MoNtH_5";
        break;
    case "มิ.ย.":
    case "มิถุนายน":
        $searchInput = "MoNtH_6";
        break;
    case "ก.ค.":
    case "กรกฎาคม":
        $searchInput = "MoNtH_7";
        break;
    case "ส.ค.":
    case "สิงหาคม":
        $searchInput = "MoNtH_8";
        break;
    case "ก.ย.":
    case "กันยายน":
        $searchInput = "MoNtH_9";
        break;
    case "ต.ค.":
    case "ตุลาคม":
        $searchInput = "MoNtH_10";
        break;
    case "พ.ย.":
    case "พฤศจิกายน":
        $searchInput = "MoNtH_11";
        break;
    case "ธ.ค.":
    case "ธันวาคม":
        $searchInput = "MoNtH_12";
        break;
    default:
}


if ($status == 1) {
    $listProjects = $projectService->listProjectsSearchByStatusName($offset, $limit, "รอตรวจสอบเอกสาร", $searchInput);
    $totalProject = $projectService->getCountProjectByStatusNameANDSearch("รอตรวจสอบเอกสาร", $searchInput);
} else if ($status == 2){
    $listProjects = $projectService->listProjectsSearchByManyStatusName($offset, $limit, ["รอเปิดโครงการ", "รออนุมัติรับเหมานอก List", "อนุมัติผู้รับเหมานอก List แล้ว", "รอแก้ไขรับเหมานอก List"], $searchInput);
    $totalProject = $projectService->getCountProjectByManyStatusNameANDSearch(["รอเปิดโครงการ", "รออนุมัติรับเหมานอก List", "อนุมัติผู้รับเหมานอก List แล้ว", "รอแก้ไขรับเหมานอก List"],$searchInput);
} else if ($status == 3){
    $listProjects = $projectService->listProjectsSearchByStatusName($offset, $limit, "รออนุมัติส่งหนังสือเชิญ", $searchInput);
    $totalProject = $projectService->getCountProjectByStatusNameANDSearch("รออนุมัติส่งหนังสือเชิญ", $searchInput);
} else if ($status == 4){
    $listProjects = $projectService->listProjectsSearchByStatusName($offset, $limit, "อนุมัติส่งหนังสือเชิญ", $searchInput);
    $totalProject = $projectService->getCountProjectByStatusNameANDSearch("อนุมัติส่งหนังสือเชิญ", $searchInput);
} else if ($status == 5){
    $listProjects = $projectService->listProjectsSearchByStatusName($offset, $limit, "กำลังประกวดราคา", $searchInput);
    $totalProject = $projectService->getCountProjectByStatusNameANDSearch("กำลังประกวดราคา", $searchInput);
} else if ($status == 6){
    $listProjects = $projectService->listProjectsSearchByStatusName($offset, $limit, "รอเปิดซองเปรียบเทียบราคา", $searchInput);
    $totalProject = $projectService->getCountProjectByStatusNameANDSearch("รอเปิดซองเปรียบเทียบราคา", $searchInput);
} else if ($status == 7){
    $listProjects = $projectService->listProjectsSearchByStatusName($offset, $limit, "กำลังเจรจาต่อรองราคาใหม่", $searchInput);
    $totalProject = $projectService->getCountProjectByStatusNameANDSearch("กำลังเจรจาต่อรองราคาใหม่", $searchInput);
} else if ($status == 8){
    $listProjects = $projectService->listProjectsSearchByManyStatusName($offset, $limit, ["รอแจ้งผลเสร็จสิ้นประกวดราคา","รอแจ้งผลล้มประกวดราคา"], $searchInput);
    $totalProject = $projectService->getCountProjectByManyStatusNameANDSearch(["รอแจ้งผลเสร็จสิ้นประกวดราคา","รอแจ้งผลล้มประกวดราคา"],$searchInput);
} else {
    $listProjects = $projectService->listProjectsBySearch($offset, $limit, $searchInput);
    $totalProject = $projectService->getCountProjectBySearch($searchInput);
}

$http->Ok(
    [
        "data" => $listProjects,
        "total" => $totalProject["count"],
        "status" => 200
    ]
);
