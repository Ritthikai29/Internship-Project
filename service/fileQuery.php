<?php
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:80',
    'http://localhost'
];
$domain = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : null;
if (in_array($domain, $allowedOrigins)) {
    $http_origin = $domain;
} else {
    $http_origin = "*";
}

header("Content-type:application/pdf");
header("Access-Control-Allow-Origin: $http_origin");

$page = $_GET["page"];

echo file_get_contents($_SERVER['DOCUMENT_ROOT']."/STSBidding".$page);