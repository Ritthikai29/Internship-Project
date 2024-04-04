<?php
include(__DIR__ . '/PHPMailer/src/Exception.php');
include(__DIR__ . '/PHPMailer/src/PHPMailer.php');
include(__DIR__ . '/PHPMailer/src/SMTP.php');

$_ENV["DEV"] = true;

// Config Timezone
date_default_timezone_set('Asia/Bangkok');

$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:80',
    'http://localhost',
    'http://127.0.0.1:5173'
];
$domain = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : null;
if (in_array($domain, $allowedOrigins)) {
    $http_origin = $domain;
} else {
    $http_origin = "*";
}

header("Access-Control-Allow-Origin: $http_origin");

header('Access-Control-Allow-Credentials: true');

header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE,PATCH");

header("Access-Control-Max-Age: 3600");

header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

header('Vary: Origin');
class Http_Response
{
    const HTTP_OK = 200;
    const HTTP_CREATED = 201;
    const HTTP_BAD_REQUEST = 400;
    const HTTP_UNAUTHORIZED = 401;
    const HTTP_FORBIDDEN = 403;
    const HTTP_NOT_FOUND = 404;
    const HTTP_METHOD_NOT_ALLOWED = 405;

    public function Ok($msg = null)
    {
        http_response_code(self::HTTP_OK);
        if ($msg) {
            echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
        exit();
    }

    public function Created($msg = null)
    {
        http_response_code(self::HTTP_CREATED);
        if ($msg) {
            echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
        exit();
    }

    public function BadRequest($msg = null)
    {
        http_response_code(self::HTTP_BAD_REQUEST);
        if ($msg) {
            echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
        exit();
    }

    public function Unauthorize($msg = null)
    {
        http_response_code(self::HTTP_UNAUTHORIZED);
        if ($msg) {
            echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
        exit();
    }

    public function Forbidden($msg = null)
    {
        http_response_code(self::HTTP_FORBIDDEN);
        if ($msg) {
            echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
        exit();
    }

    public function NotFound($msg = null)
    {
        http_response_code(self::HTTP_NOT_FOUND);
        if ($msg) {
            echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
        exit();
    }

    public function MethodNotAllowed($msg = null)
    {
        http_response_code(self::HTTP_METHOD_NOT_ALLOWED);
        if ($msg) {
            echo json_encode($msg, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
        exit();
    }
}
