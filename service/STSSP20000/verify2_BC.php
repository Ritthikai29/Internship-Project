<?php

session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../middleware/authentication.php");

include_once(__DIR__ . "/verifyService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$service = new VerifyService();

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

/**
 * find a user from user id to check is have a this user ? 
 * 
 * @var array
 */
$user = $service->getUserStaffById($userId);
// check found a user staff
if (!$user) {
    // if not found a user
    $http->NotFound(
        [
            "err" => "not found a user",
            "status" => 404
        ]
    );
}


/**
* extract a body of POST method 
* 
* @var array
*/
$body = json_decode(file_get_contents('php://input'), true);
$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "project Key");
$reasonId = $template->valFilter(isset($body["reason_2_id"]) ? $body["reason_2_id"] : null);
$comment =(isset($body["comment_2"]) ? $body["comment_2"] : null);
$isVerify_2 = $template->valNumberVariable(isset($body["is_verify_2"]) ? $body["is_verify_2"] : null, "การยืนยัน");


/**
 * find a project by project key and will get a project array
 * 
 * @var array
 */
$project = $service->getProjectByKey($projectKey);
// check is found a project 
if (!$project) {
    // if not found a project 
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

$tokenDecode = JWTAuthorize($enc, $http);
$userId = isset($tokenDecode->userId) ? $tokenDecode->userId : null;
$clientManager = $service->getManagerByProjectIdAndUserId($project["id"], $userId);
if (!$clientManager || $clientManager["role_name"] != "verifier 2") {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์เข้าถึงโครงการนี้ เนื่องจากไม่ได้เป็น ผู้ตรวจสอบ 2 ในโครงการนี้",
            "status" => 401
        ]
    );
 }



/**
 * find a ref price manager in project by role = 'calculator'
 * 
 * @var array
 */
$managerCalculator = $service->getManagerByProjectIdAndRoleName($project["id"], 'calculator');
// check manager in role calculator is found
if (!$managerCalculator) {
    // if not found a calculator manager
    $http->NotFound(
        [
            "err" => "ไม่พบผู้คำนวณของโครงการนี้",
            "status" => 404
        ]
    );
}


/**
 * find the latest budget by managerCalculator id in this project
 * 
 * @var array
 */
$latestBudgetCalculate = $service->getBudgetCalculatorByRefId($managerCalculator["id"]);
// check is found a latest budget calculator 
if (!$latestBudgetCalculate) {
    // if not found a latest budget calculator
    $http->NotFound(
        [
            "err" => "ไม่พบราคากลางที่คำนวณล่าสุด",
            "status" => 404
        ]
    );
}
// check status is 'waiting verify 2' yep?
if ($latestBudgetCalculate["status_name"] !== 'waiting verify 2') {
    // if status is not a waiting verify 2
    $http->Forbidden(
        [
            "err" => "สถานะของราคากลางไม่เป็น \"รอตรวจสอบราคากลาง จากผู้ตรวจสอบ 2\"",
            "status" => 403
        ]
    );
}


/**
 * find the manager by project id and user id
 * 
 * @var array
 */
$managerVerify = $service->getManagerByProjectIdAndUserId($project["id"], $user["id"]);
// check manager verify is found yep ?
if (!$managerVerify) {
    // if found a manager verify
    $http->NotFound(
        [
            "err" => "คุณไม่ได้ถูกเพิ่มเป็นกลุ่มผู้คำนวณในโครงการนี้",
            "status" => 404
        ]
    );
}
// Check manager is a verifier?
if ($managerVerify["role_name"] !== "verifier 2") {
    // if this manager is not in role verifier
    $http->NotFound(
        [
            "err" => "คุณไม่ได้เป็นผู้ตรวจสอบ 2 คุณเป็น $managerVerify[role_name]",
            "status" => 404
        ]
    );
}

$service->startTransaction();

$verify = $service->updateVerifyByBudgetId($isVerify_2,$latestBudgetCalculate['id']);
// check is can't update?
if (!$verify) {
    $service->rollbackTransaction();
    $http->NotFound(
        [
            "err" => "ไม่สามารถอัพเดตข้อมูลการตรวจสอบครั้งที่ 2 ได้",
            "status" => 404
        ]
    );
}

if ((int) $isVerify_2 === 1) {

    $statusVerify = $service->getBudgetStatusByName('verify');
        // check is found a status verify?
        if (!$statusVerify) {
            // if status verify is not found
            $service->rollbackTransaction();
            $http->NotFound(
                [
                    "err" => "ไม่พบ status ตรวจสอบ กรุณาติดต่อ Admin",
                    "status" > 404
                ]
            );
        }
    
    // --------------------------------------------------------- LOG GENERATED ----------------------------------
    /**
     * Generate a calculate a log of the budget 
     * 
     * @var array
     */
    $logData = [
        "action" => "ผู้ตรวจสอบ 2 ยืนยันเสร็จสมบูรณ์",
        "manager_id" => $managerVerify["id"],
        "project_id" => $project["id"]
    ];
    $logCalculate = $service->createLogBudget($logData);
    // check log is can't generate
    if (!$logCalculate) {
        // if log can't be generate
        $service->rollbackTransaction();
        $http->BadRequest(
            [
                "err" => "log can't be generate",
                "status" => 400
            ]
        );
    }


     /**
    * update a status in latest budget to verify
    */
    $budgetUpdate = $service->updateStatusBudget($latestBudgetCalculate["id"], $statusVerify["id"]);
    // check budget can be update ?
    if (!$budgetUpdate) {
        // if budget is can't update
        $service->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "ไม่สามารถอัพเดต Budget ได้",
                "status" => 404
            ]
        );
    }


    $approver1 = $service->getManagerByProjectIdAndRoleName($project["id"], "approver 1");
        if (!$approver1) {
            $http->NotFound(
                [
                    "err" => "not found a approver 1",
                    "status" => 404
                ]
            );
        }

    $userEmployeeApprover1 = $service->getUserEmployeeByUserId($approver1["user_staff_id"]);
    if (!$userEmployeeApprover1) {
        $http->NotFound(
            [
                "err" => "not found a user employee",
                "status" => 404
            ]
        );
    }

    $mail->sendTo($userEmployeeApprover1["email"]);
    $subjectEmail = 'โปรดอนุมัติการคำนวณราคากลาง ชื่อโครงการ ' . $project["name"] . ' เลขที่ ' . $project["key"] ;
    $mail->addSubject($subjectEmail);
    require(__DIR__ . "/mails/funcApproveMail.php");
    $bodyEmail = htmlMailVerifierApprove($project, $userEmployeeApprover1);
    $mail->addBody($bodyEmail);

    // !sending mail to someone
    if ($_ENV["DEV"] == false) {
        $emailSuccess = $mail->sending();
    }
    $mail->clearAddress();
    
    $service->commitTransaction();

    // response verify to client is successful
    $http->Ok(
        [
            "data" => "ดำเนินการสำเร็จ",
            "approver_1_user" => $userEmployeeApprover1,
            "status" => 200
        ]
    );

} else {

    // in case user want to not verify_2 this project

    /**
     * Check a reason and comment in the code if not found shoud be return error
    */
    $template->valVariable($reasonId, "ท่านยังไม่ได้เลือกเหตุผล");
    $template->valVariable($comment, "ท่านยังไม่ได้แสดงความคิดเห็นเพิ่มเติม");

    /**
     * find a reason from reason id
     */
    $reason = $service->getReasonById($reasonId);
    // check is reason found ?
    if (!$reason) {
        // if Not found a reason in this project 
        // in now user should contract to admin because is easy to control database
        // ? in this case i should be user can create or contract admin???
        $http->NotFound(
            [
                "err" => "not found a reason please contract admin ?",
                "status" => 404
            ]
        );
    }


    $reject = $service->updateRejectFromVerify2ByBudgetId($reasonId, $comment, $latestBudgetCalculate['id']);
    // check is can't update?
    if (!$reject) {
        $service->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "ไม่สามารถอัพเดตข้อมูลการ reject จากผู้ตรวจสอบครั้งที่ 2 ได้",
                "status" => 404
            ]
        );
    }   

   
    $statusVerify = $service->getBudgetStatusByName('reject by verify 2');
        // check is found a status verify?
        if (!$statusVerify) {
            // if status verify is not found
            $service->rollbackTransaction();
            $http->NotFound(
                [
                    "err" => "ไม่พบ status ตรวจสอบ กรุณาติดต่อ Admin",
                    "status" > 404
                ]
            );
        }

    /**
     * Generate a calculate a log of the budget 
     * 
     * @var array
    */

    $logData = [
        "log_action" => "ได้รับการปฏิเสธจากผู้ตรวจสอบ 2",
        "manager_id" => $managerVerify["id"],
        "project_id" => $project["id"],
        "reject_id" => $reason["id"],
        "reject_detail" => $comment
    ];
    
    $logCalculate = $service->createLogWithReject($logData);
    // check log is can't generate
    if (!$logCalculate) {
        // if log can't be generate
        $service->rollbackTransaction();
        $http->BadRequest(
            [
                "err" => "log can't be generate",
                "status" => 400
            ]
        );
    }

    


    /**
    * update a status in latest budget to verify
    */
    $budgetUpdate = $service->updateStatusBudget($latestBudgetCalculate["id"], $statusVerify["id"]);
    // check budget can be update ?
    if (!$budgetUpdate) {
        // if budget is can't update
        $service->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "ไม่สามารถอัพเดต Budget ได้",
                "status" => 404
            ]
        );
    }

    


    $calculator = $service->getManagerByProjectIdAndRoleName($project["id"], "calculator");
    if (!$calculator) {
        $service->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "not found a approver 1",
                "status" => 404
            ]
        );
    }
    $userEmployeeCalculator = $service->getUserEmployeeByUserId($calculator["user_staff_id"]);
    if (!$userEmployeeCalculator) {
        $service->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "not found a user employee",
                "status" => 404
            ]
        );
    }

    require(__DIR__ . "/mails/funcRejectMailVerify.php");
    $msg = "ผู้ตรวจสอบ 2";
    $subjectEmail = "มีการปฏิเสธการคำนวณราคากลาง โครงการ" . $project["name"] . " เลขที่เอกสาร " . $project["key"] ;


    $mail->sendTo($userEmployeeCalculator["email"]);
    $mail->addSubject($subjectEmail);
    
    $bodyEmail = htmlMailVerifierReject(
        $project, $userEmployeeCalculator, $msg
    );
    $mail->addBody($bodyEmail);

    // !     // !sending mail to someone
    if($_ENV["DEV"] == false){
        $emailSuccess = $mail->sending();
    }
    $mail->clearAddress();
    
    $service->commitTransaction();

    // response verify to client is successful
    $http->Ok(
        [
            "data" =>  "ดำเนินการสำเร็จ",
            "calculate_user" => $userEmployeeCalculator,
            "status" => 200
        ]
    );

}

