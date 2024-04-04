<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("./calculatorTemplate.php");
$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$calculateService = new CalculateService();
/**
 * 
 * check methods is a POST methods 
 * 
 */
if ($_SERVER["REQUEST_METHOD"] !== 'POST')
    $http->MethodNotAllowed(
        [
            "err" => "link is not allow a method",
            "status" => 405
        ]
    );
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
 * get a project id from a body json
 */
$projectId = $template->valVariable(isset($body["projectId"]) ? $body["projectId"] : null, "projectId");

/**
 * decode a jwt token to get a struct token
 * 
 * @var object
 */
$tokenDecode = $enc->jwtDecode($token);

/**
 *  
 * try to query a Ref price manager from project id and user id 
 * 
 * @var array 
 * 
 */
try{
    $refPriceManager = $calculateService->getRefPriceManagerByProjectAndUserWithRole($projectId, $tokenDecode->userId, 'calculator');
}
catch(PDOException | Exception $e){
    $cmd->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest();
}

if(!$refPriceManager){
    $http->NotFound([
        "err" => "you isn't a calculator in this project",
        "status" => 404
    ]);
}

$http->Ok([
    "data" => $refPriceManager,
    "status" => 200
]);
