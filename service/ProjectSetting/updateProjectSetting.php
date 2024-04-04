<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include_once('../Template/SettingDatabase.php');
include("./../middleware/authentication.php");

include_once("./projectSettingService.php");


$http = new Http_Response();
$template = new Template();
$enc = new Encryption();

$projectSettingService = new ProjectSettingService();


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

$body = json_decode(file_get_contents('php://input'), true);

/**
 * Recive a data from Req body 
 * Update only Tor file, Job description file, division, department, project_type, job_type
 */
$projectKey = $template->valVariable(isset($_POST["project_key"]) ? $_POST["project_key"] : null, "Project Key");
$endDateTime = $template->valVariable(isset($_POST["end_datetime"]) ? $_POST["end_datetime"] : null, "EndDateTime");
$depositMoney = $template->valVariable(isset($_POST["deposit_money"]) ? $_POST["deposit_money"] : null, "DepositMoney");

/**
 * GET Project By Key
 */
$project = $projectSettingService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

$projectSettingService->startTransaction();

$dataUpdate = [
    "project_id" => $project["id"],
    "end_datetime" => $endDateTime,
    "deposit_money" => $depositMoney
];

$projectUpdate = $projectSettingService->updateProjectSettingDateByProjectId($dataUpdate);
if (!$projectUpdate) {
    $projectEditService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "can't update a project",
            "status" => 403
        ]
    );
}

$projectSettingService->commitTransaction();

// Convert the end_datetime to a standard PHP DateTime object
$endDateTime = new DateTime($projectUpdate['end_datetime']);

$projectUpdate['end_date'] = $endDateTime->format('d/m/Y');
$projectUpdate['end_time'] = $endDateTime->format('H:i:s');

// Get Creator Info
$creatorInfo = $projectSettingService->getCreatorById((int)$project['id']);

$projectUpdate['creator_name'] = $creatorInfo['nametitle_t'].' '.$creatorInfo['firstname_t'].' '.$creatorInfo['lastname_t'];

$http->Ok([
    "updateData" => $projectUpdate,
    "status" => 200
]);