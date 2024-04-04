<?php
function htmlMailSendToVendor(
    $project,$vendor
) {
    return ('
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <title>แจ้ง vendor เมื่อมีการเสนอราคาเสร็จสิ้น ส่ง email ว่าบริษัทได้รับการเสนอราคาเรียบร้อยแล้ว</title>
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
    <table class="first-table">
        <tr>
            <td class="first-td">
                <br>
                <h1>เรียน ' . $vendor["manager_name"]. ' ( ผู้จัดการ ' . $vendor["company_name"]. ' )</h1>
                <h1>
                    
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; การเสนอราคาโครงการ '. $project["name"] .'<span> เลขที่เอกสาร ' . $project['key'] . ' </span>
                         ขณะนี้ทางบริษัท<span style="font-weight: 500; color:#1aa125;"> ได้รับข้อมูลการเสนอ</span> ของท่านแล้ว
                         ขอบคุณสำหรับการเข้าร่วมประกวดราคาในครั้งนี้
                        <br><br>
                </h1>
            </td>
        </tr>
    </table>
</body>
</html>

    ');
}
