<?php

function JWTAuthorize(Encryption $enc, Http_Response $http){
    $token = isset($_SESSION["token"]) ? $_SESSION["token"] : null;
    try {
        $tokenDecode = $enc->jwtDecode($token);
    } catch (Exception $e) {
        $http->Unauthorize(
            [
                "err" => "token is unauthorize",
                "status" => 401
            ]
        );
    }
    return $tokenDecode;
}