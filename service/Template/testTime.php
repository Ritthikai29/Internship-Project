<?php 
session_start();
include('SettingApi.php');
include("SettingEncryption.php");
include("SettingAuth.php");
include("SettingDatabase.php");


$auth = new Userauth();
$enc = new Encryption();

$token = isset($_SESSION['token']) ? $_SESSION['token'] : null;
// echo($token);
try{
    $decode = $enc->jwtDecode($token);
    echo var_dump($decode);
}catch(Exception $e){ 
    echo $e->getMessage();
}



// $auth->userAuthorizeWithoutRole($token);
