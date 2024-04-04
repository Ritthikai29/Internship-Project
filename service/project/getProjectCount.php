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

$countVerifing = $projectService->getCountProjectByStatusName("รอตรวจสอบเอกสาร");

$countOpening = $projectService->getCountProjectByManyStatusName(["รอเปิดโครงการ", "รออนุมัติรับเหมานอก List", "อนุมัติผู้รับเหมานอก List แล้ว"]);

$countSending = $projectService->getCountProjectByManyStatusName(["รออนุมัติส่งหนังสือเชิญ", "อนุมัติส่งหนังสือเชิญ"]);

$countRegistering = $projectService->getCountProjectByStatusName("กำลังประกวดราคา");

$countWaiting = $projectService->getCountProjectByStatusName("รอเปิดซองเปรียบเทียบราคา");

$countNegotiating = $projectService->getCountProjectByStatusName("กำลังเจรจาต่อรองราคาใหม่");

$countAnnouncing = $projectService->getCountProjectByStatusNameForAnnouncement("รอแจ้งผลเสร็จสิ้นประกวดราคา","รอแจ้งผลล้มประกวดราคา");

$countAll = $projectService->getCountProject();

//Prepare data
$data = [
    "verifying" => $countVerifing['count'],
    "opening" => $countOpening['count'],
    "sending" => $countSending['count'],
    "registering" => $countRegistering['count'],
    "waiting" => $countWaiting['count'],
    "negotiating" => $countNegotiating['count'],
    "announcing" => $countAnnouncing['count'],
    "all" => $countAll['count']
];

$http->Ok(
    [
        "data" => $data,        
        "status" => 200
    ]
);