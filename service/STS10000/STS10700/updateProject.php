<?php
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");
include_once('../../Template/SettingDatabase.php');
include("./../../middleware/authentication.php");
include_once('../../Template/SettingMailSend.php');

include('./projectEditService.php');


$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$projectEditService = new ProjectEditService();

/**
 * PATCH METHOD 
 * send all data to this endpoint 
 */
if ($_SERVER["REQUEST_METHOD"] != 'POST') {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] method is not allows",
            "status" => 401
        ]
    );
}


//------------------------------------AUTH-----------------------------------
try {
    $tokenDecode = JWTAuthorize($enc, $http);
} catch (Exception $e) {
    $http->Unauthorize(
        [
            "err" => "token is unauthorize",
            "status" => 401
        ]
    );
}
//---------------------------------END---AUTH-----------------------------------
$user_id = $template->valVariable(isset($tokenDecode->userId) ? $tokenDecode->userId : null, "user ID"); //find a [userId] from access token 


/**
 * body from req PATCH method
 */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * Recive a data from Req body 
 * Update only Tor file, Job description file, division, department, project_type, job_type
 */
$projectKey = $template->valVariable(isset($_POST["project_key"]) ? $_POST["project_key"] : null, "project Key");
$projectName = $template->valVariable(isset($_POST["project_name"]) ? $_POST["project_name"] : null, "ขื่อโครงการ");
$divisionId = $template->valVariable(isset($_POST["division_id"]) ? $_POST["division_id"] : null, "division");
$departmentId = $template->valVariable(isset($_POST["department_id"]) ? $_POST["department_id"] : null, "department");
$projectTypeId = $template->valVariable(isset($_POST["project_type_id"]) ? $_POST["project_type_id"] : null, "project type");
$jobTypeId = $template->valVariable(isset($_POST["job_type_id"]) ? $_POST["job_type_id"] : null, "job type");

if (isset($_FILES["tor"])) {
    $torFile = $template->valFile($_FILES["tor"], "ไฟล์ tor");
}

if (isset($_FILES["job_description"])) {
    $jobFile = $template->valFile($_FILES["job_description"], "รายละเอียดโครงการ");
}

/**
 * 
 * GET Project By Key
 */
$project = $projectEditService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}
/**
 * check a project status is for update project
 */
$projectStatus = $projectEditService->getProjectStatusById($project["status_id"]);
if (!$projectStatus) {
    $http->NotFound(
        [
            "err" => "not found a project status from id",
            "status" => 404
        ]
    );
}
if ($projectStatus["status_name"] !== "ต้องแก้ไขเอกสาร") {
    $http->Forbidden(
        [
            "err" => "เอกสารไม่อยู่ในสถานะแก้ไข",
            "status" => 403
        ]
    );
}

$upload_path = '../../../projects/' . $project["key"];
$database = '/projects/' . $project["key"];

/**
 * upload a file to host local
 */
$torDatabase = $project["Tor_uri"];
if (isset($torFile)) {
    $fileExt = strtolower(pathinfo($torFile["FileName"], PATHINFO_EXTENSION));
    $torLocation = $upload_path . '/tor.' . $fileExt;
    $torDatabase = $database . '/tor.' . $fileExt;
}
/**
 * upload a file to host local
 */
$jobDatabase = $project["Job_description_uri"];
if (isset($jobFile)) {
    $fileExt = strtolower(pathinfo($jobFile["FileName"], PATHINFO_EXTENSION));
    $jobLocation = $upload_path . '/job-description.' . $fileExt;
    $jobDatabase = $database . '/job-description.' . $fileExt;
}

$projectEditService->startTransaction();


/**
 * find a status by id
 */
$projectStatusUpdate = $projectEditService->getProjectStatusByName("รอตรวจสอบเอกสาร");
if (!$projectStatusUpdate) {
    $projectEditService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a project status \" รอตรวจสอบเอกสาร \"",
            "status" => 404
        ]
    );
}

$dataUpdate = [
    "projectId" => $project["id"],
    "projectName" => $projectName,
    "divisionId" => $divisionId,
    "departmentId" => $departmentId,
    "projectTypeId" => $projectTypeId,
    "jobTypeId" => $jobTypeId,
    "tor" => $torDatabase,
    "jobDescription" => $jobDatabase,
    "projectStatusId" => $projectStatusUpdate["id"]
];

$projectUpdate = $projectEditService->updateProjectById($dataUpdate);
if (!$projectUpdate) {
    $projectEditService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "can't update a project",
            "status" => 403
        ]
    );
}

// move file to location
try {
    if(isset($torFile)){
        move_uploaded_file($torFile["TempName"], $torLocation);
    }
    if(isset($jobFile)){
        move_uploaded_file($jobFile["TempName"], $jobLocation);
    }
} catch (Exception $e) {
    $projectEditService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "can't send a file to server storage",
            "status" => 403
        ]
    );
}




// send a email to all contractor
$listContractor = $projectEditService->listUserStaffByRoleName("Contractor");
if(count($listContractor) === 0){
    $http->NotFound(
        [
            "err" => "ไม่พบรายชื่อคนที่เป็น Contractor",
            "status" => 404
        ]
    );
}
require(__DIR__ . "/mails/funcMailUpdateFile.php");
// for loop to add a email contractor for send a notification email

        $mail->sendTo($contractor["email"]);
        $mail->addSubject(
            "$projectUpdate[name] ได้รับการแก้ไขแล้ว กรุณาตรวจสอบโครงการ"
        );
        $mail->addBody(htmlMailUpdateFile($projectUpdate, $contractor));

        
    // $mail->sendTo($contractor["email"]);
    // $mail->addSubject(
    //     "$projectUpdate[name] ได้รับการแก้ไขแล้ว กรุณาตรวจสอบโครงการ"
    // );
    // $mail->addBody(htmlMailUpdateFile($projectUpdate,$projectUpdate,$contractor));
    // "<h1>รายการ $projectUpdate[name] รหัสโครงการ $projectUpdate[key] ได้รับการแก้ไขแล้ว</h1>"





$success = false; 
$success = $mail->sending();

if(!$success) {
    $projectEditService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "ไม่สามารถส่งอีเมล์ได้",
            "status" => 404
        ]
    );
}

$projectEditService->commitTransaction();

$http->Ok([
    "data" => $projectUpdate,
    "status" => 200
]);