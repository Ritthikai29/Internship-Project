<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include("../middleware/authentication.php");
include("./middleware/authorize.php");
include_once("../Template/SettingMailSend.php");
include("./verifyService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$verifyService = new VerifyService();
$mail = new Mailing();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed([
        "err" => "this link method is not allow your method",
        "status" => 405
    ]);
}

/**
 * extract a body of POST method 
 * 
 * @var array
 */
$body = json_decode(file_get_contents('php://input'), true);

$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "project Key");

// For auth
$userId = AuthorizeByKey($projectKey);

$reasonId = $template->valFilter(isset($body["reason_id"]) ? $body["reason_id"] : null);
$comment =(isset($body["comment"]) ? $body["comment"] : null);
$isVerify = $template->valNumberVariable(isset($body["is_verify"]) ? $body["is_verify"] : null, "การยืนยัน");

/**
 * find a project by project key and will get a project array
 * 
 * @var array
 */
$project = $verifyService->getProjectByKey($projectKey);
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

/**
 * find a user from user id to check is have a this user ? 
 * 
 * @var array
 */
$user = $verifyService->getUserStaffById($userId);
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
 * find a ref price manager in project by role = 'calculator'
 * 
 * @var array
 */
$managerCalculator = $verifyService->getManagerByProjectIdAndRoleName($project["id"], 'calculator');
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
$latestBudgetCalculate = $verifyService->getBudgetCalculatorByRefId($managerCalculator["id"]);
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
// check status is 'waiting verify' yep?
if ($latestBudgetCalculate["status_name"] !== 'waiting verify') {
    // if status is not a waiting verify
    $http->Forbidden(
        [
            "err" => "สถานะของราคากลางไม่เป็น \"รอตรวจสอบราคากลาง\"",
            "status" => 403
        ]
    );
}

/**
 * find the manager by project id and user id
 * 
 * @var array
 */
$managerVerify = $verifyService->getManagerByProjectIdAndUserId($project["id"], $user["id"]);
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
if ($managerVerify["role_name"] !== "verifier") {
    // if this manager is not in role verifier
    $http->NotFound(
        [
            "err" => "คุณไม่ได้เป็นผู้ตวจสอบ คุณเป็น $managerVerify[role_name]",
            "status" => 404
        ]
    );
}

// Check have verifier_2 ?
$managerSecondVerify = $verifyService->getManagerByProjectIdAndRoleName($project['id'],'verifier 2');


// to case Is Verify in project
if ((int) $isVerify === 1) {
    // if client wnat verify this project

    /**
     * prepare verify = 1 and link ref price and budget calculate
     * 
     * @var array
     */
    
    $verifyService->startTransaction();

    if ($managerSecondVerify) {

        $employeeSecondVerify = $verifyService->getEmployeeByRefPriceManagersId($managerSecondVerify['id']);
        if (!$employeeSecondVerify) {
            // if found a manager verify_2
            $http->NotFound(
                [
                    "err" => "ไม่พบข้อมูลผู้ตรวจสอบ 2",
                    "status" => 404
                ]
            );
        }

        $saveData = [
            "verify" => $isVerify,
            "manager_verify" => $managerVerify,
            "budget_calculator" => $latestBudgetCalculate,
            "is_have_verify_2" => 1,
            "ref_verify_2" => $managerSecondVerify
        ];

        /**
         * save a data to database 
         * 
         * @var array
         */
        $verify = $verifyService->createVerify($saveData);
        // check is can be execute ?
        if (!$verify) {
            $verifyService->rollbackTransaction();
            $http->BadRequest(
                [
                    "err" => "ไม่สามารถสร้างข้อมูลการอนุมัติได้",
                    "status" => 400
                ]
            );
        }

        /**
         * find a status = 'verify'
         * 
         * @var array
         */
        $statusVerify = $verifyService->getBudgetStatusByName('waiting verify 2');
        // check is found a status verify?
        if (!$statusVerify) {
            // if status verify is not found
            $verifyService->rollbackTransaction();
            $http->NotFound(
                [
                    "err" => "ไม่พบ status ตรวจสอบ กรุณาติดต่อ Admin",
                    "status" > 404
                ]
            );
        }
    } 
    else {
        $saveData = [
            "verify" => $isVerify,
            "manager_verify" => $managerVerify,
            "budget_calculator" => $latestBudgetCalculate,
            "is_have_verify_2" => null,
            "ref_verify_2" => null
        ];

        /**
         * save a data to database 
         * 
         * @var array
         */
        $verify = $verifyService->createVerify($saveData);
        // check is can be execute ?
        if (!$verify) {
            $verifyService->rollbackTransaction();
            $http->BadRequest(
                [
                    "err" => "ไม่สามารถสร้างข้อมูลการอนุมัติได้",
                    "status" => 400
                ]
            );
        }

         /**
         * find a status = 'verify'
         * 
         * @var array
         */
        $statusVerify = $verifyService->getBudgetStatusByName('verify');
        // check is found a status verify?
        if (!$statusVerify) {
            // if status verify is not found
            $verifyService->rollbackTransaction();
            $http->NotFound(
                [
                    "err" => "ไม่พบ status ตรวจสอบ กรุณาติดต่อ Admin",
                    "status" > 404
                ]
            );
        }
    }
    
    /**
     * update a status in latest budget to verify
    */
    $budgetUpdate = $verifyService->updateStatusBudget($latestBudgetCalculate["id"], $statusVerify["id"]);
    // check budget can be update ?
    if (!$budgetUpdate) {
        // if budget is can't update
        $verifyService->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "ไม่สามารถอัพเดต Budget ได้",
                "status" => 404
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
        "action" => "ผู้ตรวจสอบ 1 ยืนยันเสร็จสมบูรณ์",
        "manager_id" => $managerVerify["id"],
        "project_id" => $project["id"]
    ];
    $logCalculate = $verifyService->createLogBudget($logData);
    // check log is can't generate
    if (!$logCalculate) {
        // if log can't be generate
        $verifyService->rollbackTransaction();
        $http->BadRequest(
            [
                "err" => "log can't be generate",
                "status" => 400
            ]
        );
    }

    $verifyService->commitTransaction();

    if($managerSecondVerify){

        $mail->sendTo($employeeSecondVerify["email"]);
        require(__DIR__ . "/mails/funcMailCalculatorToVerify2.php");
        $mail->addSubject('โปรดตรวจสอบการคำนวณราคากลาง ชื่อโครงการ' . $project["name"] . ' เลขที่เอกสาร ' . $project['key']);
        $mail->addBody(funcMailToSecondVerifier($project, $employeeSecondVerify));

        if ($_ENV["DEV"] == false) {
            $success = $mail->sending();
            if (!$success) {
                $http->BadRequest(
                    [
                        "err" => "ไม่สามารถส่งอีเมล์ได้",
                        "status" => 400
                    ]
                );
            }
            $mail->clearAddress();
        }

        // response verify to client is successful
         $http->Ok(
            [
                "data" => $verify,
                "email" => $employeeSecondVerify["email"],
                "status" => 200
            ]
        );
    }
    else {

        $approver1 = $verifyService->getManagerByProjectIdAndRoleName($project["id"], "approver 1");
        if (!$approver1) {
            $http->NotFound(
                [
                    "err" => "not found a approver 1",
                    "status" => 404
                ]
            );
        }

        $userEmployeeApprover1 = $verifyService->getUserEmployeeByUserId($approver1["user_staff_id"]);
        if (!$userEmployeeApprover1) {
            $http->NotFound(
                [
                    "err" => "not found a user employee",
                    "status" => 404
                ]
            );
        }

        $mail->sendTo($userEmployeeApprover1["email"]);
        $subjectEmail = 'โปรดอนุมัติการคำนวณราคากลาง โครงการ' . $project["name"] . ' เลขที่เอกสาร ' . $project["key"];
        $mail->addSubject($subjectEmail);
        require(__DIR__ . "/mails/funcApproveMail.php");
        $bodyEmail = htmlMailVerifierApprove($project, $userEmployeeApprover1);
        $mail->addBody($bodyEmail);

        // !sending mail to someone
        if ($_ENV["DEV"] == false) {
            $emailSuccess = $mail->sending();
        }

         // response verify to client is successful
        $http->Ok(
            [
                "data" => $verify,
                "email" => $userEmployeeApprover1["email"],
                "status" => 200
            ]
        );
    }

}
else {
    // in case user want to not verify this project

    /**
     * Check a reason and comment in the code if not found shoud be return error
     */
    $template->valVariable($reasonId, "ท่านยังไม่ได้เลือกเหตุผล");
    $template->valVariable($comment, "ท่านยังไม่ได้แสดงความคิดเห็นเพิ่มเติม");

    /**
     * find a reason from reason id
     */
    $reason = $verifyService->getReasonById($reasonId);
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


    /**
     * prepare verify = 1 and link ref price and budget calculate
     * 
     * @var array
     */
    $saveData = [
        "verify" => $isVerify,
        "manager_verify" => $managerVerify,
        "budget_calculator" => $latestBudgetCalculate,
        "reason_id" => $reason["id"],
        "comment" => $comment
    ];
    $verifyService->startTransaction();
    /**
     * save a data to database 
     * 
     * @var array
     */
    $verify = $verifyService->createVerify($saveData);
    // check is can be create ?
    if (!$verify) {
        $verifyService->rollbackTransaction();
        $http->BadRequest(
            [
                "err" => "cannot create a verify to database",
                "status" => 400
            ]
        );
    }

    /**
     * find a status = 'verify'
     * 
     * @var array
     */
    $statusVerify = $verifyService->getBudgetStatusByName('reject by verify');
    // check is found a status verify?
    if (!$statusVerify) {
        // if status verify is not found
        $verifyService->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "not found a status 'reject by verify' please contract to admin",
                "status" > 404
            ]
        );
    }
    /**
     * update the status of latest budget calculate to reject by verify
     * 
     */
    $budgetUpdate = $verifyService->updateStatusBudget($latestBudgetCalculate["id"], $statusVerify["id"]);
    if (!$budgetUpdate) {
        $verifyService->rollbackTransaction();
        $http->BadRequest([
            "err" => "can't be update a status of the budget",
            "sataus" => 400
        ]);
    }


    // --------------------------------------------------------- LOG GENERATED ----------------------------------

    /**
     * Generate a calculate a log of the budget 
     * 
     * @var array
     */
    $logData = [
        "log_action" => "ได้รับการปฏิเสธจากผู้ตรวจสอบ 1",
        "manager_id" => $managerVerify["id"],
        "project_id" => $project["id"],
        "reject_id" => $reason["id"],
        "reject_detail" => $comment
    ];
    $logCalculate = $verifyService->createLogWithReject($logData);
    // check log is can't generate
    if (!$logCalculate) {
        // if log can't be generate
        $verifyService->rollbackTransaction();
        $http->BadRequest(
            [
                "err" => "log can't be generate",
                "status" => 400
            ]
        );
    }

    $verifyService->commitTransaction();

    $calculator = $verifyService->getManagerByProjectIdAndRoleName($project["id"], "calculator");
    if (!$calculator) {
        $http->NotFound(
            [
                "err" => "not found a approver 1",
                "status" => 404
            ]
        );
    }
    $userEmployeeCalculator = $verifyService->getUserEmployeeByUserId($calculator["user_staff_id"]);
    if (!$userEmployeeCalculator) {
        $http->NotFound(
            [
                "err" => "not found a user employee",
                "status" => 404
            ]
        );
    }


    $mail->sendTo($userEmployeeCalculator["email"]);
    $subjectEmail = " มีการปฏิเสธการคำนวณราคากลาง โครงการ" . $project["name"] . " เลขที่เอกสาร " . $project["key"] ;
    $msg = "ผู้ตรวจสอบ 1";
    $mail->addSubject($subjectEmail);
    require(__DIR__ . "/mails/funcRejectMailVerify.php");
    $bodyEmail = htmlMailVerifierReject(
        $project, $userEmployeeCalculator, $msg 
    );
    $mail->addBody($bodyEmail);

    // !     // !sending mail to someone
    if($_ENV["DEV"] == false){
        $emailSuccess = $mail->sending();
    }

    // response verify to client is successful
    $http->Ok(
        [
            "data" => $verify,
            "email" => $userEmployeeCalculator["email"],
            "status" => 200
        ]
    );
}