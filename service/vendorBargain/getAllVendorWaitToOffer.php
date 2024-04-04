<?php
// ใช้ในการแสดงข้อมูล vendor ในโครงการทั้งหมด โดยลำดับจากราคาที่เสนอมารอบล่าสุด
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

$bargainService->startTransaction();

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
            "err" => "ไม่พบข้อมูล Vendor กรุณา Login ใหม่",
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
$projectId = isset($_GET["project_id"]) ? $_GET["project_id"] : null;
$projectId = $template->valVariable($projectId);

$project = $bargainService->getProjectById($projectId);
if(!$project){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลโครงการ",
            "status" => 404
        ]
    );
}

$vendorProject = $bargainService->getAllVendorProjectByProjectId($project["id"]);
if(!$vendorProject){
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูล vendor ในโครงการนี้",
            "status" => 404
        ]
    );
}

/**
 * ใช้ loop เพื่อหา ราคากลางอันล่าสุดของ vendor แต่ละคน
 */
$leastPrice = null;
$leastBidPriceVendor = [];
foreach($vendorProject as $index => $vendor){
    $vendorProject[$index]["bidPrice"] = $bargainService->getAllRegisterByVenId($vendor["id"]);
    if($vendorProject[$index]["bidPrice"]){
        $vendorProject[$index]["bidPrice"]["price"] = $enc->bidDecode($vendorProject[$index]["bidPrice"]["price"]);
        $vendorProject[$index]["compare"] = $vendorProject[$index]["bidPrice"]["price"];
    }else{
        $vendorProject[$index]["bidPrice"] = null;
        $vendorProject[$index]["compare"] = null;
    }
    // if (is_numeric($vendorProject[$index]["compare"]) && ($vendorProject[$index]["compare"] < $leastPrice || $leastPrice == null)) {
    //     $leastPrice = $vendorProject[$index]["compare"];
    // }    
}

// foreach($vendorProject as $vendor){
//     if($vendor["compare"] == $leastPrice){
//         array_push($leastBidPriceVendor,$vendor);
//     }
// }

// sorting ASC and null will go down
usort($vendorProject, function ($a, $b) {
    if ($a['compare'] === null || $a['compare'] == 0) {
        return 1;
    }
    if ($b['compare'] === null || $b['compare'] == 0) {
        return -1;
    }
    return $a['compare'] - $b['compare'];
});


$http->Ok(
    [
        "data" => $vendorProject,
        "status" => 200
    ]
);
