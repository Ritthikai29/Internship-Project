<?php

session_start();

include("../Template/SettingApi.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingTemplate.php");
include_once("../middleware/authentication.php");
include("./setDirectorService.php");

$http = new Http_Response();
$cmd = new Database();
$template = new Template();
$enc = new Encryption();
$setDirectorService = new SetDirectorService();
$chairman = 1;
$committee = 2;
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
// $body = json_decode(file_get_contents('php://input'), true);
// $openId = $template->valVariable(isset($body["open_Id"]) ? $body["open_Id"] : null, "idวันเปิดซอง");
$openId = $template->valVariable(isset($_GET["openId"]) ? $_GET["openId"] : null, "openId");


$allDirectorInOpenbidding = $setDirectorService->allDirectorInOpenbidding($openId);
$user = $setDirectorService->getUserStaffById($userId); //เอาuserId ที่ได้จาก tokenที่แตกมาแล้ว มาดึงข้อมูล
$data = [
    "director_staff_id" => $userId,
    "open_id" => $openId,
];

if ($allDirectorInOpenbidding["alldirector"] <= 4) {

    $checkSame =  $setDirectorService->checkSameDirect($data);
    if ($checkSame && $checkSame["samedirector"] == 1) {
        $http->Forbidden(
            [
                "err" => "already applied",
                "status" => 403
            ]
        );
    }

    if ($user["role_name"] !== "chairman"  &&  $user["role_name"] !== "committee") //เอาrole_nameมาดู ดีกว่าใช้id idเปลียนได้ตลอด
    {
        $http->Unauthorize(
            [
                "err" => "user not authorize",
                "status" => 401
            ]
        );
    } elseif ($user["role_name"] == "chairman") { //

        if ($allDirectorInOpenbidding["chairman"] < 1) {
            $setDirectorService->setDirectorToOpenDate($userId, $openId, $chairman);
            $http->Ok(
                [
                    "data" => "chairman apply as chairman ",
                    "status" => 200
                ]
            );
        } elseif ($allDirectorInOpenbidding["committee"] < 2) {
            $setDirectorService->setDirectorToOpenDate($userId, $openId, $committee);
            $http->Ok(
                [
                    "data" => "chairman applied as a committee ",
                    "status" => 200
                ]
            );
        } else {
            $http->Forbidden(
                [
                    "err" => "As chairman committee full  ",
                    "status" => 403
                ]
            );
        }
    } elseif ($user["role_name"] == "committee" && $allDirectorInOpenbidding["committee"] < 2) {
        $setDirectorService->setDirectorToOpenDate($userId, $openId, $committee);
        $http->Ok(
            [
                "data" => "committee applied as a committee ",
                "status" => 200
            ]
        );
    } else {
        $http->Forbidden(
            [
                "err" => "committee is full",
                "status" => 403
            ]
        );
    }
} else {
    $http->Forbidden(
        [
            "err" => "Openbidding is full ",

            "status" => 403
        ]
    );
}
