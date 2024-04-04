<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("./verifyService.php");


$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$verifyService = new VerifyService();

if($_SERVER["REQUEST_METHOD"] !== 'GET'){
    $http->MethodNotAllowed([
        "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW(s)",
        "status" => 405
    ]);
}

// check token is have in server?
if(!isset($_SESSION["token"])){
    $http->Unauthorize(
        [
            "err" => "not found a token please login",
            "status" => 401
        ]
    );
}
/**
 * Get a token from $SERVER[token] to use it to verify
 */
$token = $_SESSION["token"];

/**
 * Decode a token (verify)
 * @var object
 */
try{
    // try to verify and decodeing
    $tokenVerify = $enc->jwtDecode($token);
}catch(Exception $e){
    // if token is unauthorize
    $http->Unauthorize(
        [
            "err" => "Session ของคุณหมดอายุ โปรด Login ใหม่",
            "status" => 401
        ]
    );
}
/**
 * get a user id from Token verify 
 * 
 * @var int
 */
$userId = $tokenVerify->userId;

/**
 * Get a project Id from get Methods 
 * 
 * @var int
 */
$projectId = $template->valVariable(isset($_GET["pj_id"]) ? $_GET["pj_id"] : null, "project Id");

/**
 * Find a Manager in this project by user id and project id 
 * 
 * @var array
 */
$verifyManager = $verifyService->getManagerByProjectIdAndUserId($projectId, $userId);

// check is found a verify manager 
if(!$verifyManager){
    $http->Unauthorize(
        [
            "err" => "คุณไม่ถูกเชิญอยู่ในโครงการ หากถูกเชิญ กรุณา Login ใหม่ด้วย ID ที่ถูกเชิญ",
            "status" => 401
        ]
    );
}

// check this user and this project is not int role verifier 
if($verifyManager["role_name"] !== 'verifier' && $verifyManager["role_name"] !== 'verifier 2'){
    // if your role is not a verifier 
    $http->Unauthorize(
        [
            "err" =>  "คุณไม่ใช่ผู้ตรวจสอบราคาใรโครงการนี้ กรุณา Login ใหม่",
            "status" => 401
        ]
    );
}

// response a manager to client
$http->Ok(
    [
        "data" => $verifyManager,
        "status" => 200
    ]
);