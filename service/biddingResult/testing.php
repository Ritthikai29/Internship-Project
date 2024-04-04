<?php
// เพื่อส่ง email เพื่อเชญ Vendor ในการขอประกวดราคาอีกครั้ง
session_start();
include_once("../Template/SettingApi.php");
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");
include_once("../middleware/authentication.php");

include_once("./biddingResultService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();

$mail = new Mailing();

$biddingResultService = new BiddingReasultService();


/**
 * Get a body from client user
 */
$body = json_decode(file_get_contents('php://input'), true);

/**
 * to defind a date time of the starting to bargain vendor
 */
$startDatetime = $template->valVariable(isset($body["start_datetime"]) ? $body["start_datetime"] : null, "วันเริ่มต้น");

/**
 * to defind a date time of the end to bargain vendor
 */
$finalDatetime = $template->valVariable(isset($body["final_datetime"]) ? $body["final_datetime"] : null, "วันสิ้นสุด");

/**
 * create a bargain setting of the project 
 */
$startDatetime = strtotime($startDatetime);
$startDatetime = mktime(0,0,0, date('m', $startDatetime), date('d', $startDatetime), date('Y', $startDatetime));
$startDatetime = date('Y-m-d H:i:s',$startDatetime);

$finalDatetime = strtotime($finalDatetime);
$finalDatetime = date('Y-m-d H:i:s', $finalDatetime);
$data = [
    "start_datetime" => $startDatetime,
    "final_datetime" => $finalDatetime
];

$http->Ok(
    [
        "data" => $data
    ]
);