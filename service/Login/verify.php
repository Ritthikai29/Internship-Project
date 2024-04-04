<?php
session_start();

include("../Template/SettingApi.php");
include("../Template/SettingTemplate.php");
include("../Template/SettingEncryption.php");
include("../Template/SettingAuth.php");
include("../Template/SettingDatabase.php");
include_once("../middleware/authentication.php");
include('./LoginService.php');


$http = new Http_Response();
$template = new Template();
$enc = new Encryption();
$cmd = new Database();

$loginService = new StaffLogin();

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
$vendorId = isset($token->vendorId) ? $token->vendorId : null;

if ($userId) {
    $user = $loginService->getUserStaffById($userId);
    if (!$user) {
        $http->Unauthorize(
            [
                "err" => "not found user",
                "status" => 401
            ]
        );
    }

    if ($user['is_active'] === '0') {
        $http->Unauthorize(
            [
                "err" => "คุณถูกระงับการใช้งาน",
                "status" => 401
            ]
        );
    }

    $userRole = $loginService->getUserStaffRoleByUserId($user["id"]);
    if (count($userRole) === 0) {
        $http->NotFound(
            [
                "err" => "ไม่พบข้อมูลตำแหน่งของ User Staff คนนี้",
                "status" => 404
            ]
        );
    }

    $user["user_roles"] = $userRole;

    $http->Ok(
        [
            "data" => [
                "userId" => $userId,
                "user" => $user,
                "role" => "user_staff"
            ],
            "status" => 200
        ]
    );
} else if ($vendorId) {
    $vendor = $loginService->getVendorByVendorId($vendorId);

    if (!$vendor) {
        $http->Unauthorize(
            [
                "err" => "ไม่พบ Vendor ในระบบ",
                "status" => 401
            ]
        );
    }
    $http->Ok(
        [
            "data" => [
                "vendor" => $vendor,
                "role" => "vendor"
            ],
            "status" => 200
        ]
    );

} else {
    $http->NotFound(
        [
            "err" => "ไม่เคยลงทะเบียนในระบบ",
            "status" => 404

        ]
    );
}