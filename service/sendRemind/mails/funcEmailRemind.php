<?php

function htmlMailRemind(
    $passcode,
    $openBidding,
    $director
) {
    return '
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <title>Email-แจ้งเตือนเพื่อนเข้าร่วมประกวดราคา</title>
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
        p {
            font-weight: 500; 
            font-size: 20px;
            color: #000000;
        }
        
    </style>
</head>
<body>
    <br>
    <br>
    <table class="first-table">
        <tr>
            <td class="first-td">
                <p  style="margin-right: 30px; background-color: #dcfefd; ;"> ไฟล์แนบ (ถ้ามี) :</p>
                <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr> 
                        <td class="second-td" style="background-color: #ED3B3B; ">
                            <a href="http://137.116.132.150/STSBidding/frontend/">
                                &nbsp;&nbsp;ขอบเขต.pdf&nbsp;&nbsp;
                            </a>   
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <br>
    <table class="first-table">
        <tr>
            <td class="first-td">
                <br>
                <h1>
                    เรียน ' . $director['e_name'] . '( คณะกรรมการจ้างเหมา )
                </h1>
                <h1>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ขอแจ้งเตือนการเป็นตัวแทนเปิดซองกระกวดราคา ในวันพรุ่งนี้ ที่  '. date('d/m/Y H:i', strtotime($openBidding['open_datetime'])) . ' 
                        จำนวน ' . $openBidding['total'] . ' โครงการ โดยมีรายละเอียด Passcord ดังรายละเอียดข้างล่าง
                        <br>
                </h1>
                <table style="margin-left: 20px;" role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="left" class="second-td" style="background-color: #2B3467;">
                            <a href="http://137.116.132.150/STSBidding/frontend/committee/join?open_id='. $openBidding["id"]. '">
                                &nbsp;&nbsp;เข้าสู่ระบบ&nbsp;&nbsp;
                            </a>
                        </td>
                    </tr>
                </table>
                <h1 class="nd-h1">
                    (เมื่อเข้าสู่ระบบ ให้ท่านเข้าไป "โครงการที่รอจัดการ" และเลือก "รายละเอียดการเปิดซองที่กำหนดแล้ว")
                </h1>
            </td>
        </tr>
    </table>
    <br>
    <br>
    <table class="first-table"  style="padding: 20px; text-align: center; background: #4B81A8; border-radius: 10px; border: 1px rgba(0, 0, 0, 0.20) solid;">
        
        
            <td >
                <p style="color: white; font-size: 20px; font-weight: 600;">รายละเอียด Passcode ของท่านสำหรับเปิดซอง<br>
                    <span style="color: #EFD700; font-size: 25px; font-weight: 600;">(โปรดเก็บไว้เป็นความลับ)</span></p>
                <p style="font-size: 30px; font-weight: 800; background: #D9D9D9; margin-left: 40px; margin-right: 40px; padding-top: 15px; padding-bottom: 15px;">
                    ' . $passcode . '
                </p>
            </td>
        
    </table>
    <br>
</body>
</html>

    ';
}