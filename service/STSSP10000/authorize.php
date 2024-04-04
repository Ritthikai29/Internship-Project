<?php

function Authorize(
    $projectId=null
)
{
    $http = new Http_Response();
    $enc = new Encryption();
    $template = new Template();
    $service = new CalculateService();

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
    $clientManager = $service->getRefPriceManagerByProjectAndUser($project["id"], $userId);
    if (!$clientManager || $clientManager["role_name"] != "calculator") {
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
    $service = new CalculateService();

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
    $clientManager = $service->getRefPriceManagerByProjectAndUser($project["id"], $userId);
    if (!$clientManager || $clientManager["role_name"] != "calculator") {
        $http->Unauthorize(
            [
                "err" => "คุณไม่มีสิทธิ์เข้าถึงโครงการนี้ เนื่องจากไม่ได้เป็นผู้คำนวณในโครงการนี้",
                "status" => 401
            ]
        );
    }

    return $userId;

}