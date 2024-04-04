<?php
// ใช้ในกรณีที่ ถ้าหากว่าต้องการเพิ่มวันเจรจาต่อรอง แบะคนที่จะต้องเข้ามาเจรจาต่อรอง
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("../Template/SettingMailSend.php");

include_once("./bargainService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$bargainService = new BargainService();

$bargainService->startTransaction();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * 1. authorize a vendor of the project
 */
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบข้อมูล Vendor กรุณา Login ใหม่",
            "status" => 401
        ]
    );
}
// -------------------------- START CHECK ROLE OF THE USER STAFF -----------------------------
/**
 * find a user is a secretary ? 
 */

$isOk = false;
$roleCheck = [
    "secretary"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $bargainService->getUserByIdAndRole($userId, $roleCheck[$i]);
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

// -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------

/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);
$project_id = isset($body["project_id"]) ? $body["project_id"] : null;
$project_id = $template->valVariable($project_id);

$vendor_project_id = isset($body["vendor_project_id"]) ? $body["vendor_project_id"] : null;
$vendor_project_id = $template->valVariable($vendor_project_id);

$end_datetime = isset($body["end_datetime"]) ? $body["end_datetime"] : null;
$end_datetime = $template->valVariable($end_datetime);

$project = $bargainService->getProjectById($project_id);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลโครงการ",
            "status" => 404
        ]
    );
}

$projectStatus = $bargainService->getProjectStatusById($project["status_id"]);
if (!$projectStatus || $projectStatus["status_name"] !== "รอเจรจาต่อรอง") {
    $http->BadRequest(
        [
            "err" => "ท่านเคยส่งข้อมูลไปแล้ว ไม่สามารถส่งซ้ำได้",
            "status" => 400
        ]
    );
}

/**
 * find a bargain in this project
 */
$prevBargain = $bargainService->getBargainByProjectId($project["id"]);
if (!$prevBargain) {
    /**
     * insert bargain table to set end date time
     */
    $prepare = [
        "project_id" => $project_id,
        "end_datetime" => date("Y-m-d H:i:s", strtotime($end_datetime))
    ];
    $bargain = $bargainService->createBargainProject($prepare);
    if (!$bargain) {
        $http->BadRequest(
            [
                "err" => "ไม่สามารเพิ่มเวลาการเสนอราคาได้",
                "status" => 400
            ]
        );
    }
} else {
    /**
     * incase it have a bargain table in project will update only
     */
    $prepare = [
        "bargain_id" => $prevBargain["id"],
        "project_id" => $project_id,
        "end_datetime" => date("Y-m-d H:i:s", strtotime($end_datetime))
    ];
    $bargain = $bargainService->updateBargainByProjectId($prepare);
    if (!$bargain) {
        $http->BadRequest(
            [
                "err" => "ไม่สามารเพิ่มเวลาการเสนอราคาได้",
                "status" => 400
            ]
        );
    }
}

// Update Project Setting
$newSetting = [
    "project_id" => $project_id,
    "start_datetime" => date("Y-m-d H:i:s"),
    "end_datetime" => date("Y-m-d H:i:s", strtotime($end_datetime))
];
$setting = $bargainService->updateProjectSettingByProjectId($newSetting);
if (!$setting) {
    $http->BadRequest(
        [
            "err" => "ไม่สามารอัพเดตตั้งค่าโครงการ",
            "status" => 400
        ]
    );
}


// Convert comma-separated string to an array
$vendorIds = explode(',', $vendor_project_id);
// get status waiting for bargain
$waitingStatus = $bargainService->getVendorProjectStatusByName("waiting");
$prepare = [
    "vendor_status_id" => $waitingStatus["id"],
    "vendor_id" => $vendorIds
];
$updatedVendorProject = $bargainService->updateVendorInWithStatusAndPasscode($prepare);
if (!$updatedVendorProject) {
    $http->BadRequest(
        [
            "err" => "ไม่สามารถอัพเดตข้อมูลได้",
            "status" => 400
        ]
    );
}


// Get Previous List Send Vendor
$previousSend = $bargainService->getMaxLogVendorProjectByProjectID($project_id);
if($previousSend == NULL){
    $index = 1;
} else {
    $index = $previousSend[0]["order"] + 1;
}

foreach($vendorIds as $vendor){
    // Add Action For Save Send After Negotiation
    $data = [
        "vendor_project_id" => $vendor,
        "action_detail" => "รอเสนอราคาอีกครั้ง",
        "order" => $index
    ];
    $action = $bargainService->insertLogSecretarySendListVendor($data);
    if (!$action) {
        $http->BadRequest(
            [
                "err" => "ไม่สามารถเพิ่มข้อมูลได้",
                "status" => 400
            ]
        );
    }
}

/**
 * update project status to "กำลังเจรจาต่อรองราคาใหม่"
 */
$projectStatusSet = $bargainService->getProjectStatusByName("กำลังเจรจาต่อรองราคาใหม่");

$data = [
    "status_id" => $projectStatusSet["id"],
    "project_id" => $project_id
];
$updateProjectStatus = $bargainService->updateProjectStatusByProjectId($data);

/**
 * send an email to each vendor for the vendor to do something in this project
 * send mail with a passcode for the vendor to access
 */

$priceEncrypt = $enc->bidEncode(0);
$maxOrder = $bargainService->getCountBargainProjectByPid($project["id"]);

foreach ($vendorIds as $vendorId) {
    $passcodeGen = $bargainService->getRandomString(5);
    $hashCode = password_hash($passcodeGen, PASSWORD_BCRYPT);
    $data = [
        "passcode" => $hashCode,
        "vendor_project_id" => $vendorId
    ];
    $updatePasscode = $bargainService->updateVendorProjectPasscodeById($data);
    $vendorProject = $bargainService->getVendorProjectById($vendorId);
    $vendor = $bargainService->getVendorByVendorId($vendorProject['vendor_id']);
    // Only send emails if the vendor is found
    if ($vendor) {
        $mail->sendTo($vendor["email"]);
        $mail->addSubject('แจ้งเพื่อให้ดำเนินการเสนอราคาใหม่ โครงการ'.$project["name"] . ' เลขที่เอกสาร ' .$project["key"]);

        require_once __DIR__ . "/mails/funcSendVendorWithPasscode.php";
        $prepare = [
            "name" => $project["name"],
            "key" => $project["key"],
            "vendor_key" => $vendor["vendor_key"],
            "code" => $passcodeGen,
            "manager_name" => $vendor["manager_name"],
            "company_name" => $vendor["company_name"],
            "end_datetime" => $newSetting["end_datetime"]
        ];

        $mail->addBody(sendEmail($prepare));

        if ($_ENV["DEV"] === false) {
            $success = $mail->sending();

            if ($success == null) {
                $http->Forbidden(
                    [
                        "err" => "ไม่สามารถส่ง email ได้ กรุณาลองใหม่",
                        "status" => 403
                    ]
                );
            }
        }

        $mail->clearAddress();

        $dataInsertRegister = [
            "price" => $priceEncrypt,
            "order" => $maxOrder['count']+1,
            "vendor_project_id" => $vendorId
        ];
        $res = $bargainService->insertRegister($dataInsertRegister);

    }
    $success = $bargainService->updateStatusVendorProjectByIdAndStatusId($vendorId, 3);
    if (!$success) {
        $http->BadRequest(
            [
                "err" => "ไม่สามารถอัพเดตสเตตัสข้อมูลของ vendor ที่ต้องการให้เสนอราคาใหม่",
                "status" => 400
            ]
        );
    }
}


$bargainService->commitTransaction();

$http->Ok(
    [
        "data" => $bargain,
        "update" => $updatedVendorProject,
        "status" => 200
    ]
);
