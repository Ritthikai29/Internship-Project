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
 * to login shoule guery from a employee NO to find a emp id 
 * use emp id to find in user staff to get password
 * validate password
 * if ok check user is ok send a access token
 * if invalid something send 401 code
 */

if ($_SERVER["REQUEST_METHOD"] != 'POST') $http->MethodNotAllowed();

$body = json_decode(file_get_contents('php://input'), true);

/**
 * to get a employee No from a user when user login
 * 
 * @var string
 * 
 */
$empNO = $template->valVariable(isset($body["empNO"]) ? $body["empNO"] : null, "Employee No" );

/**
 * to get a  password from client to validate password
 * 
 * @var string
 * 
 */
$password = $template->valFilter($body["password"]); // dev = 123



/**
 * query a [user has employee has user_role] by employee id 
 */
try{
    $user = $loginService->getEmployeeByEmployeeNO($empNO);
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
        "err" => "Some thing wrong",
        "status"=> 404
    ]);
}


// check password 
// ถ้าไม่ผ่านเข้า Function
$check = password_verify($password, $user["password"]);
if(!$check){
    $http->Unauthorize([
        "err" => "your password is wrong"
    ]);
};


// create token 
$_SESSION["token"] = $enc->jwtEncode($user["role_name"], $user["user_id"] );

$http->Ok([
    "data" => $user,
    "session" => $_SESSION["token"],
    "status" => 200
]);


