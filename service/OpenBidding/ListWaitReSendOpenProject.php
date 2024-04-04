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
 * check you is a secretary of the project 
 */
$permission = false;
foreach($user["role"] as $index => $value){
    if($value["role_name"] === "secretary"){
        $permission = true;
    }
}
if(!$permission){
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้่",
            "status" => 401
        ]
    );
}

$openId = $template->valVariable(isset($_GET["op_id"]) ? $_GET["op_id"] : null, "open id");

$listWaitResendProject = $openBiddingService->listWaitReSendProject($openId);

forEach($listWaitResendProject as $index => $value){
    $listWaitResendProject[$index]["totalVendor"] = ($openBiddingService->getTotalVendorByProjectId($value["id"]))["total"];
    $listWaitResendProject[$index]["totalVendorRegistor"] = ($openBiddingService->getTotalVendorRegisterByProjectId($value["id"]))["total"];
}

$http->Ok(
    [
        "data" => $listWaitResendProject,
        "status" => 200
    ]
);

