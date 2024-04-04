<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");
include_once("./funcMdMail.php");
include_once("../middleware/authentication.php");
include_once("./approveResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$approveResultService = new ApproveResultService();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * authorize
 * 
 */
$tokenObject = JWTAuthorize($enc, $http);
$userId = isset($tokenObject->userId) ? $tokenObject->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบข้อมูลผู้ใช้ในระบบ",
            "status" => 401
        ]
    );
}

/**
 * check user is a secretary
 */
$isOk = false;
$roleCheck = [
    "secretary"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $approveResultService->getUserByIdAndRole($userId, $roleCheck[$i]);
    if ($user) {
        $isOk = true;
    }
    $i++;
} while (!$isOk && $countRole > $i);

if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่กลุ่มกรรมการในระบบ",
            "status" => 401
        ]
    );
}

// * Get body
$body = json_decode(file_get_contents('php://input'), true);

// * Get project ID
$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");
// * Get director ID
$directorId = $template->valVariable(isset($body["director_id"]) ? $body["director_id"] : null, "director id");
// * Get list of Vendor with Result
$listVendorWithResult = isset($body["vendor_result"]) ? $body["vendor_result"] : null;

// ! Not yet check '$listVendorWithResult'

// * Check is project id is exist 
$project = $approveResultService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการในระบบ",
            "status" => 404
        ]
    );
}

// * Check director have data in this project
$director = $approveResultService->getDirectorById($directorId);


// if (!$director || !password_verify($passcode, $director["passcode"])) {
//     $http->Unauthorize(
//         [
//             "err" => "ไม่พบข้อมูลของ User ที่ส่งมาให้",
//             "status" => 401
//         ]
//     );
// }

// ! No change project status

// * Get Department of project
$project['department'] = $approveResultService->getDepartmentById($project['department'])['department_name'] ?? '';

// * Get Md Info
$md = $approveResultService->getMdInfo();

// * Get Vendor Info With Result
$V_Info = [];
foreach($listVendorWithResult AS $index => $vendorWR){
    $data = $approveResultService->getVendorInfoByVendorId($vendorWR['vendor_id']);
    $data2 = $approveResultService->getResultBidById($vendorWR['result_id']);
    $data['result'] = $data2;
    array_push($V_Info,$data);
}

/**
 * send a email to vendor 
 */
$mail->sendTo($md['email']);
$subjectEmail = "โปรดพิจารณาอนุมัติผลการประกวดราคา";
$mail->addSubject($subjectEmail);

/**
 * File name & Issue
 * 
 */
$body = file_get_contents("./funcMdMail.php"); 

$mail->addBody($body);
$mail->addBody(htmlMail($project,$V_Info));

$mail->sending();

$http->Ok(
    [
        "data" => "Send Success",
        "status" => 200
    ]
);

