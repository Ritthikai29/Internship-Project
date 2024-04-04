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

$body = json_decode(file_get_contents('php://input'), true);
$updateData = array(
    'add_datetime' => $template->valFilter(isset($body["add_datetime"]) ? $body["add_datetime"] : null),
    'company_name' =>  $template->valFilter(isset($body["company_name"]) ? $body["company_name"] : null),
    'affiliated' => $template->valFilter(isset($body["affiliated"]) ? $body["affiliated"] : null),
    'location_detail' =>  $template->valFilter(isset($body["location_detail"]) ? $body["location_detail"] : null),
    'location_main' =>  $template->valFilter(isset($body["location_main"]) ? $body["location_main"] : null),
    'manager_name' =>  $template->valFilter(isset($body["manager_name"]) ? $body["manager_name"] : null),
    'manager_role' =>  $template->valFilter(isset($body["manager_role"]) ? $body["manager_role"] : null),
    'phone_number' =>  $template->valFilter(isset($body["phone_number"]) ? $body["phone_number"] : null),
    'email' =>  $template->valFilter(isset($body["email"]) ? $body["email"] : null, "email"),
    'note' =>  $template->valFilter(isset($body["note"]) ? $body["note"] : null, "note"),
    'vendor_level' => $template->valFilter(isset($body["vendor_level"]) ? $body["vendor_level"] : null),
    'jobtype' => $template->valFilter(isset($body["jobtype"]) ? $body["jobtype"] : null),
    'expertise_value' => isset($body["expertise_value"]) ? $body["expertise_value"] : null,
    'vendor_key' => $template->valFilter(isset($body["vendor_key"]) ? $body["vendor_key"] : null)
);


$service->startTransaction();

$data = $service->updateVendorList($updateData);
if(!$data){
    $service->rollbackTransaction();
    $http->Forbidden(
        [
            "err" => "ไม่สามารถอัพเดต vendor ใน list ได้",
            "status" => 403
        ]
    );
}

$expertiseVendor = $service->getVendorListWithExpertiseByVid($updateData['vendor_key']);

//เก็บ id ความเชี่ยวชาญทั้งหมดล่าสุดของ vendor นั้นๆก่อนที่จะมีการอัพเดต
$temp = array();
foreach ($expertiseVendor as $ex) {
    array_push($temp,$ex['jobtype_id']);
}

if($expertiseVendor){
    foreach ( $updateData['expertise_value'] as $upd) {
        if (!in_array($upd['value'], $temp)) { 
            $index = $service -> getCountAllVendorWithExpertise();
            $creatVendorListWithExpertise = $service-> createVendorListWithExpertise((int)$index['count'],$data['vendor_id'],$upd['value']);
            if(!$creatVendorListWithExpertise){
                $service->rollbackTransaction();
                $http->Forbidden(
                    [
                        "err" => "ไม่สามารถเพิ่ม vendor เชื่อมกับความเชี่ยวชาญได้",
                        "status" => 403
                    ]
                );
            }  
        }    
        //เอา id ความเชี่ยวชาญที่ได้มีการสร้างขึ้นหรือมีอยู่แล้ว ออกไป
        $temp = array_diff( $temp, [$upd['value']]);  
    }
 

}else{
    $index = $service -> getCountAllVendorWithExpertise();
    $creatVendorListWithExpertise = $service-> createVendorListWithExpertise((int)$index['count'],$data['vendor_id'],$updateData['expertise_value'][0]['value']);
    if(!$creatVendorListWithExpertise){
        $service->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "ไม่สามารถเพิ่ม vendor เชื่อมกับความเชี่ยวชาญได้",
                "status" => 403
            ]
        );
    }
}

//ลบข้อมูลความเชี่ยวชาญตาม id ที่เหลืออยู่ ซึ่งเป็น id ที่ไม่ต้องการแล้วตามปัจจุบัน
foreach ($temp as $t) {
    $delete = $service->deleteVendorListWithExpertise($data['vendor_id'],$t);
    if(!$delete){
        $service->rollbackTransaction();
        $http->Forbidden(
            [
                "err" => "ไม่สามารถลบ vendor เชื่อมกับความเชี่ยวชาญได้",
                "status" => 403
            ]
        );
    }
}

$service->commitTransaction();

 
$http->Ok(
    [
        "data" =>  "อัพเดตสำเร็จ",
        "status" => 200
    ]
);