<?php
// when a approver 1 need to reject to calculator
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include_once("../Template/SettingMailSend.php");

include("../middleware/authentication.php");

include("./approveService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$approveService = new ApproveService();
$mail = new Mailing();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

//------------------------------------AUTH-----------------------------------
$tokenDecode = JWTAuthorize($enc, $http);
//---------------------------------END---AUTH-----------------------------------

/**
 * extract a json of body from POST Method
 * 
 * @var array
 */
$body = json_decode(file_get_contents('php://input'), true);


/**
 * get a project key from json data
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "project Key");

/**
 * get a user ID from token extract
 * 
 * @var int
 */
$userId = $tokenDecode->userId;

/**
 * reason id from json data in body
 * 
 * @var string
 */
$reasonId = $template->valNumberVariable(isset($body["reason_id"]) ? $body["reason_id"] : null, "reason id");

if($reasonId== 0){
    // if role name is not a approver 1
    $http->Forbidden(
        [
            "err" => "ไม่พบเหตุผลในการปฏิเสธ",
            "status" => 403
        ]
    );
}
/**
 * comment from json data in body
 */
$comment = $template->valNumberVariable(isset($body["comment"]) ? $body["comment"] : null, "comment");

/**
 * check have a project ?
 * 
 * @var array
 */
$project = $approveService->getProjectByKey($projectKey);
// have a project ?
if(!$project){
    $http->NotFound(
        [
            "err" => "not found a project please contract to admin",
            "status" => 404
        ]
    );
}

/**
 * get a project status by id
 * 
 * @var array
 */
$projectStatus = $approveService->getProjectStatusById($project["status_id"]);
// Have a project status or project status != รอคำนวณราคากลาง?
if(!$projectStatus || $projectStatus["status_name"] !== "รอคำนวณราคากลาง"){
    // if not found a status or status is incorrect
    $http->NotFound(
        [
            "err" => "not found a status or wrong status | please contract admin if incorrect",
            "status" => 404
        ]
    );
}

/**
 * find a user by user id
 * 
 * @var array
 */
$user = $approveService->getUserStaffById($userId);
// have a user 
if(!$user){
    // not found a user 
    $http->Unauthorize(
        [
            "err" => "not found your user id please login again",
            "status" => 401
        ]
    );
}

/**
 * find a manager in project with role calculator for find a latest budget calculator
 * 
 * @var array
 */
$managerCalculator = $approveService->getManagerByProjectIdAndRoleName($project["id"], "calculator");
// have a manager in role calculator?
if(!$managerCalculator){
    // if not found a manager in role calculator
    $http->NotFound(
        [
            "err" => "not found a manager in role calculator please contract to admin",
            "status" => 404
        ]
    );
}

/**
 * find a [latest] budget calculator in this project
 */
$latestBudget = $approveService->getBudgetCalculatorByRefId($managerCalculator["id"]);
// check if not found a latest budget calculator or status is not for approver 1
if(!$latestBudget || ($latestBudget["status_name"] !== "verify" && $latestBudget["status_name"] !== "reject by approve 2")){
    // if not found or status is incorrect
    $http->NotFound(
        [
            "err" => "not found a budget or status is incorrect",
            "status" => 404
        ]
    );
}

/**
 * find a [latest] verify in this project 
 * 
 * @var array
 */
$latestVerify = $approveService->getVerifyByBudgetId($latestBudget["id"]);
if(!$latestVerify){
    // if not found a latest Verify with a verify
    $http->NotFound(
        [
            "err" => "don't have a verify in this budget | something is wrong please contract admin",
            "status" => 404
        ]
    );
}

/**
 * check a user is include to this project ?
 * 
 * @var array
 */
$managerClient = $approveService->getManagerByProjectIdAndUserId($project["id"], $user["id"]);
// have a manager client?
if(!$managerClient){
    $http->NotFound(
        [
            "err" => "not found a manager client | You not include to this project",
            "status" => 404
        ]
    );
}
// status is a approver 1?
if($managerClient["role_name"] !== "approver 1"){
    // if role name is not a approver 1
    $http->Forbidden(
        [
            "err" => "client manager role is incorrect",
            "status" => 403
        ]
    );
}

/**
 * start a transection for create a multiple table and can rollback if something is wrong
 */
$approveService->startTransaction();

/**
 * prepare data to create approve calculates
 * 
 * @var array
 */
$prepare = [
    "approve" => false,
    "price" => null,
    "verify_calculate_id" => $latestVerify["id"],
    "ref_price_managers_id" => $managerClient["id"],
    "is_edit" => false
];
$approveCreated = $approveService->createApproveCalculate($prepare);
if(!$approveCreated){
    // error to create a approve
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "cannot create a approve",
            "status" => 404
        ]
    );
}

/**
 * find a reason by id
 */
$reason = $approveService->getReasonById($reasonId);
// have a reason?
if(!$reason){
    // if not found a reason
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a reason | please contact to admin",
            "status" => 404
        ]
    );
}
/**
 * add a reject reason by approve id 
 * 
 * @var
 */
$prepare = [
    "approve_id" => $approveCreated['id'],
    "reason_id" => $reason["id"],
    "comment" => $comment,
    "again" => true
];
$rejectReason = $approveService->createApproveReject($prepare);
if(!$rejectReason){
    // if create is error
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "create a reject reason is failed",
            "status" => 404
        ]
        );
}

/**
 * find a budget status by name
 * 
 * @var array
 */
$budgetStatus = $approveService->getBudgetStatusByName("reject by approve 1");
if(!$budgetStatus){
    // if not found a budget status
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a budget status",
            "status" => 404
        ]
    );
}

$prepare = [
    "status_id" => $budgetStatus["id"],
    "budget_id" => $latestBudget["id"]
];
/**
 * update a latest budget calculates 
 * 
 * @var array
 */
$latestBudgetUpdated = $approveService->updatelatestBudgetStatus($prepare);
if(!$latestBudgetUpdated){
    // if update error
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "cannot update a latest budget",
            "status" => 403
        ]
    );
}


$prepare = [
    "project_id" => $project['id'],
    "manager_id" => $managerClient["id"],
    "log_action" => "ไม่อนุมัติราคากลางโดยผู้อนุมัติ 1",
    "reject_id" => $reason["id"],
    "reject_detail" => $comment
];

/**
 * generate a log of the project
 * 
 * @var array
 */
$logCalculate = $approveService->createLogWithReject($prepare);
if(!$logCalculate){
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "can't create a log budget in this projec | please contact to admin",
            "status" => 403
        ]
    );
}

$approveService->commitTransaction();

/**
 * * send a mail to calculator (For calculate again)
 */

$calculatorManager = $approveService->getManagerByProjectIdAndRoleName($project["id"], "calculator");
if(!$calculatorManager){
    $http->NotFound(
        [
            "err" => "ใครคำนวณมา...",
            "status" => 404
        ]
    );
}
require(__DIR__ . "/mails/funcMailApprove1RJ.php");
$userEmployeeCalculator = $approveService->getUserEmployeeInActivateByUserId($calculatorManager["user_staff_id"]);
$mail->sendTo($userEmployeeCalculator["email"]);
$subjectEmail = "แจ้งแก้ไข/ ปฏิเสธการอนุมัติการคำนวณราคากลางจากผู้อนุมัติ 1 ให้คำนวณราคาใหม่ของโครงการ$project[name] เลขที่เอกสาร $project[key]";
$mail->addSubject($subjectEmail);
$bodyEmail = htmlMailApproveReject($project, $userEmployeeCalculator);
$mail->addBody($bodyEmail);

// ! sending a email
if($_ENV["DEV"] == false){
    $mail->sending();
}


// if OK
$http->Ok(
    [
        "data" => [
            "approve" => $approveCreated,
            "reject" => $rejectReason,
            "log" => $logCalculate,
            "budget" => $latestBudgetUpdated
        ],
        "status" => 200
    ]
);