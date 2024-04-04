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

if ($_SERVER["REQUEST_METHOD"] !== "PATCH") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}
$body = json_decode(file_get_contents('php://input'), true);

$vendorId = $template->valVariable(isset($body["vendor_id"]) ? $body["vendor_id"] : null, "vendor id");
$companyName = $template->valVariable(isset($body["company_name"]) ? $body["company_name"] : null, "ชื่อบริษััท");
$email = $template->valVariable(isset($body["email"]) ? $body["email"] : null, "email");
$managerName = $template->valVariable(isset($body["manager_name"]) ? $body["manager_name"] : null, "ชื่อผู้รับผิดชอบ");
$managerRole = $template->valVariable(isset($body["manager_role"]) ? $body["manager_role"] : null, "ตำแหน่งของผู้รับผิดชอบ");
$phoneNumber = $template->valVariable(isset($body["phone_number"]) ? $body["phone_number"] : null, "เบอร์โทร");
$affiliated = $template->valVariable(isset($body["affiliated"]) ? $body["affiliated"] : null, "สังกัด");
$locationDetail = $template->valVariable(isset($body["location_detail"]) ? $body["location_detail"] : null, "ที่อยู่");
$locationMainId = $template->valVariable(isset($body["location_main_id"]) ? $body["location_main_id"] : null, "ที่อยู่");
$vendorType = $template->valVariable(isset($body["vendor_type"]) ? $body["vendor_type"] : null, "ประเภทของ vendor");
$note = $template->valFilter(isset($body["note"]) ? $body["note"] : null);
$vendorLevel = $template->valVariable(isset($body["vendor_level"]) ? $body["vendor_level"] : null, "vendor level");


// array input id from frontend
$jobTypeIdInput = isset($body["job_type_array_id"]) ? $body["job_type_array_id"] : null;
if ($jobTypeIdInput === null) {
    $http->BadRequest(
        [
            "err" => "ไม่พบข้อมูล job type",
            "status" => 400
        ]
    );
}
$jobTypes = [];
foreach ($jobTypeIdInput as $value) {
    array_push($jobTypes, filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
}


/**
 * search a job type by name for get a id
 * 
 * @var array have only id should be founded
 */
$jobTypesId = [];
foreach ($jobTypes as $value) {
    $data = $vendorProjectService->getVendorJobTypeById($value);
    if (!$data) {
        $http->NotFound(
            [
                "err" => "not found a vendor job type",
                "status" => 404
            ]
        );
    }
    array_push($jobTypesId, $data["id"]);
}

$data = [
    "vendor_id" => $vendorId,
    "company_name" => $companyName,
    "email" => $email,
    "manager_name" => $managerName,
    "manager_role" => $managerRole,
    "phone_number" => $phoneNumber,
    "affiliated" => $affiliated,
    "location_detail" => $locationDetail,
    "location_main_id" => $locationMainId,
    "note" => $note,
    "vendor_type" => $vendorType,
    "vendor_level" => $vendorLevel
];

$vendorProjectService->startTransaction();

$vendorUpdated = $vendorProjectService->updateVendorById($data);
if(!$vendorUpdated){
    $vendorProjectService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "update vendor is falied please check you value",
            "status" => 403
        ]
    );
}

/**
 * delete a job type of vendor
 */
$deleteSuccess = $vendorProjectService->deleteJobTypeOfVendorByVendorId($vendorUpdated["id"]);
$jobTypeCreateds = [];
foreach($jobTypesId as $value){
    $data = [
        "vendor_id" => $vendorUpdated["id"],
        "job_type_id" => $value
    ];
    $createdJobTypes = $vendorProjectService->createJobTypeOfVendor($data);
    array_push($jobTypeCreateds, $createdJobTypes);
}

$vendorProjectService->commitTransaction();
$vendorUpdated["job_type"] = $jobTypeCreateds;
$http->Ok(
    [
        "data" => $vendorUpdated,
        "delete" => $deleteSuccess,
        "status" => 200
    ]
);
