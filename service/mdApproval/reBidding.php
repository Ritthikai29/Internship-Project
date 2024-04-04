<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("../Template/SettingMailSend.php");

include_once("./approveResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$approveResultService = new ApproveResultService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * body from req POST method
 */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * Get data from parameter send from MD
 * 
 */
$projectKey  = $template->valVariable(isset($_GET["proj"]) ? $_GET["proj"] : null, "project key" );

// * Get Project By Project Key
$project = $approveResultService->getProjectByKey($projectKey);
if (!$project){
    $http->NotFound(
        [
            "err" => "project not found",
            "status" => 404
        ]
    );
}

// * Change status for New Bidding
$newBid = 12;

/**
 * prepare Data
 */

 $data = [
    "project_id" => (int)$project['id'],
    "status_id" => $newBid
];

$approveResultService->startTransaction();

// * Update Project Status
$res = $approveResultService->updateProjectStatus($data);

// if insert Failed
if (!$res) {
    $approveResultService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "update project failed",
            "status" => 400
        ]
    );
}

$approveResultService->commitTransaction();

// * Get data Secretary of project for send e-mail
$secretaryEmail = $approveResultService->getSecretaryInfoByProjectId($project["id"]);

/**
* send a email to secretary
*/
    
$mail->sendTo($secretaryEmail);
$subjectEmail = "ผลการพิจารณาการอนุมัติโครงการ" . (string)$project['name'];
$mail->addSubject($subjectEmail);

$bodyEmail = "การอนุมัติโครงการ เลขที่ " . $projectKey . " ได้ผลลัพธ์ ให้ เสนอราคาใหม่ อีกครั้ง " ;
$mail->addBody($bodyEmail);

$mail->sending();
$mail->clearAddress();

$http->Ok([
    "data" => "Success",
    "status" => 200
]);
