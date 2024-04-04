<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("../Template/SettingMailSend.php");

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
 * Authorize User
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

/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);

// * Get Project By Project key
$projectKey = $template->valVariable(isset($body["key"]) ? $body["key"] : null, "project key");
$project = $approveResultService->getProjectByKey($projectKey);
if (!$project){
    $http->NotFound(
        [
            "err" => "project not found",
            "status" => 404
        ]
    );
}

// * Project is Approve '14 : รออนุมัติผลล้มประกวดราคา'
$isCancelStatus = 14;

$approveResultService->startTransaction();

// * Prepare Data
$data = [
    "project_id" => $project['id'],
    "status_id" => $isCancelStatus
];

/**
 * Update Project Status From MD
 * 
 * 13 : รออนุมัติผลเสร็จสิ้นประกวดราคา
 * 14 : รออนุมัติผลล้มประกวดราคา
 * 
 */

$updateProjectStatus = $approveResultService->updateProjectStatus($data);

// * Get All Vendor in Project Register With Last ORDER
$getAllVendor = $approveResultService->listOfVendorInProjectByProjectId($project['id']);

/**
 * Define Result
 * 1 : Winner
 * 2 : Loser 
 * 
 * */ 

foreach($getAllVendor AS $index => $result){
    $getAllVendor[$index]['bid_result'] = 2;
}

/**
 * Update Vendor Project Register Status
 * 
 */

foreach($getAllVendor AS $update){
    // * Prepare Data2
    $data2 = [
        "id" => $update['id'],
        "vendor_status_id" => $update['bid_result']
    ];

    /**
     * Update Vendor Bidding Status
     */

    $updateVendorProjectStatus = $approveResultService->updateVendorProjectStatus($data2);

}

$listContractorsEmails = $approveResultService->listEmailOfContractor();

/**
* send a email to contractor
*/
foreach($listContractorsEmails as $contractor){
    $mail->sendTo($contractor["email"]);
}

$subjectEmail = "ผลการพิจารณาการอนุมัติโครงการ" . (string)$project['name'];
$mail->addSubject($subjectEmail);
$bodyEmail = "การอนุมัติโครงการ เลขที่ " . $projectKey . " ได้รับการ ยกเลิก โครงการ ";
$mail->addBody($bodyEmail);
$mail->sending();
$mail->clearAddress();

$approveResultService->commitTransaction();

$http->Ok(
    [
        "data" => "Success",
        "status" => 200
    ]
);



