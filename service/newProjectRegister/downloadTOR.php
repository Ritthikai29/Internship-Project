<?php
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");

include_once("./newRegisterService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$newRegisterService = new NewRegisterService();

if ($_SERVER["REQUEST_METHOD"] != 'GET')
    $http->MethodNotAllowed();

$body = json_decode(file_get_contents('php://input'), true);

$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key" );

$project = $registerProjectService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project key",
            "status" => 404
        ]
    );
}

// Download TOR file
$torURI = $project['Tor_uri'];

if ($torURI) {
    // Define the full server path to the file
    $fullPath = '../..' . $torURI;

    /**
     * !!! Warning -> this is source code for download file on server side not on client
     * ! comment it when use on product
     */

    // Check if the file exists
    if (file_exists($fullPath)) {
        // Set appropriate headers for file download
        header('Content-Description: File Transfer');
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . basename($fullPath) . '"');
        header('Content-Length: ' . filesize($fullPath));
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');

        // Output the file content
        readfile($fullPath);
        exit();
    } else {
        $http->NotFound(
            [
                "err" => "File not found on the server.",
                "status" => 404
            ]
        );
    }
} else {
    $http->BadRequest(
        [
            "err" => "The 'Tor uri' is empty or not retrieved from the service.",
            "status" => 400
        ]
    );
}

$http->Ok([
    "status" => 200
]);