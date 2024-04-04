<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("../Template/SettingMailSend.php");

include_once("./biddingResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$biddingResultService = new BiddingReasultService();
// start transections 
$biddingResultService->startTransaction();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * 1. authorize 
 */
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
    $user = $biddingResultService->getUserByIdAndRole($userId, $roleCheck[$i]);
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
$projectId = $template->valVariable(isset($body["project_id"]) ? $body["project_id"] : null, "project id");
$openId = $template->valVariable(isset($body["open_id"]) ? $body["open_id"] : null, "open_id");
$topicId = $template->valVariable(isset($body["topic_id"]) ? $body["topic_id"] : null, "topic id");
$comment = $template->valVariable(isset($body["comment"]) ? $body["comment"] : null, "comment");
$passcode = $template->valFilter(isset($body["passcode"]) ? $body["passcode"] : null);



/**
 * find a director by open_id and userId
 */
$director = $biddingResultService->getDirectorByOpenIDNUID($openId, $user["id"]);
if (!$director) {
    $htttp->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้",
            "status" => 401
        ]
    );
}

// check a passcode 
if (!password_verify($passcode, $director["passcode"])) {
    $http->Unauthorize(
        [
            "err" => "การเข้าถึงของคุณไม่ถูกต้อง กรุณาลองใหม่",
            "status" => 401
        ]
    );
}

$project = $biddingResultService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่ต้องการสรุปผล กรุณาลองใหม่",
            "status" => 404
        ]
    );
}

/**
 * check a project status is ready to save result
 * 
 */
$projectStatus = $biddingResultService->getProjectStatusById($project["status_id"]);
if (!$projectStatus || $projectStatus["status_name"] !== "กำลังเปิดซอง") {
    $http->Forbidden(
        [
            "err" => "ไม่สามารถสร้างผลลัพท์การเปิดซองได้เนื่องจากยังไม่เสร็จสิ้น",
            "status" => 403
        ]
    );
}



/**
 * get topic by topic id
 */
$topic = $biddingResultService->getTopicCommentById($topicId);
if (!$topic) {
    $http->NotFound(
        [
            "err" => "ไม่พบหัวข้อการบันทึกผล",
            "status" => 404
        ]
    );
}

$is_success = null;

if ($topic["status_comment"] == "success") {
    $is_success = true;
} else if ($topic["status_comment"] == "failed") {
    $is_success = false;
}

if ((float) $enc->apDecode($project["price"]) > 500000) {
    $approver = $biddingResultService->getUserStaffByRole("Plant Manager");
} else {
$approver = $biddingResultService->getUserStaffByRole("MD");
}
if (!$approver) {
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลผู้อนุมัติที่ต้องการ",
            "status" => 404
        ]
    );
}
$submit_datetime = date("Y-m-d H:i:s");
$data = [
    "topic_id" => $topic["id"],
    "comment" => $comment,
    "project_id" => $project["id"],
    "secretary_id" => $director["id"],
    "is_success" => $is_success,
    "is_approve" => null,
    "approver_id" => $approver["id"],
    "order" => 1,
    "submit_datetime" => $submit_datetime
];

$insertedResult = $biddingResultService->insertedFinalResult($data);
if (!$insertedResult) {
    $http->Forbidden(
        [
            "err" => "ไม่สามารถเพิ่มข้อมูลลงในระบบได้",
            "status" => 403
        ]
    );
}


/**
 * find a status of the project by [is_success] 
 */
if ($is_success === true) {
    $status = $biddingResultService->getProjectStatusByName("รออนุมัติผลเสร็จสิ้นประกวดราคา");
} else if ($is_success === false) {
    $status = $biddingResultService->getProjectStatusByName("รออนุมัติผลล้มประกวดราคา");
} else {
    $status = $biddingResultService->getProjectStatusByName("รอเจรจาต่อรอง");
}

// Update a project status to success / waiting to discuse / failed bidding
$prepareProject = [
    "statusId" => $status["id"],
    "projectId" => $project["id"]
];
$projectUpdate = $biddingResultService->updateProjectStatusById($prepareProject);
if (!$projectUpdate) {
    $http->Forbidden(
        [
            "err" => "ไม่สามารถอัพเดตสถานะโครงการได้",
            "status" => 403
        ]
    );
}



// get all Director comment to send email of the project
$listCommentOfCommittee = $biddingResultService->listDirectorCommentByProjectId($project["id"]);
if (!$listCommentOfCommittee || count($listCommentOfCommittee) !== 4) {
    $biddingResultService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "คณะกรรมการยังไม่ลงมติครบทุกราย",
            "status" => 400
        ]
    );
}

$vendorProject = $biddingResultService->listVendorsHasApproveByProjectId($project["id"]);

foreach ($vendorProject as $index => $value) {
    $price = $biddingResultService->getBidPriceByVendorProjectId($value["id"]);
    $vendorProject[$index]["price"] = $price ? (float) $enc->bidDecode($price["price"]) : null;
    $new = $biddingResultService->getNewBidPriceByVendorProjectId($value["id"]);
    $vendorProject[$index]["newPrice"] = $new ? (float) $enc->bidDecode($new["price"]) : null;
    $vendorProject[$index]["compare"] = $new ? (float) $enc->bidDecode($new["price"]) : ($price ? (float) $enc->bidDecode($price["price"]) : null);

    if ($vendorProject[$index]["vendor_type"] == "list") {
        $vendorProject[$index]["vendor_type_name"] = "ใน List ทะเบียน";
    } else {
        $vendorProject[$index]["vendor_type_name"] = "นอก List ทะเบียน";
    }
}
// usort($vendorProject, function ($a, $b) {
//     if (!$a["compare"] || $a["compare"] === 0) {
//         return 1;
//     } else if (!$b["compare"] || $b["compare"] === 0) {
//         return -1;
//     } else {
//         return $a - $b;
//     }
// });

usort($vendorProject, function ($a, $b) {
    if(!$a["compare"] && $b["compare"]){
        return 1;
    }elseif($a["compare"] && !$b["compare"]){
        return -1;
    }
    elseif($a["compare"] < $b["compare"]){
        return -1;
    }else{
        return 1;
    };

});

function findAWinner($vendorProject)
{
    $count = count($vendorProject);
    $vendorProject[0]["result"] = "ชนะการประกวด";

    // if ($vendorProject[0]["compare"] === $vendorProject[1]["compare"]) {
    //     $vendorProject[0]["result"] = "เสมอกัน";
    // }

    for ($i = 1; $i < $count; $i++) {
        // if ($vendorProject[$i - 1]["result"] == "เสมอกัน") {
        //     $vendorProject[$i]["result"] = $vendorProject[$i - 1]["compare"] == $vendorProject[$i]["compare"] ? "เสมอกัน" : "แพ้การประกวด";
        // } else {
            $vendorProject[$i]["result"] = "แพ้การประกวด";
        // }
    }
    return $vendorProject;
}

function setToLoseAll($vendorProject)
{
    foreach ($vendorProject as $index => $value) {
        $vendorProject[$index]["result"] = "แพ้การประกวด";
    }
    return $vendorProject;
}

if ($is_success === true) {
    /**
     * if success will send email to ผร to approve or reject project 
     * 
     * will use a result to add in the email before send to ผร
     */

    $vendorProject = findAWinner($vendorProject);

    require_once(__DIR__ . "/mails/funcMailToMdApprove.php");
    if ($vendorProject[0]["compare"] > 500000) {
        // find a  ผร to send mail approve (Plant Manager)
        $approver2 = $biddingResultService->getUserStaffByRoleName(
            "Plant Manager"
        );
        $mail->sendTo($approver2["email"]);

    } else {
        // find a MD to send mail to approve (MD)
        $approver2 = $biddingResultService->getUserStaffByRoleName(
            "MD"
        );
        $mail->sendTo($approver2["email"]);
    }
    $mail->addSubject("พิจารณาอนุมัติผลการประกวดราคา");
    $mail->addBody(htmlMailToMDApprove2($project, $vendorProject, $approver));

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
        $mail->clearAddress();
    }



} else if ($is_success === false) {
    $vendorProject = setToLoseAll($vendorProject);

    require_once(__DIR__ . "/mails/funcMailToMdApprove.php");
    if ($vendorProject[0]["compare"] > 500000) {
        // find a  ผร to send mail approve (Plant Manager)
        $approver3 = $biddingResultService->getUserStaffByRoleName(
            "Plant Manager"
        );
        $mail->sendTo($approver3["email"]);

    } else {
        // find a MD to send mail to approve (MD)
        $approver3 = $biddingResultService->getUserStaffByRoleName(
            "MD"
        );
        $mail->sendTo($approver3["email"]);
    }
    $mail->addSubject("พิจารณาอนุมัติผลการประกวดราคา");
    $mail->addBody(htmlMailToMDApprove2($project, $vendorProject, $approver));

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
        $mail->clearAddress();
    }

}

/**
 * check found a more project in this open id
 */
$projectOpen = $biddingResultService->getAllProjectWaitFinalCommentBtOpenId($openId);
if (!$projectOpen) {
    // is mean not found a project wait for comment
    /**
     * update opne project by open id
     */
    $updatedOpenConsult = $biddingResultService->updateOpenBiddingStatusById(
        [
            "status" => 0,
            "open_id" => $openId
        ]
    );
    if (!$updatedOpenConsult) {
        $http->Forbidden(
            [
                "err" => "ไม่สามารถอัพเดตไอดีโครงการได้",
                "status" => 403
            ]
        );
    }
}

/**
 * send email to all committee of the project
 */
$allUserRoleDirector = $biddingResultService->listDirectorCommentByProjectId($project["id"]);
require_once(__DIR__ . "/mails/funcMailToDirector.php");
foreach ($allUserRoleDirector as $index => $data) {
    if ($data["user_staff_id"] !== $userId) {
        $mail->sendTo($data["email"]);
    }
}
$mail->addSubject(" โครงการ  $project[name] เลขที่เอกสาร $project[key] ได้รับการอนุมัติแล้ว ");
$mail->addBody(htmlMailToDirector($project));

if ($_ENV["DEV"] == false) {
    $success = $mail->sending();
    if ($success === null) {
        $biddingResultService->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "ส่งอีเมลไม่สำเร็จ กรุณาติดต่อ Admin",
                "status" => 403
            ]
        );
    }
}
$mail->clearAddress();

$biddingResultService->commitTransaction();
$http->Ok(
    [
        "data" => $insertedResult,
        "status" => 200
    ]
);

