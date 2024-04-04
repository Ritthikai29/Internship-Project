<?php

use function PHPSTORM_META\type;

session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../middleware/authentication.php");

include_once(__DIR__ . "/service.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$service = new service();


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

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


// -------------------------- START CHECK ROLE OF THE USER STAFF -----------------------------
/**
 * find a user is a secretary ? 
 */
$isOk = false;
$roleCheck = [
    "Contractor"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $service->getUserByIdAndRole($userId, $roleCheck[$i]);
    if ($user) {
        $isOk = true;
    }
    $i++;
} while (!$isOk && $countRole > $i);

if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่หน่วยงานจ้างเหมา",
            "status" => 401
        ]
    );
}
// -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------



$projectKey = isset($_GET["key"]) ? $_GET["key"] : null;
// $projectKey = $template->valVariable($projectKey, "เลขเอกสารโครงการ");

$project = $service->getProjectById($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการ",
            "status" => 404
        ]
    );
}

$secretary = $service->getSecretaryByProjectId($project['id']);
$secretaryInfo = $service->getUserByIdAndRole($secretary['id'], "secretary");
if (!$secretary || !$secretaryInfo) {
    $http->NotFound(
        [
            "err" => "ไม่พบเลขาโครงการ",
            "status" => 404
        ]
    );
}

$coordinator = $service->getCoordinatorByProjectId($project["id"]);
if (!$coordinator) {
    $http->NotFound(
        [
            "err" => "ไม่พบผู้ประสานงานโครงการ",
            "status" => 404
        ]
    );
}

// $status = isset($_GET["status"]) ? $_GET["status"] : null;
// $status = $template->valVariable($status, "ผลการประกวดราคา");

$vendors = $service->listResultVendorByProjectId($project["id"]); //----------------------------------------------------

if (!$vendors) {
    $http->NotFound(
        [
            "err" => "ผลการประกวดราคาในโครงการนี้ยังไม่เสร็จสิ้น",
            "status" => 404
        ]
    );
}
$service->startTransaction();

if ($project["status_id"] == "15") {
    require_once(__DIR__ . "/mails/funcMailWinVendor.php");
    require_once(__DIR__ . "/mails/funcMailLoseVendor.php");
    $success = $service->updateProjectStatus(18, $project["id"]);
    if (!$success) {
        $http->Forbidden(
            [
                "err" => "ไม่สามารถอัพเดตสถานะโครงการได้",
                "status" => 404
            ]
        );
    }

    foreach ($vendors as $index => $vendor) {
        if ($vendor["status_name_th"] === "ชนะการประกวด") {
            $mail->sendTo($vendor["email"]);
            $mail->addSubject("แจ้งผลการประกวดราคา โครงการ $project[name] เลขที่ $project[key]");
            $mail->addBody(htmlMailWin($coordinator, $vendor, $project, $secretaryInfo));
            if ($_ENV["DEV"] == false) {
                $success = $mail->sending();
                if ($success === null) {
                    $service->rollbackTransaction();
                    $http->Forbidden(
                        [
                            "err" => "ส่งอีเมลไม่สำเร็จ",
                            "status" => 403
                        ]
                    );
                }
            }
            $mail->clearAddress();
        }
        else if ($vendor["status_name_th"] === "แพ้การประกวด") {
            $mail->sendTo($vendor["email"]);
            $mail->addSubject("แจ้งผลการประกวดราคา โครงการ $project[name] เลขที่ $project[key]");
            $mail->addBody(htmlMailLose($vendor, $project, $secretaryInfo));
            if ($_ENV["DEV"] == false) {
                $success = $mail->sending();
                if ($success === null) {
                    $service->rollbackTransaction();
                    $http->Forbidden(
                        [
                            "err" => "ส่งอีเมลไม่สำเร็จ",
                            "status" => 403
                        ]
                    );
                }
            }
            $mail->clearAddress();
        }
    }
} else {
    require_once(__DIR__ . "/mails/funcMailLoseVendor.php");
    $success = $service->updateProjectStatus(19, $project["id"]);
    if ($success === null) {
        $http->Forbidden(
            [
                "err" => "ไม่สามารถอัพเดตสถานะโครงการได้",
                "status" => 404
            ]
        );
    }
    foreach ($vendors as $index => $vendor) {
        $mail->sendTo($vendor["email"]);
        $mail->addSubject("แจ้งผลการประกวดราคา ในโครงการ$projec[name] เลขที่เอกสาร $projec[key]");
        $mail->addBody(htmlMailLose($vendor, $project, $secretaryInfo));
        if ($_ENV["DEV"] == false) {
            $success = $mail->sending();
            if ($success === null) {
                $service->rollbackTransaction();
                $http->Forbidden(
                    [
                        "err" => "ส่งอีเมลไม่สำเร็จ",
                        "status" => 403
                    ]
                );
            }
        }
        $mail->clearAddress();
    }
};
$service->commitTransaction();

$http->Ok(
    [
        "data" => "ประกาศผลสำเร็จ",
        "status" => 200
    ]
);
