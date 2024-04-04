<?php

use function PHPSTORM_META\type;

session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");

$http = new Http_Response();
$template = new Template();

if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

// Get the values from the request
$body = json_decode(file_get_contents('php://input'), true);

function check($array)
{
    return isset($array) ? $array : null;
}


// ! SEND BY Raw
$data1 = $template->valFilter(isset($body["price"]) ? $body["price"] : null);
$data2 = $template->valFilter(isset($body["confirmPrice"]) ? $body["confirmPrice"] : null);

$price = (int)$data1;
$confirmPrice = (int)$data2;

// * Pattern for integer
$pattern = '/^\d+$/';

// ! Sum of SubPrice Json data decode from body

if (isset($body['sub_price']) && is_array($body['sub_price'])) {
    $sum = 0;
    
    foreach ($body['sub_price'] as $item) {
        if (!preg_match($pattern, $item['subPrice'])){
            $http->BadRequest([
                "err" => "ราคาย่อยที่กรอกอย่างน้อย 1 รายการไม่ใช่ตัวเลขจำนวนเต็ม",
                "status" => 400
            ]);
        }
        if (isset($item['subPrice']) && is_numeric($item['subPrice'])) {
            $sum += $item['subPrice'];
        }

    }
}

// * SumOfSubPrice
$SumOfSubPrice = $sum;

// ! Expect Error When key '000', 'dsd66', '090', '#887'
// Check is User key integer
if (preg_match($pattern, $price) && preg_match($pattern, $confirmPrice)) {
    // Compare the integers
    if ($price !== $confirmPrice) {
        $http->BadRequest([
            "err" => "ราคาหลักที่กรอกไม่เท่ากัน",
            "status" => 400
        ]);
    }

    if ($price === $confirmPrice && $price !== $SumOfSubPrice){
        $http->BadRequest([
            "err" => "ราคากลางหลัก ไม่เท่ากับ ราคากลางย่อย",
            "status" => 400
        ]);
    }

    if ($price === $confirmPrice && $price === $SumOfSubPrice){
        $http->Ok([
            "data" => "ราคากลางหลัก เท่ากับ ราคากลางย่อย",
            "status" => 200
        ]);
    }

} else {
    // Send the error back to the frontend 
    $http->BadRequest([
        "err" => "ราคาที่กรอกอย่างน้อย 1 รายการไม่ใช่ตัวเลขจำนวนเต็ม",
        "status" => 400
    ]);
}

?>

