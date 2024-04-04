<?php
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");

include_once("./../middleware/authentication.php");

include_once("./projectSettingService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$projectSettingService = new ProjectSettingService();

if ($_SERVER["REQUEST_METHOD"] != 'GET') {
    $http->MethodNotAllowed();
}

/**
 * Receive data from GET body
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key" );

$project = $projectSettingService->getProjectbyKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project id",
            "status" => 404
        ]
    );
}

// Get Project Setting
$projectSetting = $projectSettingService->getProjectSettingByProjectId((int)$project['id']);

// Convert the end_datetime to a standard PHP DateTime object
$startDateTime = new DateTime($projectSetting['start_datetime']);

// Convert the end_datetime to a standard PHP DateTime object
$endDateTime = new DateTime($projectSetting['end_datetime']);

// Convert the end_datetime to a standard PHP DateTime object
$detailDateTime = new DateTime($projectSetting['detail_datetime']);

$projectSetting['start_date'] = $startDateTime->format('Y-m-d');
$projectSetting['end_date'] = $endDateTime->format('Y-m-d');
$projectSetting['detail_date'] = $detailDateTime->format('Y-m-d');

// Get Creator Info
$creatorInfo = $projectSettingService->getCreatorById((int)$project['id']);
// Get Approve Info
$approverInfo = $projectSettingService->getEmployeeInfoByUserstaffId((int)$projectSetting['approver_id']);
// Get Coordinator Info
$coordinatorInfo = $projectSettingService->getEmployeeInfoByUserstaffId((int)$projectSetting['coordinator_id']);

$projectSetting['creator_name'] = $creatorInfo['nametitle_t'].' '.$creatorInfo['firstname_t'].' '.$creatorInfo['lastname_t'];
$projectSetting['approver_info'] = $approverInfo;
$projectSetting['coordinator_info'] = $coordinatorInfo;
$http->Ok([
    "data" => $projectSetting,
    "status" => 200
]);
