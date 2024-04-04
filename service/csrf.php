<?php
session_start();
include("./Template/SettingApi.php");
require_once('csrfService.php'); // Include the CSRF protection functions

$http = new Http_Response();

$csrfToken = generateCSRFToken();
$_SESSION['csrf_token'] = $csrfToken; // Store the token in the session

$http->Ok([
    "csrfToken" => $csrfToken
]);