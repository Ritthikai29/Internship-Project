<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include("./../middleware/authentication.php");
include("./vendorProjectService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$vendorProjectService = new VendorProjectService();

// authorization
$auth = new Userauth();
$token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;
// Check token validate?
try {
    $decode = $enc->jwtDecode($token);
} catch (Exception $e) {
    $http->Unauthorize(["err" => "your token is expired"]);
}


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}
$body = json_decode(file_get_contents('php://input'), true);

$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "project key");
$userId = isset($decode->vendorId) ? $decode->vendorId : null;
$retreat = isset($body["reject_id"]) ? $body["reject_id"] : null;
$comment = isset($body["comment"]) ? $body["comment"] : null;

$vendorProjectService->startTransaction();

$project = $vendorProjectService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

$vendorUpdated = $vendorProjectService->updateVendorStatusById($project["id"], $userId, $retreat,$comment);
if(!$vendorUpdated){
    $vendorProjectService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "update vendor is falied please check you value",
            "status" => 403
        ]
    );
}

$vendorProjectService->commitTransaction();

$http->Ok([
    "data" => $vendorUpdated,
    "status" => 200
]);