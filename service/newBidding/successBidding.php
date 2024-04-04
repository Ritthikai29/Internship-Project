<?php
session_start();

include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/newBiddingService.php");
include_once(__DIR__ . "/../middleware/authentication.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

// Create a new instance of the NewBidService class
$newBidService = new NewBidService();

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
    $user = $newBidService->getUserByIdAndRole($userId, $roleCheck[$i]);
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
$topicId = $template->valVariable(isset($body["topic_id"]) ? $body["topic_id"] : null, "topic id");
$comment = isset($body["comment"]) ? $body["comment"] : null;

$newBidService->startTransaction();

/**
 * get Project by project id
 */
$project = $newBidService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลโครงการ",
            "status" => 404
        ]
    );
}

$director = $newBidService->getDirectorByOpenIDNUID($project["opendate_id"], $user["id"]);
if (!$director) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่มีสิทธิ์ในระบบนี้",
            "status" => 401
        ]
    );
}
/**
 * check a project status is ready to save result
 * 
 */
$projectStatus = $newBidService->getProjectStatusById($project["status_id"]);
if (!$projectStatus || $projectStatus["status_name"] !== "กำลังเจรจาต่อรองราคาใหม่") {
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
$topic = $newBidService->getTopicCommentById($topicId);
if (!$topic) {
    $http->NotFound(
        [
            "err" => "ไม่พบหัวข้อการบันทึกผล",
            "status" => 404
        ]
    );
}

if ((float) $enc->apDecode($project["price"]) > 500000) {
    $approver = $newBidService->getUserStaffByRole("Plant Manager");
} else {
    $approver = $newBidService->getUserStaffByRole("MD");
}
if (!$approver) {
    $http->NotFound(
        [
            "err" => "ไม่พบข้อมูลผู้อนุมัติที่ต้องการ",
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

$secretaryResult = $newBidService->getSecretaryCommmentByProjectId($project['id']);
$count = $secretaryResult['order'] + 1;

$submit_datetime = date("Y-m-d H:i:s");
$data = [
    "topic_id" => $topic["id"],
    "comment" => $comment,
    "project_id" => $project["id"],
    "secretary_id" => $director["id"],
    "is_success" => $is_success,
    "is_approve" => null,
    "approver_id" => $approver["id"],
    "order" => $count,
    "submit_datetime" => $submit_datetime
];

$insertedResult = $newBidService->insertedFinalResult($data);
if (!$insertedResult) {
    $http->Forbidden(
        [
            "err" => "ไม่สามารถเพิ่มข้อมูลลงในระบบได้",
            "status" => 403
        ]
    );
}
/**
 * update status to "รอเจรจาต่อรอง"
 */
/**
 * find a status of the project by [is_success] 
 */
if ($is_success === true) {
    $status = $newBidService->getProjectStatusByName("รออนุมัติผลเสร็จสิ้นประกวดราคา");
} else if ($is_success === false) {
    $status = $newBidService->getProjectStatusByName("รอแจ้งผลล้มประกวดราคา");
} else {
    $status = $newBidService->getProjectStatusByName("รอเจรจาต่อรอง");
}

$projectUpdate = $newBidService->updateProjectStatusById(
    [
        "statusId" => $status["id"],
        "projectId" => $project["id"]
    ]
);

/**
 * start prepare vendor to add win or lose
 */
// get vendor by project id 
$vendorProject = $newBidService->listVendorsHasApproveByProjectId($project["id"]);

foreach ($vendorProject as $index => $value) {
    $price = $newBidService->getBidPriceByVendorProjectId($value["id"]);
    $vendorProject[$index]["price"] = $price ? (float) $enc->bidDecode($price["price"]) : null;
    $new = $newBidService->getNewBidPriceByVendorProjectId($value["id"]);
    $vendorProject[$index]["newPrice"] = $new ? (float) $enc->bidDecode($new["price"]) : null;
    $vendorProject[$index]["compare"] = $new ? (float) $enc->bidDecode($new["price"]) : ($price ? (float) $enc->bidDecode($price["price"]) : null);

    if ($vendorProject[$index]["vendor_type"] == "list") {
        $vendorProject[$index]["vendor_type_name"] = "ในทะเบียน List";
    } else {
        $vendorProject[$index]["vendor_type_name"] = "นอกทะเบียน List";
    }
}
usort($vendorProject, function ($a, $b) {
    if (!$a["compare"] || $a["compare"] === 0) {
        return 1;
    } else if (!$b["compare"] || $b["compare"] === 0) {
        return -1;
    } else {
        return $a["compare"] - $b["compare"];
    }
});

function findAWinner($vendorProject)
{
    $count = count($vendorProject);
    $vendorProject[0]["result"] = "ชนะการประกวด";

    if ($vendorProject[0]["compare"] === $vendorProject[1]["compare"]) {
        $vendorProject[0]["result"] = "เสมอกัน";
    }

    for ($i = 1; $i < $count; $i++) {
        if ($vendorProject[$i - 1]["result"] == "เสมอกัน") {
            $vendorProject[$i]["result"] = $vendorProject[$i - 1]["compare"] == $vendorProject[$i]["compare"] ? "เสมอกัน" : "แพ้การประกวด";
        } else {
            $vendorProject[$i]["result"] = "แพ้การประกวด";
        }
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
        $approver2 = $newBidService->getUserStaffByRoleName(
            "Plant Manager"
        );
        $mail->sendTo($approver2["email"]);

    } else {
        // find a MD to send mail to approve (MD)
        $approver2 = $newBidService->getUserStaffByRoleName(
            "MD"
        );
        $mail->sendTo($approver2["email"]);
    }
    $mail->addSubject("ขอความกรุณาอนุมัติโครงการที่เปิดซองแล้ว");
    $mail->addBody(htmlMailToMDApprove($project, $vendorProject, $approver));

    if (!$_ENV["DEV"]) {
        $success = $mail->sending();
        if ($success === null) {
            $http->BadRequest(
                [
                    "err" => "ไม่สามารถส่งอีเมลได้",
                    "status" => 400
                ]
            );
        }
        $mail->clearAddress();
    }

} else if ($is_success === false) {
    /**
     * if failed will send email to หน่วยงานจ้างเหมา for send a failed bidding mail to vendor
     */
    $vendorProject = setToLoseAll($vendorProject);
    $contractors = $newBidService->getAllUserStaffByRoleName("Contractor");
    foreach ($contractors as $index => $contractor) {
        $mail->sendTo($contractor["email"]);
    }
    require_once(__DIR__ . "/mails/funcMailReject.php");
    $mail->addSubject("ประกาศผลถึงหน่วยงานจ้างเหมา");
    $mail->addBody(htmlMailReject($project, $vendorProject, $contractor));
    if ($_ENV["DEV"]  === false) {
        $success = $mail->sending();
        if ($success == null) {
            $http->BadRequest(
                [
                    "err" => "ไม่สามารถส่งอีเมลได้",
                    "status" => 400
                ]
            );
        }
        $mail->clearAddress();
    }

}

$newBidService->commitTransaction();

$http->Ok(
    [
        "data" => $insertedResult,
        "status" => 200
    ]
);
