<?php
function htmlMailsendUserRJ($project)
{
    return ('<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
        <title>แจ้งแก้ไข/ ปฏิเสธ จากหน่วยงานจ้างเหมา</title>
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
                    <h1>
                        
                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; โครงการ'. $project["name"] .'<span> เลขที่เอกสาร ' . $project['key'] . '</span>
                            ที่ท่านได้ทำการแจ้งงาน ได้รับการ <span style="font-weight: 500; color:red ">ปฏิเสธ</span> 
                            จากหน่วยงานจ้างเหมา โปรดเข้าแก้ไขข้อมูลตามเหตุผลการปฏิเสธ เมื่อท่านดำเนินการแก้ไขเสร็จแล้ว ระบบจะส่งข้อมูลไปยังหน่วยงานจ้างเหมาต่อไป
                            <br><br>
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
    ');
}