<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");

include("./logTemplate.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();


$logService = new GetLogTemplate();

/**
 * Check a methods of the code
 */
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "This methods is not allows",
            "status" => 405
        ]
    );
}

/**
 * get a project by project key from body 
 * 
 * @var string
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");


/**
 * get all log of the project
 */
$logCalculate = $logService->getAllLogByProjectKey($projectKey);
$http->Ok(
    [
        "data" => $logCalculate,
        "status" => 200
    ]
);

/**
 * find a project by project key
 * 
 * @var array
 */
$project = $logService->getProjectByKey($projectKey);
// check project is found ? 
if (!$project) {
    // if project is not found
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

/**
 * List all of ref price manager in this project by project id
 * 
 */
$managers = $logService->listRefPriceManagers($project["id"]);
// check if not found a manager
if (!$managers) {
    // if not found a manager(s) n this project
    $http->NotFound(
        [
            "err" => "ืnot found a manager in this project",
            "status" => 404
        ]
    );
}

$ms = array();
$cms = count($managers);
/**
 * Loop for add a user and employee to manager
 * 
 * @var array
 */
for ($i = 0; $i < $cms; $i++) {
    /**
     * query a user by user staff id from manager
     * @var array
     */
    $userStaff = $logService->getUserStaffById($managers[(int) $i]["user_staff_id"]);
    // check user staff is found ?
    if (!$userStaff) {
        // if user is not found
        $http->NotFound(
            [
                "err" => "not found a user staff",
                "status" => 404
            ]
        );
    }

    /**
     * query employee by user id 
     * @var array
     */
    $employee = $logService->getEmployeeById($userStaff["employee_id"]);
    // check user staff is found ? 
    if (!$employee) {
        // if user is not found
        $http->NotFound(
            [
                "err" => "not found a employee",
                "status" => 404
            ]
        );
    }

    // merge a manager to recording
    $managers[(int) $i]["user_staff"] = $userStaff;
    $managers[(int) $i]["user_staff"]["employee"] = $employee;
    array_push($ms, $managers[(int) $i]);
}

/**
 * find a log from database 
 * 
 * @var array
 */
$logCalculates = $logService->listLogFromManagerListId($managers, $cms);


/**
 * This for loop is for merge log to manager and user and employee
 */
// for log calculates
for ($i = 0; $i < count($logCalculates); $i++) {
    // for managers merge 
    for ($j = 0; $j < count($ms); $j++) {
        // Check a log and manager is eq
        if ($ms[(int) $j]["id"] === $logCalculates[(int) $i]["Ref_price_Manager_id"]) {
            // merge log to manager
            $logCalculates[(int) $i]["Ref_price_Manager"] = $ms[(int) $j];
            break;
        }
    }
}

// Response a log to client
$http->Ok(
    [
        "data" => $logCalculates,
        "status" => 200
    ]
);