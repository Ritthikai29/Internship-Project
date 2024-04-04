<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include("./approveService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$approveService = new ApproveService();


if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * GET a project key from parameter GET[key]
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project Key");

$project = $approveService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project by key",
            "status" => 404
        ]
    );
}

$managerCalculator = $approveService->getManagerByProjectIdAndRoleName($project["id"], 'calculator');
if (!$managerCalculator) {
    $http->NotFound(
        [
            "err" => "not found a manager in role calculator",
            "status" => 404
        ]
    );
}

$latestBudget = $approveService->getBudgetCalculatorByRefId($managerCalculator["id"]);
if (!$latestBudget) {
    $http->NotFound(
        [
            "err" => "not found a latest budget calculator",
            "status" => 404
        ]
    );
}

$latestBudget["Budget"] = $enc->apDecode($latestBudget["Budget"]);

$budgetStatus = $approveService->getBudgetStatusById($latestBudget["Budget_status_id"]);
if (!$budgetStatus) {
    $http->NotFound(
        [
            "err" => "not found a budget status",
            "status" => 404
        ]
    );
}

if (
    $budgetStatus["status_name"] !== "verify" &&
    $budgetStatus["status_name"] !== "reject by approve 2" &&
    $budgetStatus["status_name"] !== "waiting approve 2"
) {
    $http->Forbidden(
        [
            "err" => "you is not allow to get this budget",
            "test" => $budgetStatus,
            "status" => 403
        ]
    );
}

// in case reject by approve 2
if ($budgetStatus["status_name"] === "reject by approve 2") {
    /**
     * find a approve 1 by project id and role name
     * @var array
     */
    $approve1Manager = $approveService->getManagerByProjectIdAndRoleName($project["id"], "approver 1");
    if (!$approve1Manager) {
        $http->NotFound(
            [
                "err" => "Not found a approver 1 manager",
                "status" => 404
            ]
        );
    }

    $budgetCalculateApprove1 = $approveService->getLatestApprovedByManagerId($approve1Manager["id"]);
    if (!$budgetCalculateApprove1) {
        $http->NotFound(
            [
                "err" => "Not found budget calculate approve 1",
                "status" => 404
            ]
        );
    }
    $data = [
        "price" => (float) $latestBudget["Budget"],
        "new_price" => $budgetCalculateApprove1["is_edit"] ? (float) $enc->apDecode($budgetCalculateApprove1["price"]) : null,
        "calculate_file" => $latestBudget["calculate_file"],
        "status_name" => $budgetStatus["status_name"],
    ];
    $subBudgets = $approveService->getSubPriceApproveByApproveId($budgetCalculateApprove1["id"]);
    if ($subBudgets) {
        foreach ($subBudgets as $index => $value) {
            if (!is_null($subBudgets[$index]["new_price"])) {
                $subBudgets[$index]["new_price"] = (float) $enc->apDecode($subBudgets[$index]["new_price"]);
            }
            $subBudgets[$index]["price"] = (float) $enc->apDecode($subBudgets[$index]["price"]);
            $subBudgets[$index]["name"] = $value["detail"];
            unset($subBudgets[$index]["detail"]);
        }
    }
    $data["sub_price"] = $subBudgets;
    $http->Ok(
        [
            "data" => $data,
            "status" => 200
        ]
    );

}


/**
 * find a sub budget 
 * 
 * @var array
 */
$subBudgets = $approveService->getSubbudgetByBudgetId($latestBudget["id"]);
if ($subBudgets) {
    foreach ($subBudgets as $index => $value) {
        $subBudgets[$index]["price"] = $enc->apDecode($subBudgets[$index]["price"]);
        $subBudgets[$index]["new_price"] = null;
    }
}
// if in case waiting a approver 2 verify
if($budgetStatus["status_name"] === "waiting approve 2"){
    /**
     * find a approve 1 by project id and role name
     * @var array
     */
    $approve1Manager = $approveService->getManagerByProjectIdAndRoleName($project["id"], "approver 1");
    if (!$approve1Manager) {
        $http->NotFound(
            [
                "err" => "Not found a approver 1 manager",
                "status" => 404
            ]
        );
    }
    $budgetCalculateApprove1 = $approveService->getLatestApprovedByManagerId($approve1Manager["id"]);
    if (!$budgetCalculateApprove1) {
        $http->NotFound(
            [
                "err" => "Not found budget calculate approve 1",
                "status" => 404
            ]
        );
    }
    $data = [
        "price" => (float) $latestBudget["Budget"],
        "new_price" => $budgetCalculateApprove1["is_edit"] ? (float) $enc->apDecode($budgetCalculateApprove1["price"]) : null,
        "calculate_file" => $latestBudget["calculate_file"],
        "status_name" => $budgetStatus["status_name"],
    ];
    $subBudgets = $approveService->getSubPriceApproveByApproveId($budgetCalculateApprove1["id"]);
    if ($subBudgets) {
        foreach ($subBudgets as $index => $value) {
            if (!is_null($subBudgets[$index]["new_price"])) {
                $subBudgets[$index]["new_price"] = (float) $enc->apDecode($subBudgets[$index]["new_price"]);
            }
            $subBudgets[$index]["price"] = (float) $enc->apDecode($subBudgets[$index]["price"]);
            $subBudgets[$index]["name"] = $value["detail"];
            unset($subBudgets[$index]["detail"]);
        }
    }
}

$latestBudget["sub_budget"] = $subBudgets;

$data = [
    "price" => (float) $latestBudget["Budget"],
    "new_price" => isset($budgetCalculateApprove1) ? $budgetCalculateApprove1["is_edit"] ? (float) $enc->apDecode($budgetCalculateApprove1["price"]) : null : null,
    "calculate_file" => $latestBudget["calculate_file"],
    "status_name" => $budgetStatus["status_name"],
    "sub_price" => $subBudgets
];

$http->Ok(
    [
        "data" => $data,
        "status" => 200
    ]
);



/**
 * return style
 * {
 *  data : {
 *      price: number ,
 *      new_price: number ,
 *      sub_price : [
 *      {
 *      detail : string,
 *      price: number ,
 *      new_price: string
 *      }     
 *      ]
 *   }
 * }
 */