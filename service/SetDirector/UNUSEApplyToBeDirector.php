<?php 

session_start();

include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");
include("./SetDirectorService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$VerifyAuthorize = new SetDirectorService();

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
if(!$userId){
    $http->Unauthorize(
        [
            "err" => "not found a user id ",
            "status" => 401
        ]
    );
}

$user = $VerifyAuthorize->getUserStaffById($userId);//เอาuserId ที่ได้จาก tokenที่แตกมาแล้ว มาดึงข้อมูล
if(
    $user["role_name"] !== "chairman"  &&  $user["role_name"] !== "committee"
    //เอาrole_nameมาดู ดีกว่าใช้id idเปลียนได้ตลอด
){
    $http->Unauthorize(
        [
            "err" => "user not authorize",
            "status" => 401
        ]
    );
}


$http->Ok(
    [
        "data" =>"xx",

        "status" => 200
    ]
);