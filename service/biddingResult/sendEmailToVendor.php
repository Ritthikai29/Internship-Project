<?php
// เพื่อส่ง email เพื่อเชญ Vendor ในการขอประกวดราคาอีกครั้ง
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");
include_once("../middleware/authentication.php");

include_once("./biddingResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$mail = new Mailing();

$biddingResultService = new BiddingReasultService();

// start transections 
$biddingResultService->startTransaction();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

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
    $user = $biddingResultService->getUserByIdAndRole($userId, $roleCheck[$i]);
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

/**
 * to defind what project will be have a next bidding
 */
$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");

/**
 * to defind a director of the open date (to check passcode and check a permission)
 */
$directorId = $template->valVariable(isset($body["director_id"]) ? $body["director_id"] : null, "director id");

/**
 * to defind a list of id vendor of the porject to update this status to 
 * waiting (for vendor can be bidding(offer price) again)
 */
$listVendorProjectId = $template->ValArrVariable(isset($body["listVendorProject"]) ? $body["listVendorProject"] : null, "ลิสต์ของ vendor ที่จะส่ง");

/**
 * to defind a date time of the starting to bargain vendor
 */
$startDatetime = $template->valVariable(isset($body["start_datetime"]) ? $body["start_datetime"] : null);

/**
 * to defind a date time of the end to bargain vendor
 */
$finalDatetime = $template->valVariable(isset($body["final_datetime"]) ? $body["final_datetime"] : null);

/**
 * start transection to run command
 */
$biddingResultService->startTransaction();


/**
 * find a project by project id
 */
$project = $biddingResultService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่คุณต้องการ",
            "status" => 404
        ]
    );
}

/**
 * check a director id is a secretary ? 
 */
$director = $biddingResultService->getDirectorById($directorId);
if (!$director || !password_verify($passcode, $director["passcode"])) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบข้อมูลของ User ที่ส่งมาให้",
            "status" => 401
        ]
    );
}


/**
 * get status waiting to add to selected vendor (for bargain to vendor)
 */
$waitingStatus = $biddingResultService->getVendorProjectStatusByName("waiting");
if (!$waitingStatus) {
    $http->NotFound(
        [
            "err" => "ไม่พบสถานะรอการประกวดอีกครั้ง",
            "status" => 404
        ]
    );
}

/**
 * create a bargain setting of the project 
 */
$startDatetime = strtotime($startDatetime);
$startDatetime = mktime(0, 0, 0, date('m', $startDatetime), date('d', $startDatetime), date('Y', $startDatetime));
$startDatetime = date('Y-m-d H:i:s', $startDatetime);

$finalDatetime = strtotime($finalDatetime);
$finalDatetime = date('Y-m-d H:i:s', $finalDatetime);
$data = [
    "project_id" => $project["id"],
    "start_datetime" => $startDatetime,
    "final_datetime" => $finalDatetime
];
$insertBargainSetting = $biddingResultService->insertBargainSetting($data);
if (!$insertBargainSetting) {
    $http->Forbidden(
        [
            "err" => "ไมสามารถเพ่ิมข้อมูลได้",
            "status" => 403
        ]
    );
}

/**
 * get a list vendor of the project to update status to 
 * waiting
 * and send a mail to all vendor of the project 
 */
$listVendorProjectUpdate = [];
foreach ($listVendorProjectId as $index => $vendorProjectId) {
    $vendorProject = $biddingResultService->getVendorProjectById($vendorProjectId);
    if (!$vendorProject) {
        $http->NotFound(
            [
                "err" => "vendor id $vendorProjectId ไม่ได้อยู่ในกลุ่มผู้เข้าร่วมโครงการ",
                "status" => 404
            ]
        );
    }
    $vendor = $biddingResultService->getVendorByVendorId($vendorProject["vendor_id"]);
    if (!$vendor) {
        $http->NotFound(
            [
                "err" => "ไม่พบข้อมูลของ vendor ที่เจอ",
                "status" => 404
            ]
        );
    }

    $prepareUpdate = [
        "vendor_status_id" => $waitingStatus["id"],
        "vendor_project_id" => $vendorProject["id"]
    ];
    $vendorProjectUpdate = $biddingResultService->updateVendorProjectStatusByVendorProjectId(
        $prepareUpdate
    );
    if (!$vendorProjectUpdate) {
        $http->Forbidden(
            [
                "err" => "can't update a vendor project",
                "status" => 404
            ]
        );
    }

}

$http->Ok(
    [
        "data" => [
            "bargain" => $insertBargainSetting,
            "listVendorUpdate" => $listVendorProjectUpdate
        ],
        "status" => 200
    ]
);