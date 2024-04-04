<?php
include_once("./registerProjectService.php");
$registerProjectService = new RegisterService();
;
function htmlMail($info, $contractor){
    $body = '
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <title>Email-แจ้งมีการ update ข้อมูลและไฟล์</title>
    <style>
    .first-table {
        width: 1000px; 
        margin: 0 auto; 
        padding-bottom: 20px; 
        background: #dcfefd; 
        box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25); 
        border-radius: 10px; 
        border: solid 2px rgb(0, 0, 0);
        font-family: Tahoma;

    }

        .first-td {
            position: relative; 
            padding-left: 30px; 
            padding-right: 30px;
        }

        .second-td {
            background-color: #2B3467; 
            padding: 10px; 
            border-radius: 8px;
        }

        h1{
            color: #000000; 
            font-size: 20px; 
            margin-left: 20px; 
            font-weight: 500; 
            word-wrap: break-word;
        }

        a {
            color: #ffffff !important; 
            font-size: 20px; 
            font-weight: 500; 
            text-decoration: none; 
            display: inline-block; 
            text-align: center;
        }
    </style>
</head>
<body>
    <br>
    <br>
    <table class="first-table">
        <tr>
            <td class="first-td">
                <br>
                <h1>เรียน ' . $contractor['e_name'] . '</h1>
                <h1>
                    
                        ข้อมูล และ ไฟล์ของ ' . $info . ' ได้รับการอัพเดตแล้ว โปรดตรวจสอบรายละเอียด
                        <br>
                    
                </h1>
                <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="left" class="second-td">
                            <a href="http://137.116.132.150/STSBidding/frontend/">
                                &nbsp;&nbsp;เข้าสู่ระบบ&nbsp;&nbsp;
                            </a>
                        </td>
                    </tr>
                </table>
                <br>
            </td>
        </tr>
    </table>
    <br>
</body>
</html>

';
return $body;
    
}