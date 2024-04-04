<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("./projectSettingService.php");
include_once("../Template/SettingMailSend.php");
// ini_set('display_errors', 1);

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();


$projectSettingService = new ProjectSettingService();


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
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
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "not found a user id ",
            "status" => 401
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);

$projectId = isset($body["project_id"]) ? $body["project_id"] : null;
$projectId = $template->valVariable($projectId, "ไอดีโครงการ");

$rejectTopicId = isset($body["reject_topic_id"]) ? $body["reject_topic_id"] : null;
$rejectTopicId = $template->valVariable($rejectTopicId, "ไอดีหัวข้อการปฏิเสธ");

$detailReject = isset($body["detail_reject"]) ? $body["detail_reject"] : null;
$detailReject = $template->valVariable($detailReject, "เนื้อหาการปฏิเสธการอนุมัติ");


/**
 * find a project by project id
 */
$project = $projectSettingService->getProjectbyId($projectId);
if (!$project) {
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
if (!$projectSetting) {
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
if ((string) $userId !== (string) $projectSetting["approver_id"]) {
    $http->Unauthorize(
        [
            "err" => "you is not a approver | pleas login with approver user",
            "status" => 401
        ]
    );
}

/**
 * find a reject topic id
 */
$rejectTopic = $projectSettingService->getRejectTopicById($rejectTopicId);
if (!$rejectTopic) {
    $http->NotFound(
        [
            "err" => "not found a reject topic",
            "status" => 404
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
    "end_datetime" => $projectSetting["end_datetime"],
    "deposit_money" => $projectSetting["deposit_money"],
    "approver_id" => $projectSetting["approver_id"],
    "approve" => 0,
    "detail_datetime" => $projectSetting["detail_datetime"],
    "coordinator_id" => $projectSetting["coordinator_id"],
    "creator_id" => $projectSetting["creator_id"],
    "is_approver_send" => 0
];
$updateProjectSetting = $projectSettingService->updateProjectSettingById($data);
if (!$updateProjectSetting) {
    $http->Forbidden(
        [
            "err" => "can't reject project setting",
            "status" => 403
        ]
    );
}

/**
 * create a reject project setting 
 */
$data = [
    "reject_topic_id" => $rejectTopic["id"],
    "reject_detail" => $detailReject,
    "project_setting_id" => $updateProjectSetting["id"]
];
$rejectProjectSetting = $projectSettingService->createRejectProjectSetting($data);
if (!$rejectProjectSetting) {
    $http->Forbidden(
        [
            "err" => "can't reject this project",
            "status" => 403
        ]
    );
}

$projectStatus = $projectSettingService->getProjectStatusByName(
    "รอแก้ไขโครงการ"
);
$data = [
    "pj_id" => $project["id"],
    "status_id" => $projectStatus["id"]
];
$projectStatusUpdate = $projectSettingService->updateProjectStatusById(
    $data
);
if (!$projectStatusUpdate) {
    $http->Forbidden(
        [
            "data" => "can't update project status",
            "status" => 403
        ]
    );
}



$projectSettingService->commitTransaction();

$rejectApprove = "ปฎิเสธ";
$rejectTopic = $projectSettingService->getRejectTopicByProjectSettingId($projectSetting['id']);
$contractors = $projectSettingService->getAllContractor();
require(__DIR__ . "/mails/funcMailContrator.php");
foreach ($contractors as $contractor) {
    $mail->sendTo($contractor["email"]);
    $mail->addSubject("ผลการพิจารณาการอนุมัติการเชิญ Vendor เข้าร่วมประกวดราคา เลขที่เอกสาร: ". $project["key"]);
    $mail->addBody(htmlMailSendToConTractor($project, $rejectApprove, $rejectTopic, $contractor));

    if (!$_ENV["DEV"]) {
        $success = $mail->sending();
        if (!$success) {
            $http->BadRequest(
                [
                    "err" => "ไม่สามารถส่ง Email : " . $contractor["email"] . " ได้",
                    "status" => 400
                ]
            );
        }
    }
}

$http->Ok(
    [
        "data" => [
            "project_setting" => $updateProjectSetting,
            "reject" => $rejectProjectSetting
        ],
        "status" => 200
    ]
);