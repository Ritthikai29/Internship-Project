<?php

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
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}


//------------------------------------AUTH-----------------------------------
$tokenDecode = JWTAuthorize($enc, $http);
/**
 * extract user id from token
 * 
 * @var int
 */
$userId = $tokenDecode->userId;
//---------------------------------END---AUTH-----------------------------------




/**
 * decode a json of body from POST Method
 * 
 * @var array
 */
$body = json_decode(file_get_contents('php://input'), true);
$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "project Key");


// start transection 
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
            "err" => "not found a project",
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
if (!$user) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a user",
            "status" => 404
        ]
    );
}

/**
 * find a client manager by project id and user id 
 * 
 * @var array
 */
$managerClient = $approveService->getManagerByProjectIdAndUserId($project["id"], $user["id"]);
if (!$managerClient) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a manager client",
            "status" => 404
        ]
    );
}

$managerCalculator = $approveService->getManagerByProjectIdAndRoleName($project["id"], "calculator");

/**
 * get a calculator manager to find a latest budget calculator
 * 
 * @var array
 */
$latestBudget = $approveService->getBudgetCalculatorByRefId($managerCalculator["id"]);
if (!$latestBudget || ($latestBudget["status_name"] !== "waiting approve 2")) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "ไม่พบ หรือไม่อยู่ในสถานะรอการอนุมัติ",
            "status" => 404
        ]
    );
}

/**
 * find a latest verify of the project
 * 
 * @var array
 */
$verifyBudget = $approveService->getVerifyByBudgetId($latestBudget["id"]);
if (!$verifyBudget || $verifyBudget["verify"] != 1) {
    $approveService->rollbackTransaction();
    $http->NotFound([
        "err" => "ไม่พบข้อมูลการตรวจสอบสำเร็จ",
        "status" => 404
    ]);
}

/**
 * find a latest approve 1 of the project 
 * 
 * @var array
 */
$approve1Calculate = $approveService->getLatestApproveByVerifyId($verifyBudget["id"]);
if (!$approve1Calculate) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "ไม่พบการอนุมัติจากผู้อนุมัติ 1",
            "status" => 404
        ]
    );
}



/**
 * save a approve 2 to a table approve
 * 
 * @var array
 */
$prepare = [
    "ref_price_id" => $managerClient["id"],
    "approve" => 1,
    "submit_datetime" => date("Y-m-d H:i:s"),
    "approve1_cal_id" => $approve1Calculate["id"]
];
$approve2Calculate = $approveService->createApprove2Calculate($prepare);
if (!$approve2Calculate) {
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "ไม่สามารถอนุมัติการอนุมัติ 1 ได้",
            "status" => 404
        ]
    );
}


/**
 * find a approver 1 to find a approve of approver 1
 * 
 * @var array
 */
$approver1Manager = $approveService->getManagerByProjectIdAndRoleName($project["id"], "approver 1");
if (!$approver1Manager) {
    $http->NotFound(
        [
            "err" => "not found a approver 1",
            "status" => 404
        ]
    );
}

/** 
 * find a approve of the approve 1 to update price in the project 
 */
$approve1Calculate = $approveService->getApproveByVerifyIdAndApproverId($verifyBudget["id"], $approver1Manager["id"]);
if (!$approve1Calculate) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a approve calculate of approver 1",
            "status" => 404
        ]
    );
}

/**
 * get a sub price of approved 1 to save in project
 */
$subPriceApprove1 = $approveService->listApproveSubPriceByApproveId($approve1Calculate["id"]);

/**
 * for loop to save a sub price to project
 */
$subPriceProjects = [];
foreach ($subPriceApprove1 as $index => $value) {
    $prepare = [
        "project_id" => $project["id"],
        "detail" => $value["detail"],
        "price" => $value["new_price"] ? $value["new_price"] : $value["price"]
    ];
    try {
        $subPriceProject = $approveService->createSubPriceInProject($prepare);
    } catch (PDOException | Exception $e) {
        $approveService->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "cann't make a approve 2 in project",
                "status" => 404
            ]
        );
    }
    array_push($subPriceProjects, $subPriceProject);
}

/**
 * find a project status by name = "รอตรวจสอบเอกสาร"
 */
$projectStatus = $approveService->getProjectStatusByName("รอตรวจสอบเอกสาร");
if (!$projectStatus) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a project status",
            "status" => 404
        ]
    );
}

/**
 * update a project in case price and project status
 * 
 * @var array
 */
$prepare = [
    "price" => $approve1Calculate["price"],
    "cal_uri" => $latestBudget["calculate_file"],
    "status_id" => $projectStatus["id"],
    "project_id" => $project["id"]
];
$projectUpdated = $approveService->updateProjectPriceAndStatus($prepare);
if (!$projectUpdated) {
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "cannot update a project in database",
            "status" => 403
        ]
    );
}

/**
 * find a budget status to update a latest budget
 * status === "approve 2"
 */
$budgetStatus = $approveService->getBudgetStatusByName("approve 2");
if (!$budgetStatus) {
    $approveService->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "not found a status of budget in approve 2",
            "status" => 404
        ]
    );
}

/**
 * update a latest budget to approve 2
 */
$prepare = [
    "status_id" => $budgetStatus["id"],
    "budget_id" => $latestBudget["id"]
];
$latestBudgetUpdated = $approveService->updatelatestBudgetStatus($prepare);
if (!$latestBudgetUpdated) {
    $approveService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "can't update a latest budget status",
            "status" => 403
        ]
    );
}

/**
 * create a log for approve 2 is approve
 * 
 * @var array
 */
$logApprove = $approveService->createBudgetLog(
    [
        "project_id" => $project['id'],
        "manager_id" => $managerClient["id"],
        "action" => "ผู้อนุมัติ 2 อนุมัติราคากลาง"
    ]
);

$approveService->commitTransaction();

$listContractors = $approveService->listUserEmployeeInActivateByRoleName("Contractor");
if (!$listContractors) {
    $http->NotFound(
        [
            "data" => "not found a contractor in activate",
            "status" => 404
        ]
    );
}
require(__DIR__ . "/mails/funcMailApprove2AP.php");
foreach ($listContractors as $index => $constractor) {
    $mail->sendTo($constractor["email"]);
    $subjectEmail = 'การอนุมัติการคำนวณราคากลางจากผู้อนุมัติ 2 ได้อนุมัติ โครงการ' . $project["name"] . ' เลขที่เอกสาร ' . $project["key"] ;
    $mail->addSubject($subjectEmail);
    $bodyEmail = htmlMailApproveSuccess(
        $project,
        $constractor
    );
    $mail->addBody($bodyEmail);
    // ! When run on server and send email
    if ($_ENV["DEV"] == false) {
        $success = $mail->sending();
        if ($success === null) {
            $http->BadRequest(
                [
                    "err" => "ไม่สามารถส่งอีเมล์ได้",
                    "status" => 400
                ]
            );
        }
    }
    $mail->clearAddress();
}

// response to approve 2 
$http->Ok(
    [
        "data" => $approve2Calculate,
        "project" => $latestBudgetUpdated,
        "email" => $listContractors,
        "status" => 200
    ]
);