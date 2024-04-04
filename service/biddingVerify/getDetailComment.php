<?php
// ใช้ในการ List แสดงข้อมูลหัวข้อ Comment การเปิดซอง
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../middleware/authentication.php");

include_once("./biddingVerifyService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();


$biddingVerifyService = new BiddingVerifyService();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    $http->MethodNotAllowed(
        [
            "err" => "$_SERVER[REQUEST_METHOD] METHOD IS NOT ALLOW (s)",
            "status" => 405
        ]
    );
}

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
$project_id = $template->valNumberVariable(isset($_GET["project_id"]) ? $_GET["project_id"] : 0);
// $project_id = $template->valVariable(isset($_GET["project_id"]) ? $_GET["project_id"] : null, "project_id");
// print_r(5555);

$Data = $biddingVerifyService->getDetailCommentById($project_id,$userId);
// if (!$openDate || $openDate["open_status"] != 1) {
//     $http->BadRequest(
//         [
//             "err" => "ซองเปิดตัวนี้ยังไม่เปิด กรุณาติดต่อเลขา",
//             "status" => 400
//         ]
//     );
// }

// print_r($userId);
// exit();
$http->Ok(
    [
        "data" => $Data,
        "status" => 200
    ]
);

