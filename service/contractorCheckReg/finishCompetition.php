<?php 
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("../middleware/authentication.php");

include_once("./checkRegisterService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$checkService = new CheckService();

/**
 * POST METHOD 
 */
if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

/**
 * 1. authorize 
 */
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "not found a user id ",
            "status" => 401
        ]
    );
}

/**
 * body from req POST method
 */
$body = json_decode(file_get_contents('php://input'), true);

$projectKey = $template->valVariable(isset($body["key"]) ? $body["key"] : null, "project key");

/**
 * GET Project By Key
 */
$project = $checkService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

$checkService->startTransaction();

$projectStatus = $checkService->getProjectStatusById($project['status_id']);
if ($projectStatus['status_name'] !== "กำลังประกวดราคา") {
    $checkService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "project is not in competition",
            "status" => 400
        ]
    );
}

/**
 * update project status by project id
 */
$projectStatus = $checkService->getProjectStatusByName(
    "รอเลือกวันเปิดซอง"
);
$data = [
    "pj_id" => $project["id"],
    "status_id" => $projectStatus["id"]
];
$projectStatusUpdate = $checkService->updateProjectStatusById(
    $data
);

// $vendorRegisterUpdate = $checkService->updateVendorRejisterByPidAndRid($project["id"],12);
// if (!$vendorRegisterUpdate) {
//     $checkService->rollbackTransaction();
//     $http->BadRequest([
//         "error" => "เกิดข้อผิดพลาดไม่สามารถอัพเดตข้อมูลของ vendor ที่ไม่ได้มีการเสนอราคา",
//         "status" => 400
//     ]);
// }

$checkService->commitTransaction();

$http->Ok([
    "data" => $project,
    "status" => 200
]);




