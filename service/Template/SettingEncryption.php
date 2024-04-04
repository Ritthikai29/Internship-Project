<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


include(__DIR__. '/../../vendor/firebase/php-jwt/src/BeforeValidException.php');
include(__DIR__. '/../../vendor/firebase/php-jwt/src/CachedKeySet.php');
include(__DIR__. '/../../vendor/firebase/php-jwt/src/ExpiredException.php');
include(__DIR__. '/../../vendor/firebase/php-jwt/src/JWK.php');
include(__DIR__. '/../../vendor/firebase/php-jwt/src/JWT.php');
include(__DIR__. '/../../vendor/firebase/php-jwt/src/Key.php');
include(__DIR__. '/../../vendor/firebase/php-jwt/src/SignatureInvalidException.php');




class Encryption
{
  private $value;
  private $roleId;
  private $role;
  private $userId;
  private $projectId;
  private $jwt;
  private $ciphertext;
  private const sensitive = [
    "VENDOR_KEY" => "123efvcdertyujnbg567ujnbfe45678ikbfde456789plmnbfr5678ikng6789ol",
    "BID_KEY" => "688954d2d8c71895068034a52599fa709941bc7842f55cb2bd0f999e09430074",
    "AP_KEY" => "25a3e692f23af6c3c2583617eeabf800e4b7eacb6be85136178116c9f44a3539",
    "ID_KEY" => "a828c7c58fbeb627a19eb6d5102fcf6f0e6f3087b093647d9a3af7364bac78e6",
    "FILE_KEY" => "23ae475f9f0c027ec71f33633bb18fddb2a16639517dfa4a1620eb2e17b998d8",
  ];
  private function encrypt($value, $key)
  {
    $cipher = "AES-256-CBC";
    $ivlen = openssl_cipher_iv_length($cipher);
    $iv = openssl_random_pseudo_bytes($ivlen);
    $ciphertext_raw = openssl_encrypt($value, $cipher, $key, $options = OPENSSL_RAW_DATA, $iv);
    $hmac = hash_hmac('sha256', $ciphertext_raw, $key, $as_binary = true);
    return base64_encode($iv . $hmac . $ciphertext_raw);
  }

  private function decrypt($ciphertext, $key)
  {
    $c = base64_decode($ciphertext);
    $ivlen = openssl_cipher_iv_length($cipher = "AES-256-CBC");
    $iv = substr($c, 0, $ivlen);
    $hmac = substr($c, $ivlen, $sha2len = 32);
    $ciphertext_raw = substr($c, $ivlen + $sha2len);
    $original_plaintext = openssl_decrypt($ciphertext_raw, $cipher, $key, $options = OPENSSL_RAW_DATA, $iv);
    $calcmac = hash_hmac('sha256', $ciphertext_raw, $key, $as_binary = true);
    if (hash_equals($hmac, $calcmac)) {
      return $original_plaintext;
    }
  }

  // Endoce ของฝั่ง ราคาที่เสนอ
  public function bidEncode($value)
  {
    $this->value = $value;
    return self::encrypt($this->value, self::sensitive["BID_KEY"]);
  }

  public function bidDecode($ciphertext)
  {
    $this->ciphertext = $ciphertext;
    return self::decrypt($this->ciphertext, self::sensitive["BID_KEY"]);
  }

  // Encode ฝั่งราคากลาง
  public function apEncode($value)
  {
    $this->value = $value;
    return self::encrypt($this->value, self::sensitive["AP_KEY"]);
  }

  public function apDecode($ciphertext)
  {
    $this->ciphertext = $ciphertext;
    return self::decrypt($this->ciphertext, self::sensitive["AP_KEY"]);
  }

  public function jwtEncode($role, $userId, $vendorId=null, $roleId = null, $projectId = null)
  {
    $this->roleId = $roleId;
    $this->role = $role;
    $this->userId = $userId;
    $this->projectId = $projectId;

    $date = new DateTimeImmutable();
    $time_gettoken = $date->getTimestamp();
    $expire_at = $date->modify('+24 hours')->getTimestamp();

    $payload = [
      'roleId' => $this->roleId,
      'role' => $this->role,
      'userId' => $this->userId,
      "vendorId" => $vendorId,
      'projectId' => $this->projectId,
      'isser' => $_SERVER['SERVER_NAME'],
      'iat' => $time_gettoken,
      'exp' => $expire_at
    ];

    $jwtToken = JWT::encode($payload, self::sensitive["ID_KEY"], 'HS256');

    return $jwtToken;
  }


  public function jwtDecode($jwt)
  {
    if (is_null($jwt))
      return null;
    $this->jwt = $jwt;
    $decoded = JWT::decode($this->jwt, new Key(self::sensitive["ID_KEY"], 'HS256'));

    return $decoded;
  }

  // เก็บข้อมูลเข้ารหัสชื่อไฟล์
  public function fileEncode($value)
  {
    $this->value = $value;
    return self::encrypt($this->value, self::sensitive["FILE_KEY"]);
  }

  public function fileDecode($ciphertext)
  {
    $this->ciphertext = $ciphertext;
    return self::decrypt($this->ciphertext, self::sensitive["FILE_KEY"]);
  }

  public function vendorEncode($value){
    $this->value = $value;
    return self::encrypt($this->value, self::sensitive["VENDOR_KEY"]);
  }

  public function vendorDecode($ciphertext){
    $this->ciphertext = $ciphertext;
    return self::decrypt($this->ciphertext, self::sensitive["VENDOR_KEY"]);
  }
  
}