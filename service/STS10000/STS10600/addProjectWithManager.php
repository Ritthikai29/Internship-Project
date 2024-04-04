<?php
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");
include("../../Template/SettingMailSend.php");
include('./TemplateProject.php');
include_once('./mails/funcMailToCalculator.php');
$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();
$mail = new Mailing();

$projectService = new ProjectService();

// authorization
$auth = new Userauth();
$token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;
// check authorization
try {
    $decode = $enc->jwtDecode($token);
    if ($decode === null) {
        $http->Unauthorize(
            [
                "err" => "your token is expired or invalid",
                "status" => 401
            ]
        );
    }
} catch (Exception $e) {
    $http->Unauthorize(
        [
            "err" => "your token is expired",
            "status" => 401
        ]
    );
}


// function code
if ($_SERVER["REQUEST_METHOD"] != 'POST') {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);
// will get userid from token 
$userId = $decode->userId;

// get from POST
/**
 * no [price] but have any 
 */
// ! SEND BY DataForm
$projectTypeId = $template->valVariable(isset($_POST["projectTypeId"]) ? $_POST["projectTypeId"] : null, "project Type Id");
$projectJobTypeId = $template->valVariable(isset($_POST["projectJobTypeId"]) ? $_POST["projectJobTypeId"] : null, "project Job Type Id");
$affiliationId = $template->valVariable(isset($_POST["affiliationId"]) ? $_POST["affiliationId"] : null,"affiliation");
$departmentId = $template->valVariable(isset($_POST["affiliationId"]) ? $_POST["affiliationId"] : null, "department");
$divisionId = $template->valVariable(isset($_POST["affiliationId"]) ? $_POST["affiliationId"] : null, "division");
$projectName = $template->valVariable(isset($_POST["projectName"]) ? $_POST["projectName"] : null, "project Name");

// Calculator
$calculatorCode = $template->valVariable(isset($_POST["calculator_id"]) ? $_POST["calculator_id"] : null, "Emp Code Cal");
$verifierCode = $template->valVariable(isset($_POST["verifier_id"]) ? $_POST["verifier_id"] : null, "Emp Code Verifier");
$approver1Code = $template->valVariable(isset($_POST["approver_id"]) ? $_POST["approver_id"] : null, "Emp Code Approver 1");

// (optional)
$approver2Code = $template->valFilter(isset($_POST["approver2_id"]) ? $_POST["approver2_id"] : null);
$verifier2Code = $template->valFilter(isset($_POST["verifier2_id"]) ? $_POST["verifier2_id"] : null);

//  GET FILE FROM FORMDATA
$torFile = $template->valFile($_FILES["tor"], "ไฟล์ TOR");
$jobDescriptionFile = $template->valFile($_FILES["jobDescription"], "ไฟล์รายละเอียดของงาน");

$affiliationName = $template->valVariable(isset($_POST["affiliationName"]) ? $_POST["affiliationName"] : null, "ชื่อสังกัด");
// 1. getUserByID
try {
    $addUser = $projectService->getUserStaffByUserId($userId);
} catch (PDOException | Exception $e) {
    $http->BadRequest(["err" => $e]);
}
// check if not found ?
if (!$addUser) {
    $http->BadRequest(["err" => "not found a user from userID"]);
}
// check a add user id a duplicate to all managers?
$userManager = [
    "calculator" => $calculatorCode,
    "verifier" => $verifierCode,
    "verifier 2" => $verifier2Code,
    "approver 1" => $approver1Code,
    "approver 2" => $approver2Code,
];
foreach ($userManager as $role => $manager) {
    if($manager == $addUser["employeeNO"]){
        $http->Forbidden(
            [
                "err" => "คุณมีการเพิ่มตัวคุณเอง กรุณาแก้ไข",
                "status" => 403
            ]
        );
    }
}


// 2. find project Type By id
$projectType = $projectService->getProjectTypeById($projectTypeId);
// check if not found ?
if (!$projectType) {
    $http->BadRequest([
        "err" => "not found a project type",
        "status" => 400
    ]);
}

// 3. find project job types By id
$projectJobType = $projectService->getProjectJobTypeById($projectJobTypeId);
// check if not found ?
if (!$projectJobType) {
    $http->BadRequest([
        "err" => "not found a project Job Type",
        "status" => 400
    ]);
}

// 4. find department By id
$department = $projectService->getDepartmentById($departmentId);
if (!$department) {
    $http->BadRequest([
        "err" => "not found a department",
        "status" => 400
    ]);
}

// 5. find division by id
$division = $projectService->getDivisionById($divisionId);
if (!$division) {
    $http->BadRequest([
        "err" => "not found a division",
        "status" => 400
    ]);
}

// 6. find affitiation by id
$affiliation = $projectService-> getAffiliationByName($affiliationName);
if (!$affiliation) {
    $http->BadRequest(["err" => "ไม่พบข้อมูลสังกัด"]);
}

// 7. find Project status
$status = $projectService->getProjectStatusByName('รอคำนวณราคากลาง');


// ! ในช่วง ADD Manager เราจะต้อง เช็คก่อนว่า User คนนี้ กับโปรเจค ID นี้ เคยถูกแอดไปแล้วหรือยัง 
// ! ถ้าเคยแล้วไม่ควรเพิ่มได้ 

// 7. Generate Project Key

$folderOld = scandir('../../../projects');
// echo(var_dump($folderOld));
// check if project is have will re runing
do {
    function generateRandomString($length = 10) {
        $characters = '0123456789';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }
    $projectKey = generateRandomString(7);
} while (in_array( $projectKey, $folderOld));

// 8. Save file to server
$upload_path = '../../../projects/' . $projectKey;
$database_path = '/projects/' . $projectKey;
// 1. file tor
$fileExt = strtolower(pathinfo($torFile["FileName"], PATHINFO_EXTENSION));
$torLocation = $upload_path . '/tor.' . $fileExt;
$torDatabase = $database_path . '/tor.' . $fileExt;

// 2. job-description file
$fileExt = strtolower(pathinfo($jobDescriptionFile["FileName"], PATHINFO_EXTENSION));
$jobLocation = $upload_path . '/job-description.' . $fileExt;
$jobDatabase = $database_path . '/job-description.' . $fileExt;


// 9. save Data to database

// start Transection
$projectService->startTransaction();

// prepare Data
$data = [
    "projectKey" => $projectKey,
    "projectName" => $projectName,
    "price" => null,
    // File Location
    "tor" => $torDatabase,
    "jobDescription" => $jobDatabase,
    "priceLocation" => null,
    // Relations 
    "userStaffId" => $addUser["id"],
    "divisionId" => $affiliation["id"],
    "departmentId" => $affiliation["id"],
    "affiliationId" => $affiliation["id"],
    "projectTypeId" => $projectType["id"],
    "jobTypeId" => $projectJobType["id"],
    "statusId" => $status["id"],
    "full_affiliation" => "",
    "projectUnitPrice" => ""
];
// insert to db
try {
    $projectInserted = $projectService->insertProject($data);
} catch (PDOException | Exception $e) {
    $projectService->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
    $http->BadRequest(["err" => $e->getMessage()]);
}

// 10. INSERT Manager to Table

// prepared a user for inserted to Ref price manager
$userManager = [
    "calculator" => $calculatorCode,
    "verifier" => $verifierCode,
    "verifier 2" => $verifier2Code,
    "approver 1" => $approver1Code,
    "approver 2" => $approver2Code,
];



$userManagerResponse = [];

foreach ($userManager as $userRole => $userCode) {

    if ($userRole == "approver 2" && $userCode == null) {
        continue;
    }
    if ($userRole == "verifier 2" && $userCode == null) {
        continue;
    }

    // Calculator 
    // Find a role calculator
    $role = $projectService->findManagerRole($userRole);
    // Check is have ?
    if (!$role) {
        $projectService->rollbackTransaction();
        $http->BadRequest(["err" => "not Found a $userRole role"]);
    }
    // Find a calculator from User Staff
    $user = $projectService->getUserStaffByEmployeeNO($userCode);

    if (!$user) {
        $projectService->rollbackTransaction();
        $http->BadRequest(["err" => "not found a $userRole user"]);
    }

    // check is have ?
    // RPM = ref_price_managers
    $check = $projectService->findRPMByUidAndPJID($user["user_staff_id"], $projectInserted["id"]);
    if ($check) {
        $projectService->rollbackTransaction();
        $http->BadRequest(["err" => "พนักงานคนนี้เคยถูกเพิ่มไปแล้ว หรือคุณเพิ่มพนักงานซ้ำ"]);
    }
    // prepare Data
    $data = [
        "userStaffId" => $user["user_staff_id"],
        "projectId" => $projectInserted["id"],
        "managerRoleId" => $role["id"]
    ];
    
    $rpmInserted = $projectService->addRefPriceManager($data);
    if(! $rpmInserted){
        $projectService->rollbackTransaction();
        $http->NotFound([
            "err" => "cannot insert this project user",
            "status" => 400
        ]);
    }

    $userManagerResponse[$userRole] = $rpmInserted;
    if($userRole === "calculator"){
        $calculator = $user;
    }
}


$projectInserted["manager"] = $userManagerResponse;
$res = $projectInserted;


// Create a Dir
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

// move file from temp file
try {  
    move_uploaded_file($torFile["TempName"], $torLocation);
    move_uploaded_file($jobDescriptionFile["TempName"], $upload_path . '/job-description.' . $fileExt);
} catch (Exception $e) {
    $projectService->rollbackTransaction();
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}
$departmentProject = $projectService->getDepartmentById($projectInserted["department"]);
$projectInserted["department"] = $departmentProject["department_name"];
$projectInserted["full_affiliation"] = $affiliation["SECTION"] . ' / ' . $affiliation["department_name"] . ' / '. $affiliation["SUBSECTION"] . ' / '. $affiliation["division_name"];
$mail->sendTo($calculator["email"]);
$mail->addSubject("โปรดคำนวณราคากลาง โครงการ$projectName เลขที่เอกสาร $projectKey");
// Body Waiting p'Ake writing the email
$mail->addBody(
    htmlMailProjectCreate(
        $projectInserted, $calculator
    )
);
$emailSuccess = false;
if($_ENV["DEV"] == false){
    $emailSuccess = $mail->sending();
}

$projectService->commitTransaction();


$http->Ok(
    [
        "data" => $res,
        "email" => $calculator["email"],
        "success" => $emailSuccess,
        "status" => 200
    ]
);
