<?php
include("./sendInviteService.php");
$sendService = new SendInviteService();
function htmlMail($project,$dataSetting, $vendor, $newPassword)
{
    // Detail date
    $detail_date = date_create_from_format('m/d/Y', $dataSetting['setting']['detail_date']);
    $formatted_detail_date = date_format($detail_date, 'd M') . ' ' . ((int)date_format($detail_date, 'Y') + 543);
    $formatted_detail_date = str_replace(
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
        $formatted_detail_date
    );

    // End date
    $end_date = date_create_from_format('m/d/Y', $dataSetting['setting']['end_date']);
    $formatted_end_date = date_format($end_date, 'd M') . ' ' . ((int)date_format($end_date, 'Y') + 543);
    $formatted_end_date = str_replace(
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
        $formatted_end_date
    );


    $body = '
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
        <title>Email-ขอเชิญเข้าร่วมประกวดราคา เลขที่เอกสาร ' . ($dataSetting['project'])['key'] . '</title>
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

            h1 {
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

            .blue-text {
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
                        <p><span>ไฟล์แนบ :</span></p>
                            <table role="presentation" cellspacing="0" cellpadding="0">
                                
                                <tr>
                                ' . checkFile($project,$dataSetting ) . '
                                    
                                </tr>
                            </table>
                </td>
            </tr>
        </table>
        <br>
        <table class="first-table">
            <tr>
                <td class="first-td">
                    <p style=" font-weight: 700;">
                        <br>
                        เรียน ' . $vendor['manager_name'] . ' ( ผู้จัดการ ' . $vendor['company_name'] . ' )
                    </p>
                    <p style=" font-weight: 700;"> เรื่อง ขอเชิญเข้าร่วมประกวดราคางาน <span class="blue-text">"' . ($dataSetting['project'])['name'] . '" เลขที่เอกสาร ' . ($dataSetting['project'])['key'] . '</span>
                    </p>
                    <p style="margin-left: 20px;">
                        <br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;บริษัท ปูนซิเมนต์ไทย(ทุ่งสง) จำกัด โดยหน่วยงาน <span class="blue-text">' . ($dataSetting['project'])['affiliation'] . '</span>
                        มีความประสงค์ที่จะเรียกประกวดราคาด้วยเงื่อนไขของการประกวดราคา/เสนอราคา ตามข้อกำหนด (Specification) และรายละเอียดเพิ่มเติมที่แนบมาพร้อมนี้
                        โปรดเสนอราคา โดยดำเนินการดังนี้
                    </p>
                    <p style="margin-left: 40px;">
                        <br>
                        1. เข้าสู่ระบบ STS E-Bidding
                        <a href="http://137.116.132.150/STSBidding/frontend/" style="color: #0083FF; text-decoration: underline;"><span style="color: #0083FF;">คลิ๊ก</span></a>
                        <br>
                        <span style="margin-left: 20px; color: #0083FF;">User :  ' . $vendor['vendor_key'] . ' </span><br>
                        <span style="margin-left: 20px; color: #0083FF;">Password เริ่มต้น (สำหรับ vendor ใน List ทะเบียน): 123 ขอให้ท่านดำเนินการเปลี่ยนรหัสก่อนดำเนินการเสนอราคา โดยการเปลี่ยนรหัสผ่าน ขอให้ท่านอ่านรายละเอียดเงื่อนไขอย่างละเอียดตามไฟล์แนบ </span><br>';
                        
                    if ($vendor['new_register'] == 1) {
                        $body .= '<span style="margin-left: 20px; color: #0083FF;">Password เริ่มต้น (สำหรับ vendor นอก List ทะเบียน): ' . $newPassword . '</span><br>';
                    }
                        
                    $body .= '
                    </p>
                    <p style="margin-left: 40px;">
                        2. เลือกโครงการ <span class="blue-text">' . ($dataSetting['project'])['name'] . ' เลขที่เอกสาร ' . ($dataSetting['project'])['key'] . ' </span><br>
                        <span style="margin-left: 20px;">ระบบจะเรียกถาม Passcode ให้ท่านใส่ </span><span style="font-weight: 700;" class="blue-text">' . $vendor['passcode'] . '</span>
                    </p>
                    <p style="margin-left: 40px;">
                        3. ขอให้ท่านอ่านรายละเอียดเงื่อนไขอย่างละเอียดตามไฟล์แนบและกรอกตัวเลขที่ท่านต้องการเสนอราคาในระบบ โดยสามารถดูขั้นตอนการกรอกจากคู่มือที่แนบมานี้
                    </p>
                    <p style="margin-left: 40px;">
                        4.  กำหนดยื่นเสนอราคาภายในวันที่ <span class="blue-text">' . $formatted_end_date . ' เวลา ' . ($dataSetting['setting'])['end_time'] . ' น.</span>
                    </p>
                    <p style="margin-left: 40px;">
                        5.  เงินประกันซอง <span class="blue-text">' . number_format(($dataSetting['setting'])['deposit_money'], 2, '.', ',') . ' บาท</span>
                    </p>
                    <p style="margin-left: 40px;">
                        6. ผู้สนใจยื่นซองประกวดราคาจะต้องเข้าฟังคำชี้แจงรายละเอียดงานเพิ่มเติมที่ <span class="blue-text">หน่วยงาน ' . ($dataSetting['project'])['affiliation'] . '
                            ในวัน ' . $formatted_detail_date . ' 
                            เวลา ' . ($dataSetting['setting'])['detail_time'] . ' น. </span> ทั้งนี้ท่านจะต้องแนบแบบฟอร์มรับฟังคำชี้แจงระเอียดงานกลับมา
                        ยังหน่วยงานบริการงานจ้างเหมาเมื่อท่านยื่นเสนอราคาในระบบนี้
                    </p>
                    <p style="margin-left: 40px;">
                        7. ผู้ประสานงานโครงการ  :  <span class="blue-text">คุณ' . ($dataSetting['coordinator'])['firstname_t'] . ' ' . ($dataSetting['coordinator'])['lastname_t'] . 
                        ' โทร. +66 ' . substr_replace(substr_replace(($dataSetting['coordinator'])['mobile'], '-', 6, 0), '-', 3, 0) . '</span>
                    </p>
                    <p style="margin-left: 20px;">
                        <br>
                        จึงเรียนมาเพื่อพิจารณา
                    </p>
                    <p style="margin-left: 20px; text-align: right;" class="blue-text">
                        <span >'. ($dataSetting['approver'])['firstname_t'] . ' ' . ($dataSetting['approver'])['lastname_t'] . '</span>
                        <br>'  . ($dataSetting['approver'])['position'] . '
                    </p>
                </td>
            </tr>
        </table>
        <br>
        <br>
    </body>
</html>';
    return $body;
}
function checkFile($project,$dataSetting )
{
    $body = " ";
    if($project['file_uri'] !== ''){
        $body .= '<td class="second-td"  style="background-color: #dcfefd; ">
        <a>&nbsp;</a>
    </td>
    <td class="second-td" style="background-color:  #2B3467;">
        <a class="file-a" href="http://137.116.132.150/STSBidding'.$dataSetting['project']['Tor_uri'].'">
        &nbsp;&nbsp;TOR&nbsp;&nbsp;</a>
    </td>
    <td class="second-td"  style="background-color: #dcfefd; ">
    <a>&nbsp;</a>
    </td>
    <td class="second-td" style="background-color:  #2B3467;">
    <a class="file-a" href="http://137.116.132.150'.$project['file_uri'].'">
        &nbsp;&nbsp;เอกสารอื่นๆ&nbsp;&nbsp;</a>
    </td>
    
    <td class="second-td"  style="background-color: #dcfefd; ">
        <a>&nbsp;</a>
    </td>
    <td class="second-td" style="background-color:  #2B3467;">
        <a class="file-a" href="http://137.116.132.150/STSBidding/file_pdf/clarification_form.pdf">
        &nbsp;&nbsp;ใบรับฟังคำชี้แจง&nbsp;&nbsp;</a>
    </td>

    <td class="second-td"  style="background-color: #dcfefd; ">
    <a>&nbsp;</a>
    </td>
    <td class="second-td" style="background-color:  #2B3467;">
        <a class="file-a" href="http://137.116.132.150/STSBidding/manual/user_manual.pdf">
        &nbsp;&nbsp;คู่มือการใช้งาน&nbsp;&nbsp;</a>
    </td>';
    }else{
        $body .= '<td class="second-td"  style="background-color: #dcfefd; ">
        <a>&nbsp;</a>
    </td>
    <td class="second-td" style="background-color:  #2B3467;">
        <a class="file-a" href="http://137.116.132.150/STSBidding'.$dataSetting['project']['Tor_uri'].'">
        &nbsp;&nbsp;TOR&nbsp;&nbsp;</a>
    </td>
    <td class="second-td"  style="background-color: #dcfefd; ">
    <a>&nbsp;</a>
    </td>
    
    <td class="second-td"  style="background-color: #dcfefd; ">
        <a>&nbsp;</a>
    </td>
    <td class="second-td" style="background-color:  #2B3467;">
        <a class="file-a" href="http://137.116.132.150/STSBidding/file_pdf/clarification_form.pdf">
        &nbsp;&nbsp;ใบรับฟังคำชี้แจง&nbsp;&nbsp;</a>
    </td>

    <td class="second-td"  style="background-color: #dcfefd; ">
    <a>&nbsp;</a>
    </td>
    <td class="second-td" style="background-color:  #2B3467;">
        <a class="file-a" href="http://137.116.132.150/STSBidding/manual/user_manual.pdf">
        &nbsp;&nbsp;คู่มือการใช้งาน&nbsp;&nbsp;</a>
    </td>';
    }
    
    return $body;
}
