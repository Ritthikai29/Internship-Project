<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");
include_once("../Template/SettingMailSend.php");

include_once("./approveResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$mail = new Mailing();

$approveResultService = new ApproveResultService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

/**
 * Authorize User
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

/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);

// * Get Project By Project key
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");
$project = $approveResultService->getProjectByKey($projectKey);
if (!$project){
    $http->NotFound(
        [
            "err" => "project not found",
            "status" => 404
        ]
    );
}

$approveResultService->startTransaction();

// list vendor project by project id (is approveing)
$listVendor = $approveResultService->listVendorApproveProjectByProjectId($project["id"]);

if (!$listVendor) {
    $http->NotFound(
        [
            "err" => "ไม่มีผู้เสนอประกวดราคา",
            "status" => 404
        ]
    );
}

// get latest budget of the project by vendor id
foreach ($listVendor as $index => $value) {
    $priceBidding = $approveResultService->getFirstRegisterPriceByVendorProjectId($value["id"], $enc); // select data and decode price

    if ($priceBidding) {
        $listVendor[$index]["boq_uri"] = $priceBidding["boq_uri"];
        $listVendor[$index]["price"] = (float) $priceBidding["price"];
        // find all sub price of the project
        $subpriceBidding = $approveResultService->listSubpriceRegisterByRegisterId($priceBidding["id"], $enc); // select data and decode price
        if ($subpriceBidding) {
            $listVendor[$index]["subprice"] = $subpriceBidding;
        } else {
            $listVendor[$index]["subprice"] = null;
        }

        // search to get new price 
        $newPrice = $approveResultService->getNewRegisterPriceByVendorProjectId($value["id"], $enc);
        if ($newPrice) {
            $listVendor[$index]["boq"] = $newPrice["boq_uri"];
            $listVendor[$index]["newPrice"] = $newPrice["price"];
            $listVendor[$index]["compare"] = $newPrice["price"];

        } else {
            $listVendor[$index]["boq"] = null;
            $listVendor[$index]["newPrice"] = null;
            $listVendor[$index]["compare"] = $listVendor[$index]["price"];
        }


    } else {
        $listVendor[$index]["price"] = null;
        $listVendor[$index]["newPrice"] = null;
        $listVendor[$index]["subprice"] = null;
        $listVendor[$index]["compare"] = null;
        $listVendor[$index]["boq_uri"] = null;
    }
}

// * Extract the 'price' values into a separate array
$prices = array_column($listVendor, 'price');

// Count Price Value 
function countValuesOfVendorPrice($array)
{
    $counts = [];
    foreach ($array as $value) {
        if ($value !== null) {
            if (array_key_exists($value, $counts)) {
                $counts[$value]++;
            } else {
                $counts[$value] = 1;
            }
        }
    }
    return $counts;
}

$listCountPriceValue = countValuesOfVendorPrice($prices);

// Filter out empty values
$price = array_filter($prices, function ($value) {
    return $value !== NULL;
});

if (count($price) === 0) {

    foreach ($listVendor as $index => $vendor) {
        $listVendor[$index]["result"] = "lose";
    }

    $http->Ok(
        [
            "price" => $project["price"],
            "data" => $listVendor,
            "res_status" => [
                "text" => "ไม่มีผู้เสนอราคา",
                "status" => "failed"
            ],
            "result" => [],
            "status" => 200
        ]
    );
}

// Find the minimum value
$minPrice = min($price);

$listLeastVendor = array_filter($listVendor, fn($item) => $item['compare'] == $minPrice);

// sorting ASC and null will go down
usort($listVendor, function ($a, $b) {
    if ($a['compare'] == null)
        return 1;
    if ($b['compare'] == null)
        return -1;
    return $a['compare'] - $b['compare'];
});

// ----------------------- check this vendor is win / draw / lose -------------------

for ($index = 0; $index < count($listVendor); $index++) {
    if ($listVendor[$index]["compare"] == null) {
        $listVendor[$index]["result"] = "lose";
        continue;
    }

    if ($index !== 0) {
        if (
            is_null($listVendor[$index]["compare"]) ||
            $listVendor[$index - 1]["result"] === "win"
        ) {
            $listVendor[$index]["result"] = "lose";
        } else {
            if ($listVendor[$index]["compare"] > $listVendor[$index - 1]["compare"]) {
                $listVendor[$index]["result"] = "lose";
            } else {
                $listVendor[$index]["result"] = "draw";
            }
        }
    } else {
        if (is_null($listVendor[$index + 1]["compare"]) || $listVendor[$index]["compare"] < $listVendor[$index + 1]["compare"]) {
            if ($listVendor[$index]["compare"] <= $project["price"]) {
                $listVendor[$index]["result"] = "win";
            } else {
                $listVendor[$index]["result"] = "draw";
                $listVendor[$index]["result2"] = "more than main price";
            }
        } else {
            $listVendor[$index]["result"] = "draw";
        }
    }
}
// ----------------------- check this vendor is win / draw / lose -------------------

// get vendor by vendor id
foreach ($listVendor as $index => $value) {
    $vendor = $approveResultService->getVendorByVendorId($value["vendor_id"]);
    $listVendor[$index]["vendor"] = $vendor;
}

/**
 * Update Vendor Project Register Status
 * 
 */

foreach($listVendor AS $update){

    if ($update['result']== 'win'){
        $vendor_status = 1;
    } else {
        $vendor_status = 2;
    }

    // * Prepare Data2
    $data2 = [
        "id" => $update['id'],
        "vendor_status_id" => $vendor_status
    ];

    /**
     * Update Vendor Bidding Status
     */

    $updateVendorProjectStatus = $approveResultService->updateVendorProjectStatus($data2);

}

//!---------------------------------------------!//
// * Project is Approve '13 : รออนุมัติผลเสร็จสิ้นประกวดราคา'
$isSuccessStatus = 13;

// * Prepare Data
$data = [
    "project_id" => $project['id'],
    "status_id" => $isSuccessStatus
];

/**
 * Update Project Status From MD
 * 
 * 13 : รออนุมัติผลเสร็จสิ้นประกวดราคา
 * 14 : รออนุมัติผลล้มประกวดราคา
 * 
 */

$updateProjectStatus = $approveResultService->updateProjectStatus($data);

$approveResultService->commitTransaction();

// get email of Secretary
$SecretaryEmail = $approveResultService->getSecretaryEmailByProjectId($project['id']);

/**
* send a email to secretary
*/

$mail->sendTo($SecretaryEmail['email']);

$subjectEmail = "ผลการพิจารณาการอนุมัติโครงการ" . (string)$project['name'];
$mail->addSubject($subjectEmail);
$bodyEmail = "การอนุมัติโครงการ เลขที่ " . $projectKey . " ได้รับการ อนุมัติ โครงการ ";
$mail->addBody($bodyEmail);
$mail->sending();
$mail->clearAddress();

$http->Ok(
    [
        "data" => "Success",
        "status" => 200
    ]
);



