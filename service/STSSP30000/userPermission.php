<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include("./approveService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$approveService = new ApproveService();

/**
 * check a request method is get?
 */
if($_SERVER["REQUEST_METHOD"] !== 'GET'){
    $http->MethodNotAllowed([
        "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW(s)",
        "status" => 405
    ]);
}

// check token is have in server?
if(!isset($_SESSION["token"])){
    $http->NotFound(
        [
            "err" => "not found a token please login",
            "status" => 404
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
            "err" => "your token is not have to authorize",
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
 * Get a parameter clientRole
 * 
 * @var string
 */
$clientRole = $template->valVariable( isset($_GET["role"]) ? $_GET["role"] : null, "client Role" );

/**
 * Get a parameter project id
 * 
 * @var string
 */
$projectId = $template->valVariable( isset($_GET["id"]) ? $_GET["id"] : null, "project Id" );


/**
 * check client role is a approve 1 or approve 2
 * first if for approver 1
 * second if for approver 2
 * else for other role (Exception)
 */
if($clientRole === "approver 1"){
    // if client Role is a approve 1

    /**
     * find a ref price manager by project id and user id
     * 
     * @var array
     */
    $clientManager = $approveService->getManagerByProjectIdAndUserId($projectId, $userId);
    // check is found a client Manager?
    if(!$clientManager){
        // if not found a client manager
        $http->Unauthorize(
            [
                "err" => "not found a client manager",
                "status" => 401
            ]
        );
    }
    // check role is a approver 1?
    if($clientManager["role_name"] !== "approver 1"){
        // if role isn't approver 1
        $http->Unauthorize(
            [
                "err" => "you is not a approver 1 in this project",
                "status" => 401
            ]
        );
    }
    // if ok user is have a permission to access this project
    $http->Ok(
        [
            "data" => $clientManager,
            "status" => 200
        ]
    );

}else if($clientRole === "approver 2"){
    // if client role is a approver 2
    /**
     * check approver 2 s have in project?
     * 
     * @var array
     */
    $approve2 = $approveService->getManagerByProjectIdAndRoleName($projectId, 'approver 2');
    // Check is found a approve2
    if(!$approve2){
        // if not found a approver 2 in this project
        $http->NotFound(
            [
                "err" => "not found a approver 2",
                "status" => 404
            ]
        );
    }
    /**
     * find a manager by user id and project id
     * 
     * @var array
     */
    $clientManager = $approveService->getManagerByProjectIdAndUserId($projectId, $userId);
    // check a client manager is have?
    if(!$clientManager){
        // not found this manager in this project
        $http->Unauthorize(
            [
                "err" => "you is not include in this project | please contract to admin",
                "status" => 401
            ]
        );
    }
    // check role of the client manager is a approver 2?
    if($clientManager["role_name"] !== "approver 2"){
        // if client manager role is not a approver 2
        $http->Unauthorize(
            [
                "err" => "client manager is not a approver 2",
                "status" => 401
            ]
        );
    }

    // if ok user is have a permission in this project
    $http->Ok(
        [
            "data" => $clientManager,
            "status" => 200
        ]
    );
}else{
    // if role is incorrect 
    $http->Forbidden(
        [
            "data" => "input is not correct for this api",
            "status" => 403
        ]
    );
}