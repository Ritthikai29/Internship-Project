<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingTemplate.php");
include_once("./../middleware/authentication.php");
include_once("./approveResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$approveResultService = new ApproveResultService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$tokenObject = JWTAuthorize($enc, $http);

// * Check is User is Log in
// ! Change to Log in URL
if (empty($tokenObject)){
    header('Location: http://localhost:8000/STSBidding/service/Login/staffLogin.php');
}

$userId = isset($tokenObject->userId) ? $tokenObject->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "not found a user by user id",
            "status" => 401
        ]
    );
}

/**
 * check user is a MD
 */
$isOk = false;
$roleCheck = [
    "chairman"
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
            "err" => "คุณไม่ใช่กลุ่มกรรมการในระบบ",
            "status" => 401
        ]
    );
}

// * Check is projectKey is exist 
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key" );
$project = $approveResultService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project key",
            "status" => 404
        ]
    );
}

$http->Ok(
    [
        "data" => "Success",
        "status" => 200
    ]
);