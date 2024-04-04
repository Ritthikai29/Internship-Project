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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

// auth
$token = JWTAuthorize($enc, $http);
// userID
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ได้ Login เข้าสู่ระบบ",
            "status" => 401
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);

/**
 * we use 3 parameter from FE to create vendor of project
 * 
 * @param string $project_id
 * @param string $vendor_id
 * @param string $user_id
 */
$projectId = isset($body["project_id"]) ? $body["project_id"] : null;
$projectId = $template->valVariable($projectId);

$vendorId = isset($body["vendor_id"]) ? $body["vendor_id"] : null;
$vendorId = $template->valVariable($vendorId);


/**
 * find a project by project ID (checking project is have?)
 * 
 * @var array
 */


$project = $vendorProjectService->getProjectById($projectId);
if(!$project){
    $http->NotFound(
        [
            "err" => "Not found a project by id : $projectId",
            "status" => 404
        ]
    );
}

/**
 * find a vendor by vendor ID (checking vendor is have?)
 * 
 * @var array
 */
$vendor = $vendorProjectService->getVendorById($vendorId);
if(!$vendor){
    $http->NotFound(
        [
            "err" => "Not found a vendor by id : $vendorId",
            "status" => 404
        ]
    );
}




$data = [
    "project_id" => $project["id"],
    "vendor_id" => $vendor["id"],
    "approve" => 1,
    "passcode" => null,
    "adder_user_staff_id" => $userId
];

$vendorProjectService->startTransaction();

$checkRes=$vendorProjectService->checkVendorProject($data);
if(!$checkRes){
    $vendorProject = $vendorProjectService->createVendorProject($data);
    $vendorProjectService->commitTransaction();
$http->Ok(
    [
        "data" => $vendorProject,
        "status" => 200
    ]
);
} else {$http->Forbidden(
    [
        "data" => "VendorProject already exist",
        "status" => 403
    ]
);
    
}




