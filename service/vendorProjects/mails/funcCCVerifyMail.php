<?php
function htmlMailCCVerifyMail(
    $project,
    $approveVnedorProject,
    $listVendorWaitApprove,
    $result,
    $headContractor
){
    
    $listVendor = "";
    foreach ($listVendorWaitApprove as $index => $value) {
        $listVendor .= '
        <p style="font-weight: 700;"> รายที่ ' . ($index + 1) . ' </p>
        <p style="font-weight: 700;"> ชื่อ หจก/บริษัทฯ : </p>
        <p class="custom-container custom-paragraph">' . $value["company_name"] . '</p>

        <p style="font-weight: 700;"> ที่ตั้งสำนักงาน : </p>
        <p class="custom-container custom-paragraph"> ' . $value["location_detail"] . " " . $value["location_main"]["tambons_name_th"] . " " . $value["location_main"]["amphures_name_th"] . " " . $value["location_main"]["provinces_name_th"] . " " . $value["location_main"]["zip_code"] .'</p>
        
        <p style="font-weight: 700;">ชื่อ-สกุล :</p>
        <p class="custom-container custom-paragraph">' . $value["manager_name"] . '</p>
        
        <p style="font-weight: 700;">ตำแหน่ง :</p>
        <p class="custom-container custom-paragraph">' . $value["manager_role"] . '</p>
        
        <p style="font-weight: 700;">เบอร์โทร :</p>
        <p class="custom-container custom-paragraph">' . $value["phone_number"] . '</p>
        
        <p style="font-weight: 700;">E-mail :</p>
        <p class="custom-container custom-paragraph"> ' . $value["email"] . '</p>
        
        <!-- <p style="font-weight: 700;">ความเชี่ยวชาญ</p>
        <p class="custom-container custom-paragraph">---------------</p> -->
                    ';
    }

    $body =
        '
   
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
            <title>Email-โปรดอนุมัติการขออนุมัติผู้เข้าร่วมประกวดราคานอก List ทะเบียน เลขที่เอกสาร : XXXXXXX</title>
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
                    padding: 5px; 
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
        
                .login-a {
                    color: #ffffff !important; 
                    font-size: 20px; 
                    font-weight: 500; 
                    text-decoration: none; 
                    display: inline-block; 
                    text-align: center;
                    padding: 8px; 
                    border-radius: 8px; 
        
                }
        
                .file-a {
                    color: #ffffff !important; 
                    font-size: 20px; 
                    font-weight: 500; 
                    text-decoration: none; 
                    display: inline-block; 
                    text-align: center;
                    padding: 8px; 
                    border-radius: 8px;
                    width: 150px;
                    
                }
        
            </style>
        </head>
        <body>
            <br>
            <br>
            <table class="first-table">
                <tr>
                    <td class="first-td">
                        <p align = right >                  
                                <span>เลขที่เอกสาร :</span> ' . $project['key']  . '                  
                        </p>
                        <br>
                        <h1>เรียน ' . $headContractor['e_name'] . '</h1>
                        <p>
                            โครงการ : ' . $project["name"] . '
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
                                    <a>&nbsp;&nbsp;</a>
                                <td class="second-td" style="background-color:  #2B3467;">
                                <a class="file-a" href="http://137.116.132.150/STSBidding/' . $project["Job_description_uri"] . '">
                                        &nbsp;&nbsp;ใบแจ้งงาน&nbsp;&nbsp;</a>
                                    
                                </td>
                                <td class="second-td"  style="background-color: #dcfefd;">
                            <a>&nbsp;</a>
                        </td>
                                <td class="second-td" style="background-color:  #2B3467;">
                                <a class="file-a" href="http://137.116.132.150/STSBidding/' . $project["Tor_uri"] . '" >
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
                    <td class="rd-td">
                        <h1 style="font-weight: 700;">
                            1) เหตุผลในการขออนุมัติผู้เข้าร่วมโครงการนอก List ทะเบียน
                        </h1>
                         <p class="custom-container custom-paragraph"> ' . $result . '</p>
                    </td>
                </tr>
            </table>
            <br>
            <table class="first-table">
                <tr>
                    <td class="rd-td">
                        <h1 style="font-weight: 700;">
                            2) ข้อมูลผู้เข้าร่วมโครงการนอก List ทะเบียน
                        </h1>
                        ' . $listVendor . '
                </td>
            </tr>
        </table>
    <br>
    </body>
</html>
    ';
    return $body;
}