<?php
#region Include Files
session_start();
include("../../Template/SettingApi.php");
include("../../Template/SettingDatabase.php");
include("../../Template/SettingTemplate.php");
include("../../Template/SettingEncryption.php");
include("../../Template/SettingAuth.php");
$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

if ($_SERVER["REQUEST_METHOD"] != 'GET') $http->MethodNotAllowed();

    $auth = new Userauth("Staff", 1);
    // This case will be add data to cookies on your website
    $token = isset($_SESSION['token']) ? $_SESSION['token'] : null;
    $decode = $enc->jwtDecode($token);
    if(is_null($decode)) $auth->userAuthorize(null, null);
    else $auth->userAuthorize($decode->role, $decode->roleId);
#endregion

try {
    $cmd->setSqltxt("SELECT * FROM PROJECT LIMIT 5");
    $ret = $cmd->queryAll();

    $http->Ok($ret);
} catch (PDOException | Exception $e) {
    $cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
    $http->BadRequest();
}
