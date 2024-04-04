<?php
session_start();
include_once("../Template/SettingTemplate.php");
include_once("../Template/SettingApi.php");
include_once("../Template/SettingAuth.php");
include_once("../Template/SettingDatabase.php");
include_once("../Template/SettingEncryption.php");
include_once("../Template/SettingMailSend.php");
include_once("./funcInviteVendorMail.php");

$http = new Http_Response();
$mail = new Mailing();

/**
 * test
 */

$mail->sendTo("nattapong30294@hotmail.com");
$subjectEmail = "ผลการพิจารณาการอนุมัติการเชิญ Vendor เข้าร่วมประกวดราคา  เลขที่เอกสาร : " . $projectKey;
$htmlContent = '
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SCG</title>
</head>

<body>
    <table style="width: 1000px; border-collapse: collapse;">
        <thead>
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="4" style="border: 2px solid rgb(104, 104, 104); border-bottom: none;">
                    <span>&nbsp;</span><br>
                    <h3>โปรดพิจารณาอนุมัติการแจ้งงานหมายเลข [!--REPORT_ID--!] โดยรายละเอียดนี้
                    </h3>
                </td>
            </tr>
            <tr style="border: 2px solid rgb(104, 104, 104); border-top: none; width: 100%;" >
                <td style="border: none ;width: 10%;">
                    <a href="[!--BTN_APPROVE--!]" style="text-decoration: none;">
                        <div style="
                        width: 80px;
                        height: 40px; 
                        background-color: #198754;  
                        border-radius: 5px;
                        border: 0;
                        text-align: center;
                        color: #ffffff !important;
                        ">
                            <div style="height: 10px;">&nbsp;</div>
                            อนุมัติ
                        </div>
                    </a>
                    <div style="height: 10px;"></div>
                </td>
                <td style="border: none ;" colspan="3">

                    <a href="[!--BTN_DISAPPROVE--!]" style="text-decoration: none;">
                        <div style="
                        width: 80px;
                        height: 40px; 
                        background-color: #c50000;  
                        border-radius: 5px;
                        border: 0;
                        text-align: center;
                        color: #ffffff !important;
                        ">
                            <div style="height: 10px;">&nbsp;</div>
                            ไม่อนุมัติ
                        </div>
                    </a>
                    <div style="height: 10px;"></div>
                
                </td>
            </tr>
            </tbody>
            </table>
    <table style="width: 1000px; border-collapse: collapse;">
        <thead>
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
           
            <tr>
                <td colspan="4" style="text-align: right;">
                    <span>&nbsp;</span><br>
                    <h3>Report Number: [!--REPORT_ID--!]</h3>
                </td>
            </tr>

            <tr>
                <td colspan="3" style="border: 2px solid rgb(104, 104, 104);  width:70%">
                    <h3 style="text-decoration-line: underline;">ชื่องาน/รายละเอียดของงาน</h3>
                    <p>[!--DESCRIPTION--!]</p>
                </td>
                <td style="border: 2px solid rgb(104, 104, 104);  width: 30%;">
                    <h3 style="text-decoration-line: underline;">วันที่แจ้งงาน</h3>
                    <p>[!--REPORT_DATE--!]</p>
                </td>
            </tr>

            <tr>
                <td colspan="2" style="border: 2px solid rgb(104, 104, 104); border-bottom: none; ">
                    <h3 style="text-decoration-line: underline; ">รายละเอียดผู้แจ้ง</h3>
                </td>
                <td colspan="2" style="border: 2px solid rgb(104, 104, 104); border-bottom: none;">
                    <h3 style="text-decoration-line: underline;">รายละเอียดเรียกเก็บค่าใช้จ่าย</h3>
                </td>
            </tr>

            <tr>
                <td style="border-left: 2px solid rgb(104, 104, 104); ">
                    <h4>ชื่อเจ้าของงาน</h4>
                </td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">
                    <h4>Section</h4>
                </td>
                <td style="border-left: 2px solid rgb(104, 104, 104); ">
                    <h4>Company Code</h4>
                </td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">
                    <h4>Cost Center</h4>
                </td>
            </tr>
            <tr>
                <td style="border-left: 2px solid rgb(104, 104, 104); ">[!--OWNER--!]</td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">[!--SECTION--!]</td>
                <td style="border-left: 2px solid rgb(104, 104, 104); ">[!--COMPANY_CODE--!]</td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">[!--COST_CENTER--!]</td>
            </tr>
            <tr>
                <td style="border-left: 2px solid rgb(104, 104, 104); ">
                    <h4>Department</h4>
                </td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">
                    <h4>เบอร์ติดต่อ</h4>
                </td>
                <td style="border-left: 2px solid rgb(104, 104, 104); ">
                    <h4>Cost Element</h4>
                </td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">
                    <h4>Internal Order(IO)</h4>
                </td>
            </tr>

            <tr>
                <td style="border-left: 2px solid rgb(104, 104, 104); ">[!--DEPARTMENT--!]<br><span>&nbsp;</span></td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">[!--PHONE--!]<br><span>&nbsp;</span></td>
                <td style="border-left: 2px solid rgb(104, 104, 104); ">[!--COST_ELEMENT--!]<br><span>&nbsp;</span></td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">[!--IO--!]<br><span>&nbsp;</span></td>
            </tr>

            <tr>
                <td style="border: 2px solid rgb(104, 104, 104); border-bottom: none;" colspan="4">
                    <h3 style="text-decoration-line: underline;">รายละเอียดอื่นๆ</h3>
                </td>
            </tr>

            <tr>
                <td style="border-left: 2px solid rgb(104, 104, 104); ">
                    <h4>ชนิดของงาน</h4>
                </td>
                <td>
                    <h4>นอกกระบวนการผลิต</h4>
                </td>
                <td>
                    <h4>Shutdown Type</h4>
                </td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">
                    <h4>Equipment Number</h4>
                </td>
            </tr>

            <tr style="border-bottom: 2px solid rgb(104, 104, 104); ">
                <td style="border-left: 2px solid rgb(104, 104, 104); ">[!--WORK_TYPE--!]<br><span>&nbsp;</span></td>
                <td>[!--IN_OUT--!]<br><span>&nbsp;</span></td>
                <td>[!--SHUTDOWN_TYPE--!]<br><span>&nbsp;</span></td>
                <td style="border-right: 2px solid rgb(104, 104, 104); ">[!--EQ_NUM--!]<br><span>&nbsp;</span></td>

            </tr>
        </tbody>
    </table>

    <span>&nbsp;</span><br>
    <span>&nbsp;</span><br>

    <h3 style="text-decoration-line: underline;">ประวัติการดำเนินการ</h3>
    <table style="width: 1000px; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="border: 2px solid rgb(104, 104, 104); ">Date/Time</th>
                <th style="border: 2px solid rgb(104, 104, 104); ">Action Detail</th>
                <th style="border: 2px solid rgb(104, 104, 104); ">Action By</th>
            </tr>
        </thead>
        <tbody>
            [!--TABLE_LOG--!]
        </tbody>
    </table>
</body>

</html>

';

$mail->addSubject($subjectEmail);
$mail->addBody($htmlContent);
$mail->sending();
$mail->clearAddress();

$http->Ok([
    "data" => "success",
    "status" => 200
]);
