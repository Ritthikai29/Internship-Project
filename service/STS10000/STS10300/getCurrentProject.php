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

if ($_SERVER["REQUEST_METHOD"] != 'POST') $http->MethodNotAllowed();

// create a role starting [Think Create what role can access this]
$auth = new Userauth("Staff", 1); 
// GET TOKEN FROM _SESSION
$token = isset($_SESSION['token']) ? $_SESSION['token'] : null;
$decode = $enc->jwtDecode($token);

// Authorized a user 
if (is_null($decode)) $auth->userAuthorize(null, null);
else $auth->userAuthorize($decode->role, $decode->roleId);
#endregion

#region Get Data
$statusId = $template->valFilter($_POST['StatusId']);
#endregion

$where = "";
if (!is_null($statusId)) $where = " WHERE P.statusId = :statusId";
try {
    $cmd->setSqltxt("SELECT * FROM PROJECT P INNER JOIN STATUS_PROJECT SP ON P.statusId = SP.statusId {$where}");
    if (!is_null($statusId)) $cmd->bindParams(":statusId", $statusId);
    $ret = $cmd->queryAll();

    $http->Ok($ret);
} catch (PDOException | Exception $e) {
    $cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
    $http->BadRequest();
}
