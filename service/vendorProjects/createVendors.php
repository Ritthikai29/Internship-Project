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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}


$vendorProjectService = new VendorProjectService();

$body = json_decode(file_get_contents('php://input'), true);

$companyName = $template->valVariable(isset($body["company_name"]) ? $body["company_name"] : null, "ชื่อบริษััท");
$email = $template->valVariable(isset($body["email"]) ? $body["email"] : null, "email");
$managerName = $template->valVariable(isset($body["manager_name"]) ? $body["manager_name"] : null, "ชื่อผู้รับผิดชอบ");
$managerRole = $template->valVariable(isset($body["manager_role"]) ? $body["manager_role"] : null, "ตำแหน่งของผู้รับผิดชอบ");
$phoneNumber = $template->valVariable(isset($body["phone_number"]) ? $body["phone_number"] : null, "เบอร์โทร");
$affiliated = $template->valVariable(isset($body["affiliated"]) ? $body["affiliated"] : null, "สังกัด");
$location = $template->valVariable(isset($body["location"]) ? $body["location"] : null, "ที่อยู่");
$locationMainId = $template->valVariable(isset($body["location_main_id"]) ? $body["location_main_id"] : null, "ข้อมูลตามเลข zip");
$vendorType = $template->valVariable(isset($body["vendor_type"]) ? $body["vendor_type"] : null, "ประเภทของ vendor");
$vendorLevel = $template->valVariable(isset($body["vendor_level"]) ? $body["vendor_level"] : null, "vendor level");
$note = $template->valFilter(isset($body["note"]) ? $body["note"] : null);

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
foreach ($jobTypes as $key => $value) {
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

/**
 * find a location of vendor for inserted
 * 
 * @var array
 */
$getLocationMain = $vendorProjectService->getLocationMainById($locationMainId);
if(!$getLocationMain){
    $http->NotFound(
        [
            "err" => "not found a location",
            "status" => 404
        ]
    );
}

/**
 * gen vendor key
 * 
 * @var string
 */
/**
 * get last vendor to gen a code vendor key
 */
$prevVendor = $vendorProjectService->getLatestVendor();
$vendorKey = $prevVendor["vendor_key"]++;

 /**
  * gen vendor password
  */
$password = $vendorProjectService->getRandomString(10);
$password = '123';


$passwordHash = password_hash($password, PASSWORD_BCRYPT);

$data = [
    "vendor_key" => $vendorKey,
    "password" => $passwordHash,
    "company_name" => $companyName,
    "email" => $email,
    "manager_name" => $managerName,
    "manager_role" => $managerRole,
    "phone_number" => $phoneNumber,
    "affiliated" => $affiliated,
    "location_detail" => $location,
    "location_main_id" => $getLocationMain["id"],
    "note" => $note,
    "vendor_level" => $vendorLevel,
    "vendor_type" => $vendorType,
    "add_datetime" => date("Y-m-d H:i:s")
];

$vendorProjectService->startTransaction();
$vendorCreated = $vendorProjectService->createVendor($data);
if (!$vendorCreated) {
    $vendorProjectService->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "สร้างไม่สำเร็จ",
            "status" => 403
        ]
    );
}

$jobTypeCreateds = [];
foreach ($jobTypesId as $key => $value) {
    $data = [
        "vendor_id" => $vendorCreated["id"],
        "job_type_id" => $value
    ];
    $jobTypeCreated = $vendorProjectService->createJobTypeOfVendor($data);
    array_push($jobTypeCreateds, $jobTypeCreated);
}

$vendorProjectService->commitTransaction();

$vendorCreated["job_types"] = $jobTypeCreateds;
$vendorCreated["vendor_key"] = $vendorKey;
$vendorCreated["password"] = $password;

$http->Ok(
    [
        "data" => $vendorCreated,
        "status" => 200
    ]
);


// ? generate a random string 
function getRandomString($n) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
 
    for ($i = 0; $i < $n; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $randomString .= $characters[$index];
    }
 
    return $randomString;
}