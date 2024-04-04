<?php

// Query project by project id
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingDatabase.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");

// import for authorize
include_once("../../middleware/authentication.php");
include("../authorize.php");

include("../../Template/SettingMailSend.php");
include("../calculatorTemplate.php");

include_once('./mails/funcMailCalculatorToVeirfy.php');

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$calculateService = new CalculateService();
$mail = new Mailing();


if ($_SERVER["REQUEST_METHOD"] != 'POST') {
    $http->MethodNotAllowed(
        [
            "err" => "link is not allow a method",
            "status" => 405
        ]
    );
}


//------------------------------------AUTH-----------------------------------
/**
 * GET token from SESSION in server side
 * 
 * @var string
 */
$token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;
if ($token === null) {
    $http->Unauthorize(
        [
            "err" => "your don't have a token",
            "status" => 401
        ]
    );
}

/**
 * 
 * Authorize from token and decode token 
 * 
 * @var object
 */
try {
    $tokenDecode = $enc->jwtDecode($token);
} catch (Exception $e) {
    $http->Unauthorize(
        [
            "err" => "token is unauthorize",
            "status" => 401
        ]
    );
}
//---------------------------------END---AUTH-----------------------------------


/**
 * for query a all data from body of method POST
 * @var array
 */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * get a data from formData
 */
$budget = $template->valVariable(isset($_POST["budget"]) ? $_POST["budget"] : null, "ราคากลาง"); //find a [ราคากลาง] from formData
$project_id = $template->valVariable(isset($_POST["pj_id"]) ? $_POST["pj_id"] : null, "Project ID"); //find a [ProjectId] from formData
$user_id = Authorize($project_id); //find a [userId] from access token 


/**
 * get a file data from FormData
 * 
 * @var array
 */
$BudgetFile = $template->valFile(isset($_FILES["auction_file"]) ? $_FILES["auction_file"] : null, "ไฟล์คำนวนราคากลาง");


/**
 * find a Manager for calculator in this project
 * 
 * @var array
 */
try {
    $calculatorManager = $calculateService->getRefPriceManagerByProjectAndUserWithRole($project_id, $user_id, 'calculator');
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}
if (!$calculatorManager) {
    $http->NotFound([
        "err" => "คุณไม่ใช่ calculator ในระบบ หรือ ตุณไม่มีสิทธิ์ในระบบนี้",
        "status" => 404
    ]);
}

/**
 * find a Budget Calculator in this project is have ?
 * 
 * @var array
 */
try {
    $budgetCalculator = $calculateService->getLatestBudgetCalculate($calculatorManager["id"]);
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}

/**
 * Check 3 validate for create
 */
if (
    $budgetCalculator &&
    $budgetCalculator["status_name"] !== "reject by verify" &&
    $budgetCalculator["status_name"] !== "reject by verify 2" &&
    $budgetCalculator["status_name"] !== "reject by approve 1"
) {
    $http->BadRequest([
        "err" => "ท่านได้เสนออนุมัติรายการดังกล่าวไปแล้ว",
        "status" => 404
    ]);
}


/**
 * find a project from database by project ID
 * 
 * @var array
 */
try {
    $project = $calculateService->getProjectById($project_id);
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}
if (!$project) {
    $http->BadRequest(
        [
            "err" => "ไม่พบโปรเจค กรุณาติดต่อ admin",
            "status" => 404
        ]
    );
}

/**
 * prepare a path for save a data file 
 */
$upload_path = '../../../projects/' . $project["key"] . '/';
$saveToDatabasePath = '/projects/' . $project["key"] . '/';
$fileExt = strtolower(pathinfo($BudgetFile["FileName"], PATHINFO_EXTENSION));
$filePath = $upload_path . 'Estimated_Price.' . $fileExt;
$databaseFilePath = $saveToDatabasePath . 'Estimated_Price.' . $fileExt;


/**
 * create a directory for project 
 */
if (!is_dir($upload_path)) {
    try {
        mkdir($upload_path, 0777, true);
    } catch (Exception $e) {
        $http->BadRequest([
            "err" => $e->getMessage(),
            "status" => 400
        ]);
    }
}

/**
 * move file temp to folder
 */
try {
    move_uploaded_file($BudgetFile["TempName"], $filePath);
} catch (Exception $e) {
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}

/**
 * get a budget status 'waiting verify'
 * 
 * @var array
 */
try {
    $budgetStatus = $calculateService->getBudgetStatusByName('waiting verify');
} catch (PDOException | Exception $e) {
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}
if (!$budgetStatus) {
    $http->BadRequest(
        [
            "err" => "ไม่พบสถานะ รอการตรวจสอบ กรุณาติดต่อ admin",
            "status" => 404
        ]
    );
}


/**
 * encryption a main price before saving
 */
$budgetEncrypt = $enc->apEncode($budget);

/**
 * prepare a data to array for save in database
 *
 * @var array
 */
$budgetCalculateData = [
    "manager_id" => $calculatorManager["id"],
    "budget_status_id" => $budgetStatus["id"],
    "budget" => $budgetEncrypt,
    "file_path" => $databaseFilePath
];

$calculateService->startTransaction();

/**
 * save a budget to database and return it to array
 * 
 * @var array
 * @param array $budgetCalculateData
 */
try {
    $budgetCalculateSuccess = $calculateService->createBudgetCalculates($budgetCalculateData);
} catch (PDOException | Exception $e) {
    // if have some error will rollback This transaction
    $calculateService->rollbackTransaction();
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}

$logData = [
    "action" => "สร้างหรือแก้ไขราคากลาง",
    "manager_id" => $calculatorManager["id"],
    "project_id" => $project["id"],
];
/**
 * save a log file for save a data when some one do something in database
 * 
 * @var array
 */
try {
    $logBudgetCalculate = $calculateService->createLogBudget($logData);
} catch (PDOException | Exception $e) {
    // if have some error will rollback This transaction
    $calculateService->rollbackTransaction();
    $calculateService->generateLog($_SERVER["PHP_SELF"], $e->getMessage());
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}


// commit a database
$calculateService->commitTransaction();

/**
 * find a manager in role verifier by project id 
 */
$verifier = $calculateService->getRefPriceManagerByProjectAndRole($project["id"], "verifier");
if (!$verifier) {
    $http->NotFound(
        [
            "err" => "not found a verifier in this project",
            "status" => 404
        ]
    );
}
/**
 * find a employee by user id for get email to sending
 */
$userEmployeeVerifier = $calculateService->getUserEmployeeByUserId($verifier["user_staff_id"]);
if (!$userEmployeeVerifier) {
    $http->NotFound(
        [
            "err" => "not found a employee",
            "status" => 404
        ]
    );
}

// $department = $calculateService->getDepartmentById($project["department"]);
// $project["department"] = $department["department_name"];

$projectKey = $project["key"];
$mail->sendTo($userEmployeeVerifier["email"]);
$subjectEmail = "โปรดตรวจสอบการคำนวณราคากลาง โครงการ" . $project["name"] . ' เลขที่เอกสาร ' . $project["key"];
$mail->addSubject($subjectEmail);

$bodyEmail = funcMailToVerifier(
    $project, $userEmployeeVerifier
);
$mail->addBody($bodyEmail);

//  when user is not scg
$mail->sendTo($userEmployeeVerifier["email"]);

/**
 * !when want to send a mail to some one
 */
$sendSuccess = false;
if ($_ENV["DEV"] == false) {
    $sendSuccess = $mail->sending();
}
$http->Ok(
    [
        "data" => $budgetCalculateSuccess,
        "verifier" => $userEmployeeVerifier["email"],
        "status" => 200
    ]
);