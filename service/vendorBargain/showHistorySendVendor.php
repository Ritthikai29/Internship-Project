<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("../Template/SettingMailSend.php");

include_once("./bargainService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$bargainService = new BargainService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * 1. authorize a vendor of the project
 */
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบข้อมูล User กรุณา Login ใหม่",
            "status" => 401
        ]
    );
}
// -------------------------- START CHECK ROLE OF THE USER STAFF -----------------------------
/**
 * find a user is a secretary ? 
 */

$isOk = false;
$roleCheck = [
    "secretary"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $bargainService->getUserByIdAndRole($userId, $roleCheck[$i]);
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

// -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------

/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);
$project_id = isset($_GET["project_id"]) ? $_GET["project_id"] : null;
$project_id = $template->valVariable($project_id);

$project = $bargainService->getProjectById($project_id);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลโครงการ",
            "status" => 404
        ]
    );
}

// Get Previous List Send Vendor
$previousSend = $bargainService->getLogVendorProjectByProjectID($project_id);
if (!$previousSend) {
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลส่งเชิญก่อนหน้า",
            "status" => 404
        ]
    );
}

$http->Ok(
    [
        "data" => $previousSend,
        "status" => 200
    ]
);
