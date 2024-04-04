<?php 
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingMailSend.php");

include_once("./funcVendorUpdate.php");

// Call service for connect to database of 'RegisterService'
include_once("./registerProjectService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

// Create a new instance of the RegisterService class
$registerProjectService = new RegisterService();

// authorization
$auth = new Userauth();
$token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;
// Check token validate?
try {
    $decode = $enc->jwtDecode($token);
} catch (Exception $e) {
    $http->Unauthorize(["err" => "your token is expired"]);
}

/**
 * POST METHOD 
 * send all data to this endpoint 
 */
if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

/**
 * body from req POST method
 */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * Recieve a data from Req body
 * 
 */
$projectKey = $template->valVariable(isset($_POST["p_key"]) ? $_POST["p_key"] : null, "project key");

$price = $template->valVariable(isset($_POST["price"]) ? $_POST["price"] : null, "main offered price");
$have = $template->valVariable(isset($_POST["AuctionPrice"]) ? $_POST["AuctionPrice"] : null, "sub offered price");
// $subPrice = array();
// if($have == 1){
//     $subPrice = $template->ValArrVariable($_POST["subPrice"]);
// }
$boqFile = $template->valFile(isset($_FILES["boq_uri"]) ? $_FILES["boq_uri"] : null, "ไฟล์ BOQ");
$receiptFile = $template->valFile(isset($_FILES["receipt_uri"]) ? $_FILES["receipt_uri"] : null, "ไฟล์ RECEIPT");

/**
 * * Get User ID By vendor id
 * 
 */

 $userId = isset($decode->vendorId) ? $decode->vendorId : null;

/**
 * 
 * GET Project By Key
 */
$project = $registerProjectService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project",
            "status" => 404
        ]
    );
}

/**
 * * Check db if vendor register this project first time ?
 * 
 */

$info = $registerProjectService->getLastVendorRegisterInfoByPrAndVdId((int)$project["id"],(int)$userId);

// * Generate Vendor Key
$folderOld = scandir('../../uploads');
do {
    function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }
    $vendorKey = "vd-" . generateRandomString(16);
} while (in_array($vendorKey, $folderOld));

// * Upload Vendor BOQ & Receipt
// ? Save file to server
$upload_path = '../../uploads/' . $vendorKey;
// ? file to save database path
$database_path = '/uploads/' . $vendorKey;

// 1. boq file
$fileExt = strtolower(pathinfo($boqFile["FileName"], PATHINFO_EXTENSION));
$boqLocation = $upload_path . '/boq-' . date('Y-m-d_H-i-s') . '.' . $fileExt;
$boqDatabase = $database_path . '/boq-' . date('Y-m-d_H-i-s') . '.' . $fileExt;
// 2. receipt file
$fileExt = strtolower(pathinfo($receiptFile["FileName"], PATHINFO_EXTENSION));
$receiptLocation = $upload_path . '/receipt-' . date('Y-m-d_H-i-s') . '.' . $fileExt;
$receiptDatabase = $database_path . '/receipt-' . date('Y-m-d_H-i-s') . '.' . $fileExt;

/**
 * encrypt main price of Vendor
 */
$priceEncrypt = $enc->bidEncode($price);

$vendorProject = $registerProjectService->getVendorProjectByPjAndVdId((int)$project["id"],(int)$userId);

/**
 * prepare Data
 */

 $data = [
    "vendor_register_id" => (int)$info["regis_id"],
    "price" => $priceEncrypt,
    // File Location
    "boq_uri" => $boqDatabase,
    "receipt_uri" => $receiptDatabase,
    "order" => (int)$info["order"],
    "vendor_project_id" => (int)$info["proj_id"]
];

$registerProjectService->startTransaction();

// update to db
$res = $registerProjectService->updateRegisterById($data);

// if insert Failed
if (!$res) {
    $registerProjectService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "vendor register insert failed",
            "status" => 400
        ]
    );
}

$registerProjectService->commitTransaction();

$listContractorsEmails = $registerProjectService->listEmailOfContractor();

/**
 * send a email to all contractor
 */
$subjectEmail = "(แจ้งอัพเดต) ข้อมูลการสมัครของรายการ " . (int)$info["regis_id"];
$body = file_get_contents("./funcVendorUpdate.php"); 
foreach($listContractorsEmails as $contractor){
    $mail->sendTo($contractor["email"]);
    $mail->addSubject($subjectEmail);
    $mail->addBody($body);
    $mail->addBody(htmlMail((int)$info["regis_id"],$contractor));

    $mail->sending();
}

$http->Ok([
    "data" => $res,
    "status" => 200
]);




