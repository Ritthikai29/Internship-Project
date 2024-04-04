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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
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

$offset = $template->valNumberVariable(isset($_GET["ofs"]) ? $_GET["ofs"] : 0);
$limit = $template->valNumberVariable(isset($_GET["lim"]) ? $_GET["lim"] : 5);
$ListProject = $vendorService->ListProject($vendorId,$offset, $limit);  
if(!$ListProject){
    $http->NotFound(
        [
            "err" => "ไม่พบListProject ",
            "status" => 404
        ]
    );
}


$index = 0;
foreach ($ListProject as $data) {
    $maxOrder = $vendorService->getCountBargainProjectByPid($ListProject[$index]["id"]);
    if(($data['registers_status'] == 'รอเสนอราคา') and ( $maxOrder['count'] == null) ){
        $ListProject[$index]['vendor_registers_id'] = null;
        $ListProject[$index]['registers_status'] = null;
    }
    $index++;
}
foreach($ListProject as $index => $project){
    if($project['vendor_status'] == null){
        $ListProject[$index]['vendor_status'] = "รอใส่เสนอราคา";
    }
}

$totalProject = $vendorService->getCountProjectByID($vendorId);

$http->Ok(
    [
        "data" => $ListProject,
        "total" => $totalProject["count"],
        "status" => 200
    ]
);
