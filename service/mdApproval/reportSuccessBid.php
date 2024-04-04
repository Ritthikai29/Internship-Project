<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");
include_once("../middleware/authentication.php");
include_once("./funcVendorWinResultMail.php");
include_once("./funcVendorLoseResultMail.php");

include_once("./approveResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$approveResultService = new ApproveResultService();

if ($_SERVER["REQUEST_METHOD"] !== "PATCH") {
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
     $user = $approveResultService->getUserByIdAndRole($userId, $roleCheck[$i]);
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

// * Check user have employee acc in database
$user = $approveResultService->getUserStaffById($userId);
if (!$user) {
    $http->NotFound(
        [
            "err" => "not found a user by user id",
            "status" => 404
        ]
    );
}

 /**
  * Get data from body
  */
$body = json_decode(file_get_contents('php://input'), true);

// * Check is projectKey is exist 
$projectKey = $template->valVariable(isset($body["key"]) ? $body["key"] : null, "project key" );
$project = $approveResultService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project id",
            "status" => 404
        ]
    );
}

$approveResultService->startTransaction();

// * Check Project is "รออนุมัติผลเสร็จสิ้นประกวดราคา" หรือ "รออนุมัติผลล้มประกวดราคา"
$projectStatus = $approveResultService->getProjectStatusByProjectId($project["status_id"]);

if ($projectStatus['status_id'] == 13 || $projectStatus['status_id'] == 14)
{
    /**
     * Check previous project status
     */
    if ($project["status_id"] == 13){
        $nextStatus = 15;
    } else if ($project["status_id"] == 14){
        $nextStatus = 16;
    }
} else {
    $http->Forbidden(
        [
            "err" => "โปรเจคไม่อยู่ในขั้นตอนการอนุมัติ",
            "status" => 403
        ]
    );
}


/**
 * Prepare data
 * 
 */

$data = [
    "project_id" => $project['id'],  
    "status_id" => $nextStatus
];


// * Update project status
$res = $approveResultService->updateProjectStatus($data);

if(!$res){
    $approveResultService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "update project status is falied",
            "status" => 403
        ]
    );
}

// * Get Coordinator in project
$coInfo = $approveResultService->getCoordinatorByProjectId((int)$project["id"]);

// * Get All Vendor in Project Register With Last ORDER
$getAllVendor = $approveResultService->listOfVendorInProjectByProjectId($project['id']);

/**
 * send a email to vendor 
 * staID 1: Winner
 * staID 2: Loser
 * 
 */

// * Send Mail to Winner
foreach($getAllVendor as $vendor){
    if ($vendor['vendor_project_status_id'] == 1)
    {
        $mail->sendTo($vendor["email"]);
    }
}

$subjectEmail = "แจ้งผลการประกวดราคา  เลขที่เอกสาร : " . (string)$projectKey;
$mail->addSubject($subjectEmail);
$body = file_get_contents("./funcVendorWinResultMail.php"); 
$mail->addBody($body);
$mail->addBody(htmlMail($project,$coInfo));
$mail->sending();
$mail->clearAddress();

// * Send Mail to Loser
foreach($getAllVendor as $vendor){
    if ($vendor['vendor_project_status_id'] == 2)
    {
        $mail->sendTo($vendor["email"]);
    }
}

$subjectEmail = "แจ้งผลการประกวดราคา  เลขที่เอกสาร : " . (string)$projectKey;
$mail->addSubject($subjectEmail);
$body = file_get_contents("./funcVendorLoseResultMail.php"); 
$mail->addBody($body);
$mail->addBody(htmlMail2($project));
$mail->sending();
$mail->clearAddress();

$approveResultService->commitTransaction();

$http->Ok([
    "data" => "Send Vendor Result Success",
    "status" => 200
]);