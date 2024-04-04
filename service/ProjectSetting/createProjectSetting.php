<?php
session_start();
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../middleware/authentication.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once("./projectSettingService.php");
define("FILEURI", "/STSBidding/projectSetting");
// ini_set('display_errors', 1);

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$projectSettingService = new ProjectSettingService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}
/**
 * authentication 
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


$projectId = isset($_POST["project_id"]) ? $_POST["project_id"] : null;
$projectId = $template->valVariable($projectId, "ไอดีโครงการ");


$datetimeStart = isset($_POST["datetime_start"]) ? $_POST["datetime_start"] : null;
$datetimeStart = new Datetime($datetimeStart);
$datetimeStart = date('Y-m-d H:i:s', $datetimeStart->getTimestamp());
// file_put_contents('mylog.log', $datetimeStart . "\n", FILE_APPEND);


$datetimeEnd = isset($_POST["datetime_end"]) ? $_POST["datetime_end"] : null;
$timeEnd = isset($_POST["time_end"]) ? $_POST["time_end"] : null;
$datetimeEnd = $datetimeEnd . ' ' . $timeEnd;
$datetimeEnd = new Datetime($datetimeEnd);
$datetimeEnd = date('Y-m-d H:i:s', $datetimeEnd->getTimestamp());


$detailTime = isset($_POST["date_details"]) ? $_POST["date_details"] : null;
if (!$detailTime) {
    $http->BadRequest(
        [
            "err" => "ไม่ได้ระบุวันที่รับฟังคำชี้แจงจากหน่วยงานต้นสังกัด",
            "status" => 400
        ]
    );
}
$timeDetail = isset($_POST["time_details"]) ? $_POST["time_details"] : null;
if (!$detailTime) {
    $http->BadRequest(
        [
            "err" => "ไม่ได้ระบุเวลารับฟังคำชี้แจงจากหน่วยงานต้นสังกัด",
            "status" => 400
        ]
    );
}
$detailTime = $detailTime . ' ' . $timeDetail;
$detailTime = new Datetime($detailTime);
$detailTime = date('Y-m-d H:i:s', $detailTime->getTimestamp());

$depositMoney = isset($_POST["deposit_money"]) ? $_POST["deposit_money"] : null;
$depositMoney = $template->valVariable($depositMoney, "เงินประกันซอง");



/**
 * find a project by project id
 */
$project = $projectSettingService->getProjectbyId($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project by projectId ",
            "status" => 404
        ]
    );
}

/**
 * check all vendor is more than 5 yep?
 */
$listVendorProjectApproveds = $projectSettingService->listVendorProjectHasApproveByProjectId($projectId);
if (!$listVendorProjectApproveds || count($listVendorProjectApproveds) < 5) {
    // when vendor is not found or less than 5 vendor approve in project
    $http->BadRequest(
        [
            "err" => "not found a vendor in list or vendor is less than 5",
            "status" => 400
        ]
    );
}



/**
 * start transection of the code
 */
$projectSettingService->startTransaction();

/**
 * find a approver is have a person
 */
$approverId = isset($_POST["approver"]) ? $_POST["approver"] : null;
$approverId = $template->valVariable($approverId, "ผู้อนุมัติ");

$approver = $projectSettingService->getUserStaffById($approverId);
if (!$approver) {
    // if approver is not found
    $http->NotFound(
        [
            "err" => "not found a approver ",
            "status" => 404
        ]
    );
}

$coordinatorId = isset($_POST["coordinator"]) ? $_POST["coordinator"] : null;
$coordinatorId = $template->valVariable($coordinatorId, "ผู้ประสานงานโครงการ");
$coordinator = $projectSettingService->getUserStaffById($coordinatorId);
if (!$coordinator) {
    // if approver is not found
    $http->NotFound(
        [
            "err" => "not found a coordinator ",
            "status" => 404
        ]
    );
}

$job_type = isset($_POST["job_type"]) ? $_POST["job_type"] : null;
$job_type = $template->valVariable($job_type, "ประเภทงาน");



/**
 * prepare a data of the project
 */
$data = [
    "start_datetime" => $datetimeStart,
    "end_datetime" => $datetimeEnd,
    "deposit_money" => $depositMoney,
    "approver_id" => $approver["id"],
    "approve" => null,
    "detail_datetime" => $detailTime,
    "coordinator_id" => $coordinator["id"],
    "project_id" => $projectId,
    "creator_id" => $userId,
    "job_type" => $job_type,
    "is_approver_send" => 1,

];
//echo(var_dump($data));
$projectSetting = $projectSettingService->createProjectSetting($data);
if (!$projectSetting) {
    $http->NotFound(
        [
            "err" => "can't create this project setting",
            "status" => 404
        ]
    );
}
$fileInputs = [];
foreach ($_FILES as $FILE) {
    $fileObject = $template->valFile($FILE, $FILE["name"]);
    $fileObject["Name"] = $FILE["name"];
    array_push($fileInputs, $fileObject);
}
/**
 * upload file to server and database
 */
$fileButton = ""; // to add in email for send
/**
 * delete old file from database
 */
$deleteFileSuccessed = $projectSettingService->deleteFileByProjectSettingId($projectSetting["id"]);
if (!$deleteFileSuccessed) {
    $projectSettingService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "can't delete old data from database",
            "status" => 400
        ]
    );
}

if(empty($fileInputs)){
    $data = [
        "file_uri" => "",
        "file_name" => "",
        "project_setting_id" => $projectSetting["id"]
    ];
    $fileSaved = $projectSettingService->createProjectSettingFile($data);
    if (!$fileSaved) {
        $projectSettingService->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "can't create file",
                "status" => 403
            ]
        );
    }
}
foreach ($fileInputs as $file) {
    $uploadUriPath = "../../projectSetting/$project[key]/";
    $uploadUriFile = $uploadUriPath . $file["FileName"];
    $uploadUriFileDatabase = FILEURI . "/$project[key]/" . $file["FileName"];
    /**
     * save a data to database before save file (when some thing wrong is mean file will not save to database)
     */
    $data = [
        "file_uri" => $uploadUriFileDatabase,
        "file_name" => $file["Name"],
        "project_setting_id" => $projectSetting["id"]
    ];
    $fileSaved = $projectSettingService->createProjectSettingFile($data);
    if (!$fileSaved) {
        $projectSettingService->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "can't create file",
                "status" => 403
            ]
        );
    }
    /**
     * create a directory for project 
     */
    if (!is_dir($uploadUriPath)) {
        try {
            mkdir($uploadUriPath, 0777, true);
        } catch (Exception $e) {
            $http->BadRequest(["err" => $e->getMessage()]);
        }
    }
    /**
     * move temp file to file location
     */
    try {
        move_uploaded_file($file["TempName"], $uploadUriFile);
    } catch (Exception $e) {
        $projectSettingService->rollbackTransaction();
        $http->BadRequest([
            "err" => $e->getMessage(),
            "status" => 400
        ]);
    }
}

$projectStatus = $projectSettingService->getProjectStatusByName(
    "รออนุมัติส่งหนังสือเชิญ"
);
$data = [
    "pj_id" => $project["id"],
    "status_id" => $projectStatus["id"]
];
$projectStatusUpdate = $projectSettingService->updateProjectStatusById(
    $data
);
if (!$projectStatusUpdate) {
    $http->Forbidden(
        [
            "data" => "can't update project status",
            "status" => 403
        ]
    );
}

$vendorProject = $projectSettingService->listVendorsHasApproveByProjectId($project["id"]);
$projectSettingInfo = $projectSettingService->getProjectSettingByProjectId($project["id"]);

$mdEmail = $projectSettingService->getMDemail();
/**
 * send email to ผจส for approve project setting 
 */
require(__DIR__ . "/mails/funcMailCreatePjSet.php");
$mail->sendTo($approver["email"]);
$mail->sendCc($mdEmail["email"]);
$mail->addSubject("โปรดอนุมัติหนังสือเชิญ โครงการ$projectSettingInfo[name] เลขที่เอกสาร $projectSettingInfo[key]");
$mail->addBody(htmlMailSendToApprover($projectSettingInfo, $vendorProject, $approver));

if (!$_ENV["DEV"]) {
    $success = $mail->sending();
    if (!$success) {
        $http->BadRequest(
            [
                "err" => "ไม่สามารถส่ง Email ได้",
                "status" => 400
            ]
        );
    }
}


$projectSettingService->commitTransaction();

$http->Ok(
    [
        "date" => "success",
        "status" => 200 
    ]
);