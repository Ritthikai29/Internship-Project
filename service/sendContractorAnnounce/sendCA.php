<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");
include_once("../middleware/authentication.php");

include_once("./sendCAService.php");
include_once("./funcMailContractorAnnounce.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$mail = new Mailing();
$enc = new Encryption();
$sendContractorAnnounceService = new SendContractorAnnounceService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * 1. authorize 
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

// -------------------------- START CHECK ROLE OF THE USER STAFF -----------------------------
/**
 * find a user is a secretary ? 
 */

$isOk = false;
$roleCheck = [
    "secretary"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $sendContractorAnnounceService->getUserByIdAndRole($userId, $roleCheck[$i]);
    if ($user) {
        $isOk = true;
    }
    $i++;
} while (!$isOk && $countRole > $i);

if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่กลุ่มกรรมการในระบบ",
            "status" => 401
        ]
    );
}

// // -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------

$key = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null);
$project = $sendContractorAnnounceService->getProjectByKey($key);
$updatestatus = $sendContractorAnnounceService->updateProjectStatusByPId($key);
$contractors = $sendContractorAnnounceService->getAllContractor();

$subjectEmail = "แจ้งผลประกวดราคา  โครงการ$project[name] เลขที่เอกสาร $project[key]";
$body = file_get_contents("./funcMailContractorAnnounce.php");

foreach ($contractors as $contractor) {
    $mail->sendTo($contractor["email"]);
    $mail->addSubject($subjectEmail);
    $mail->addBody($body);
    $mail->addBody(htmlMail5($project, $contractor));
    if ($_ENV["DEV"] === false) {
        $success = $mail->sending();
        if ($success === null) {
            $sendContractorAnnounceService->rollbackTransaction();
            $http->Forbidden(
                [
                    "err" => "ส่งอีเมลไม่สำเร็จ กรุณาติดต่อ Admin",
                    "status" => 403
                ]
            );
        }
    }
    $mail->clearAddress();
}





$http->Ok(
    [
        "data" => "success",
        "status" => 200
    ]
);
