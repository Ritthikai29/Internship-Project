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

    if($_SERVER["REQUEST_METHOD"] != 'GET') $http->MethodNotAllowed();

    $auth = new Userauth("Guest", 1);
    $token = isset($_SESSION['token']) ? $_SESSION['token'] : null;
    $decode = $enc->jwtDecode($token);
    if(!is_null($decode)) $auth->userAuthorize($decode->role, $decode->roleId);
#endregion

function getProject($cmd, $http){
    try{
        $cmd->setSqltxt("SELECT * FROM PROJECT");
        $ret = $cmd->queryAll();

        $http->Ok($ret);
    }
    catch(PDOException | Exception $e){
        $cmd->generateLog($cmd->getFunctionName(), $e->getMessage());
        $http->BadRequest();
    }
}

#region Interface

getProject($cmd, $http);

#endregion

?>