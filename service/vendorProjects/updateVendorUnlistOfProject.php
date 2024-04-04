<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include("./../middleware/authentication.php");
include("./vendorProjectService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$vendorProjectService = new VendorProjectService();

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

$body = json_decode(file_get_contents('php://input'), true);

$unlistVendorsInput = isset($body["unlistVendor"]) ? $body["unlistVendor"] : null;
// $unlistVendorsInput = $template->ValArrVariable($unlistVendorsInput);

$reasonToApprove = isset($body["reason"]) ? $body["reason"] : null;
$reasonToApprove = $template->valVariable($reasonToApprove, "เหตุผลการขอ approve");

$verifierId = isset($body["verifier_id"]) ? $body["verifier_id"] : null;
$verifierId = $template->valVariable($verifierId, "ไม่พบ id ของผู้ตรวจสอบ");

$approverId = isset($body["approver_id"]) ? $body["approver_id"] : null;
$approverId = $template->valVariable($approverId, "ไม่พบข้อมูลของผู้อนุมัติ");

$ccSendId = isset($body["cc_send_id"]) ? $body["cc_send_id"] : null;
$ccSendId = $template->valFilter($ccSendId);

$projectId = isset($body["project_id"]) ? $body["project_id"] : null;
$projectId = $template->valVariable($projectId, "ไอดีโครงการ");

$vendorIds = [];
$vendorProjects = [];
$vendorProjectService->startTransaction();

/**
 * check a latest is a approve ?
 */
$latestApproveVendorProject = $vendorProjectService->getLatestApproveVendorProjectByProjectId($projectId);
if (
    !$latestApproveVendorProject ||
    is_null( $latestApproveVendorProject["approve2"])||
    is_null( $latestApproveVendorProject["approve1"])||
    $latestApproveVendorProject["approve1"] == 1 ||
    $latestApproveVendorProject["approve2"] == 1 
) {
    $http->Forbidden(
        [
            "err" => "you can't edit this vendor project",
            "status" => 403
        ]
    );
}


foreach ($unlistVendorsInput as $body) {
    $vendorKey = $template->valFilter(isset($body["vendor_key"]) ? $body["vendor_key"] : null);
    $companyName = $template->valVariable(isset($body["company_name"]) ? $body["company_name"] : null, "ชื่อบริษััท");
    $email = $template->valVariable(isset($body["email"]) ? $body["email"] : null, "email");
    $managerName = $template->valVariable(isset($body["manager_name"]) ? $body["manager_name"] : null, "ชื่อผู้รับผิดชอบ");
    $managerRole = $template->valVariable(isset($body["manager_role"]) ? $body["manager_role"] : null, "ตำแหน่งของผู้รับผิดชอบ");
    $phoneNumber = $template->valVariable(isset($body["phone_number"]) ? $body["phone_number"] : null, "เบอร์โทร");
    $affiliated = $template->valVariable(isset($body["affiliated"]) ? $body["affiliated"] : null, "สังกัด");
    $location = $template->valVariable(isset($body["location"]) ? $body["location"] : null, "ที่อยู่");
    $locationMainId = $template->valVariable(isset($body["location_main_id"]) ? $body["location_main_id"] : null, "ข้อมูลตามเลข zip");
    $vendorLevel = $template->valVariable(isset($body["vendor_level"]) ? $body["vendor_level"] : null, "vendor level");
    $note = $template->valFilter(isset($body["note"]) ? $body["note"] : null);

    /**
     * check 3 part of the project
     * 1. the old vendor and have in vendor project
     * 2. the old vendor but have't in vendor project
     * 3. the new vendor
     */
    if ($vendorKey) {
        // is a old vendor in this project

        /**
         * check this old vendor is join in the project
         */
        $vendor = $vendorProjectService->getVendorByVendorKey($vendorKey);
        if (!$vendor) {
            $http->NotFound(
                [
                    "err" => "this vendor key is not found",
                    "status" => 404
                ]
            );
        }
        $vendorProject = $vendorProjectService->getVendorProjectByVendorIdAndProjectId($vendor["id"], $projectId);
        if ($vendorProject) {
            // in case found a vendor project

            /**
             * update a vendor project column to null
             */
            $data = [
                "vp_id" => $vendorProject["id"],
                "vendor_id" => $vendorProject["vendor_id"],
                "project_id" => $vendorProject["project_id"],
                "passcode" => null,
                "approve" => null,
                "adder_user_staff_id" => $vendorProject["adder_user_staff_id"]
            ];
            $vendorProjectUpdated = $vendorProjectService->updateVendorProject($data);

            /**
             * update vendor data in table vendor
             */
            $data = [
                "vendor_id" => $vendor["id"],
                "company_name" => $companyName,
                "email" => $email,
                "manager_name" => $managerName,
                "manager_role" => $managerRole,
                "phone_number" => $phoneNumber,
                "affiliated" => $affiliated,
                "vendor_type" => "unlist",
                "location_detail" => $location,
                "note" => $note,
                "vendor_level" => $vendorLevel,
                "location_main_id" => $locationMainId
            ];
            $vendorUpdated = $vendorProjectService->updateVendorById($data);

            array_push($vendorIds, $vendorUpdated);
            array_push($vendorProjects, $vendorProjectUpdated);
        } else {
            // in case not found a vendor project (add a new vendor to project)

            /**
             * update a vendor 
             */
            $data = [
                "vendor_id" => $vendor["id"],
                "company_name" => $companyName,
                "email" => $email,
                "manager_name" => $managerName,
                "manager_role" => $managerRole,
                "phone_number" => $phoneNumber,
                "affiliated" => $affiliated,
                "vendor_type" => "unlist",
                "location_detail" => $location,
                "note" => $note,
                "vendor_level" => $vendorLevel,
                "location_main_id" => $locationMainId
            ];
            $vendorUpdated = $vendorProjectService->updateVendorById($data);

            array_push($vendorIds, $vendorUpdated);

            /**
             * create a vendor project 
             */
            $data = [
                "vendor_id" => $vendorUpdated["id"],
                "project_id" => $projectId,
                "passcode" => null,
                "approve" => null,
                "adder_user_staff_id" => $userId
            ];
            $vendorProjectInserted = $vendorProjectService->createVendorProject($data);
            if (!$vendorProjectInserted) {
                $http->Forbidden(
                    [
                        "err" => "cannot insert vendor project",
                        "status" => 403
                    ]
                );
            }
            array_push($vendorProjects, $vendorProjectInserted);
        }
    } else {
        // in case insert a new vendor

        do {
            $vendorKeyRandom = $vendorProjectService->getRandomString(5);
            $vendor = $vendorProjectService->getVendorByVendorKey($vendorKeyRandom);
        } while ($vendor); // if found a vendor is mean vendor is duplicate gen again
        $data = [
            "vendor_key" => $vendorKeyRandom,
            "password" => null,
            "company_name" => $companyName,
            "add_datetime" => date("Y-m-d H:i:s"),
            "email" => $email,
            "manager_name" => $managerName,
            "manager_role" => $managerRole,
            "phone_number" => $phoneNumber,
            "affiliated" => $affiliated,
            "vendor_type" => "unlist",
            "location_detail" => $location,
            "note" => $note,
            "vendor_level" => null,
            "location_main_id" => $locationMainId
        ];
        $unlistVendor = $vendorProjectService->createVendor($data);

        array_push($vendorIds, $unlistVendor);

        /**
         * create a vendor project 
         */
        $data = [
            "vendor_id" => $unlistVendor["id"],
            "project_id" => $projectId,
            "passcode" => null,
            "approve" => null,
            "adder_user_staff_id" => $userId
        ];
        $vendorProjectInserted = $vendorProjectService->createVendorProject($data);
        if (!$vendorProjectInserted) {
            $http->Forbidden(
                [
                    "err" => "cannot insert vendor project",
                    "status" => 403
                ]
            );
        }
        array_push($vendorProjects, $vendorProjectInserted);
    }

}

/**
 * create a approve vendor project 
 */
$data = [
    "approver1_id" => $verifierId,
    "approver2_id" => $approverId,
    "reason_to_approve" => $reasonToApprove
];
$approveVendorProject = $vendorProjectService->createApproveVendorProject($data);
if(!$approveVendorProject){
    $http->Forbidden(
        [
            "err" => "can't inserted a approve vendor project",
            "status" => 403
        ]
    );
}

$links = [];
foreach($vendorProjects as $vendorProject){
    /**
     * link a approve vendor project to vendor project (unlist should be approve)
     */
    $data = [
        "approve_vendor_project_id" => $approveVendorProject["id"],
        "vendor_project_id" => $vendorProject["id"]
    ];
    $approveVendorLink = $vendorProjectService->createLinkVendorProjectToApprove($data);
    array_push($links, $approveVendorLink);

}

// $vendorProjectService->commitTransaction();

$http->Ok(
    [
        "data" => "successful to update",
        "vendorProject" => $vendorProjects,
        "latest" => $latestApproveVendorProject,
        "link" => $links,
        "approveVendorProject" => $approveVendorProject,
        "status" => 200
    ]
);