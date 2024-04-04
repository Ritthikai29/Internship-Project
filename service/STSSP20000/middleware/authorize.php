<?php

function Authorize(
    $projectId=null
)
{
    $http = new Http_Response();
    $enc = new Encryption();
    $template = new Template();
    $service = new VerifyService();

    if($projectId == null){
        $projectId = isset($_GET["pj_id"]) ? $_GET["pj_id"] : null;
    }
    $projectId = $template->valVariable($projectId, "project Id");

    $project = $service->getProjectById($projectId);
    if (!$project) {
        $http->Unauthorize(
            [
                "err" => "ไม่พบข้อมูลโครงการนี้ โปรดลองใหม่ในภายหลัง",
                "status" => 401
            ]
        );
    }
    
    $tokenDecode = JWTAuthorize($enc, $http);
    $userId = isset($tokenDecode->userId) ? $tokenDecode->userId : null;
    $clientManager = $service->getManagerByProjectIdAndUserId($project["id"], $userId);
    if (!$clientManager || $clientManager["role_name"] != "verifier") {
        $http->Unauthorize(
            [
                "err" => "คุณไม่มีสิทธิ์เข้าถึงโครงการนี้ เนื่องจากไม่ได้เป็นผู้คำนวณในโครงการนี้",
                "status" => 401
            ]
        );
    }

    return $userId;

}


function AuthorizeByKey(
    $projectKey=null
)
{
    $http = new Http_Response();
    $enc = new Encryption();
    $template = new Template();
    $service = new VerifyService();

    if($projectKey == null){
        $projectKey = isset($_GET["key"]) ? $_GET["key"] : null;
    }
    $projectKey = $template->valVariable($projectKey, "project Key");

    $project = $service->getProjectByKey($projectKey);
    if (!$project) {
        $http->Unauthorize(
            [
                "err" => "ไม่พบข้อมูลโครงการนี้ โปรดลองใหม่ในภายหลัง",
                "status" => 401
            ]
        );
    }

    $tokenDecode = JWTAuthorize($enc, $http);
    $userId = isset($tokenDecode->userId) ? $tokenDecode->userId : null;
    $clientManager = $service->getManagerByProjectIdAndUserId($project["id"], $userId);
    
    $have_verify_2 = isset($_GET["haveVerify_2"]) ? $_GET["haveVerify_2"] : false;
    if ($have_verify_2 === "true"){
        if (!$clientManager || $clientManager["role_name"] != "verifier 2") {
            $http->Unauthorize(
                [
                    "err" =>  "คุณไม่ใช่ผู้ตรวจสอบ 2",
                    "status" => 401
                ]
            );
        }
    }else{
        if (!$clientManager || $clientManager["role_name"] != "verifier") {
            $http->Unauthorize(
                [
                    "err" =>  "คุณไม่ใช่ผู้ตรวจสอบ 1",
                    "status" => 401
                ]
            );
        }
    }

    return $userId;

}