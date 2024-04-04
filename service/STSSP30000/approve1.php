<?php
// in this case is will run when user client approve this project
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include("../middleware/authentication.php");

include_once("../Template/SettingMailSend.php");
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
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}


//------------------------------------AUTH-----------------------------------
$tokenDecode = JWTAuthorize($enc, $http);
// extract user id from token extract
$userId = $tokenDecode->userId;
//---------------------------------END---AUTH-----------------------------------


/**
 * decode a json of body from POST Method
 * 
 * @var array
 */
$body = json_decode(file_get_contents('php://input'), true);

$projectKey = $template->valVariable(isset($body["project_key"]) ? $body["project_key"] : null, "โปรเจคคีย์");
$price = $template->valNumberVariable(isset($body["price"]) ? $body["price"] : null, "is haven't a approve price");
$isEdit = $template->valNumberVariable(isset($body["is_edit"]) ? $body["is_edit"] : null, "is have editing");

$reasonedit = isset($body["reasonedit"]) ? $body["reasonedit"] : null;
  //for test
    // $http->Ok(
    //     [
    //         "data" =>  $logGenerate,
    //         "status" => 200
    //     ]
    // );


/**
 * get a sub Price from body 
 * 
 * @var array will be like in this style => '[{ "detail":"bigData", "price" : 300}]' (in content/json)
 */
$subPrices = isset($body["sub_prices"]) ? $body["sub_prices"] : null;


/**
 * To check the role of a user client is a Manager in this project right?
 * 
 * Get a project for find project id
 * @var array
 */
$project = $approveService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project by project_key",
            "status" => 404
        ]
    );
}

/**
 * find a user from user id of token user id
 * 
 * @var array
 */
$user = $approveService->getUserStaffById($userId);

/**
 * find a manager of the client to chek a role is a approver 1 yep?
 * 
 * @var array
 */
$managerClient = $approveService->getManagerByProjectIdAndUserId($project["id"], $user["id"]);
// check a manager is a role approver 1
if (!$managerClient || $managerClient["role_name"] !== "approver 1") {
    // if not found a manager client or role is not correct 
    $http->Unauthorize(
        [
            "err" => "you haven't permission to this project",
            "status" => 401
        ]
    );
}

/**
 * find a manager of a calculator in this project to find a latest budget calculator 
 * 
 * @var array
 */
$managerCalculator = $approveService->getManagerByProjectIdAndRoleName($project["id"], "calculator");

/**
 * find a latest budget calculates from manager calculator
 * 
 * @var array
 */
$latestBudget = $approveService->getBudgetCalculatorByRefId($managerCalculator["id"]);

if ($price < 500000) {
    // check a status of latest budget calculates
    if (!$latestBudget) {
        // if not found or status is wrong
        $http->NotFound(
            [
                "err" => "not found a latest budget in status",
                "status" => 404
            ]
        );
    }

    

    /**
     * find a verify of the project by budget calculates id 
     * 
     * @var array
     */
    $verifyBudget = $approveService->getVerifyCalculatesByBudgetId($latestBudget["id"]);
    // check a verify is have ?
    if (!$verifyBudget) {
        // if not found a verify budget 
        $http->NotFound(
            [
                "err" => "not found a verify budget in this project",
                "status" => 404
            ]
        );
    }

    /**
     * create a prepare to save in database stsbidding_approve_calculates
     * 
     * @var array
     */
    $prepareApprove = [
        "approve" => true,
        "price" => $enc->apEncode($price),
        "verify_calculate_id" => $verifyBudget["id"],
        "ref_price_managers_id" => $managerClient["id"],
        "is_edit" => $isEdit
    ];



    /**
     * save to database "stsbidding_approve_calculates"
     * 
     * @var array
     */
    try {
        $approveCalculate = $approveService->createApproveCalculate($prepareApprove);
    } catch (PDOException | Exception $e) {
        $approveService->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "cannot create this database",
                "status" => 404
            ]
        );
    }

   /**
     * is have a sub price in this project yep?
     */
    $subPriceArrays = [];
    $subPriceCount = is_null($subPrices) ? 0 : count($subPrices);
    if ($subPriceCount !== 0) {
        // check a sub price is have
        foreach ($subPrices as $key => $value) {
            // loop to create a table to approve subprice
            $detailFilter = $template->valFilter($value["name"]);
            $priceFilter = $template->valFilter(isset($value["price"]) ? $value["price"] : null);
            $newPriceFilter = $template->valFilter(isset($value["new_price"]) ? $value["new_price"] : null);
            $prepareSubPrice = [
                "detail" => $detailFilter,
                "price" => !is_null($priceFilter) ? $enc->apEncode($priceFilter) : null,
                "new_price" => !is_null($newPriceFilter) ? $enc->apEncode($newPriceFilter) : null,
                "approve_id" => $approveCalculate["id"]
            ];
            try {
                $subPriceCreated = $approveService->createApproveSubBudget($prepareSubPrice);
            } catch (PDOException | Exception $e) {
                $approveService->rollbackTransaction();
                $http->NotFound(
                    [
                        "err" => "cannot create a sub budget",
                        "f" => $e->getMessage(),
                        "status" => 404
                    ]
                );
            }
            array_push($subPriceArrays, $subPriceCreated);
        }
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
        "price" => $approveCalculate["price"],
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
     * status === "approve 1"
     */
    $budgetStatus = $approveService->getBudgetStatusByName("approve 1");
    if (!$budgetStatus) {
        $approveService->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "not found a status of budget in approve 1",
                "status" => 404
            ]
        );
    }

    /**
     * update a latest budget to approve 1
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
     * create a log for approve 1 is approve
     * 
     * @var array
     */
    if(( $reasonedit === null) || ($reasonedit['reason_id'] === null)){
        $logGenerate = [
            "project_id" => $project["id"],
            "manager_id" => $managerClient["id"],
            "action" => "ผู้อนุมัติ 1 อนุมัติราคากลาง"
        ];
    
     }else{
    
        
        $logGenerate = [
            "project_id" => $project["id"],
            "manager_id" => $managerClient["id"],
            "action" => "ผู้อนุมัติ 1 อนุมัติและมีการแก้ไขราคากลาง",
            "reject_result_id" => $reasonedit['reason_id'],
            "reject_detail" => $reasonedit['comment']
        ];
         
    };
    $logApprove = $approveService->createBudgetLog($logGenerate);

    $listContractors = $approveService->listUserEmployeeInActivateByRoleName("Contractor");
    if (!$listContractors) {
        $http->NotFound(
            [
                "data" => "not found a contractor in activate",
                "status" => 404
            ]
        );
    }
    require(__DIR__ . "/mails/funcMailApprove1AP2Success.php");
    foreach ($listContractors as $index => $constractor) {
        $mail->sendTo($constractor["email"]);
        $subjectEmail = 'การอนุมัติการคำนวณราคากลางจากผู้อนุมัติ 1 ได้อนุมัติ โครงการ' . $project["name"] . ' เลขที่เอกสาร ' . $project["key"] ;
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
    // response to approve 1
    $http->Ok(
        [
            "data" => $approveCalculate,
            "project" => $latestBudgetUpdated,
            "email" => $listContractors,
            "status" => 200
        ]
    );
} else {
    // check a status of latest budget calculates
    if (!$latestBudget || ($latestBudget["status_name"] !== "verify" && $latestBudget["status_name"] !== "reject by approve 2")) {
        // if not found or status is wrong
        $http->NotFound(
            [
                "err" => "not found a latest budget in status verify or reject by approve2 ",
                "status" => 404
            ]
        );
    }

    /**
     * find a verify of the project by budget calculates id 
     * 
     * @var array
     */
    $verifyBudget = $approveService->getVerifyCalculatesByBudgetId($latestBudget["id"]);
    // check a verify is have ?
    if (!$verifyBudget) {
        // if not found a verify budget 
        $http->NotFound(
            [
                "err" => "not found a verify budget in this project",
                "status" => 404
            ]
        );
    }


    /**
     * find a approver 2 in this project is have?
     * 
     * @var array
     */
    $managerApprover2 = $approveService->getManagerByProjectIdAndRoleName($project["id"], 'approver 2');
    // check is found a approver 2 is found?
    $approveService->startTransaction();
    if (!$managerApprover2) {
        // *if not found a approver 2

        /**
         * create a prepare to save in database stsbidding_approve_calculates
         * 
         * @var array
         */
        $prepareApprove = [
            "approve" => true,
            "price" => $enc->apEncode($price),
            "verify_calculate_id" => $verifyBudget["id"],
            "ref_price_managers_id" => $managerClient["id"],
            "is_edit" => $isEdit
        ];

        /**
         * save to database "stsbidding_approve_calculates"
         * 
         * @var array
         */
        try {
            $approveCalculate = $approveService->createApproveCalculate($prepareApprove);
        } catch (PDOException | Exception $e) {
            $approveService->rollbackTransaction();
            $http->NotFound(
                [
                    "err" => "cannot create this database",
                    "status" => 404
                ]
            );
        }
    } else {
        // *if found a approver 2
        /**
         * create a prepare to save in database stsbidding_approve_calculates
         * 
         * @var array
         */
        $prepareApprove = [
            "approve" => false,
            "price" => $enc->apEncode($price),
            "verify_calculate_id" => $verifyBudget["id"],
            "ref_price_managers_id" => $managerClient["id"],
            "is_edit" => $isEdit
        ];

        /**
         * save to database "stsbidding_approve_calculates"
         * 
         * @var array
         */
        try {
            $approveCalculate = $approveService->createApproveCalculate($prepareApprove);
        } catch (PDOException | Exception $e) {
            $approveService->rollbackTransaction();
            $http->NotFound(
                [
                    "err" => "cannot create this database in case not have a approver 2",
                    "status" => 404
                ]
            );
        }
    }

    /**
     * is have a sub price in this project yep?
     */
    $subPriceArrays = [];
    $subPriceCount = is_null($subPrices) ? 0 : count($subPrices);
    if ($subPriceCount !== 0) {
        // check a sub price is have
        foreach ($subPrices as $key => $value) {
            // loop to create a table to approve subprice
            $detailFilter = $template->valFilter($value["name"]);
            $priceFilter = $template->valFilter(isset($value["price"]) ? $value["price"] : null);
            $newPriceFilter = $template->valFilter(isset($value["new_price"]) ? $value["new_price"] : null);
            $prepareSubPrice = [
                "detail" => $detailFilter,
                "price" => !is_null($priceFilter) ? $enc->apEncode($priceFilter) : null,
                "new_price" => !is_null($newPriceFilter) ? $enc->apEncode($newPriceFilter) : null,
                "approve_id" => $approveCalculate["id"]
            ];
            try {
                $subPriceCreated = $approveService->createApproveSubBudget($prepareSubPrice);
            } catch (PDOException | Exception $e) {
                $approveService->rollbackTransaction();
                $http->NotFound(
                    [
                        "err" => "cannot create a sub budget in case not have a approver 2",
                        "f" => $e->getMessage(),
                        "status" => 404
                    ]
                );
            }
            array_push($subPriceArrays, $subPriceCreated);
        }
    }

    /**
     * check is found a approver 2 in this project
     */
    if (!$managerApprover2) {
        // *if not found a approver 2
        /**
         * 1. check a sub price is found?
         *  1.1 if found add a sub price to this code 
         * 2. find a project status in this code
         * 3. update project (price, status)
         */

        // 1. check this project is have a sub price
        $projectSubPrices = [];
        if ($subPriceCount !== 0) {
            // 1.1
            foreach ($subPrices as $index => $value) {
                $prepareData = [
                    "project_id" => $project["id"],
                    "detail" => $value["detail"],
                    "price" => $value["new_price"] ? $enc->apEncode($value["new_price"]) : $enc->apEncode($value["price"])
                ];
                try {
                    $projectSubPrice = $approveService->createSubPriceInProject($prepareData);
                } catch (PDOException | Exception $e) {
                    $approveService->rollbackTransaction();
                    $http->NotFound(
                        [
                            "err" => "cannot create a sub budget in case not have a approver 2",
                            "except" => $e,
                            "status" => 404
                        ]
                    );
                }
                array_push($projectSubPrices, $projectSubPrice);
            }
        }
        // 2.
        $projectStatus = $approveService->getProjectStatusByName("รอตรวจสอบเอกสาร");

        // 3. update 
        $prepareUpdateProject = [
            "price" => $approveCalculate["price"],
            "cal_uri" => $latestBudget["calculate_file"],
            "status_id" => $projectStatus["id"],
            "project_id" => $project["id"]
        ];
        $updateProject = $approveService->updateProjectPriceAndStatus($prepareUpdateProject);
        if (!$updateProject) {
            $approveService->rollbackTransaction();
            $http->BadRequest(
                [
                    "err" => "cannot update this project",
                    "status" => 400
                ]
            );
        }

        $approve1Status = $approveService->getBudgetStatusByName("approve 1");
        if (!$approve1Status) {
            $approveService->rollbackTransaction();
            $http->NotFound(
                [
                    "err" => "not found a status in project",
                    "status" => 404
                ]
            );
        }
        /**
         * update a latest budget status to approve 1
         */
        $prepareBudgetUpdate = [
            "status_id" => $approve1Status["id"],
            "budget_id" => $latestBudget["id"]
        ];
        $budgetUpdated = $approveService->updatelatestBudgetStatus($prepareBudgetUpdate);
        if (!$budgetUpdated) {
            $approveService->rollbackTransaction();
            $http->BadRequest(
                [
                    "err" => "cann't update a latest budget status",
                    "status" => 400
                ]
            );
        }



        // * send mail part in case not found approver 2
        /**
         * send to all Contractor for notification to verify
         */
        $listContractors = $approveService->listUserEmployeeInActivateByRoleName("Contractor");
        if (!$listContractors) {
            $http->NotFound(
                [
                    "data" => "not found a contractor in activate",
                    "status" => 404
                ]
            );
        }
        require(__DIR__ . "/mails/funcMailApprove1AP2Success.php");
        foreach ($listContractors as $index => $constractor) {
            $mail->sendTo($constractor["email"]);
            $subjectEmail = 'การอนุมัติการคำนวณราคากลางจากผู้อนุมัติ 1 ได้อนุมัติ โครงการ' . $project["name"] . ' เลขที่เอกสาร ' . $project["key"] ;
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
    } else {
        // *in case have a approver 2 in this project

        /**
         * in this case approve is will be not change to project
         * budget status will be change to waiting approver 2 
         */
        $waitingApprove2 = $approveService->getBudgetStatusByName("waiting approve 2");
        if (!$waitingApprove2) {
            // if not found a status waiting approve 2
            $approveService->rollbackTransaction();
            $http->NotFound(
                [
                    "err" => "not found a status waiting approve 2",
                    "status" => 404
                ]
            );
        }
        /**
         * update a latest budget status to approve 1
         */
        $prepareBudgetUpdate = [
            "status_id" => $waitingApprove2["id"],
            "budget_id" => $latestBudget["id"]
        ];
        $budgetUpdated = $approveService->updatelatestBudgetStatus($prepareBudgetUpdate);
        if (!$budgetUpdated) {
            $approveService->rollbackTransaction();
            $http->BadRequest(
                [
                    "err" => "cann't update a latest budget status",
                    "status" => 400
                ]
            );
        }



        // *send mail part in case found approver 2
        // send a mail to approver 2 to approve this
        $approver2Id = $managerApprover2["user_staff_id"];
        $userEmployeeApprover2 = $approveService->getUserEmployeeInActivateByUserId($approver2Id);
        if (!$userEmployeeApprover2) {
            $http->NotFound(
                [
                    "err" => "not found a approver 2 employee",
                    "status" => 404
                ]
            );
        }
        require(__DIR__ . "/mails/funcMailApprove1AP2Approve2.php");
        $mail->sendTo($userEmployeeApprover2["email"]);
        $subjectEmail = 'โปรดอนุมัติการคำนวณราคากลาง โครงการ' . $project["name"] . ' เลขที่ ' . $project["key"] ;
        $mail->addSubject($subjectEmail);
        $bodyEmail = htmlMailAp1AP2Ap2($project, $userEmployeeApprover2);
        $mail->addBody($bodyEmail);
        // ! When run on server and send email
        if ($_ENV["DEV"] == false) {
            $mail->sending();
        }
    }

    /**
     * prepare a log variable
     * 
     * @var array
     */
    if(( $reasonedit === null) || ($reasonedit['reason_id'] === null)){
        $logGenerate = [
            "project_id" => $project["id"],
            "manager_id" => $managerClient["id"],
            "action" => "ผู้อนุมัติ 1 อนุมัติราคากลาง"
        ];
    
     }else{
    
        
        $logGenerate = [
            "project_id" => $project["id"],
            "manager_id" => $managerClient["id"],
            "action" => "ผู้อนุมัติ 1 อนุมัติและมีการแก้ไขราคากลาง",
            "reject_result_id" => $reasonedit['reason_id'],
            "reject_detail" => $reasonedit['comment']
        ];
         
    };


    // Log generate
    $logBudgetCalculate = $approveService->createBudgetLog($logGenerate);
    if (!$logBudgetCalculate) {
        $approveService->rollbackTransaction();
        $http->BadRequest(
            [
                "err" => "cannot create a log to thid project",
                "status" => 400
            ]
        );
    }

    $approveService->commitTransaction();

    $http->Ok(
        [
            "data" => [
                "project" => isset($updateProject) ? $updateProject : null,
                "approve" => $approveCalculate,
                "sub_price" => $subPriceArrays,
                "budget_updated" => $budgetUpdated
            ],
            "status" => 200
        ]
    );
}
