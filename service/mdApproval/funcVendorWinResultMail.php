<?php
function htmlMail($project,$coInfo){
    $body = '
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <title>Email-แจ้งผลประกวดราคา เลขที่เอกสาร  '.$project['key'].'</title>
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
                    เรียน ผู้เข้าร่วมประกวดราคา
                </p>
                <p style=" font-weight: 700;"> เรื่อง แจ้งผลประกวดราคา โครงการ :<span class="blue-text">     
                    "'.$project["name"].'"</span> เลขที่เอกสาร <span>'.$project['key'].'</span>
                </p>           
                <p style="margin-left: 20px;">
                    <br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;บริษัท ปูนซิเมนต์ไทย(ทุ่งสง) จำกัด โดยหน่วยงาน <span>'.$project["department_name"].'</span> 
                     ได้ประกวดราคา โครงการ :<span>     
                        "'.$project["name"].'"</span> เลขที่เอกสาร <span >'.$project['key'].'</span>
                        บัดนี้ได้ดำเนินการเสร็จเรียบร้อยแล้ว บริษัท/หจก. ของท่าน ได้รับการพิจารณา 
                    <span style="color:#1aa125; font-weight: 700;">"ชนะการประกวด" </span>
                    ขอให้ท่านดำเนินการ ดังนี้
                </p>
                <p style="margin-left: 40px;">
                    <br>
                    1.  ติดต่อเจ้าของงาน เพื่อมอบพื้นที่ และกำหนดวันเริ่มงานต่อไป 
                </p>
                <p style="margin-left: 40px;">
                    2. ผู้ประสานงานโครงการ <span style="color: #0083FF;">
                         '.$coInfo["nametitle_t"].$coInfo["firstname_t"].$coInfo["lastname_t"]."/".$coInfo["department"]."/".$coInfo["email"].' </span>
                </p>
                <p style="margin-left: 20px;">
                    <br>
                    จึงแจ้งมาเพื่อทราบและโปรดดำเนินการตามรายละเอียดข้างต้น

                </p>
                <p style="margin-left: 20px; text-align: right;" class="blue-text">
                    <span style="margin-right: 50px;">ประภาส แก้วพงศ์พันธ์</span> <br> People Management Manager-TS 
                </p>
                <p style=" color: #0083FF;">
                    <br>
                    สำเนา :  หน่วยงานเจ้าของงาน / หน่วยงานบริการงานจ้างเหมา
                </p>
            </td>
        </tr>
    </table>
    <br>
    <br>
</body>
</html>

  
';
return $body;
    
}