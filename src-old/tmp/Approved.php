<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../../asset/css/googlefont-kanit.css" />
    <link rel="stylesheet" href="../../asset/css/bootstrap-5.3.0.css" />
    <link rel="stylesheet" href="../../asset/scss/scss-0.11.1.scss" />
    <script src="../../asset/js/bootstrap-5.3.0.js"></script>
    <script src="../../asset/js/sweetalert2-11.7.3.js"></script>
    <script src="../../asset/js/jQuery-3.5.1.js"></script>
    <script src="../../asset/js/dataTable-1.13.1.js"></script>
    <link rel="stylesheet" href="../../asset/css/dataTable-1.13.1.css" />
    <link rel="stylesheet" href="../../asset/css/bootstrapIcon.css" />
    <link rel="stylesheet" href="../../asset/css/font-awesome-4.7.0.css">
    <link rel="stylesheet" href="css/guest-style.css" />
    <title>Home More</title>
</head>

<body class="back">


    <?php
    include("template/header.php");
    ?>



    <div class="container mb-4 mt-5 ">

        <div class="cardback mb-5">
            <div class="apphead">
                <h2>การอนุมัติผู้สมัครเข้าร่วมประกวดราคา</h2>
            </div>
            <div class="content">
                <div class="col mb-3" style="border-bottom: 1px #cacaca solid;">
                    <h5 id="project" class="ticon">ชื่อโครงการ: งานติดตั้งกล้องวงจรปิด AI </h5>
                </div>
                <div class="row mb-2">
                    <div class="col-8">
                        <h5 id="project_id" class="card-title2">เลขที่เอกสาร: CAMERA20/11/65</h5>
                    </div>
                    <div class="col-4">
                        <h5 id="status" class="card-title2">สถานะ: เสร็จสิ้น</h5>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-8">
                        <h5 id="projectAdded" class="card-title2">วันที่เพิ่ม: 19/03/65</h5>
                    </div>
                    <div class="col-4">
                        <h5 id="projectEnded" class="card-title2">วันที่สิ้นสุด: 22/08/66</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2"><button type="button" class="filebt1"><i class="bi bi-file-earmark-arrow-down-fill"></i> TOR</button></div>
                    <div class="col-2"><button type="button" class="filebt2"><i class="bi bi-file-earmark-arrow-down-fill"></i> ใบแจ้งงาน</button></div>
                </div>
            </div>
        </div>


        <table id="project-table" class="table1 table-hover text-center mt-5">
            <thead class="thead-dark">
                <tr>
                    <th scope="col" class="text-center">ลำดับ</th>
                    <th scope="col" class="text-center">ผู้สมัครเข้าร่วมงานประกวดราคา</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div class="container mt-5">
        <p style="color: green; font-size:25px; text-align: right;">
            คำชี้แจง : เพื่ออนุมัติการเชิญ Vendor ตามจำนวนข้างต้น เข้าร่วมประกวดราคาดังรายละเอียด ซึ่งระบุในหัวข้อ และ TOR แนบ
        </p>
        <div class="row">
            <div class="col-10"></div>
            <div class="col-2" style="text-align: right;">
                <button type="button" class="btn btapprov btn-danger" onclick="confirmSending()"> อนุมัติ</button>
            </div>
        </div>

    </div>


    <!-- footter-->

    <?php
    include("template/footer.php");
    ?>

</body>
<script src="../fetchClass.js"></script>
<script src="../alertClass.js"></script>
<script>
    $(document).ready(async function() {
        await loadTable();
        $("#project-table").DataTable({
            autoWidth: false,
            responsive: true
        });
    })

    async function loadTable() {
        // const url = "api/get_mailApprove";
        // const jsonData = await FetchAPI.getData(url);
        const jsonData = [{
                fname: "นาย สมปอง",
                lname: "เอกสรสาร",
                call: "0813333333",
                email: "Kanook12324@gmail.com",
                date: "20/11/2565",
                company: "บริษัท ปลอดภัย จำกัด",
                address: "1/11 หมู่ 1 ตำบล หนึ่ง อำเภอ หนึ่ง จังหวัด แห่งหนึ่ง 811111 ชั้น 1",
                Status: "หจก. ที่ขึ้นทะเบียนไว้แล้ว"
            },
            {
                fname: "นาย สมพงค์",
                lname: "เอกสรสาร",
                call: "0813333333",
                email: "Kanook12324@gmail.com",
                date: "20/11/2565",
                company: "บริษัท ปลอดภัย จำกัด",
                address: "1/11 หมู่ 1 ตำบล หนึ่ง อำเภอ หนึ่ง จังหวัด แห่งหนึ่ง 811111 ชั้น 1",
                Status: "หจก. ที่ขึ้นทะเบียนไว้แล้ว"
            },
            {
                fname: "นาง สมศรี",
                lname: "เอกสรสาร",
                call: "0813333333",
                email: "Kanook12324@gmail.com",
                date: "20/11/2565",
                company: "บริษัท ปลอดภัย จำกัด",
                address: "1/11 หมู่ 1 ตำบล หนึ่ง อำเภอ หนึ่ง จังหวัด แห่งหนึ่ง 811111 ชั้น 1",
                Status: "หจก. นอก list และได้รับการอนุมัติจากผู้อำนวยการโรงงานแล้ว"
            },
            {
                fname: "นาย สมศักดิ์",
                lname: "เอกสรสาร",
                call: "0813333333",
                email: "Kanook12324@gmail.com",
                date: "20/11/2565",
                company: "บริษัท ปลอดภัย จำกัด",
                address: "1/11 หมู่ 1 ตำบล หนึ่ง อำเภอ หนึ่ง จังหวัด แห่งหนึ่ง 811111 ชั้น 1",
                Status: "หจก. นอก list และได้รับการอนุมัติจากผู้อำนวยการโรงงานแล้ว"
            },
            {
                fname: "นางสาว สมหมาย",
                lname: "เอกสรสาร",
                call: "0813333333",
                email: "Kanook12324@gmail.com",
                date: "20/11/2565",
                company: "บริษัท ปลอดภัย จำกัด",
                address: "1/11 หมู่ 1 ตำบล หนึ่ง อำเภอ หนึ่ง จังหวัด แห่งหนึ่ง 811111 ชั้น 1",
                Status: "หจก. ที่ขึ้นทะเบียนไว้แล้ว"
            }

        ];

        $("#project-table tbody").empty();

        let number = 1;

        // Populate the table
        for (const item of jsonData) {
            let status;
            switch (item.Status) {
                case "หจก. ที่ขึ้นทะเบียนไว้แล้ว":
                    status = `<p style="color:green;" class="p-1">สถานะการขึ้นทะเบียน : ${item.Status}</p>`;
                    break;
                case "หจก. นอก list และได้รับการอนุมัติจากผู้อำนวยการโรงงานแล้ว":
                    status = `<p style="color:orange;" class="p-1">สถานะการขึ้นทะเบียน : ${item.Status}</p>`;
                    break;

            }
            $("#project-table tbody").append(`
    <tr>
      <td class="more  backcard">${number}</td>
      <td class="backcard " >
        <div class="card shadow-lg" style="text-align: left;">
          <div class="card-body body1">
              <div class="row">
                <div class=""></div>
                  <div class=" col    text-start">
                      <p class="p-1">ชื่อ : ${item.fname}</p>
                    </div>
                    <div class="col">
                    <p class="p-1">นามสกุล : ${item.lname}</p>
                    </div>
                    <div class="col">
                    </div>
              </div>
              <div class="row mb-3">
                  <div class=""></div>
                  <div class=" col    text-start">
                      <p class="p-1">เบอร์โทร : ${item.call}</p>
                    </div>
                    <div class="col">
                    <p class="p-1">อีเมลล์ : ${item.email} </p>
                    </div>
                    <div class="col">
                    <p class="p-1">วันที่สมัคร : ${item.date}</p>
                    </div>

                  </div>
                  <p class="p-1">ชื่อบริษัท : ${item.company}</p>
                  <p class="p-1">ที่ตั้งสำนักงาน : ${item.address}</p>
                  <p class="p-1"> ${status}</p>
                 
              </div>
          </div>
      </div>
      </td>
    </tr>
    `);
            number++;
        }
    }

    function sending(){
        alert = new SweetAlertClass();
        alert.showSuccessAlert(null, "ส่งเชิญสำเร็จแล้ว");
    }

    function confirmSending() {
        alert = new SweetAlertClass();
        alert.showConfirmAlert(sending, "ต้องการอนุมัติการส่งเชิญไปยัง Vendor ทั้งหมดที่แสดง");
    }
</script>

</html>