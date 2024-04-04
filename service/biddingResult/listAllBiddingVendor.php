<?php
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");

include_once("./biddingResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$biddingResultService = new BiddingReasultService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * 1. authorize 
 */
$token = JWTAuthorize($enc, $http);
$userId = isset($token->userId) ? $token->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "not found a user id ",
            "status" => 401
        ]
    );
}

// -------------------------- START CHECK ROLE OF THE USER STAFF -----------------------------
/**
 * find a user is a secretary ? 
 */

$isOk = false;
$roleCheck = [
    "secretary"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $biddingResultService->getUserByIdAndRole($userId, $roleCheck[$i]);
    if ($user) {
        $isOk = true;
    }
    $i++;
} while (!$isOk && $countRole > $i);

if (!$user) {
    $http->Unauthorize(
        [
            "err" => "คุณไม่ใช่กลุ่มกรรมการในระบบ",
            "status" => 401
        ]
    );
}

// -------------------------- END CHECK ROLE OF THE USER STAFF -----------------------------

$projectId = $template->valVariable(isset($_GET["project_id"]) ? $_GET["project_id"] : null, "project id");
// $directorId = $template->valVariable(isset($_GET["director_id"]) ? $_GET["director_id"] : null, "director id");

// get a project by id
$project = $biddingResultService->getProjectById($projectId);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่กำลังประมูล",
            "status" => 404
        ]
    );
}

$project["price"] = (float) $enc->apDecode($project["price"]);

// list vendor project by project id (is approveing)
$listVendor = $biddingResultService->listVendorApproveProjectByProjectId($project["id"]);

if(!$listVendor){
    $http->NotFound(
        [
            "err" => "ไม่พบ Vendor ในระบบ",
            "status" => 404
        ]
    );
}
// get latest budget of the project by vendor id
foreach ($listVendor as $index => $value) {
    $priceBidding = $biddingResultService->getFirstRegisterPriceByVendorProjectId($value["id"], $enc); // select data and decode price
    if ($priceBidding) {
        $listVendor[$index]["price"] = (float) $priceBidding["price"];
        // find all sub price of the project
        $subpriceBidding = $biddingResultService->listSubpriceRegisterByRegisterId($priceBidding["id"], $enc); // select data and decode price
        if ($subpriceBidding) {
            $listVendor[$index]["subprice"] = $subpriceBidding;
        } else {
            $listVendor[$index]["subprice"] = null;
        }

        // search to get new price 
        $newPrice = $biddingResultService->getNewRegisterPriceByVendorProjectId($value["id"], $enc);
        if ($newPrice) {
            $listVendor[$index]["newPrice"] = $newPrice["price"];
            $listVendor[$index]["compare"] = $newPrice["price"];

        } else {
            $listVendor[$index]["newPrice"] = null;
            $listVendor[$index]["compare"] = $listVendor[$index]["price"];
        }



    } else {
        $listVendor[$index]["price"] = null;
        $listVendor[$index]["newPrice"] = null;
        $listVendor[$index]["subprice"] = null;
        $listVendor[$index]["compare"] = null;
    }
}

// sorting ASC and null will go down
usort($listVendor, function ($a, $b) {
    if ($a['compare'] == null)
        return 1;
    if ($b['compare'] == null)
        return -1;
    return $a['compare'] - $b['compare'];
});



// ----------------------- check this vendor is win / draw / lose -------------------



// in case no vendor registering
if ($listVendor[0]["compare"] == null) {
    foreach ($listVendor as $index => $value) {
        $listVendor[$index]["result"] = "draw";
    }
    $http->Ok(
        [
            "data" => $listVendor,
            "status" => 200
        ]
    );
} else if ($listVendor[1]["compare"] == null) {
    foreach ($listVendor as $index => $value) {
        $listVendor[$index]["result"] = "lose";
    }
    $listVendor[0]["result"] = "win";
    $http->Ok(
        [
            "data" => $listVendor,
            "status" => 200
        ]
    );
}

// first check a one and second is a win lost or draw
// it have 2 case 
// 1. first win second lost => 3,4,5,6 will lost
// 2. first draw second draw => check second and three 
if ($listVendor[0]["compare"] < $listVendor[1]["compare"]) {
    $listVendor[0]["result"] = "win";
    $listVendor[1]["result"] = "lose";
} else {
    $listVendor[0]["result"] = "drew";
    $listVendor[1]["result"] = "drew";
}

for ($i = 1; $i < count($listVendor) - 1; $i++) {
    if ($listVendor[$i]["result"] == "draw") {
        // check next is more that now 
        if ($listVendor[$i]["compare"] < $listVendor[$i + 1]["compare"]) {
            $listVendor[$i + 1]["result"] = "draw";
        } else {
            $listVendor[$i + 1]["result"] = "lose";
        }
    } else {
        $listVendor[$i + 1]["result"] = "lose";
    }
}

if ($listVendor[0]["compare"] > $project["price"]) {
    $listVendor[0]["result"] = "draw";
}
foreach ($listVendor as $index => $value) {
    if (($listVendor[$index]["result"] == "draw" || $listVendor[$index]["result"] == "win") && $listVendor[$index]["compare"] > $project["price"]) {
        $listVendor[$index]["result"] = "draw(more middle)";
    }
}
// ----------------------- check this vendor is win / draw / lose -------------------

// get vendor by vendor id
foreach ($listVendor as $index => $value) {
    $vendor = $biddingResultService->getVendorByVendorId($value["vendor_id"]);
    $listVendor[$index]["vendor"] = $vendor;
}

$http->Ok(
    [
        "price" => $project["price"],
        "data" => $listVendor,

        "status" => 200
    ]
);