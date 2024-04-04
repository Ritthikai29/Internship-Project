<?php

session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");

$http = new Http_Response();
$template = new Template();

if ($_SERVER["REQUEST_METHOD"] != 'POST')
    $http->MethodNotAllowed();

// Get the values from the request
$body = json_decode(file_get_contents('php://input'), true);

// ! SEND BY DataForm
$price = $template->valVariable(isset($_POST["price"]) ? $_POST["price"] : null, "price");
$confirmPrice = $template->valVariable(isset($_POST["confirmPrice"]) ? $_POST["confirmPrice"] : null, "confirm price");

$pattern = '/^\d+$/';

// Check is User key integer
if (preg_match($pattern, $price) && preg_match($pattern, $confirmPrice)) {
    // Compare the integers
    if ($price === $confirmPrice) {
        $result = "ราคาที่กรอกเท่ากัน";
    } else {
        $http->Forbidden(
            [
                "err" => "confirm price is not match with your main price",
                "status" => 403
            ]
        );
    }

    // Send the result back to the frontend
    $http->Ok([
        "data" => $result,
        "status" => 200
    ]);
} else {
    // Send the error back to the frontend 
    $http->BadRequest([
        "err" => "รายการที่กรอกอย่างน้อย 1 รายการไม่ใช่ตัวเลขจำนวนเต็ม",
        "status" => 400
    ]);
}

?>

