<?php
session_start();
include_once(__DIR__ . "/../Template/SettingApi.php");
include_once(__DIR__ . "/../Template/SettingTemplate.php");
include_once(__DIR__ . "/../Template/SettingAuth.php");
include_once(__DIR__ . "/../Template/SettingDatabase.php");
include_once(__DIR__ . "/../Template/SettingMailSend.php");
include_once(__DIR__ . "/../middleware/authentication.php");
include_once("../Template/SettingEncryption.php");

include_once(__DIR__ . "/adminService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$service = new AdminService();

$service->startTransaction();
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

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);
$password = password_hash('123',PASSWORD_BCRYPT);
$employeeNO = isset($data['employeeNO']) ? $data['employeeNO'] : null;
if((!empty($employeeNO) && is_array($employeeNO)) === false){
    $http->Forbidden(
        [
            "err" => "กรุณาเลือกพนักงานที่ต้องการ",
            "status" => 403
        ]
    );
}

$projectJobTypeId = isset($data['projectJobTypeId']) ? $data['projectJobTypeId'] : null;
if($projectJobTypeId === null){
    $http->Forbidden(
        [
            "err" => "กรุณาเลือก Role",
            "status" => 403
        ]
    );
}

//ทำการ loop เพื่อสร้างข้อมูลใน userstaff และ userstaffofrole
foreach ($employeeNO as $index => $employee) {
    $empId = $service -> getEmployeeByEmpNO($employee);
    if(!$empId){
        $http->NotFound(
            [
                "err" => "ไม่พบข้อมูล Employee ID",
                "status" => 404
            ]
        );
    }

    //ทำการเช็คว่าเคยมี user อยู่แล้วในระบบหรือไม่ หากมีแล้วจะทำการ update สถานะแทน หากไม่มีจะทำการสร้างใหม่
    // ** ตอนนี้หาก role เป็นประธาน ให้เปลี่ยนเป็นกรรมการทั้งหมดใน staffofrole
    $check = $service -> getUserstaffall($empId["id"]);
    if($check){
        $update = $service -> updateUserIsActiveandRole(1,$empId["id"],$projectJobTypeId);
        if(!$update){
            $http->Forbidden(
                [
                    "err" => "ไม่สามารถเพิ่ม user ได้",
                    "status" => 403
                ]
            );
        }
        if($projectJobTypeId === '4'){
            $Createofrole = $service -> updateRoleforuserstaff($check["id"],'5');
            if(!$Createofrole){
                $http->Forbidden(
                    [
                        "err" => "ไม่สามารถเพิ่ม userofrole ได้",
                        "status" => 403
                    ]
                );
            }
        }else{
            $Createofrole = $service -> updateRoleforuserstaff($check["id"],$projectJobTypeId);
            if(!$Createofrole){
                $http->Forbidden(
                    [
                        "err" => "ไม่สามารถเพิ่ม userofrole ได้",
                        "status" => 403
                    ]
                );
            }
        }
    }else{
        $Create = $service -> CreateUserstaffforAdmin($password,$projectJobTypeId,$empId["id"]);
        if(!$Create){
            $http->Forbidden(
                [
                    "err" => "ไม่สามารถเพิ่ม user ได้",
                    "status" => 403
                ]
            );
        }

        if($projectJobTypeId === '4'){
            $Createofrole = $service -> CreateUserstaffofroleforAdmin($Create["id"],'5');
            if(!$Createofrole){
                $http->Forbidden(
                    [
                        "err" => "ไม่สามารถเพิ่ม userofrole ได้",
                        "status" => 403
                    ]
                );
            }
        }else{
            $Createofrole = $service -> CreateUserstaffofroleforAdmin($Create["id"],$projectJobTypeId);
            if(!$Createofrole){
                $http->Forbidden(
                    [
                        "err" => "ไม่สามารถเพิ่ม userofrole ได้",
                        "status" => 403
                    ]
                );
            }
        }
    }
}


$service->commitTransaction();
$http->Ok(
    [
        "data" => "สำเร็จ",
        "status" => 200
    ]
);
