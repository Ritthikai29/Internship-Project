<?php
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("./newBiddingService.php");
include_once("../Template/SettingMailSend.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

// Create a new instance of the NewBidService class
$newBidService = new NewBidService();

// authorization
$auth = new Userauth();
$token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;
// Check token validate?
try {
    $decode = $enc->jwtDecode($token);
} catch (Exception $e) {
    $http->Unauthorize(["err" => "your token is expired"]);
}

$userId = isset($decode->vendorId) ? $decode->vendorId : null;

// Check is a post methods
if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

/**
 * * Get Project ID By project key
 * 
 */

$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");
$project = $newBidService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project key",
            "status" => 404
        ]
    );
}

// ! Check is the negotiation date has pass or not By Key
// Get Date Time Now
$nowDateTime = date("Y-m-d H:i:s");
// Check Time Scope
$timeScopeProject = ($newBidService->getTimeScopeProjectByProjectId($project['id']))['formatted_end_datetime'];
if ($nowDateTime > $timeScopeProject) {
    $http->Forbidden(
        [
            "err" => "The negotiation deadline has passed. You can no longer apply for negotiations.",
            "status" => 403
        ]
    );
}

// ! Check is Vendor have Permission to Create new Bidding
$nowVendorStatus = $newBidService->getVendorProjectStatusByProjectIdAndVendorId($project['id'], $userId);
if ($nowVendorStatus['status_name_en'] !== 'waiting' || $nowVendorStatus['status_name_en'] == NULL) {
    $http->Forbidden(
        [
            "err" => "You have no permission to send new bid",
            "status" => 403
        ]
    );
}

// Read and decode JSON data from the request body
$body = json_decode(file_get_contents('php://input'), true);

// !SEND BY DataForm
$price = $template->valVariable(isset($_POST["price"]) ? $_POST["price"] : null, "main offered price");

$jsonData = $_POST["subPrice"];
$subPrice = json_decode($jsonData);
$subDePrice = array();

if (isset($subPrice) && is_array($subPrice)) {
    foreach ($subPrice as $index => $subPriceItem) {
        // Initialize each element of $subDePrice as an associative array
        $subDePrice[$index] = array();

        // Assign properties to the element
        $subDePrice[$index]["detail"] = $template->valVariable(isset($subPriceItem->detail_price) ? $subPriceItem->detail_price : null, "sub offered detail");
        $subDePrice[$index]["price"] = $template->valVariable(isset($subPriceItem->price) ? $subPriceItem->price : null, "sub offered price");
    }
}


// !GET File from FormData
$boqFile = $template->valFile(isset($_FILES["boq_uri"]) ? $_FILES["boq_uri"] : null, "ไฟล์ BOQ");
$explaindetailsFile = $template->valFile($_FILES["explaindetails_uri"], "ไฟล์ Explaindetails");

/**
 * * Get User ID By vendor idreceipt_uri
 * 
 */

$vendor = $newBidService->getVendorInfoByVdId($userId);
if (!$vendor) {
    $http->NotFound(
        [
            "err" => "not found a vendor from vendor id",
            "status" => 404
        ]
    );
}

/**
 * * Check db if vendor register this project first time ?
 */

$info = $newBidService->getLastVendorRegisterInfoByPrAndVdId($project["id"], $userId);

// * Generate Vendor Key
$folderOld = scandir(__DIR__ . '/../../uploads');
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

// * Upload Vendor BOQ & Explaindetails
// ? Save file to server
$upload_path = __DIR__ . '/../../uploads/' . $vendorKey;
// ? file to save database path
$database_path = '/uploads/' . $vendorKey;

// 1. boq file
$fileExt = strtolower(pathinfo($boqFile["FileName"], PATHINFO_EXTENSION));
$boqLocation = $upload_path . '/boq-' . date('Y-m-d_H-i-s') . '.' . $fileExt;
$boqDatabase = $database_path . '/boq-' . date('Y-m-d_H-i-s') . '.' . $fileExt;
// 2. explaindetails file
$fileExt = strtolower(pathinfo($explaindetailsFile["FileName"], PATHINFO_EXTENSION));
$explaindetailsLocation = $upload_path . '/explaindetails-' . date('Y-m-d_H-i-s') . '.' . $fileExt;
$explaindetailsDatabase = $database_path . '/explaindetails-' . date('Y-m-d_H-i-s') . '.' . $fileExt;

/**
 * encrypt main price of Vendor
 */
$priceEncrypt = $enc->bidEncode($price);

$vendorProject = $newBidService->getVendorProjectByPjAndVdId((int) $project["id"], (int) $userId);

$newBidService->startTransaction();

/**
 * prepare Data
 */

$maxOrder = $newBidService->getCountBargainProjectByPid($project["id"]);
$data = [
    "price" => $priceEncrypt,
    "order" => $maxOrder['count'] +1,
    "boq_uri" => $boqDatabase,
    "explaindetails_uri" => $explaindetailsDatabase,
    "receipt_uri" => $info['receipt_uri'],
    "vendor_project_id" => (int) $vendorProject["id"],
    "prev_bidding_id" => (int) $info['regis_id'],
    "registers_status_id" => 7
];


// insert to db
// $res = $newBidService->insertRegister($data);
$res = $newBidService->updateRegister($data);
// if insert Failed
if (!$res) {
    $projectService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "vendor register insert failed",
            "status" => 400
        ]
    );
}

if ($subPrice) {
    /**
     *  "sub_price": [
     *  {"detail": "บ้าน A", "price": 50},
     *  {"detail": "บ้าน B", "price": 50}
     *  How to in sert ? 
     * -> do not know number of row.
     * 
     */

    $lastVenderRegisId = $newBidService->getLastVendorRegisterIdByVpId((int) $vendorProject["id"]);

    // insert sub price to db
    foreach ($subDePrice as $subDePriceItem) {
        // Encrypt the sub price
        $subDePriceItem['price'] = $enc->bidEncode($subDePriceItem['price']);

        // Prepare the data for insertion
        $data2 = [
            "detail" => $subDePriceItem['detail'],
            "price" => $subDePriceItem['price'],
            "vendor_register_id" => (int) $lastVenderRegisId['id']
        ];

        // Insert the data into the database
        $res2 = $newBidService->insertSubPrice($data2);

        // Check if the insertion was successful
        if (!$res2) {
            $projectService->rollbackTransaction();
            $http->BadRequest([
                "err" => "sub-price insert failed",
                "status" => 400
            ]);
        }
    }
}

// Create a Dir
if (!is_dir($upload_path)) {
    try {
        mkdir($upload_path, 0777, true);
    } catch (Exception $e) {
        $http->BadRequest([
            "err" => $e->getMessage(),
            "status" => 400
        ]);
    }
}

// move file from temp file
try {
    move_uploaded_file($boqFile["TempName"], $boqLocation);
    move_uploaded_file($explaindetailsFile["TempName"], $explaindetailsLocation);
} catch (Exception $e) {
    $projectService->rollbackTransaction();
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}

// ! Update Vendor Project Status
/**
 * prepare Data
 */

$data3 = [
    "vp_id" => (int) $vendorProject["id"],
    "vendor_status_id" => 4
];


// update to db
$res3 = $newBidService->updateVendorProjectStatusById($data3);
if (!$res3) {
    $newBidService->rollbackTransaction();
    $http->BadRequest(
        [
            "err" => "vendor register project status insert failed",
            "status" => 400
        ]
    );
}

//Update Log After Re-Quatation
if($project['status_id'] == 12){
    $check = $newBidService->getLogVendorProjectByProjectIDANDVendorID($project['id'],$userId);
    $data = [
        "log_vendor_project_id" => $check['id'],
        "action_detail" => "เสนอราคาแล้ว"
    ];

    $res = $newBidService->updateLogSecretarySendListVendor($data);
    if (!$res) {
        $http->BadRequest(
            [
                "err" => "ไม่สามารถอัพเดต Log ได้",
                "status" => 400
            ]
        );
    }
}

require(__DIR__ . "/mails/funcMailVendorRegis.php");

$mail->sendTo($vendor["email"]);
$mail->addSubject("[บริษัทได้รับการเสนอราคาของท่านในโครงการ $project[name] แล้ว ]");
$mail->addBody(htmlMailVendorRegis($project,$vendor));
// $success = !$_ENV["DEV"] ? $mail->sending() : true;
if ($_ENV["DEV"] === false) {
    $success = $mail->sending();

    if($success === null) {
        $projectEditService->rollbackTransaction();
        $http->NotFound(
            [
                "err" => "ไม่สามารถส่งอีเมลได้",
                "status" => 404
            ]
        );
    }
}

$mail->clearAddress();

$newBidService->commitTransaction();

$http->Ok([
    "data" => isset($res) ? $res : null,
    "data2" => isset($res2) ? $res2 : null,
    "data3" => isset($res3) ? $res3 : null,
    "status" => 200
]);
