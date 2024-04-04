<?php
function htmlMailApproveReject(
    $project,
    $userEmployeeCalculator
) {
    return ('
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <title>แจ้งแก้ไข/ ปฏิเสธการอนุมัติการคำนวณราคากลาง โครงการ ' . $project["name"] . ' เลขที่  ' . $project['key']  . '</title>
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
                <h1>เรียน ' . $userEmployeeCalculator['e_name'] . ' </h1>
                <h1>
                    
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; โครงการ'. $project["name"] .' เลขที่เอกสาร ' . $project['key'] . '
                        ได้ถูก <span style="font-weight: 500; color:red ">ปฎิเสธ</span> 
                        โดยผู้อนุมัติที่1 โปรดเข้าตรวจสอบรายละเอียดและคำนวณราคากลางใหม่
                        <br><br>
                </h1>
                <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="left" class="second-td">
                            <a href="http://137.116.132.150/STSBidding/frontend/budget/calculate?pj=' . $project["key"] . '">
                                &nbsp;&nbsp;ดูข้อมูลและคำนวณราคาใหม่&nbsp;&nbsp;
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

    
        '
    );
}
