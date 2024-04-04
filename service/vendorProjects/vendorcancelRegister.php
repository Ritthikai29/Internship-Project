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

$projectKey = isset($body["project_key"]) ? $body["project_key"] : null;
$userId = isset($decode->vendorId) ? $decode->vendorId : null;
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

//Update Log After Re-Quatation
if($project['status_id'] == 12){
    $check = $vendorProjectService->getLogVendorProjectByProjectIDANDVendorID($project['id'],$userId);
    $data = [
        "log_vendor_project_id" => $check['id'],
        "action_detail" => "สละสิทธิ์"
    ];

    $res = $vendorProjectService->updateLogSecretarySendListVendor($data);
    if (!$res) {
        $http->BadRequest(
            [
                "err" => "ไม่สามารถอัพเดต Log ได้",
                "status" => 400
            ]
        );
    }
}

$vendor_project = $vendorProjectService->getProject_ProjectByKey($project["id"],$userId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

$maxOrder = $vendorProjectService->getCountBargainProjectByPid($project["id"]);

$priceEncrypt = $enc->bidEncode(0);
$vendorProject = $vendorProjectService->updateRegister($vendor_project["id"],11,$maxOrder['count']+1);
if(!$vendorProject){
    $vendorProjectService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "เกิดข้อผิดพลาด ไม่สามารถสละสิทธ์ได้",
            "status" => 400
        ]
    );
};
// if($maxOrder['count'] == null){
//     $vendorProject = $vendorProjectService->insertcancelRegister($vendor_project["id"],$priceEncrypt,null);
// } else{
//     $vendorProject = $vendorProjectService->updateRegister($vendor_project["id"],11,$maxOrder['count']+1);
// }

$vendorProjectService->commitTransaction();

$http->Ok([
    "data" => "success",
    "status" => 200
]);