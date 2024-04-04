<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");
include("./OpenBiddingService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$openBiddingService = new OpenBiddingService();
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

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

/**
 * get a data of the user by user id
 */
$user = $openBiddingService->getUserEmployeeByUserId($userId);
if(!$user){
    $http->Unauthorize(
        [
            "err" => "ไม่พบ user id คนนี้",
            "status" => 401
        ]
    );
}

$user["role"] = $openBiddingService->getUserRoleByUserId($user["id"]);
if(!$user["role"]){
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้่",
            "status" => 401
        ]
    );
}

/**
 * find a user is a committee or chairman or secretary ? 
 */

 $isOk = false;
 $roleCheck = [
     "chairman",
     "committee",
     "secretary"
 ];
 $countRole = count($roleCheck);
 $i = 0;
 do {
     $user = $openBiddingService->getUserByIdAndRole($userId, $roleCheck[$i]);
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
 * Get Project By Project Key
 */
$projectId = $template->valVariable(isset($_GET["project_id"]) ? $_GET["project_id"] : null, "project id" );

/**
 * Get Project Price Of Project
 */
$project = $openBiddingService->getProjectById($projectId);

$projectPriceProcessCal = $openBiddingService->getProcessPriceOfProjectCalculator($projectId);
$projectPriceProcessApr = $openBiddingService->getProcessPriceOfProjectApprover($projectId);

if($projectPriceProcessCal && $projectPriceProcessApr !== null){
    if ($projectPriceProcessCal['CAL_price'] !== null) {
        $cal_de = $enc->apDecode($projectPriceProcessCal['CAL_price']);
        $projectPriceProcessCal['CAL_price'] = $cal_de;
    }

    if ($projectPriceProcessApr['AP_price'] !== null) {
        $cal_de = $enc->apDecode($projectPriceProcessApr['AP_price']);
        $projectPriceProcessApr['AP_price'] = $cal_de;
    }
} else {
    $projectPriceProcessCal = [];
    $projectPriceProcessApr = [];
    $price = $enc->apDecode($project['price']);
    $projectPriceProcessCal['CAL_price'] = $price;
    $projectPriceProcessApr['AP_price'] = $price;
}

$http->Ok([
    "cal" => $projectPriceProcessCal,
    "apr" => $projectPriceProcessApr,
    "status" => 200
]);