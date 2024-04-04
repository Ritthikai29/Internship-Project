<?php
$include_path = "../../includes"; 
include("$include_path/configAPI.php");

$to ="junlavonno1200@gmail.com"; // เมลล์ที่จะส่งไป
$subject = "หัวเรื่องอีเมลล์"; // หัวเรื่องอีเมลล์
$body = "
        <div>
            <a style='padding: 5px; background-color: #4CAF50; color: white;' href='https://www.google.co.th'>Approve</a>
        </div>
        "; // เนื้อหาเมลล์ใส่ HTML CSS ฝังได้ แต่ใส่ JS ไม่ได้

sendingMail($to, $subject, $body);// ส่งเมลล์
?>