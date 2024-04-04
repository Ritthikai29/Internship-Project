<?php
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingDatabase.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");

// import for authorize
include_once("../../middleware/authentication.php");
include("../authorize.php");
include("../calculatorTemplate.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$calculateService = new CalculateService();

/**
 * For security i will use a project key replace projectID
 */

if ($_SERVER["REQUEST_METHOD"] != 'GET')
    $http->MethodNotAllowed(
        [
            "err" => "link is not allow a method",
            "status" => 405
        ]
    );


/**
 * Get Project By Project Key from frontend
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, 'ไม่พบ Project Key');

/**
 * authorize a token user in role calculator of the project
 */
$userId = AuthorizeByKey();

/**
 * find a project by project Key
 * 
 * @var array
 */

$project = $calculateService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "Not Found a Project",
            "status" => 404
        ]
    );
}

/**
 * find a client manager is include in project
 */
$clientManager = $calculateService->getRefPriceManagerByProjectAndUser($project["id"], $userId);
if (!$clientManager || $clientManager["role_name"] !== "calculator") {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์เข้าถึงข้อมูลการปฏิเสธต่างๆ",
            "status" => 401
        ]
    );
}


/**
 * find a manager calculator from project id and role name
 * @var array
 */
$managerCalculator = $calculateService->getRefPriceManagerByProjectAndRole($project["id"], 'calculator');
if (!$managerCalculator) {
    $http->BadRequest([
        "err" => "NOT FOUND A CALCULATOR",
        "status" => 400
    ]);
}

/**
 * find a the budget calculator by calculator id
 * 
 * @var array
 */
$budgetCalculate = $calculateService->getLatestBudgetCalculate($managerCalculator['id']);
if (!$budgetCalculate) {
    $http->NotFound(
        [
            "data" => [
                "reason_id" => null,
                "comment" => null,
                "err" => "don't create a calculate budget"
            ],
            "status" => 404
        ]
    );
}

$reason = [];

/**
 * incase i have a reject from a verifier
 */
if ($budgetCalculate["status_name"] === "reject by verify") {
    /**
     * find a verifier by project id
     * @var array
     */

    $verifier = $calculateService->getRefPriceManagerByProjectAndRole($project["id"], 'verifier');
    if (!$verifier) {
        $http->BadRequest([
            "err" => "not found a verifier please contract a admin",
            "status" => 400
        ]);
    }

    /**
     * use a verifier for find a reject reason
     * 
     * @var array
     */

    $reasonVerify = $calculateService->getRejectReasonFromVerifierByRefId($verifier["id"]);
    if (!$reasonVerify) {
        $http->BadRequest([
            "err" => "not found a reason from verify reason please contract a admin",
            "status" => 400
        ]);
    }

    /**
     * find a reason by reason id'
     * 
     * @var array
     */
    $reasonData = $calculateService->getReasonById($reasonVerify["reason_id"]);

    $reason["reason_id"] = $reasonVerify["reason_id"];
    $reason["reason"] = $reasonData;
    $reason["comment"] = $reasonVerify["comment"];
    $reason["err"] = null;
    
}  elseif ($budgetCalculate["status_name"] === "reject by verify 2") {
    /**
     * find a verifier 2 by project id
     * @var array
     */

    $verifier = $calculateService->getRefPriceManagerByProjectAndRole($project["id"], 'verifier');
    if (!$verifier) {
        $http->BadRequest([
            "err" => "not found a verifier 2 please contract a admin",
            "status" => 400
        ]);
    }

    /**
     * use a verifier 2 for find a reject reason
     * 
     * @var array
     */

    $reasonVerify = $calculateService->getRejectReasonFromVerifierByRefId($verifier["id"]);
    if (!$reasonVerify) {
        $http->BadRequest([
            "err" => "not found a reason from verify reason please contract a admin",
            "status" => 400
        ]);
    }

    /**
     * find a reason by reason id'
     * 
     * @var array
     */
    $reasonData = $calculateService->getReasonById($reasonVerify["reason_id"]);

    $reason["reason_id"] = $reasonVerify["reason_id"];
    $reason["reason"] = $reasonData;
    $reason["comment"] = $reasonVerify["comment"];
    $reason["err"] = null;

} elseif ($budgetCalculate["status_name"] === "reject by approve 1") {
    /** 
     * find a approver 1 by role name 'approver 1' and project id
     * 
     * @var array
     */

    $approver1 = $calculateService->getRefPriceManagerByProjectAndRole($project["id"], 'approver 1');

    if (!$approver1) {
        $http->BadRequest([
            "err" => "not found a approver 1 please contract a admin",
            "status" => 400
        ]);
    }

    /**
     * use a approver 1 for find a reason in approve calculate
     */

    $reasonApprover = $calculateService->getRejectReasonFromApproveByRefId($approver1["id"]);

    /**
     * find a reason by reason id'
     * 
     * @var array
     */
    $reasonData = $calculateService->getReasonById($reasonApprover["reason_id"]);

    $reason["reason_id"] = $reasonApprover["reason_id"];
    $reason["reason"] = $reasonData;
    $reason["comment"] = $reasonApprover["comment"];
    $reason["err"] = null;

} else {
    $http->BadRequest([
        "err" => "this project, you can't be access because the status is not for you access",
        "status" => 400
    ]);
}

$http->Ok([
    "data" => $reason,
    "status" => 200
]);