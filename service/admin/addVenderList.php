<?php
session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/../middleware/authentication.php");
include_once(__DIR__ . "/../Template/SettingEncryption.php");
include_once(__DIR__ . "/adminService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$service = new AdminService();

// เช็ค HTTP request methods ว่าเป็น PATCH methods ไหม
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

// เช็ค authorize
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบข้อมูล user นี้",
            "status" => 401
        ]
    );
}

// เช็คว่าเป็น admin จริงไหม
$user = $service->getUserByIdAndRole($userId,"admin");
if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่ Admin ไม่มีสิทธิ์ในการกระทำดังกล่าว",
            "status" => 401
        ]
    );
}

$num = $service->getCountAllVendor();
if($num['count'] >= '999'){
    $num['count'] = 'V'.(int)$num['count'] + 1;
} elseif($num['count'] >= '99'){
    $num['count'] = 'V0'.(int)$num['count'] + 1;
} elseif($num['count'] >= '9'){
    $num['count'] = 'V00'.(int)$num['count'] + 1;
}else{
    $num['count'] = 'V000'.(int)$num['count'] + 1;
}

$body = json_decode(file_get_contents('php://input'), true);
$addData = array(
    'vendor_key' => $num['count'],
    'add_datetime' => date("Y-m-d H:i:s") ,
    'company_name' =>  $template->valVariable(isset($body["company_name"]) ? $body["company_name"] : null, "company_name"),
    'affiliated' => $template->valVariable(isset($body["affiliated"]) ? $body["affiliated"] : null, "affiliated"),
    'location' =>  $template->valVariable(isset($body["location"]) ? $body["location"] : null, "location"),
    'location_main' =>  $template->valVariable(isset($body["location_main"]) ? $body["location_main"] : null, "location_main"),
    'manager_name' =>  $template->valVariable(isset($body["manager_name"]) ? $body["manager_name"] : null, "manager_name"),
    'manager_role' =>  $template->valVariable(isset($body["manager_role"]) ? $body["manager_role"] : null, "manager_role"),
    'phone_number' =>  $template->valVariable(isset($body["phone_number"]) ? $body["phone_number"] : null, "phone_number"),
    'email' =>  $template->valVariable(isset($body["email"]) ? $body["email"] : null, "email"),
    'note' =>  $template->valVariable(isset($body["note"]) ? $body["note"] : null, "note"),
    'vendor_level' => $template->valVariable(isset($body["vendor_level"]) ? $body["vendor_level"] : null, "vendor_level"),
    'vendor_type' => 'list',
    'jobtype' => $template->valVariable(isset($body["jobtype"]) ? $body["jobtype"] : null, "jobtype"),
    'password' => password_hash('123',PASSWORD_BCRYPT)
);

$expertise = $template->valVariable(isset($body["expertise"]) ? $body["expertise"] : null, "expertise");

$service -> startTransaction();

$creatVendorList = $service -> createVendorList($addData);
    if(!$creatVendorList){
        $service->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "ไม่สามารถเพิ่ม vendor ใน list ได้",
                "status" => 403
            ]
        );
    }
$index = $service -> getCountAllVendorWithExpertise();
$creatVendorListWithExpertise = $service-> createVendorListWithExpertise((int)$index['count'],$creatVendorList['id'],$expertise);
    if(!$creatVendorListWithExpertise){
        $service->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "ไม่สามารถเพิ่ม vendor เชื่อมกับความเชี่ยวชาญได้",
                "status" => 403
            ]
        );
}
$service -> commitTransaction();

$http->Ok(
    [
        "data" =>  $creatVendorList,
        "status" => 200
    ]
);