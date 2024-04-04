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


if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

// check token is have in server?
if (!isset($_SESSION["token"])) {
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
try {
    // try to verify and decodeing
    $tokenVerify = $enc->jwtDecode($token);
} catch (Exception $e) {
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
 * GET a project key from parameter GET[key]
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project Key");

$project = $approveService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project key",
            "status" => 404
        ]
    );
}

$clientManager = $approveService->getManagerByProjectIdAndUserId($project["id"], $userId);
if (!$clientManager || ($clientManager["role_name"] !== "approve 1" && $clientManager["role_name"] !== "approve 2")) {
    $http->NotFound(
        [
            "err" => "your client is not found or role is incorrect",
            "status" => 404
        ]
    );
}

$latestApprove1 = $approveService->getLatestApproveByRefId($clientManager["id"]);
$http->Ok(
    [
        "data" => $latestApprove1,
        "status" => 200
    ]
);