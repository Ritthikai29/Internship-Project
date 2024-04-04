<?php

function htmlMaill(array $openDateTimePlace,array $listOpenBidding){//!HTML ตัวนี้เป็นตัวทดสอบ เดียวแก้ไป วางระบบไป แต่เสร็จแล้วเอาcommmentนี้ออกด้วย
    $body = '
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <title>Email-เพื่อพิจารณาเข้าร่วมประกวดราคา</title>
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
        .blue-text{
            color: #0083FF;
        }
        .custom-container {
            margin-left: 40px;
            margin-right: 40px;
            border-radius: 5px;
            border: 1px solid rgba(0, 0, 0, 0.20);
            
        }
        
        .custom-paragraph {
            color: #000;
            padding: 10px;
            margin-left: 30px;
            margin-right: 20px;
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            font-family: Tahoma;
        }
        .custom-table {
            border-collapse: collapse;
            width: 100%;
            border: 1px solid black;
        }
    
        .header-row {
            border-radius: 8px;
            border: 1px solid black;
            background: #2B2A2A;
            box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.25);
            color: #FFF;
            text-align: center;
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            height: 40px;
            font-family: Tahoma;
        }
    
        .data-row {
            font-size: 20px;
            text-align: center;
            border: 1px solid black;
        }
    
        .data-row td {
            height: 40px;
        }
    </style>
</head>
<body>
    <br>
    <br>
    <table class="first-table">
        <tr>
            <td class="first-td">
                <p style=" font-weight: 700;">
                    <br>
                    เรียน คณะกรรมการจ้างเหมา
                </p>
                <p> ขอเชิญเป็นตัวแทนเปิดซองประกวดราคา ในวันที่  '. date('d/m/Y', strtotime($openDateTimePlace['opentime'])) . '  
                    จำนวน ' . $openDateTimePlace['open_datetime'] . ' โครงการ โดยมีรายละเอียดนี้ </p> 
                <br>  
                <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="left" class="second-td" style="background-color: #2B3467;  ">
                            <a href="http://137.116.132.150/STSBidding/frontend/Applydirector/Apply?id=' . $openDateTimePlace['id'] . '">
                                &nbsp;&nbsp;สะดวกเข้าร่วม&nbsp;&nbsp;
                            </a>
                        </td>
                    </tr>
                </table>  
                <p style="color: #e90d0d;;"> "ในการประกวดราคาแต่ละครั้งจะมีกรรมการทั้งหมด 3 ท่าน หากท่านสมัครไม่ได้ อาจหมายถึงมีผู้สมัครเป็นกรรมการครบจำนวนแล้ว"</p>     
            </td>
        </tr>
    </table>
    <br>
    <table  class="first-table">
        <tr>
            <td class="rd-td">
                <h1 style="font-weight: 700;">
                    1. วันและเวลาเปิดโครงการ
                </h1>
                <h1>
                    1) รายละเอียดวัน เวลา และสถานที่ 
                </h1>
                <p class="custom-paragraph">วัน / เวลา</p>    
                
                    <p class="custom-container custom-paragraph">'. date('d/m/Y H:i', strtotime($openDateTimePlace['opentime'])) . ' น.</p>
                <p class="custom-paragraph">สถานที่</p>    
                
                    <p class="custom-container custom-paragraph" >' . $openDateTimePlace['openplace'] . ' </p>
   
                <h1>
                    2) ผู้ประสานงานโครงการ 
                </h1> 
                <p class="custom-container custom-paragraph" style="color: red;">  
                    ' . $openDateTimePlace['open_datetime'] . ' / ' . $openDateTimePlace['open_datetime'] . ' <br>/' . $openDateTimePlace['open_datetime'] . '
                </p>
                </p>
            </td>
        </tr>
    </table>  
    <br>  
    <table  class="first-table">
         <tr>
            <td style="padding: 25px; padding-bottom: 40px;">
                <h1 style="font-weight: 700;">
                    2. งานที่เปิดซองประกวดราคา
                </h1>
                <table class="custom-table">
                    <tr class="header-row">
                        <th>เลขที่เอกสาร</th>
                        <th>ชื่อโครงการ</th>
                        <th>หน่วยงาน</th>
                    </tr>

        

                        ' . GenerateTable($listOpenBidding) . '
                    </table>
                </td>
            </tr>
        </table>
        <br>
    </body>
</html>
';
return $body;
    
}

function GenerateTable($listOpenBidding)
{
    $table = "";
    foreach ($listOpenBidding as $biddingData) {
        $table .= '<tr class="data-row">
        <td>' . $biddingData['key'] . '</td>
        <td>' . $biddingData['name'] . '</td>
        <td>' . $biddingData['department_name'] . '</td>
    </tr>';;
    }
    return $table;
}