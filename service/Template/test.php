<?php
session_start();
include('SettingEncryption.php');
include('SettingApi.php');
$encrypt = new Encryption();
$response = new Http_Response();


// Create a Test Token from JWT Token
function getToken($encrypt)
{
    return $encrypt->jwtEncode(1, $role = 'Staff', 6);
}

function decodeToken($encrypt, $token)
{
    return $encrypt->jwtDecode($token);
}
// $token = getToken($encrypt);

// $_SESSION['token'] = $token;

// For encode a token to data
$detoken = decodeToken($encrypt,$_SESSION['token']);

$response -> Ok(
    [
        "token" => $_SESSION['token'],
        "decode" => $detoken,
    ]
);


// function getToken($cmd)
// {
//     try {
//         $cmd->setSqltxt("INSERT INTO staff_role VALUES(:role_id, :role_name)");
//         $cmd->bindParams(":role_id", 55);
//         $cmd->bindParams(":role_name", "Test2");
//         $cmd->execute();
//     } catch (PDOException | Exception $e) {
//         $cmd->generateLog($cmd->getFunctionName(), $e->getMessage());
//     }
// }
// getToken($cmd);