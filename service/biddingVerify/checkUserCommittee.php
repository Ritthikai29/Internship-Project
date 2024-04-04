<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");

include_once("./biddingVerifyService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$biddingVerifyService = new BiddingVerifyService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * 
 * Decode a josn body to @var array 
 * 
 */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * Get Token from a session => token 
 */
$token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;
if(!$token){
    $http->NotFound([
        "err" => "Not found a token",
        "status" => 404
    ]);
}
/**
 * decode a jwt token to get a struct token
 * 
 * @var object
 */
$tokenDecode = $enc->jwtDecode($token);

/**
 * get a open id from a body json
 */
$openId = $template->valVariable(isset($body["open_id"]) ? $body["open_id"] : null, "open id");

/**
 * try to query committee from open id and user id
 */
try{
    $committee = $biddingVerifyService->getCommitteeToDayByOpenIdAndUserId($openId,$tokenDecode->userId);
} catch (PDOException | Exception $e){
    $cmd->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest();
}

if(!$committee){
    $http->NotFound([
        "err" => "you aren't a committee in open bidding",
        "status" => 404
    ]);
}

$http->Ok([
    "data" => $committee['role_name'],
    "status" => 200
]);