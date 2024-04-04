<?php
function htmlMailResetPassword(
    $emp
) {
    return ('
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <title>Email-แจ้งลิ้งผู้ใช้เพื่อตั้งรหัสผ่านใหม่</title>
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

        .nd-h1{
            color: #1d1d1d; 
            font-style: italic;
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
            <td class="first-td" valign="middle" align="center">
                <br>
                <h2>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ตั้งค่ารหัสผ่านใหม่
                        <br>
                </h2>
                <h1>
                    เราได้รับคำขอเพื่อตั้งค่ารหัสผ่านใหม่ สำหรับบัญชีของคุณ
                    <br>
                    <span style="color: #2f19fa !important;">' . str_replace('@', '@', $emp['email']) . '</span>
                    <br>
                    กรุณาคลิกปุ่ม <p style=" font-weight: 700; display: inline;"> ตั้งค่ารหัสผ่านใหม่ </p> หากคุณต้องการดำเนินการต่อ
                </h1>
                <table style="margin-left: 20px;" role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" class="second-td">
                            <a href="http://137.116.132.150/STSBidding/frontend/resetpassword?user='. $emp['user_type'].'&key='. $emp['encUser'] .'">
                                &nbsp;&nbsp;ตั้งค่ารหัสผ่านใหม่&nbsp;&nbsp;
                            </a>
                        </td>
                    </tr>
                </table>
                <br>
                <p>คุณยังสามารถเข้าใช้งานด้วยรหัสผ่านเดิมได้ตามปกติ จนกว่าจะเปลี่ยนรหัสผ่านใหม่ ลิ้งค์จะมีอายุ 15 นาที</p>
            </td>
        </tr>
    </table>
    <br>
</body>
</html>
    ');
}

