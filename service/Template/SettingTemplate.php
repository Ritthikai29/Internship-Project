<?php
class Template
{

    private $http;
    public function __construct()
    {
        $this->http = new Http_Response();
    }
    public function download($path)
    {
        if (file_exists($path)) {
            // Set the appropriate headers
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . basename($path) . '"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($path));
            return readfile($path);
        } else {
            return die("ไฟล์สูญหายหรือโดนลบไปแล้ว");
        }
    }

    public function dateThai($strDate)
    {
        $strYear = date("Y", strtotime($strDate)) + 543;
        $strMonth = date("n", strtotime($strDate));
        $strDay = date("j", strtotime($strDate));
        $strMonthCut = array("", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.");
        $strMonthThai = $strMonthCut[$strMonth];
        return "$strDay $strMonthThai $strYear";
    }

    public function hourMinute($strTime)
    {
        return $strTime ? ltrim(date("H:i", strtotime($strTime)), "0") : "-";
    }

    public function getOTP()
    {
        $lower = bin2hex(random_bytes(3));
        $otp = strtoupper($lower);
        return $otp;
    }

    
    public function sanitize($data)
    {
        $sanitized = filter_var($data, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        return $sanitized;
    }

    public function valFilter($data){
        $data = isset($data) && !empty($data) // ถูก SET และ ไม่เป็น ค่าว่าง ใช่หรือไม่
                ? self::sanitize($data)
                : null;
        return $data;
    }

    public function valNumberVariable($data, $data_desc = ""){
        if (!isset($data) ) $this->http->BadRequest(
            [
                "err" => "ไม่พบข้อมูล " . $data_desc,
                "status" => 400
            ]
        );
        $sanitized = filter_var($data, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        return $sanitized;
    }

    public function valVariable($data, $data_desc = "")
    {
        if (!isset($data) || empty($data)) $this->http->BadRequest(
            [
                "err" => "ไม่พบข้อมูล " . $data_desc,
                "status" => 400
            ]
        );
        $sanitized = filter_var($data, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        return $sanitized;
    }

    public function ValArrVariable($arr, $data_desc = ""){
        if (!isset($data) || empty($data)) $this->http->BadRequest("ไม่พบข้อมูล " . $data_desc);
        $tempArr = array();
        foreach($arr as $data){
            $sanitized = filter_var($data, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            array_push($tempArr, $sanitized); 
        }
        return $tempArr;
    }

    public function valFile($file, $file_desc, $specific_allowed = null)
    {
        $max_file_size = 15728640; // 15 M
        $allowed_extensions = array("jpeg", "jpg", "png", "pdf");
        if (!is_null($specific_allowed)) {
            $allowed_extensions = $specific_allowed;
        }
        if (isset($file) && $file['error'] === UPLOAD_ERR_OK && is_uploaded_file($file['tmp_name'])) {
            $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            if (!in_array($file_extension, $allowed_extensions)) $this->http->BadRequest("รองรับประเภทไฟล์เฉพาะ " . implode(", ", $allowed_extensions));
            if ($file['size'] > $max_file_size) $this->http->BadRequest([
                "err" => [
                    "data" => "ขนาดไฟล์ไม่ควรเกิน " . (int)$max_file_size / 1048576 . "MB"
                ]
            ]);

            $fileObject = [
                "FileName" => uniqid() . '.' . $file_extension,
                "TempName" => $file['tmp_name'],
            ];

            return $fileObject;
        } else {
            $this->http->NotFound("ไม่พบข้อมูลไฟล์ " . $file_desc);
        }
    }
}
