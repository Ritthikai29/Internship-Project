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

$auth = new Userauth("Calculator", 1);
$token = isset($_SESSION['token']) ? $_SESSION['token'] : null;
$decode = $enc->jwtDecode($token);
if (!is_null($decode)) $auth->userAuthorize($decode->role, $decode->roleId);
#endregion

#region Get Data
$pj_id = $decode->projectCode;
$AuctionFile = $template->valFile($_FILES['AuctionFile'], "รายละเอียดราคากลาง");
$AuctionPrice = $template->valVariable($_POST['AuctionPrice'], "ราคากลาง");
$have = $template->valVariable($_POST['AuctionPrice'], "ราคากลางย่อย");
$subPrice = array();
if($have == 1){
    $subPrice = $template->ValArrVariable($_POST['SubPrice']);
}
#endregion

try {
    $cmd->setSqltxt("SELECT P.*, SP.PJ_STATUS AS Status, SP.PJ_HEX AS Hex FROM PROJECT P INNER JOIN STATUS_PROJECT SP ON P.PSTATUS_ID = SP.PSTATUS_ID WHERE P.PJ_ID = :pj_id");
    $cmd->bindParams(":pj_id", $pj_id);
    $ret = $cmd->query();

    $http->Ok($ret);
} catch (PDOException | Exception $e) {
    $cmd->generateLog($_SERVER['PHP_SELF'], $e->getMessage());
    $http->BadRequest();
}
