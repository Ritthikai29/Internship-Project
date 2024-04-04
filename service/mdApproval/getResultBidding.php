<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");

include_once("./approveResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$approveResultService = new ApproveResultService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
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
 * find a user is a contractor ? 
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
             "err" => "คุณไม่ใช่หน่วยจ้างเหมา",
             "status" => 401
         ]
     );
 }

/**
 * body from req GET method
 */
$body = json_decode(file_get_contents('php://input'), true);

$projectKey = $template->valVariable(isset($body["key"]) ? $body["key"] : null, "project key");

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

// * Check Project is "รออนุมัติผลเสร็จสิ้นประกวดราคา" หรือ "รออนุมัติผลล้มประกวดราคา"
$projectStatus = $approveResultService->getProjectStatusByProjectId($project["status_id"]);
if ($projectStatus !== 13 || $projectStatus !== 14){
    $http->Forbidden(
        [
            "err" => "โปรเจคไม่อยู่ในขั้นตอนการอนุมัติ",
            "status" => 403
        ]
    );
}

$project['project_status'] = $projectStatus;

$http->Ok([
    "data" => $project,
    "status" => 200
]);
