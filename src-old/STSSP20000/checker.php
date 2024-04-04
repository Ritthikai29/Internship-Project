<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="../../asset/css/googlefont-kanit.css" />
  <link rel="stylesheet" href="../../asset/css/bootstrap-5.3.0.css" />
  <script src="../../asset/js/bootstrap-5.3.0.js"></script>
  <script src="../../asset/js/sweetalert2-11.7.3.js"></script>
  <script src="../../asset/js/jQuery-3.5.1.js"></script>
  <script src="../../asset/js/loadingOverlay-2.1.7.js"></script>
  <script src="../../asset/js/dataTable-1.13.1.js"></script>
  <script src="../../asset/js/jQuery-ui-1.12.1.js"></script>
  <script src="../../asset/js/select2-4.1.0.js"></script>
  <link rel="stylesheet" href="../../asset//css/select2-4.1.0.css">
  <link rel="stylesheet" href="../../asset/css/jQuery-ui-1.12.1.css" />
  <link rel="stylesheet" href="../../asset/css/dataTable-1.13.1.css" />
  <link rel="stylesheet" href="../../asset/css/bootstrapIcon.css" />
  <link rel="stylesheet" href="../../asset/css/font-awesome-4.7.0.css" />
  <link rel="stylesheet" href="css/guest-style.css" />
  <link rel="stylesheet" href="css/assign.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.4/font/bootstrap-icons.css">
  <title>Approve Price</title>
</head>

<body class="back">

  <div class="container formbold-main-wrapper">
    <div class="formbold-form-wrapper">
      <form id="project_adder_form">
        <div class="adder mb-4">
          <h3 style="border-bottom: 1px solid #c7c7c7; padding-bottom: 10px;" id="project-title">
            <!-- โครงการ : งานติดตั้งกล้องวงจรปิด AI -->
          </h3>
          <div class="row mt-3">
            <div class="col-5">
              <h5 class="card-title2">เลขที่เอกสาร: <span id="project-key"></span></h5>
            </div>
            <div class="col-4">
              <h5 class="card-title2">สถานะ: <span id="project-status"></span> </h5>
            </div>
          </div>

          <div class="row">
            <div class="col-4">
              <h5 class="date-add">วันที่เพิ่ม: <span id="project-date"></span> </h5>
            </div>
            <div class="col-4">

            </div>
            <h4 class="mt-4 mb-3">
              ดาวน์โหลดเอกสาร
            </h4>
            <div class="row">
              <div class="col-2 me-4"><button type="button" class="bt2" id="btn-TOR"><i
                    class="bi bi-file-earmark-arrow-down-fill"></i> TOR</button></div>
              <div class="col-2"><button type="button" class="bt3" id="btn-JOB"><i
                    class="bi bi-file-earmark-arrow-down-fill"></i> ใบแจ้งงาน</button></div>
            </div>
          </div>
        </div>
        <div class="adder mb-4">
          <h3 style="margin-bottom: 40px;">
            สรุปราคากลาง
          </h3>
          <div class="mb-4">
            <label for="auction_file" class="formbold-form-label ">
              <h6>1.ไฟล์แนบ PDF ที่ผ่านการคำนวณมา
                <span style="color: red">(โปรดเก็บรักษาเป็นความลับและห้ามพิมพ์ออกมาเด็ดขาด)</span>
              </h6>
            </label>

            <div class="row" style="padding-left: 10px;">
              <div class="in file col-5" id="file-input">ราคากลาง.pdf </div>
              <div class="col-1 ms-0 me-0" style="padding-left: 0px;"><button type="button" class="bt1"
                  id="main-price">ตรวจสอบ</button>
              </div>
            </div>

          </div>
          <div id="errorAuction_file" style="color: red;"></div>


          <div class=" mb-4 col-6">
            <label for="auction" class="formbold-form-label">
              <h6>
                2.ราคากลางสุทธิ(รวม) หน่วยบาท
              </h6>
            </label>
            <input disabled class="in" type="text" id="auction-budget" value="200" step="0.01" maxlength="12"
              placeholder="(ราคากลางสุทธิ)" class="formbold-form-input" />
          </div>

          <div id="errorAuctionPrice" style="color: red;"></div>

          <div class="mt-3">
            <label for="confirm_auction" class="formbold-form-label">
              <h6>3.ราคากลางย่อยที่ต้องใช้กำหนดเปรียบเทียบในการประกวดราคา</h6>
            </label>
            <label style="margin-right: 10px; width: 150px;">
              <input disabled id="radioButtonId1" type="radio" name="option[]" value="1" onclick="toggleInput(true)">
              มีราคากลางย่อย
            </label>
            <label style="margin-right: 10px; width: 150px;" class="mb-3">
              <input disabled id="radioButtonId2" type="radio" name="option[]" value="0" onclick="toggleInput(false)">
              ไม่มีราคากลางย่อย
            </label>
            <!-- Hidden  Field-->
            <div id="sub-field" style="display:none" class="mt-3">
              <div id="errorSubPrice" style="color: red;"></div>

              <!-- Show sub details and price here -->

              <div class="backde">
                <div id="item-list">
                  <!-- ตัวอย่างข้อมูล -->
                  <div class="formbold-input-flex" style=" margin:0;">
                    <span class="item-number" style="padding: 10px; padding-left: 80px; width:50px;"></span>
                    <span class="in2 m-auto" style="padding: 10px; width: 350px;font-weight: bold;">รายละเอียด</span>
                    <span class="in2"
                      style="padding: 10px; width: 350px; font-weight: bold;">ราคากลางย่อยหน่วยบาท</span>
                  </div>
                </div>
              </div>

              <div id="errorTab1" style="color: red;"></div>



            </div>
            <div class="d-flex mt-4 mb-5">
              <div class="ms-auto me-auto p-2">
                <button type="button" class="btsum" id="btn-approve">เสนออนุมัติ</button>
              </div>
              <div class="me-auto p-2">
                <button type="button" class="bthold" id="btn-reject">แจ้งแก้ไข</button>
              </div>
            </div>
          </div>

          <div class="adder2 headhis">
            <h3 style="margin-bottom:0; color:#ffffff;">
              ประวัติการดำเนินการ
            </h3>
          </div>
          <div class="adder2">
            <div class="container">
              <div class="table-responsive">
                <table id="project-table" class="table col-lg-12 text-nowrap mt-2">
                  <thead>
                    <tr class="tbhead">
                      <th class="text-center" style="font-weight: bold;" scope="col">Date/Time</th>
                      <th class="text-center" style="font-weight: bold;" scope="col">Action Detail</th>
                      <th class="text-center" style="font-weight: bold;" scope="col">Action By</th>
                    </tr>
                  </thead>
                  <tbody id="history-project" >
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>
    </div>
    </form>
  </div>
  </div>

</body>

</html>


<script type="module" src="js/checker.js"></script>

<script src="../Template/JSHttpRequest.js"></script>
<script src="../Template/JSSweetAlert.js"></script>
<!-- <script src="js/assign.js"></script> -->
<script src="js/checker-subprice.js"></script>