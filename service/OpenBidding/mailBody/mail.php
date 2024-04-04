<?php

include("../OpenBiddingService.php");
$openBiddingService = new OpenBiddingService();

//$openDateTime = $openBiddingService->detailOpenBidding(); 
?>

<html>
    <body>
        <style>
            h1{
                color: #2B3467;
                font-weight: 900;
            }

            h3{
                color: #444444;
                font-weight: 600;
            }
            
            .container {
                margin: 6rem;
            }

            .text-box{
                border-radius: 10px;
                background: #d8d8d8;
                padding-top: 10px;
                padding-bottom: 10px;
                padding-left: 20px;
                width: 200px;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            th, td {
                text-align: left;
                padding: 8px;
            }

            tr:nth-child(even){background-color: #f2f2f2}

            th {
                
                background-color: #262525;
                color: white;
            }

            /* textcolor */
            .font-red{
                color: #FF0000;
            }

            .font-blue{
                color: #0083FF ; 
            }
            
            .rcorners1 {
                border-radius: 20px;
                background: #ffffff;
                padding-top: 30px;
                padding-bottom: 30px;
                padding-left: 100px;
                padding-right: 100px;
                width: max;
                height: auto;
                box-shadow: 2px 2px 8px #b7b7b7;
                margin-bottom: 2rem;
            }  


        </style>
        <div class="container">

            <h1 class="">1. ข้อมูลประเภทงานและผู้เข้าร่วมประกวดโครงการ</h1>
            <div class="rcorners1">
                <h3>1) ประเภทงาน</h3>
                <p class="text-box">dsfsdf</p>
            </div>
    
            <div class="rcorners1">
                <h3>2) ผู้เข้าร่วมประกวดราคาทั้งหมด</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>ประเภท</th>
                            <th>เลขสมาชิก</th>
                            <th>ชื่อ หจก./บริษัท</th>
                            <th>ชื่อผู้จัดการ</th>
                            <th>อีเมล์</th>
                            <th>เบอร์โทร</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td class="font-blue">ใน List ทะเบียน</td>
                            <td>A00001</td>
                            <td>หจก.ท่งุ สงสุคนธ์การ</td>
                            <td>นาย ก่อสร้าง คงทน</td>
                            <td>abc@gmail.com</td>
                            <td>099-xxxxxxx</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td class="font-blue">ใน List ทะเบียน</td>
                            <td>A00001</td>
                            <td>หจก.ท่งุ สงสุคนธ์การ</td>
                            <td>นาย ก่อสร้าง คงทน</td>
                            <td>abc@gmail.com</td>
                            <td>099-xxxxxxx</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td class="font-blue">ใน List ทะเบียน</td>
                            <td>A00001</td>
                            <td>หจก.ท่งุ สงสุคนธ์การ</td>
                            <td>นาย ก่อสร้าง คงทน</td>
                            <td>abc@gmail.com</td>
                            <td>099-xxxxxxx</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td class="font-red">นอก List ทะเบียน</td>
                            <td>A00001</td>
                            <td>หจก.ท่งุ สงสุคนธ์การ</td>
                            <td>นาย ก่อสร้าง คงทน</td>
                            <td>abc@gmail.com</td>
                            <td>099-xxxxxxx</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td class="font-red">นอก List ทะเบียน</td>
                            <td>A00001</td>
                            <td>หจก.ท่งุ สงสุคนธ์การ</td>
                            <td>นาย ก่อสร้าง คงทน</td>
                            <td>abc@gmail.com</td>
                            <td>099-xxxxxxx</td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
           
            <h1>2. ข้อมูลตั้งค่าโครงการ</h1>
            <div class="rcorners1">
                <div>
                    <h3>1) กำหนดระยะรับสมัคร</h3>
                    <h3>2) กำหนดเงินประกันซองที่ต้องชำระ</h3>
                    <h3>3) กำหนดข้อมูลผู้จัดการส่วนเพื่ออนุมัติหนังสือเชิญ</h3>
                </div>
            </div>
            <h1>3. รายละเอียดเพิ่มเติมและไฟล์แนบในหนังสือเชิญ</h1>
            <div class="rcorners1">
                <h3>1) วัน/เวลา รับฟังคำชี้แจงจากหน่วยงานต้นสังกัด</h3>


                <h3>2) ผู้ประสานงานโครงการ</h3>
            </div>
        </div>
    </body>
</html>