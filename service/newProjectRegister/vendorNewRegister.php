<?php 
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingMailSend.php");
include_once("./funcSecNewRegis.php");

include_once("./newRegisterService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$newRegisterService = new NewRegisterService();

if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

// authorization
$auth = new Userauth();
$token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;
// Check token validate?
try {
    $decode = $enc->jwtDecode($token);
} catch (Exception $e) {
    $http->Unauthorize(["err" => "your token is expired"]);
}

// Read and decode JSON data from the request body
$body = json_decode(file_get_contents('php://input'), true);

// !SEND BY DataForm
$price = $template->valVariable(isset($_POST["price"]) ? $_POST["price"] : null, "main offered price");
$have = $template->valVariable(isset($_POST["AuctionPrice"]) ? $_POST["AuctionPrice"] : null, " have sub offered price");


// Decode the JSON string into a PHP array
$jsonData = $_POST["subPrice"];
$subPrice = json_decode($jsonData);
$subDePrice = array();

if ($have == 1 && isset($subPrice) && is_array($subPrice)) {
    foreach ($subPrice as $index => $subPriceItem) {
        // Initialize each element of $subDePrice as an associative array
        $subDePrice[$index] = array();

        // Assign properties to the element
        $subDePrice[$index]["detail"] = $template->valVariable(isset($subPriceItem->detail) ? $subPriceItem->detail : null, "sub offered detail");
        $subDePrice[$index]["price"] = $template->valVariable(isset($subPriceItem->price) ? $subPriceItem->price : null, "sub offered price");
    }
}


// !GET File from FormData
$boqFile = $template->valFile(isset($_FILES["boq_uri"]) ? $_FILES["boq_uri"] : null, "ไฟล์ BOQ");
$receiptFile = $template->valFile($_FILES["receipt_uri"], "ไฟล์ RECEIPT");

/**
 * * Get User ID By vendor id
 * 
 */

$userId = isset($decode->vendorId) ? $decode->vendorId : null;

$vendor = $newRegisterService->getVendorInfoByVdId($userId);
if (!$vendor) {
    $http->NotFound(
        [
            "err" => "not found a vendor from vendor id",
            "status" => 404
        ]
    );
}

/**
 * * Get Project ID By project key
 * 
 */

$projectKey = $template->valVariable(isset($_GET["p_key"]) ? $_GET["p_key"] : null, "project key" );
$project = $newRegisterService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project key",
            "status" => 404
        ]
    );
}

// Get order of register
$order = 0;

/**
 * * Check db if vendor register this project first time ?
 * 
 */

 $info = $newRegisterService->getLastVendorRegisterInfoByPrAndVdId($project["id"],$userId);
 if ($info !== false){
    // Check if the "order" key exists in the array before incrementing
    if (isset($info["order"])) {
        $order = (int) $info["order"] + 1;
    }
} else {
        // If "order" key is not defined, handle the error or provide a default value
        $order = 1;
}

/**
 * check a datetime is can be inserted ?
 */
if($order !== 1){
    $bargainSetting = $newRegisterService->getBargainSettingByProjectId($project["id"]);
    
}

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

$vendorProject = $newRegisterService->getVendorProjectByPjAndVdId((int)$project["id"],(int)$userId);

// Get Vendor Register info
$vendorRegisterInfo = $newRegisterService->getVendorRegisterInfoByVdIdAndPjId((int)$userId ,(int)$project['id']);

$newRegisterService->startTransaction();

/**
 * prepare Data
 */

$data = [
    "price" => $priceEncrypt,
    "boq_uri" => $boqDatabase,
    "receipt_uri" => $receiptDatabase,
    "order" => (int)$order,
    "vendor_project_id" => (int)$vendorProject["id"],
    "prev_bidding_id" => (int)$vendorRegisterInfo["id"]
];


// insert to db
$res = $newRegisterService->insertNewRegister($data);

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

if ($have == 1){
    /**
     *  "sub_price": [
     *  {"detail": "บ้าน A", "price": 50},
     *  {"detail": "บ้าน B", "price": 50}
     *  How to in sert ? 
     * -> do not know number of row.
     * 
     */

    $lastVenderRegisId = $newRegisterService->getLastVendorRegisterIdByVpId((int)$vendorProject["id"]);

    // insert sub price to db
    foreach ($subDePrice as $subDePriceItem) {
        // Encrypt the sub price
        $subDePriceItem['price'] = $enc->bidEncode($subDePriceItem['price']);
        
        // Prepare the data for insertion
        $data2 = [
            "detail" => $subDePriceItem['detail'],
            "price" => $subDePriceItem['price'],
            "vendor_register_id" => (int)$lastVenderRegisId['id']
        ];
        
        // Insert the data into the database
        $res2 = $newRegisterService->insertSubPrice($data2);
        
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
    move_uploaded_file($receiptFile["TempName"], $receiptLocation);
} catch (Exception $e) {
    $projectService->rollbackTransaction();
    $http->BadRequest([
        "err" => $e->getMessage(),
        "status" => 400
    ]);
}

// * Get data Secretary of project for send e-mail
$secretaryEmail = $approveResultService->getSecretaryInfoByProjectId($project["id"]);

/**
 * send a email to Secretary
 */

$mail->sendTo($secretaryEmail);

$subjectEmail = "โปรดอนุมัติการแจ้งงาน โครงการ$project[name] เลขที่เอกสาร $projectKey ";
$body = file_get_contents("./funcSecNewRegis.php"); 

$mail->addSubject($subjectEmail);
$mail->addBody($body);
$mail->addBody(htmlMail($project));

$mail->sending();

$newRegisterService->commitTransaction();
$http->Ok([
    "data" => $res,
    "data2" => $res2,
    "status" => 200
]);