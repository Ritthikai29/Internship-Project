<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");
include_once("./funcInviteVendorMail.php");

include_once("../middleware/authentication.php");
include_once("./sendInviteService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$sendService = new SendInviteService();

// Check is a post methods
if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

$tokenObject = JWTAuthorize($enc, $http);
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
 * check user is have in database (get all data of user)
 */
$user = $sendService->getUserStaffById($userId);

if (!$user) {
    $http->NotFound(
        [
            "err" => "not found a user by user id",
            "status" => 404
        ]
    );
}

/**
 * check is user is contractor
 * 
 */

$userRole = $sendService->getUserRoleByUserId($userId);

if ($userRole["role_name"] !== "Contractor") {
    $http->Forbidden(
        [
            "err" => "your account can not be access",
            "status" => 403
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);

$projectKey = $template->valVariable(isset($body["key"]) ? $body["key"] : null, "project key");

// Check is projectKey is exist 
$project = $sendService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project key",
            "status" => 404
        ]
    );
}

// Get Department By Id
$project['affiliation'] = $sendService->getAffiliation($project['id'])['affiliation'];

// Get List Vendor Info In Project
$getListVendorInfo = $sendService->getListVendorAndInfoByProjectId($project['id']);

// Get Project Setting From DB
$getProjectSetting = $sendService->getProjectSettingByProjectId($project['id']);

// Get Approver Info By ID
$getApproverInfo = $sendService->getEmployeeInfoById($getProjectSetting['approver_id']);

// Get Coordinator Info By Id
$getCoordinatorInfo = $sendService->getEmployeeInfoById($getProjectSetting['coordinator_id']);

$sendService->startTransaction();

// Check is Vendor have password
$newPassword = '12345678';
// If do not have set default password
foreach ($getListVendorInfo as $item => $ListVendor) {
    if ($ListVendor['password'] == NULL) {     
        $getListVendorInfo[$item]['new_register'] = 1;
        $updatePassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $getListVendorInfo[$item]['password'] = $updatePassword;

        // Prepare data
        $data = [
            "vendor_id" => $ListVendor['id'],
            "update_password" => $updatePassword
        ];

        // Update new password to DB
        $dataUpdateNewPass = $sendService->updatePasswordVendorByVendorId($data);

        // if insert Failed
        if (!$dataUpdateNewPass) {
            $sendService->rollbackTransaction();
            $http->BadRequest(
                [
                    "err" => "vendor password insert failed",
                    "status" => 400
                ]
            );
        }
    }
    else{
        $getListVendorInfo[$item]['new_register'] = 0;
    }
}

// Generate Passcode foreach Vendor
foreach ($getListVendorInfo as $item => $ListVendor) {
    $newPasscode = $sendService->generateRandomString(6);
    $updatePasscode = password_hash($newPasscode, PASSWORD_BCRYPT);
    $getListVendorInfo[$item]['passcode'] = $newPasscode;
    $getListVendorInfo[$item]['hash_passcode'] = $updatePasscode;

    // Prepare data
    $data2 = [
        "vendor_project_id" => $ListVendor['vendor_project_id'],
        "update_passcode" => $updatePasscode
    ];

    // Update new passcode to DB
    $dataUpdateNewCode = $sendService->updatePasscodeVendorById($data2);

    // if insert Failed
    if (!$dataUpdateNewCode) {
        $sendService->rollbackTransaction();
        $http->BadRequest(
            [
                "err" => "vendor passcode insert failed",
                "status" => 400
            ]
        );
    }
}

/**
 * update project status to bidding
 */
$projectStatus = $sendService->getProjectStatusByName("กำลังประกวดราคา");

$projectUpdated = $sendService->updateProjectStatus($project["id"], $projectStatus["id"]);


// Prepare Send Data
$dataSetting = [
    "project" => $project,
    "setting" => $getProjectSetting,
    "approver" => $getApproverInfo,
    "coordinator" => $getCoordinatorInfo
];

set_time_limit(5);

$priceEncrypt = $enc->bidEncode(0);
$projectSettingInfo = $sendService->getProjectSettingByProjectId($project["id"]);


/**
 * send a email to all vendor
 */

foreach ($getListVendorInfo as $vendor) {
    $mail->sendTo($vendor["email"]);

    $subjectEmail = "ผู้เข้าร่วมประกวดราคา เชิญเข้าร่วมประกวดราคา  เลขที่เอกสาร : " . $projectKey;
    $body = file_get_contents("./funcInviteVendorMail.php");

    $mail->addSubject($subjectEmail);
    $mail->addBody($body);
    $mail->addBody(htmlMail($projectSettingInfo, $dataSetting, $vendor, $newPassword));

    if ($_ENV["DEV"] === false) {
        $success = $mail->sending();

        if ($success == null) {
            $http->Forbidden(
                [
                    "err" => "ไม่สามารถส่ง email ได้ กรุณาลองใหม่",
                    "status" => 403
                ]
            );
        }
    }

    $mail->clearAddress();
    set_time_limit(15);

    $dataInsertRegister = [
        "price" => $priceEncrypt,
        "order" => 1,
        "vendor_project_id" => $vendor['vendor_project_id']
    ];
    $res = $sendService->insertVendorRegister($dataInsertRegister);
}

$sendService->commitTransaction();

$http->Ok([
    "data" => "success",
    "status" => 200
]);
