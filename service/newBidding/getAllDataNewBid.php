<?php 
session_start();

include_once("../Template/SettingApi.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingAuth.php");
include("./../middleware/authentication.php");
include_once("./newBiddingService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

// Create a new instance of the NewBidService class
$newBidService = new NewBidService();

// IF REQUEST_METHOD IS NOT 'GET' -> MethodNotAllowed
if ($_SERVER["REQUEST_METHOD"] != 'GET')
    $http->MethodNotAllowed();


//----------------AUTH---------------------//
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
$user_id = $template->valVariable(isset($tokenDecode->vendorId) ? $tokenDecode->vendorId : null, "user ID");

/**
 * ! Recieve data from GET body
 */
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key" );

// ! Get Project From Project Key
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
if ($nowDateTime > $timeScopeProject){
    $http->Forbidden(
        [
            "error" => "The negotiation deadline has passed. You can no longer apply for negotiations.",
            "status" => 403
        ]
    );
}

// ! Check is Vendor have Permission to Create new Bidding
$nowVendorStatus = $newBidService->getVendorProjectStatusByProjectIdAndVendorId($project['id'],$user_id);
if ($nowVendorStatus['status_name_en'] !== 'waiting' || $nowVendorStatus['status_name_en'] == NULL){
    $http->Forbidden(
        [
            "err" => "You have no permission to send new bid",
            "status" => 403
        ]
    );
}

// ! Get Project Sub price if have
// * Array contain SubBudget
try {
    $SubBudget = $newBidService->getListSubBudgetByProjectId($project["id"]);
} catch (Exception $e) {
    $SubBudget = null;
}

// ! Get Project information and Project Setting
$projectSetting = $newBidService->getProjectSettingByProjectId($project["id"]);
if ($nowVendorStatus['status_name_en'] !== 'waiting' || $nowVendorStatus['status_name_en'] == NULL){
    $http->NotFound(
        [
            "err" => "Not Found Project Setting",
            "status" => 404
        ]
    );
}

// ! Get Previous Bid of Vendor
$registerInfo = $newBidService->getLastVendorRegisterInfoByPrAndVdId($project["id"],$user_id);
if (!$registerInfo){
    $http->NotFound(
        [
            "err" => "not found vendor info from project",
            "status" => 404
        ]
    );
}

/**
 * decrypt main price of Vendor
 */
$priceDecrypt = $enc->bidDecode($registerInfo["regis_price"]);
$registerInfo["regis_price"] = $priceDecrypt;

// * Check is vendor have sub price
$have_sub = 0;
$subPriceInfo = $newBidService->getSubPriceByVendorRegisterId($registerInfo["regis_id"]);

if (!empty($subPriceInfo)){
    $have_sub = 1;
    // Add '1' in column 'have_sub' in registerInfo 
    $registerInfo["have_sub"] = 1;
    // Decode sub price 'price' and add decode sub price ["price"] into column 'price'
    foreach ($subPriceInfo as $subPriceInfoItem){
        
        $subPriceInfoItem["price"] = $enc->bidDecode($subPriceInfoItem["price"]);
    }
    // Add subPriceInfo into registerInfo
    $registerInfo["sub_info"] = $subPriceInfo;
}

// ! Get Vendor info
$vendorInfo = $newBidService->getVendorInfoByVdId($user_id);

$response = [
    "project" => $project,
    "project_setting" => $projectSetting,
    "prev_regis" => $registerInfo,
    "vendor_info" => $vendorInfo,
    "status" => 200
];

if ($SubBudget !== NULL) {
    $response["sub_price"] = $SubBudget;
}

$http->Ok($response);






