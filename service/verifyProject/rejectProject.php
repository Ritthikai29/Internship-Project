<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingMailSend.php");
include_once("./verifyService.php");
include_once("./../middleware/authentication.php");

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$mail = new Mailing();


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$verifyProjectService = new VerifyProjectService();

$body = json_decode(file_get_contents('php://input'), true);
// Req body Project Key
$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "project Key");
// Req body reject Id
$rejectId = $template->valVariable(isset($body["reject_id"]) ? $body["reject_id"] : null, "reject id");
// Req body comment
$comment = isset($body["comment"]) ? $body["comment"] : null;

/**
 * get data in JWT Token [Middleware decode a JWT Token and valify Token]
 * 
 * @var object
 */
$tokenObject = JWTAuthorize($enc, $http);

/**
 * get a user id from token id
 */
$tokenUserId = $tokenObject->userId;
/**
 *  find a user by user id
 * 
 * @var array
 */
$user = $verifyProjectService->getUserById($tokenUserId);
if (!$user) {
    $http->NotFound(
        [
            "err" => "not found a user by id",
            "status" => 404
        ]
    );
}
/**
 * check a role of the user is a หน่วยงานจ้างเหมา ?
 *
 * find a user role from database
 */
$userRole = $verifyProjectService->getUserRoleById($user["user_staff_role"]);
if ($userRole["role_name"] !== "Contractor") {
    $http->Unauthorize(
        [
            "err" => "unauthorize user, you aren't a contractor",
            "status" => 401
        ]
    );
}

$project = $verifyProjectService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่สนใจ",
            "status" => 404
        ]
    );
}

/**
 * check a status is ready to add a approve project ?
 */
$projectStatus = $verifyProjectService->getProjectStatusById($project["status_id"]);
if (!$projectStatus) {
    $http->NotFound(
        [
            "err" => "ไม่พบสถานะของโครงการ โปรดติดต่อ Admin",
            "status" => 404
        ]
    );
}

$verifyProjectService->startTransaction();

/**
 * prepare a data to ready to save
 * 
 * @var array
 */
$prepare = [
    "approve_user_id" => $user["id"],
    "project_id" => $project["id"],
    "approve" => false
];

$validateProject = $verifyProjectService->createValidateProject($prepare);
if (!$validateProject) {
    $verifyProjectService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "ไม่สามารถอนุมัติโครงการได้ กรุณาลองใหม่",
            "status" => 403
        ]
    );
}

/**
 * get Project Status by name
 */
$updateProjectStatus = $verifyProjectService->getProjectStatusByName(
    "ต้องแก้ไขเอกสาร"
);
if (!$updateProjectStatus) {
    $verifyProjectService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "ไม่สามารถอัพเดตโครงการได้ กรุณาลองใหม่",
            "status" => 404
        ]
    );
}

/**
 * find a reject reason by id
 */
$reasonProject = $verifyProjectService->getRejectReasonById($rejectId);
if (!$reasonProject) {
    $verifyProjectService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "ไม่พบเหตุผลการปฏิเสธที่เลือก กรุณาลองใหม่",
            "status" => 404
        ]
    );
}

/**
 * add a reject project to reject table
 */
$prepareReject = [
    "validate_id" => $validateProject["id"],
    "reject_reason_id" => $reasonProject["id"],
    "comment" => $comment
];
$rejectProject = $verifyProjectService->createRejectProject($prepareReject);
if (!$rejectProject) {
    $verifyProjectService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "ไม่สามารถไม่อนุมัติได้",
            "status" => 404
        ]
    );
}

/**
 * update a project status 
 */
$updateProject = $verifyProjectService->updateProjectStatus($updateProjectStatus["id"], $project["id"]);
if (!$updateProject) {
    $verifyProjectService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "อัพเดตโครงการไม่สำเร็จ",
            "status" => 403
        ]
    );
}

//Find Creator Project
$email = $verifyProjectService->getCreatorEmailById ($project['id']);

require(__DIR__ . "/mails/funcMailsendUserRJ.php");

        $mail->sendTo($email["email"]);
        $mail->addSubject("โครงการ $project[name] มีการปฏิเสธจากหน่วยงานจ้างเหมา");
        $mail->addBody(htmlMailsendUserRJ($project));
        if ($_ENV["DEV"] === false) {
            $success = $mail->sending();

            if ($success == null) {
                $http->Forbidden(
                    [
                        "err" => "ไม่สามารถส่ง email ได้ กรุณาลองใหม่",
                        "status" => 403
                    ]
                );
            }
        }
    
$verifyProjectService->commitTransaction();


$http->Ok(
    [
        "data" => $validateProject,
        "update" => $updateProject,
        "reject" => $rejectProject,
        "status" => 200
    ]
);
