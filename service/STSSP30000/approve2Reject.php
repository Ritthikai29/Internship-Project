<?php
// in this case is will run when approver 2 reject a approve 1
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
$mail = new Mailing();

$approveService = new ApproveService();


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
 * decode a json of body from POST Method
 * 
 * @var array
 */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * get a user id from a token 
 * 
 * @var int
 */
$userId = $tokenDecode->userId;

/**
 * get a project key from json data
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "โปรเจคคีย์");

/**
 * reason id from json data in body
 * 
 * @var string
 */
$reasonId = $template->valNumberVariable(isset($body["reason_id"]) ? $body["reason_id"] : null, "reason id");

/**
 * comment from json data in body
 */
$comment = $template->valNumberVariable(isset($body["comment"]) ? $body["comment"] : null, "comment");


/**
 * start transection
 */
$approveService->startTransaction();

/**
 * find a project by project key
 * 
 * @var array
 */
$project = $approveService->getProjectByKey($projectKey);
if (!$project) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a project by key",
            "status" => 404
        ]
    );
}

/**
 * find a user by userid
 * 
 * @var array
 */
$user = $approveService->getUserStaffById($userId);
if (!$user) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a user in project",
            "status" => 404
        ]
    );
}

/**
 * find a manager of client by user id and project id 
 * 
 * @var array
 */
$clientManager = $approveService->getManagerByProjectIdAndUserId($project["id"], $user["id"]);
if (!$clientManager) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "you haven't include in this project please contact to admin",
            "status" => 404
        ]
    );
}

/**
 * check you are a approver 2 ?
 */
if ($clientManager["role_name"] !== "approver 2") {
    $approveService->rollbackTransaction();
    $http->Unauthorize(
        [
            "err" => "you are not a approver 2",
            "status" => 401
        ]
    );
}

/**
 * find a manager of calculator in project by project id and key
 * 
 * @var array
 */
$managerCalculator = $approveService->getManagerByProjectIdAndRoleName($project["id"], "calculator");
if (!$managerCalculator) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "this project is not have manager calculator please contact admin if it wrong",
            "status" => 404
        ]
    );
}

/**
 * find a latest budget calculator to 
 * 1. check status of project 
 * 2. use to find a verify calculates
 */
$latestBudget = $approveService->getBudgetCalculatorByRefId($managerCalculator["id"]);
if (!$latestBudget || $latestBudget["status_name"] !== "waiting approve 2") {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "Not found a budget calculate or status is incorrect",
            "status" => 404
        ]
    );
}

/**
 * find a verify to use to create a approve 2 (for reject)
 */
$verifyBudget = $approveService->getVerifyByBudgetId($latestBudget["id"]);
if (!$verifyBudget) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a verify for this budget",
            "status" => 404
        ]
    );
}

/**
 * find a latest approve 1 of the project 
 * 
 * @var array
 */
$approve1Calculate = $approveService->getLatestApproveByVerifyId($verifyBudget["id"]);
if (!$approve1Calculate) {
    $http->NotFound(
        [
            "err" => "not found a approve from approve 1",
            "status" => 404
        ]
    );
}



/**
 * create a approve of approver 2 in this project
 * 
 * @var array
 */
$prepare = [
    "ref_price_id" => $clientManager["id"],
    "approve" => false,
    "submit_datetime" => date("Y-m-d H:i:s"),
    "approve1_cal_id" => $approve1Calculate["id"]
];
$approve2Created = $approveService->createApprove2Calculate($prepare);
if (!$approve2Created) {
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "approve 2 is created failed",
            "status" => 403
        ]
    );
}

/**
 * find a reason by id
 */
$reason = $approveService->getReasonById($reasonId);
if (!$reason) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a reason in project",
            "status" => 404
        ]
    );
}

/**
 * create a reject reason by approve2Created
 * 
 * @var array
 */
$rejectReason = $approveService->createApproveReject(
    [
        "approve_id" => $approve2Created["id"],
        "reason_id" => $reason["id"],
        "comment" => $comment,
        "again" => false
    ]
);
if (!$rejectReason) {
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "cannot create a reject reason in this project",
            "status" => 403
        ]
    );
}

/**
 * get a status of the latestBudget 
 * 
 * @var array
 */
$statusRejectA2 = $approveService->getBudgetStatusByName("reject by approve 2");
if (!$statusRejectA2) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a status reject by approve 2",
            "status" => 404
        ]
    );
}

/**
 * update a status of latest budget to reject by approve 2
 * 
 * @var array
 */
$latestBudgetUpdated = $approveService->updatelatestBudgetStatus(
    [
        "status_id" => $statusRejectA2["id"],
        "budget_id" => $latestBudget["id"]
    ]
);
if (!$latestBudgetUpdated) {
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "can't update a latest budget in this project",
            "status" => 403
        ]
    );
}



// send email to approver 1 for reject this
$approver1 = $approveService->getManagerByProjectIdAndRoleName($project["id"], "approver 1");
if (!$approver1) {
    $http->NotFound(
        [
            "err" => "นี้โครงการอะไรนะ....",
            "status" => 404
        ]
    );
}
$userEmployeeApprover1 = $approveService->getUserEmployeeInActivateByUserId($approver1["user_staff_id"]);
if (!$userEmployeeApprover1) {
    $http->NotFound(
        [
            "err" => "Not found a employee",
            "status" => 404
        ]
    );
}
require(__DIR__ . "/mails/funcMailApprove2RJ.php");
$mail->sendTo($userEmployeeApprover1["email"]);
// subject of the email
$subjectEmail = "แจ้งแก้ไข/ปฏิเสธ การอนุมัติการคำนวณราคากลางจากผู้อนุมัติ 2 โครงการ$project[name] เลขที่เอกสาร $project[key]";
$mail->addSubject($subjectEmail);
$bodyEmail = htmlMailApprove2RJ(
    $project,
    $userEmployeeApprover1
);
$mail->addBody($bodyEmail);

// ! sending a email
if ($_ENV["DEV"] == false) {
    $success = $mail->sending();
    if(!$success){
        $http->BadRequest(
            [
                "err" => "ไม่สามารถส่ง email ไปได้",
                "status" => 400
            ]
        );
    }
}

$prepareLog = [
    "log_action" => "ผู้อนุมัติ 2 ไม่อนุมัติราคากลาง",
    "manager_id" => $clientManager["id"],
    "project_id" => $project["id"],
    "reject_id" => $reason["id"],
    "reject_detail" => $comment
];
$logCreate = $approveService->createLogWithReject($prepareLog);
if(!$logCreate){
    $http->NotFound(
        [
            "err" => "ไม่สามารถสร้างได้",
            "status" => 404
        ]
    );
}


// if a user is ok (a reject approve 2 is success)
$approveService->commitTransaction();

$http->Ok(
    [
        "data" => [
            "approve" => $approve2Created,
            "email"=>$userEmployeeApprover1["email"],
            "reason" => $rejectReason
        ],
        "status" => 200
    ]
);