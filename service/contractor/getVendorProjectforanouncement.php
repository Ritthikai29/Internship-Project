<?php
session_start();
include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");
include_once("./contractorservice.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$projectService = new contractorservice();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
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

//Check Role of User
$role = $projectService->getRoleByUserId($userId);


$key=$template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null);
$vendorresult = $projectService->getVendorProjectXByKey($key);
$newResult = [];



    $countBidding = $projectService->getCountBargainProjectByPid($vendorresult[0]["project_id"]);
    
    foreach ($vendorresult as $index => $vendor) {
        $vendorresult[$index]['history_price'] = $projectService->getAllVendorRegisterByVpid($vendor["id"], $enc);
        
        if($vendorresult[$index]['history_price'][0]['registers_status_id'] == 12 ){
            $vendorresult[$index]['history_price'][0]['price'] = 'ไม่มีการเสนอราคา';
        }
        if($vendorresult[$index]['history_price'][0]['registers_status_id'] == 11) {
            $vendorresult[$index]['history_price'][0]['price'] = 'สละสิทธิ์';
        }
        // if($vendorresult[$index]['history_price'][0]['registers_status_id'] == 10){
        //     $vendorresult[$index]['history_price'][0]['price'] =  $vendorresult[$index]['history_price'][0]['price'];
        // }    
        
        $addData = array();
        array_push($addData,$vendorresult[$index]['history_price'][0]);
        if  (   (count($vendorresult[$index]['history_price']) > 1) or 
                (count($vendorresult[$index]['history_price']) == 1 && ($countBidding['count'] != null ))
            )
        {
            for ($x = 1; $x <= $countBidding['count']; $x++) { 
                $check = 1;
                if($x > 1){    
                    foreach ($vendorresult[$index]['history_price'] as $i => $history_price) {
                        if($x  == $history_price['order']){
                           
                            if($history_price['registers_status_id'] == 11) {
                                $history_price['price'] = 'สละสิทธิ์';
                            } else if ($history_price['registers_status_id'] == 12) {
                                $history_price['price'] = 'ไม่มีการเสนอราคา';
                            }
                          
                            array_push($addData,$history_price);
                            $check = 0;
                        }
                        $vendorresult[$index]['history_price'] = $addData;
                    }
                    if( $check == 1){
                        array_push($addData,['price' => 'ไม่ถูกเชิญเจรจา']);
                    }
                }
            }
        } 
        $vendorresult[$index]['history_price'] = $addData;      
    }


foreach ($vendorresult as $index => $value) {
    // Get bid price and new bid price by vendor project ID
    $price = $projectService->getBidPriceByVendorProjectId($value["id"]);
    $new = $projectService->getNewBidPriceByVendorProjectId($value["id"]);
    // Check user role
    if ($role['role_name'] == "secretary" || $role['role_name'] == "committee" || $role['role_name'] == "chairman") {
        // Secretary or committee role logic
        $vendorresult[$index]["price"] = $price ? (float) $enc->bidDecode($price["price"]) : null;
        $vendorresult[$index]["newPrice"] = $new ? (float) $enc->bidDecode($new["price"]) : null;
        if($vendorresult[$index]["newPrice"] && ($vendorresult[$index]["newPrice"] <= $vendorresult[$index]["price"])){
            $vendorresult[$index]["compare"] = $vendorresult[$index]["newPrice"];
        } else {
            $vendorresult[$index]["compare"] = $vendorresult[$index]["price"];
        }
    } else {
        // Other roles logic
        if ($value['status_name_th'] == "ชนะการประกวด") {
            $vendorresult[$index]["price"] = $price ? (float) $enc->bidDecode($price["price"]) : null;
            $vendorresult[$index]["newPrice"] = $new ? (float) $enc->bidDecode($new["price"]) : null;
        } else {
            $vendorresult[$index]["price"] = "ไม่เปิดเผย";
            $vendorresult[$index]["newPrice"] = "ไม่เปิดเผย";
        }
    }
}
    $http->Ok(
        [
            "data" => $vendorresult, 
            "countBidding" => $countBidding['count'],       
            "status" => 200
        ]
    );

