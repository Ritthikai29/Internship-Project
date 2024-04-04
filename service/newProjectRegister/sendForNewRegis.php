<?php 
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingMailSend.php");
include_once("../middleware/authentication.php");
include_once("./funcVendorNewRegis.php");

// Call service for connect to database of 'RegisterService'
include_once("./newRegisterService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$newRegisterService = new NewRegisterService();

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
     $user = $newRegisterService->getUserByIdAndRole($userId, $roleCheck[$i]);
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

 /**
  * Get data from body
  */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * Receive a data from Req body
 */
$projectKey = $template->valVariable(isset($_POST["key"]) ? $_POST["key"] : null, "project key");
// * Get Project By Project Key
$project = $newRegisterService->getProjectByKey($projectKey);
if (!$project){
    $http->NotFound(
        [
            "err" => "project not found",
            "status" => 404
        ]
    );
}

/**
 * * GET List of Vendor In Project With Last Order
 */
$getAllVendor = $newRegisterService->listOfVendorInProjectByProjectId($project['id']);
if (!$getAllVendor) {
    $http->BadRequest(
        [
            "err" => "not found vendor in project",
            "status" => 400
        ]
    );
}

/**
 * send a email to all vendor 
 */
$subjectEmail = "แจ้งรายละเอียดเพื่อเสนอราคาใหม่ โครงการ$project[name] เลขที่เอกสาร $projectKey";
$body = file_get_contents("./funcVendorNewRegis.php");
foreach($getAllVendor as $vendor){
    $mail->sendTo($vendor["email"]);
    $mail->addSubject($subjectEmail);
    $mail->addBody($body);
    $mail->addBody(htmlMail($project, $vendor));

    $mail->sending();
}
    
 



$http->Ok([
    "data" => "Send Success",
    "status" => 200
]);




