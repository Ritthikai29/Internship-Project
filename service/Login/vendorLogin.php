<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include('./LoginService.php');


$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$loginService = new StaffLogin();

/**
 * to login should query from a vendor Key to find a vendor id 
 * validate password
 * if ok check user is ok send a access token
 * if invalid something send 401 code
 */

if ($_SERVER["REQUEST_METHOD"] != 'POST') $http->MethodNotAllowed();

$body = json_decode(file_get_contents('php://input'), true);

/**
 * to get a vendor Key from a user when user login
 * 
 * @var string
 * 
 */
$vendKey = $template->valVariable(isset($body["vend_key"]) ? $body["vend_key"] : null, "Vendor Key" );

/**
 * to get a  password from client to validate password
 * 
 * @var string
 * 
 */
$password = $template->valFilter($body["password"]);



/**
 * query a [user has vendor has user_role] by vendor id 
 */
try{
    $user = $loginService->getVendorByVendorKey($vendKey);
}catch(PDOException | Exception $e){
    $http->NotFound(
        [
            "err" => "Some thing wrong",
            "status"=> 404
        ]
    );
}

if(!$user){
    $http->NotFound([
        "err" => "not found a vendor @ number $vendKey",
        "status"=> 404
    ]);
}


// check password 
// ถ้าไม่ผ่านเข้า Function
$check = password_verify($password, $user["password"]);
if(!$check){
    $http->Unauthorize([
        "err" => "your password is wrong",
        "status" => 401
    ]);
};


// create token 
$_SESSION["token"] = $enc->jwtEncode( null, null, $user["id"] );

$http->Ok([
    "data" => $user,
    "session" => $_SESSION["token"],
    "status" => 200
]);


