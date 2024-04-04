<?php

session_start();

include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");
include("./OpenBiddingService.php");
include("../SetDirector/setDirectorService.php");
include("../Template/SettingMailSend.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$openBiddingService = new OpenBiddingService();
$setDirectorService = new SetDirectorService();
$mail = new Mailing();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

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

// authen is a secarey

/**
 * get a data of the user by user id
 */
$user = $openBiddingService->getUserEmployeeByUserId($userId);
if (!$user) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบ user id คนนี้",
            "status" => 401
        ]
    );
}

$user["role"] = $openBiddingService->getUserRoleByUserId($user["id"]);
if (!$user["role"]) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้่",
            "status" => 401
        ]
    );
}

/**
 * check you is a secretary of the project 
 */
$permission = false;
foreach ($user["role"] as $index => $value) {
    if ($value["role_name"] === "secretary") {
        $permission = true;
    }
}
if (!$permission) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้่",
            "status" => 401
        ]
    );
}


$body = json_decode(file_get_contents('php://input'), true); //ส่งไปเป็น Json
$Date = $template->valVariable(isset($body["open_datetime"]) ? $body["open_datetime"] : null, "วันเปิดซอง");
$Place = $template->valVariable(isset($body["open_place"]) ? $body["open_place"] : null, "สถานที่เปิดซอง");

$projectList = isset($body["project_list"]) ? $body["project_list"] : null; //"project_list" camelCase มาจากjson

// แปลงเวลาให้ตรงกับเวลาของประเทศไทย
$dateTime = new DateTime($Date);

$DateAndPlace = [
    "open_datetime" => date('Y-m-d H:i:s', $dateTime->getTimestamp()),
    "open_place" => $Place
];

$openBiddingService->startTransaction();

$NewDateOpenProject = $openBiddingService->insertDateAndPlace($DateAndPlace);
//$NewDateOpenProject ตัวนี้มันมีค่ากลับมาด้วย เพราะinsertDateAndPlace ในSQL มี output ที่จะเหมือน selcet สิ่งที่เรา insert ล่าสุด
foreach ($projectList as $index => $value) { //pj มาเป็น array run index,value foreach คือ for
    $projectId = $template->valFilter($value); //Id โปรเจคที่ถูกเลื่อก จากArray projectList (อยู่ในค่าvalue) เอาไปใส่ $projectId

    $project = $openBiddingService->getProjectById($projectId);
    if (!$projectId) {
        $http->NotFound(
            [
                "err" => "ไม่พบ โครงการ",
                "status" => 404
            ]
        );
    }

    $projectStatus = $openBiddingService->getProjectStatusById($project["status_id"]);
    if (!$projectStatus) {
        $http->NotFound(
            [
                "err" => "ไม่พบข้อมูลสถานะโครงการ",
                "status" => 404
            ]
        );
    }
    $projectSetting = $openBiddingService->getProjectSettingByProjectId($project["id"]);
    if (!$projectSetting) {
        $http->NotFound(
            [
                "err" => "ไม่พบข้อมูล การตั้งค่าโครงการ",
                "status" => 404
            ]
        );
    }

    /**
     * check open date is more than setting end date?
     */
    if (($projectStatus["status_name"] == "รอเปิดโครงการ" || $projectStatus["status_name"] == "กำลังประกวดราคา") && strtotime($projectSetting["end_datetime"]) > strtotime($Date)) {
        $http->BadRequest(
            [
                "err" => " คุณกรอกข้อมูลวันที่ก่อนวันปิดประมูล กรุณากำหนดวันเวลาเป็นหลังจากโครงการครบกำหนดการรับสมัคร",
                "status" => 400
            ]
        );
    }


    $prepareUpdateProject = [
        //เตรียม open_idที่ต้องการ assign และId peojectที่จะถูกassign
        "opendate_id" => $NewDateOpenProject["id"],
        //id ของopen_biddding
        "id" => $projectId
    ];

    $isUpdateSuccess = $openBiddingService->updateOpenidProject($prepareUpdateProject); //เอาข้อมูลที่เตรียมใว้($prepareUpdateProject) ไปใส่func ในupdateOpenidProjec
    // updateOpenidProject จะreturnออกมาเป็น boolen แล้วให้เก็บใน$isUpdateSuccess 
    if (!$isUpdateSuccess) { //ถ้าupdateไม่สำเร็จ 
        $openBiddingService->rollbackTransaction(); //จะทำการ rollback insert ทั้งหมด
        $http->Forbidden(
            //ส่งข้อความให้FontEnd
            [
                "err" => "cant update",
                "status" => 403
            ]
        );
    }
}

/**
 * กำหนดตัวเองเป็นกรรมการ
 */

$user = $setDirectorService->getUserStaffById($userId);

// * insert yourself to a director group

/**
 * find a role secretary from director role table
 */
$secretaryRole = $openBiddingService->getDirectorRoleByName("secretary");

$prepareInsertDirector = [
    "director_staff_id" => $user["id"],
    "open_id" => $NewDateOpenProject['id'],
    "director_role_id" => $secretaryRole["id"]
];
$directorSecretaryInsert = $openBiddingService->insertDirector($prepareInsertDirector);

$openBidding = $openBiddingService->getProjectCountByOpenId($NewDateOpenProject['id']);
$openBidInfo = $openBiddingService->getOpenBiddingInfoByOpenId($NewDateOpenProject['id']);

$committeeGroups = $openBiddingService->getAllCommitteeGroup();
include(__DIR__ . "/functionEmailbody.php");

$prepare = [
    "openId" => $NewDateOpenProject["id"]
];
$listOpenBidding = $openBiddingService->listProjectInOpenBidding($prepare);
foreach ($committeeGroups as $index => $value) {
    $mail->sendTo($value["email"]);
    $mail->addSubject("เชิญคุณ $value[firstname_t] $value[lastname_t] สมัครเข้าร่วมเป็นกรรมการในการเปิดซอง");
    $mail->addBody(htmlMaill($openBidInfo, $listOpenBidding, $openBidding));
    $success = $_ENV["DEV"] === false ? $mail->sending() : true;
    if ($success === null) {
        $openBiddingService->rollbackTransaction();
        $http->Forbidden([
            "err" => "ไม่สามารถส่งอีเมลได้",
            "status" => 403
        ]);
    }
    $mail->clearAddress();
}

$openBiddingService->commitTransaction(); //ถ้าupdateสำเร็จ commit ที่insertมาทั้งหมด


$http->Ok(
    [
        "data" => "updatesuccessful",
        "data2" => $NewDateOpenProject,
        "status" => 200
    ]
);