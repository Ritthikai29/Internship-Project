<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("./projectSettingService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$projectSettingService = new ProjectSettingService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}
/**
 * authentication 
 */
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if(!$userId){
    $http->Unauthorize(
        [
            "err" => "not found a user id ",
            "status" => 401
        ]
    );
}


$projectId = isset($_GET["project_id"]) ? $_GET["project_id"] : null;
$projectId = $template->valVariable($projectId, "ไอดีโครงการ");
/**
 * find a project by project id
 */
$project = $projectSettingService->getProjectbyId($projectId);
if(!$project){
    $http->NotFound(
        [
            "err" => "not found a project by project id",
            "status" => 404
        ]
    );
}

/**
 * find a project setting by project id (project id is unique define project setting)
 */
$projectSetting = $projectSettingService->getProjectSettingByProjectId($project["id"]);
if(!$projectSetting){
    $http->NotFound(
        [
            "err" => "Not found a project setting by project id : $project[id]",
            "status" => 404
        ]
    );
}

/**
 * verify a user is correct user id (use a user id from token)
 */
if((string)$userId !== (string)$projectSetting["approver_id"] ){
    $http->Unauthorize(
        [
            "err" => "you is not a approver | pleas login with approver user",
            "status" => 401
        ]
    );
}

$projectSettingService->startTransaction();
/**
 * update a project setting status to approve = 1
 */
$data = [
    "id" => $projectSetting["id"],
    "project_id" => $projectSetting["project_id"],
    "start_datetime" => $projectSetting["start_datetime"],
    "end_datetime" => $projectSetting["end_datetime"].' '.$projectSetting['end_time'],
    "deposit_money" => $projectSetting["deposit_money"],
    "approver_id" => $projectSetting["approver_id"],
    "approve" => 1,
    "detail_datetime" => $projectSetting["detail_datetime"].' '.$projectSetting['detail_time'],
    "coordinator_id" => $projectSetting["coordinator_id"],
    "creator_id" => $projectSetting["creator_id"],
    "is_approver_send" => $projectSetting["is_approver_send"]
];
$updateProjectSetting = $projectSettingService->updateProjectSettingById($data);
if(!$updateProjectSetting){
    $http->Forbidden(
        [
            "err" => "can't approve project setting",
            "status" => 403
        ]
    );
}

/**
 * find a project status 
 */
$updateStatus = $projectSettingService->getProjectStatusByName(
    "อนุมัติส่งหนังสือเชิญ"
);
$data = [
    "pj_id" => $project["id"],
    "status_id" => $updateStatus["id"]
];
$projectStatusUpdate = $projectSettingService->updateProjectStatusById($data);
if(!$projectStatusUpdate){
    $http->Forbidden(
        [
            "err" => "can't update a status project by project id",
            "status" => 403
        ]
    );
}

$projectSettingService->commitTransaction();

/**
 * send mail to ผู้จัดการจ้างเหมา ว่า approve นะ 
 */

$http->Ok(
    [
        "data" => [
            "project_setting" => $updateProjectSetting,
            "project" => $projectStatusUpdate
        ],
        "status" => 200
    ]
);