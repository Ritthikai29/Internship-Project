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
$data_serach = $template->valVariable(isset($body["data_serach"]) ? $body["data_serach"] : null, "data_serach");
$expertise = $template->valVariable(isset($body["expertise"]) ? $body["expertise"] : null, "expertise");

$data = $service->getAllVendorListฺBySearch($data_serach, $expertise);

$addData = array();
$addJobId = array();
$temp = "";
$tempCount = 0;

//จัดเรียงและรวมข้อมูลในกรณีที่ vendor นั้นๆมีมากกว่า 1 ความเชี่ยวชาญ----------------------------------------------
if(count($data) == 1){
    $option = array(
        'value' => $data[0]['expertise_value'],
        'label' => $data[0]['expertise']);
    array_push($addJobId,$option);
    $data[0]['expertise_value'] = $addJobId;
    $addJobId = [];
    array_push($addData,$data[0]);
} else{
    for ($i = 0; $i < count($data); $i++) {
        if($i == 0){
            if($data[$i]['vendor_key'] == $data[$i+1]['vendor_key']){
                $temp = $data[$i]['expertise'];
                $tempCount = 1;
                $option = array(
                    'value' => $data[$i]['expertise_value'],
                    'label' => $data[$i]['expertise']);
                array_push($addJobId,$option);
            }else{
                $option = array(
                    'value' => $data[$i]['expertise_value'],
                    'label' => $data[$i]['expertise']);
                array_push($addJobId,$option);
                $data[$i]['expertise_value'] = $addJobId;
                $addJobId = [];
                array_push($addData,$data[$i]);
                
            }
        }elseif($i == count($data)-1){
            if($data[$i]['vendor_key'] == $data[$i-1]['vendor_key'] ){
                $option = array(
                    'value' => $data[$i]['expertise_value'],
                    'label' => $data[$i]['expertise']);
                array_push($addJobId,$option);
                $data[$i]['expertise_value'] = $addJobId;
                $data[$i]['expertise'] =  $temp . ' , ' . $data[$i]['expertise'];
                array_push($addData,$data[$i]);
                $addJobId = [];
                $temp = "";
                $tempCount = 0;
                
            }else{
                $option = array(
                    'value' => $data[$i]['expertise_value'],
                    'label' => $data[$i]['expertise']);
                array_push($addJobId,$option);
                $data[$i]['expertise_value'] = $addJobId;
                $addJobId = [];
                array_push($addData,$data[$i]);
            }
        }elseif($data[$i]['vendor_key'] == $data[$i+1]['vendor_key'] or $data[$i]['vendor_key'] == $data[$i-1]['vendor_key'] ){
            if($tempCount == 0){
                $temp = $data[$i]['expertise'];
                $tempCount = 1;
                $option = array(
                    'value' => $data[$i]['expertise_value'],
                    'label' => $data[$i]['expertise']);
                array_push($addJobId,$option);
            }elseif($data[$i]['vendor_key'] == $data[$i+1]['vendor_key']){
                $temp =  $temp . ' , ' . $data[$i]['expertise'];
                $option = array(
                    'value' => $data[$i]['expertise_value'],
                    'label' => $data[$i]['expertise']);
                array_push($addJobId,$option);
            }elseif($data[$i]['vendor_key'] == $data[$i-1]['vendor_key']){
                
                $option = array(
                    'value' => $data[$i]['expertise_value'],
                    'label' => $data[$i]['expertise']);
                array_push($addJobId,$option);
                $data[$i]['expertise_value'] = $addJobId;
                $addJobId = [];
                $data[$i]['expertise'] =  $temp . ' , ' . $data[$i]['expertise'];
                array_push($addData,$data[$i]);
                $temp = "";
                $tempCount = 0;
            }
        }elseif($data[$i]['vendor_key'] != $data[$i+1]['vendor_key'] and $data[$i]['vendor_key'] != $data[$i-1]['vendor_key']){
            $option = array(
                'value' => $data[$i]['expertise_value'],
                'label' => $data[$i]['expertise']);
            array_push($addJobId,$option);
            $data[$i]['expertise_value'] = $addJobId;
            $addJobId = [];
            array_push($addData,$data[$i]);
        }
    }
}
//จัดเรียงและรวมข้อมูลในกรณีที่ vendor นั้นๆมีมากกว่า 1 ความเชี่ยวชาญ----------------------------------------------


$http->Ok(
    [
        "data" => $addData,
        "status" => 200
    ]
);