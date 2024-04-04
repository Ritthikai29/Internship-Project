<?php
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../middleware/authentication.php");

include_once("./newRegisterService.php");

$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$newRegisterService = new NewRegisterService();

if ($_SERVER["REQUEST_METHOD"] != 'GET')
    $http->MethodNotAllowed();

//------------------------------------AUTH-----------------------------------
try {
    $tokenDecode = JWTAuthorize($enc, $http);
} catch (Exception $e) {
    $http->Unauthorize(
        [
            "err" => "token is unauthorize",
            "status" => 401
        ]
    );
}
//---------------------------------END---AUTH-----------------------------------
$body = json_decode(file_get_contents('php://input'), true);

$user_id = $template->valVariable(isset($tokenDecode->vendorId) ? $tokenDecode->vendorId : null, "user ID");

$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null);


// * get parameter 'id' of vendor id
$vendorId = $user_id;
if (!$vendorId) {
    $http->NotFound(
        [
            "err" => "not found vendor from vendor id",
            "status" => 404
        ]
    );
}


/**
 * get project with project key
 */
$project = $newRegisterService->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "not found a project from project key",
            "status" => 404
        ]
    );
}


$registerInfo = $newRegisterService->getLastVendorRegisterInfoByPrAndVdId($project["id"],$vendorId);

/**
 * decrypt main price of Vendor
 */
$priceDecrypt = $enc->bidDecode($registerInfo["regis_price"]);
$registerInfo["regis_price"] = $priceDecrypt;

// * Check is vendor have sub price
$have_sub = 0;
$subPriceInfo = $newRegisterService->getSubPriceByVendorRegisterId($registerInfo["regis_id"]);

if (!empty($subPriceInfo)){
    $have_sub = 1;
    // Add '1' in column 'have_sub' in registerInfo 
    $registerInfo["have_sub"] = 1;
    // Decode sub price 'price' and add decode sub price ["price"] into column 'price'
    foreach ($subPriceInfo["price"] as $subPriceInfoItem){
        $subPriceInfoItem["price"] = $enc->bidDecode($subPriceInfoItem["price"]);
    }
    // Add subPriceInfo into registerInfo
    $registerInfo["sub_info"] = $subPriceInfo;
}

$http->Ok([
    "data" => $registerInfo,
    "status" => 200
]);


