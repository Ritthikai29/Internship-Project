<?php
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:80',
    'http://localhost',
    'http://127.0.0.1:5173'
];
$domain = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : null;
if (in_array($domain, $allowedOrigins)) {
    $http_origin = $domain;
} else {
    $http_origin = "*";
}
header("Access-Control-Allow-Origin: $http_origin");
header('Access-Control-Allow-Credentials: true');
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

include_once("../Template/SettingDatabase.php");

$cmd = new Database();
while (true) {
    // Perform the necessary server ping and retrieve data
    $pingData = getServerPingData(); // Define this function according to your needs

    $cmd->setSqltxt("");
    // Send the data to the client
    echo "data: " . json_encode($pingData) . "\n\n";

    // Flush the output buffer to ensure data is sent to the client
    ob_flush();
    flush();

    // Wait for a specified interval before pinging the server again
    sleep(5);  // Adjust the interval as needed
}

function getServerPingData() {
    // Logic to get server ping data
    // Replace this with your actual logic to retrieve server data
    $pingData = ['ping' => 'pong'];

    return $pingData;
}
