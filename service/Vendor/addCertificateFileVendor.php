<?php

session_start();

include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");
include_once("./vendorService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$vendorService = new vendorService();


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$token = JWTAuthorize($enc, $http);
$vendorId = isset($token->vendorId) ? $token->vendorId : null;
if (!$vendorId) {
    $http->Unauthorize(
        [
            "err" => "ไม่พบข้อมูล Vendor กรุณา Login ใหม่",
            "status" => 401
        ]
    );
}

$body = json_decode(file_get_contents('php://input'), true);

$vendorKey = $template->valVariable(isset($_POST["vendor_key"]) ? $_POST["vendor_key"] : null, "vendor_key");

$vendorFile = $template->valFile(isset($_FILES["vendor_file"]) ? $_FILES["vendor_file"] : null, "ไฟล์ของVendor");


    $upload_path = '../../vendors/' . $vendorKey;
    // file to save database path
    $database_path = '/vendors/' . $vendorKey;

        $fileExt = strtolower(pathinfo($vendorFile["FileName"], PATHINFO_EXTENSION));
        $certificateLocation = $upload_path . '/certificate.' . $fileExt;
        $certificateDatabase = $database_path . '/certificate.' . $fileExt;

        $data=[
            "certificate_uri"=> $certificateDatabase,
            "vendor_key"=> $vendorKey            
        ];
        
        $vendorService->startTransaction();
        $fileSaved = $vendorService->updatecertificateFileVendor($data); 
        if (!$fileSaved) {
            $vendorService->rollbackTransaction();
            $http->Forbidden(
                [
                    "err" => "can't create file",
                    "status" => 403
                ]
            );
        }
        /**
     * create a directory for project 
     */
        if (!is_dir($upload_path)) {
            try {
                mkdir($upload_path, 0777, true);
            } catch (Exception $e) {
                $http->BadRequest(["err" => $e->getMessage()]);
            }
        }

        try {
            move_uploaded_file($vendorFile["TempName"], $certificateLocation);
        } catch (Exception $e) {
            $vendorService->rollbackTransaction();
            $http->BadRequest([
                "err" => $e->getMessage(),
                "status" => 400
            ]);
        }
        $vendorService->commitTransaction();
        $http->Ok([
            "data" => $fileSaved,
            "status" => 200
        ]);
     