<?php
function htmlMailReject(
    $project,
    $vendor,
    $contractor
) {
    return ('
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
        <title>Email-เพื่อพิจารณาอนุมัติผลการประกวดราคา โครงการ : ' . $project['name']  . '</title>
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
    
            .rd-td {
                padding: 20px; 
                padding-bottom: 30px;
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
                margin-left: 30px;
            }
    
            .custom-container {
                margin-left: 40px;
                margin-right: 40px;
                border-radius: 5px;
                border: solid 2px rgb(0, 0, 0);
                
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
    
            .login-a {
                color: #ffffff; 
                font-size: 20px; 
                font-weight: 500; 
                text-decoration: none; 
                display: inline-block; 
                text-align: center;
                padding: 8px; 
                border-radius: 8px; 
    
            }
    
            .file-a {
                color: #ffffff; 
                font-size: 20px; 
                font-weight: 500; 
                text-decoration: none; 
                display: inline-block; 
                text-align: center;
                padding: 8px; 
                border-radius: 8px;
                width: 150px;
            }
            .custom-table {
                border-collapse: collapse;
                width: 100%;
                border: 1px solid black;
                font-family: Tahoma;
            }
            
            .header-row {
                border-radius: 8px;
                border: 1px solid black;
                background: #2B2A2A;
                box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.25);
                color: #FFF;
                text-align: center;
                font-size: 20px;
                font-weight: 400;
                line-height: normal;
                height: 40px;
                font-family: Tahoma;
                
            }
            
            .data-row {
                text-align: center;
                border: 1px solid black;
                font-size: 20px;
                font-family: Tahoma;
            }
            
            .data-row th {
                height: 40px;
                font-size: 20px;
            }
            
            .data-row td {
                height: 40px;
            }
            
            .type-highlight {
                color: #0083FF;
            }
            
            .status-highlight {
                color: #FF0000;
            }
    
            .custom-paragraph-02 {
                display: inline-block;
                margin-left: 30px;
                color: rgba(0, 0, 0, 0.70);
                font-size: 20px;
                font-weight: 400;
                line-height: normal;
                word-wrap: break-word;
            }
            
            .custom-link {
                display: inline-block;
                margin-left: 25px;
                border-radius: 5px;
                border: 1px solid rgba(0, 0, 0, 0.20);
                color: #000;
                padding: 10px 30px;
                font-size: 20px;
                font-weight: 500;
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
                    <h1>
                        เรียน  เรียน กจก. / ผู้อำนวยการโรงงาน ปูนทุ่งสง 
                    </h1>
                    <h1>   
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;เพื่อพิจารณาอนุมัติผลการประกวดราคา 
                            โครงการ<span>' . $project['name']  . '</span>ซึ่งได้รับความเห็นชอบจากคณะกรรมการจ้างเหมา ปูนทุ่งสงแล้ว
    
                            <br><br>
                    </h1>
                    <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                            <td class="second-td"  style="background-color: #1aa125;">
                                <a class="login-a" href="http://137.116.132.150/STSBidding/frontend/md/approve-bidding?key=' . $project['key']  . '" >
                                    &nbsp;&nbsp;อนุมัติ&nbsp;&nbsp;</a>
                                
                            </td>
                            <td class="second-td"  style="background-color: #dcfefd;">
                                <a>&nbsp;</a>
                            </td>
                            <td class="second-td" style="background-color: #e90d0d; " >
                                 <a class="login-a" href="http://137.116.132.150/STSBidding/frontend/md/reject-bidding?key=' . $project['key']  . '">
                                    &nbsp;&nbsp;ไม่อนุมัติ&nbsp;&nbsp;</a>
                            </td>
                            <td class="second-td"  style="background-color: #dcfefd;">
                                <a>&nbsp;</a>
                            </td>
                            <td class="second-td" style="background-color: #FFC300  " >
                                 <a class="login-a" href="http://137.116.132.150/STSBidding/frontend/md/bargain-bidding?key=' . $project['key']  . '">
                                    &nbsp;&nbsp;เจรจาต่อรอง&nbsp;&nbsp;</a>
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
                    <p align = right >                  
                            <span>เลขที่เอกสาร :</span> ' . $project['key']  . '                  
                    </p>
                    <p>
                        โครงการ : ' . $project['name']  . '
                    </p>              
                        <p>                    
                                <span>สังกัด :</span> ' . $project['afiliation']  . '
                        </p>
                        <p>
                                <span>วันที่เพิ่มโครงการ :</span> '. date('d/m/Y H:i', strtotime($project['add_datetime'])) . '
                        </p>
                        <p><span>ไฟล์แนบ :</span></p>
                            <table role="presentation" cellspacing="0" cellpadding="0">
                                
                                <tr>
                                    <td class="second-td"  style="background-color: #dcfefd;">
                                    <a>&nbsp;</a>
                                    </td>
                                    <td class="second-td" style="background-color:  #2B3467;">
                                         <a class="file-a" href="' . $project['Job_description_uri']  . '">
                                            &nbsp;&nbsp;ใบแจ้งงาน&nbsp;&nbsp;</a>
                                    </td>
                                    <td class="second-td"  style="background-color: #dcfefd;">
                                        <a>&nbsp;</a>
                                    </td>
                                    <td class="second-td" style="background-color:  #2B3467;">
                                        <a class="file-a" href="href=' . $project['Tor_uri']  . '">
                                        &nbsp;&nbsp;TOR&nbsp;&nbsp;</a>
                                    </td>
                                </tr>
                            </table>
                </td>
            </tr>
        </table>
        <br>
        <table  class="first-table">
             <tr>
                <td style="padding: 25px; padding-bottom: 40px;">
                    <h1 style="font-weight: 700; font-size: x-large;">
                        แจ้งผลการประกวดราคา
                    </h1>
                    <table class="custom-table">
                        <tr class="header-row">
                            <th>ลำดับ</th>
                            <th>ผลการประกวด</th>
                            <th>ประเภท</th>
                            <th>เลขสมาชิก</th>
                            <th>ชื่อ หจก./บริษัท</th>
                            <th>ชื่อผู้จัดการ</th>
                        </tr>
                        ' . GenerateTable($vendor) . '
                    </table>
                </font>
                </td>
            </tr>
        </table>
    </body>
</html>
    ');
}


function GenerateTable($vendors)
{
    $table = "";
    
    foreach ($vendors as $index => $vendor) {
        $colorResult = $vendor["result"] == "ชนะการประกวด" ? "#549743" : "#FF0000";
        $colorVendorType = $vendor["vendor_type_name"] == "ใน List ทะเบียน" ? "#0083FF" : "#FF0000";

        $table .= '<tr style="text-align: center; border: 1px solid black; font-size: 13px;">
            <td style="height: 40px;">' . ($index + 1) . '</td>
            <td style="height: 40px; color: ' . $colorResult . ';">' . $vendor["result"] . '</td>
            <td style="height: 40px; color: ' . $colorVendorType . ';">' . $vendor["vendor_type_name"] . '</td>
            <td style="height: 40px;">' . $vendor["vendor_key"] . '</td>
            <td style="height: 40px;">' . $vendor["company_name"] . '</td>
            <td style="height: 40px;">' . $vendor["manager_name"] . '</td>
        </tr>';
    }

    return $table;
}
