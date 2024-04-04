<?php
session_start();
// Header
include("../../Template/SettingApi.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");
include('./TemplateProject.php');
include("../../Template/SettingMailSend.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$mail = new Mailing();
$projectService = new ProjectService();

// authorization

$auth = new Userauth();
$token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;

// Check token validate?
try {
    $decode = $enc->jwtDecode($token);
} catch (Exception $e) {
    $http->Unauthorize(["err" => "your token is expired"]);
}

// check permission
// ! Not verify user in this role


// function code
if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

// Decode all data
$body = json_decode(file_get_contents('php://input'), true);

// get userid from access token
$userId = $decode->userId;

// ! SEND BY DataForm
$projectTypeId = $template->valFilter(
    isset($_POST["projectTypeId"]) ? $_POST["projectTypeId"] : null
);
$projectJobTypeId = $template->valFilter(
    isset($_POST["projectJobTypeId"]) ? $_POST["projectJobTypeId"] : null
);
$departmentId = $template->valFilter(
    isset($_POST["affiliationId"]) ? $_POST["affiliationId"] : null
);
$divisionId = $template->valFilter(
    isset($_POST["affiliationId"]) ? $_POST["affiliationId"] : null
);
$affiliationId = $template->valFilter(
    isset($_POST["affiliationId"]) ? $_POST["affiliationId"] : null
);
$projectName = $template->valFilter(
    isset($_POST["projectName"]) ? $_POST["projectName"] : null
);
$price = $template->valFilter(
    isset($_POST["price"]) ? $_POST["price"] : null
);

$unit = $template->valFilter(
    isset($_POST["unit"]) ? $_POST["unit"] : null
);

//  GET FILE FROM FORMDATA
$torFile = $template->valFile($_FILES["tor"], "ไฟล์ TOR");
$jobDescriptionFile = $template->valFile($_FILES["jobDescription"], "ไฟล์รายละเอียดของงาน");
$calculateFile = $template->valFile($_FILES["calculateFile"], "ไฟล์คำนวณราคากลาง");


// * SUB PRICE FROM FORMDATA
$subprices_input = isset($_POST["subPrice"]) ? $_POST["subPrice"] : null;
$subPrices = json_decode($subprices_input, true);
$affiliationName = $template->valVariable(isset($_POST["affiliationName"]) ? $_POST["affiliationName"] : null, "ชื่อสังกัด");


try {

    $projectService->startTransaction();

    // 1. getUserByID
    $addUser = $projectService->getUserStaffByUserId($userId);
    // check if not found ?
    if (!$addUser) {
        $http->BadRequest(["err" => "not found a user"]);
    }

    // 2. find project Type By id
    $projectType = $projectService->getProjectTypeById($projectTypeId);
    // check if not found ?
    if (!$projectType) {
        $http->BadRequest(["err" => "not found a project type"]);
    }

    // 3. find project job types By id
    $projectJobType = $projectService->getProjectJobTypeById($projectJobTypeId);
    // check if not found ?
    if (!$projectJobType) {
        $http->BadRequest(["err" => "not found a project Job Type"]);
    }

    // 4. find affiliation By name
    $affiliation = $projectService-> getAffiliationByName($affiliationName);
    if (!$affiliation) {
        $http->BadRequest(["err" => "ไม่พบข้อมูลสังกัด"]);
    }

    $department = $projectService->getDepartmentById($departmentId);
    if (!$department) {
        $http->BadRequest([
            "err" => "not found a department",
            "status" => 400
        ]);
    }

    $division = $projectService->getDivisionById($divisionId);
    if (!$division) {
        $http->BadRequest([
            "err" => "not found a division",
            "status" => 400
        ]);
    }

    // 5. find Project status
    $status = $projectService->getProjectStatusByName('รอตรวจสอบเอกสาร');

    // 6. Generate Project Key
    $folderOld = scandir('../../../projects');
    // echo(var_dump($folderOld));
    // check if project is have will re runing
    do {
        function generateRandomString($length = 10)
        {
            $characters = '0123456789';
            $charactersLength = strlen($characters);
            $randomString = '';
            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[random_int(0, $charactersLength - 1)];
            }
            return $randomString;
        }
        $projectKey = generateRandomString(7);
    } while (in_array($projectKey, $folderOld));

    // 7. Save file to server
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
    // 3. price
    $fileExt = strtolower(pathinfo($calculateFile["FileName"], PATHINFO_EXTENSION));
    $priceLocation = $upload_path . '/price.' . $fileExt;
    $priceDatabase = $database_path . '/price.' . $fileExt;

    // sum all of sub-price is eq main price?


    /**
     * encrypt a main price to something
     */
    $priceEncrypt = $enc->apEncode($price);

    // 8. save Data to database
    // start transections

    $data = [
        "projectKey" => $projectKey,
        "projectName" => $projectName,
        "price" => $priceEncrypt,
        // File Location
        "tor" => $torDatabase,
        "jobDescription" => $jobDatabase,
        "priceLocation" => $priceDatabase,
        // Relations 
        "userStaffId" => $addUser["id"],
        "divisionId" => $affiliation["id"],
        "departmentId" => $affiliation["id"],
        "affiliationId" => $affiliation["id"],
        "projectTypeId" => $projectType["id"],
        "jobTypeId" => $projectJobType["id"],
        "statusId" => $status["id"],
        "full_affiliation" => "",
        "projectUnitPrice" => $unit
    ];

    // insert to db
    $res = $projectService->insertProject($data);

    // if insert Failed
    if (!$res) {
        $projectService->rollbackTransaction();
        $http->BadRequest(
            ["err" => "project insert failed"]
        );
    }


    $sub_price_length = count($subPrices);
    $subPriceArray = [];
    // insert subprice
    for ($i = 0; $i < $sub_price_length; $i++) {
        $detail = $template->valFilter(isset($subPrices[$i]["detail_price"]) ? $subPrices[$i]["detail_price"] : null);
        $subprice = $template->valFilter(isset($subPrices[$i]["price"]) ? $subPrices[$i]["price"] : null);
        $subPriceEncrypt = $enc->apEncode($subprice);
        $subData = [
            "projectId" => $res["id"],
            "detail" => $detail,
            "price" => $subPriceEncrypt
        ];
        $subPriceRes = $projectService->addSubprice($subData);

        if (!$subPriceRes) {
            $projectService->rollbackTransaction();
            $http->BadRequest([
                "err" => "cannot insert this subprice"
            ]);
        }
        array_push($subPriceArray, $subPriceRes);
    }

    // prepare data to response
    $response = [
        "data" => $res,
        "status" => 200
    ];

    $response["data"]["subPriceArray"] = $subPriceArray;
    // Commit the transection

    // Create a Dir
    if (!is_dir($upload_path)) {
        try {
            mkdir($upload_path, 0777, true);
        } catch (Exception $e) {
            $http->BadRequest(["err" => $e->getMessage()]);
        }
    }
    // move file from temp file
    try {
        move_uploaded_file($torFile["TempName"], $torLocation);
        move_uploaded_file($jobDescriptionFile["TempName"], $upload_path . '/job-description.' . $fileExt);
        move_uploaded_file($calculateFile["TempName"], $priceLocation);
    } catch (Exception $e) {
        $projectService->rollbackTransaction();
        $http->BadRequest(["err" => $e->getMessage()]);
    }


    /**
     * Send a email to User staff in role 'Contractor'
     * Except owner of the project
     */
    require(__DIR__ . "/mails/funcMailToContractor.php");
    $departmentProject = $projectService->getDepartmentById($res["department"]);
    $res["full_affiliation"] = $affiliation["SECTION"] . ' / ' . $departmentProject["department_name"] . ' / '. $affiliation["SUBSECTION"] . ' / '. $division["division_name"];
    $allUserRoleContractor = $projectService->getUserStaffByRole('Contractor');
    foreach ($allUserRoleContractor as $index => $contractor) {
        if ($contractor["user_staff_id"] !== $userId) {
            $mail->sendTo($contractor["email"]);
            $mail->addSubject("โครงการ $projectName รอการตรวจสอบไฟล์");
            $mail->addBody(htmlMailProjectCreate2($res, $contractor));
    
            if ($_ENV["DEV"] == false) {
                $success = $mail->sending();
                if (!$success) {
                    $projectService->rollbackTransaction();
                    $http->Forbidden(
                        [
                            "err" => "ส่งอีเมลไม่สำเร็จ กรุณาติดต่อ Admin",
                            "status" => 403
                        ]
                    );
                }
            }
        }

    }
    

    // ! uncomment when you need a use in production
    $projectService->commitTransaction();

    $http->Ok([
        "data" => $res,
        "status" => 200
    ]);

    $http->Ok(
        $response
    );


} catch (PDOException | Exception $e) {
    $cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
    $http->BadRequest(["err" => $e->getMessage()]);
}