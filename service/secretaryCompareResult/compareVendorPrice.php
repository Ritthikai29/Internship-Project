<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");

include_once("../middleware/authentication.php");
include_once("./resultCompareService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$resultCompare = new ResultCompareService();

// Check is a get methods
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

$tokenObject = JWTAuthorize($enc, $http);
$userId = isset($tokenObject->userId) ? $tokenObject->userId : null;
if (!$userId) {
    $http->Unauthorize(
        [
            "err" => "not found a user by user id",
            "status" => 401
        ]
    );
}

/**
 * find a user is a secretary ? 
 */

$isOk = false;
$roleCheck = [
    "secretary",
    "committee",
    "MD"
];
$countRole = count($roleCheck);
$i = 0;
do {
    $user = $resultCompare->getUserByIdAndRole($userId, $roleCheck[$i]);
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


// Get project key from GET method 
$projectKey = $template->valVariable(isset($_GET["key"]) ? $_GET["key"] : null, "project key");

/**
 * get project info by project key
 */
$project = $resultCompare->getProjectByKey($projectKey);
if (!$project) {
    $http->NotFound(
        [
            "err" => "ไม่พบโครงการที่กำลังประมูล",
            "status" => 404
        ]
    );
}

// ! Decode Main Price Project
$project["price"] = (float) $enc->apDecode($project["price"]);

$maxOrder = $resultCompare->getCountBargainProjectByPid($project["id"]);
if($project['status_id'] == "13" or $project['status_id'] == "29"){
    $maxOrder['count'] =  $maxOrder['count'] - 1;
}

$addData = array();

$listVendorProject = $resultCompare->getVendorProjectByPid($project["id"]);
if (!$listVendorProject) {
    $http->NotFound(
        [
            "err" => "ไม่มีผู้เสนอประกวดราคา",
            "status" => 404
        ]
    );
}
foreach ($listVendorProject as $index => $vendor) {

    $result = $resultCompare->getVendorRejisterByPidAndVid($project["id"],$vendor["vendor_id"],$enc);
    $tempCount = 1;

    if( count($result) == 1 and $maxOrder['count'] == null ){
        $result[0]["newPrice"] = '-';
        if( $result[0]['registers_status_id'] == 10 ) {
    
            $result[0]["compare"] = $result[0]['price'];
            
            $subpriceBidding = $resultCompare->listSubpriceRegisterByRegisterId($result[0]["id"], $enc); 
            if ($subpriceBidding and ($maxOrder['count'] +1 ==  $result[0]["order"])) {
                $result[0]["subprice"] = $subpriceBidding;
            } else {
                $result[0]["subprice"] = null;
            }

            array_push($addData,$result[0]);

        } else if( $result[0]['registers_status_id'] == 12 ) {

            $result[0]["compare"] = null;
            $result[0]["boq_uri"] = null;
            $result[0]["subprice"] = null;

            array_push($addData,$result[0]);

        } else if ( $result[0]['registers_status_id'] == 11 ) {
            
            $result[0]["compare"] = null;
            $result[0]["boq_uri"] = null;
            $result[0]["subprice"] = null;

            array_push($addData,$result[0]);
        }

    } 
    else{
        foreach ($result as $index2 => $data) {
            if( ($data['order'] == ($maxOrder['count'] +1))  and  $tempCount == 1){
                
                if( $data['registers_status_id'] == 7 ) {
    
                    $result[$index2]["compare"] = $data['price'];
                    $result[$index2]["newPrice"] = $data['price'];
                    $subpriceBidding = $resultCompare->listSubpriceRegisterByRegisterId($data["id"], $enc); 
                    if ($subpriceBidding) {
                        $result[$index2]["subprice"] = $subpriceBidding;
                    } else {
                        $result[$index2]["subprice"] = null;
                    }
    
                    array_push($addData,$result[$index2]);
    
                } else if( $data['registers_status_id'] == 12 ) {
    
                    $result[$index2]['newPrice'] = null;
                    $result[$index2]["compare"] = null;
                    $result[$index2]["boq_uri"] = null;
                    $result[$index2]["subprice"] = null;
    
                    array_push($addData,$result[$index2]);
    
                } else if ( $data['registers_status_id'] == 11 ) {
                    
                    $result[$index2]['newPrice'] = 0;
                    if($project['status_id'] == "13" or $project['status_id'] == "29"){
                        $result[$index2]["compare"] = null;
                    }else{
                        $result[$index2]["compare"] = 0;
                    }          
                    $result[$index2]["boq_uri"] = null;
                    $result[$index2]["subprice"] = null;
    
                    array_push($addData,$result[$index2]);
                }
    
                $tempCount = 0;
     
            } 
            else if( ($index2 == count($result)-1) and  $tempCount == 1){
                $result[$index2]['newPrice'] = '-';
                $result[$index2]["compare"] = null;
                $result[$index2]["boq_uri"] = null;
                $result[$index2]["subprice"] = null;
    
                array_push($addData,$result[$index2]);
                $tempCount = 0;
            }      
         } 
    }
    
   
}

// $http->Ok([
//     "data" => $addData ,
//     "test" => $maxOrder['count'] +1,
//     "status" => 200
// ]);


$listVendor = $addData;
foreach ($listVendor as $index => $vendor) {
    $listVendor[$index]['history_price'] = $resultCompare->getVendorRegisterByVPId($vendor["vendor_project_id"], $enc);
   
    if($listVendor[$index]['history_price'][0]['registers_status_id'] == 12 ){
        $listVendor[$index]['price'] = null;
    }
    if($listVendor[$index]['history_price'][0]['registers_status_id'] == 11) {
        $listVendor[$index]['price'] = 0;
    }
    if($listVendor[$index]['history_price'][0]['registers_status_id'] == 10){
        $listVendor[$index]['price'] =  $listVendor[$index]['history_price'][0]['price'];
    }    
    
    $addData3 = array();
    array_push($addData3,$listVendor[$index]['history_price'][0]);
    if  (   (count($listVendor[$index]['history_price']) > 1) or 
            (count($listVendor[$index]['history_price']) == 1 && ($maxOrder['count'] != null ))
        )
    {
        for ($x = 1; $x <= $maxOrder['count']+1; $x++) { 
            $check = 1;
            if($x > 1){    
                foreach ($listVendor[$index]['history_price'] as $i => $history_price) {
                    if($x  == $history_price['order']){
                        array_push($addData3,$history_price);
                        $check = 0;
                    }
                }
                if( $check == 1){
                    array_push($addData3,['price' => '-']);
                }
            }
        }
    } 
    $listVendor[$index]['history_price'] = $addData3;
    
}

// * Extract the 'price' values into a separate array
$prices = array_column($listVendor, 'price');

// Count Price Value 
function countValuesOfVendorPrice($array)
{
    $counts = [];
    foreach ($array as $value) {
        if ($value !== null) {
            $key = (string)$value;
            if (array_key_exists($key, $counts)) {
                $counts[$key]++;
            } else {
                $counts[$key] = 1;
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

$listLeastVendor = array_filter($listVendor, fn ($item) => $item['compare'] == $minPrice);


// sorting ASC and null will go down
usort($listVendor, function ($a, $b) {
    if ($a['price'] == null)
        return 1;
    if ($b['price'] == null)
        return -1;
    return $a['price'] - $b['price'];
});


// ----------------------- check this vendor is win / draw / lose -------------------
$minPrice = PHP_INT_MAX;
$winIndices = []; // เก็บ index ที่มีการชนะ
foreach ($listVendor as $index => $vendor) {
    if ($vendor["compare"] !== null) {
        if ($vendor["compare"] < $minPrice) {
            $minPrice = $vendor["compare"];
            $winIndices = [$index]; // หากมีค่าที่ต่ำสุดใหม่, เซ็ต index ที่ชนะเป็น index ปัจจุบัน
        } elseif ($vendor["compare"] === $minPrice) {
            $winIndices[] = $index; // มีการเสมอ, เพิ่ม index ที่ชนะ
        }
    }
}
foreach ($listVendor as $index => $vendor) {
    if ($vendor["compare"] === null) {
        $listVendor[$index]["result"] = "lose";
    } elseif (count($winIndices) > 1 && in_array($index, $winIndices)) {
        $listVendor[$index]["result"] = "draw";
    } elseif (count($winIndices) === 1 && $vendor["compare"] === $minPrice) {
        $listVendor[$index]["result"] = "win";
    } else {
        $listVendor[$index]["result"] = "lose";
    }
}

// get vendor by vendor id
foreach ($listVendor as $index => $value) {
    $vendor = $resultCompare->getVendorByVendorId($value["vendor_id"]);
    $listVendor[$index]["vendor"] = $vendor;
}

// get list least vendor id 
$listLeastVendor = array_filter($listVendor, fn ($item) => $item['compare'] == $minPrice);

// Check is least price have more than 1 person ?
$sameLeastPrice = count($listLeastVendor);

// Announce Status To Display
if ($sameLeastPrice > 1 && (int) $minPrice > (int) $project["price"]) {
    $announcementStatus = [
        "text" => "มากกว่าราคากลาง และ มีผู้เสนอราคาต่ำสุดมากกว่า 1 ราย",
        "status" => "draw"
    ];
} elseif ($sameLeastPrice > 1 && (int) $minPrice <= $project["price"]) {
    $announcementStatus = [
        "text" => "ต่ำกว่าหรือเท่ากับราคากลาง และ มีผู้เสนอราคาต่ำสุดมากกว่า 1 ราย",
        "status" => "draw"
    ];
} elseif ($sameLeastPrice == 1 && (int) $minPrice > $project["price"]) {
    $announcementStatus = [
        "text" => "มากกว่าราคากลาง และ มีผู้เสนอราคาต่ำสุด 1 ราย",
        "status" => "draw"
    ];
} else {
    $announcementStatus = [
        "text" => "ต่ำกว่าหรือเท่ากับราคากลาง และ มีผู้เสนอราคาต่ำสุด 1 ราย",
        "status" => "success"
    ];
}




$http->Ok(
    [
        "price" => $project["price"],
        "data" => $listVendor,
        "res_status" => $announcementStatus,
        "result" => $listLeastVendor,
        "project" => $project,
        "order" => $maxOrder['count']+1,
        "status" => 200
    ]
);
