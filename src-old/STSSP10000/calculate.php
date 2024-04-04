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
  <title>Calculate Price</title>
</head>

<body class="back">
  <div class="container formbold-main-wrapper">
    <div class=" formbold-form-wrapper">
      <form id="project_adder_form">
        <div class="adder mb-4">
          <h3 id="project-name" style="border-bottom: 1px solid #c7c7c7; padding-bottom: 10px;">
            <!-- โครงการ : งานติดตั้งกล้องวงจรปิด AI -->
          </h3>
          <div class="row mt-3">
            <div class="col-6">
              <h5 class="">เลขที่เอกสาร: <span id="project-key"></span></h5>
            </div>
            <div class="col-6">
              <h5 class="">สถานะ: <span id="project-status"></span> </h5>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <h5 class="">วัน-เวลาเพิ่ม: <span id="project-date"></span> </h5>
            </div>
            <div class="col-6">

            </div>
            <h4 class="mt-4 mb-3">
              ดาวน์โหลดเอกสาร
            </h4>
            <div class="row">
              <div class="col-2 me-4">
                <button type="button" class="bt2" id="btn-TOR">
                  <i class="bi bi-file-earmark-arrow-down-fill"></i> TOR
                </button>
              </div>
              <div class="col-2 me-4">
                <button type="button" class="bt3" id="btn-JOB">
                  <i class="bi bi-file-earmark-arrow-down-fill"></i> ใบแจ้งงาน
                </button>
              </div>
              <div class="col-2" id="old-file-calculator" style="display:none;">
                <button type="button" class="bt4" id="btn-CAL">
                  <i class="bi bi-file-earmark-arrow-down-fill"></i> ใบคำนวนเก่า
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Reject Section For show when have a rejection from "verifier" and "approver" -->
        <div class="adder mb-4" style="display: none;" id="reject-section">
          <div>
            <h3>การปฎิเสธ</h3>
          </div>
          <hr />
          <div class="row mt-3 mb-4">
            <label class="formbold-form-label">
              <h6>1. เหตุผลในการปฎิเสธ</h6>
            </label>
            <div class="col-5">
              <div class="formbold-form-input" id="reject-reason">
                เหตุผลในการปฎิเสธ
              </div>
            </div>
          </div>

          <div class="row mt-3 mb-4">
            <label class="formbold-form-label">
              <h6>2. ข้อมูลเพิ่มเติม</h6>
            </label>
            <div class="col-5">
              <p id="reject-comment" class="formbold-form-input " style="word-wrap:break-word;">
                ข้อมูลเพิ่มเติม
              </p>
            </div>
            <div class="col-7"></div>
          </div>

        </div>

        <div class="adder">
          <h3 style="margin-bottom: 40px;">
            คำนวณราคากลาง
          </h3>
          <label for="auction_file" class="formbold-form-label ">
            <h6>1.โปรดแนบไฟล์ PDF ที่ผ่านการคำนวณมา
              <span style="color: red; ">(โปรดเก็บรักษาเป็นความลับและห้ามพิมพ์ออกมาเด็ดขาด)</span>
            </h6>
          </label>
          <div class="row ">
            <div class="col-6">
              <div class="row mb-3">

                <div class="col-10 ms-0 me-0" style="padding-right: 0px;">
                  <input type="file" class="form-control input1 col-11" name="auction_file" id="auction_file"
                    aria-label="file example" accept="application/pdf" required />
                </div>
                <div class="col-2 ms-0 me-0" style="padding-left: 0px;">
                  <button type="button" class="bt1" id="btn-file-check">ตรวจสอบ</button>
                </div>

              </div>
            </div>

          </div>
          <div id="errorAuction_file" style="color: red;"></div>

          <div class="mt-3 col-6 mb-4">
            <label for="auction" class="formbold-form-label">
              <h6>2.โปรดใส่ราคากลางสุทธิ(รวม) หน่วยบาท</h6>
            </label>
            <input type="text" name="auction" id="auction-budget" min="0" step="0.01" maxlength="12"
              placeholder="(ราคากลางสุทธิ)" class="formbold-form-input input1" />
          </div>
          <div id="errorAuctionPrice" style="color: red;"></div>

          <div class="mt-3">
            <label for="confirm_auction" class="formbold-form-label">
              <h6>3.ท่านมีราคากลางย่อยที่ต้องใช้กำหนดเปรียบเทียบในการประกวดราคาหรือไม่</h6>
            </label>
            <label style="margin-right: 10px; width: 150px;">
              <input type="radio" name="option[]" value="1" id="radio-have" onclick="toggleInput(true)"> มีราคากลางย่อย
            </label>
            <label style="width: 150px;">
              <input type="radio" name="option[]" value="0" id="radio-not-have" onclick="toggleInput(false)">
              ไม่มีราคากลางย่อย
            </label>


            <!-- Hidden  Field-->
            <div id="sub-field" style="display:none" class="mt-3">
              <div id="errorSubPrice" style="color: red;"></div>
              <label style="color: green;">
                <p><span style="font-weight: bold;">คำแนะนำ :</span>
                  <br>
                  1. กรุณากรอกข้อมูลที่ต้องการลงในช่อง และกดปุ่ม “ADD” เพื่อยืนยัน
                  </br>
                  2. สามารถเพิ่มได้หลายรายการ
                </p>
              </label>
              <div class="formbold-input-flex mb-0">

                <div align="center" style="padding-left: 95px;">
                  <label class="formbold-form-label" style="margin-left: 30px;">รายละเอียด</label>
                  <input
                    style="text-align: center; margin-left: 25px; width: 350px; height: 40px; border: 1px #cdcdcd solid;"
                    id="detail-input" type="text" placeholder="(รายละเอียดงาน)">
                </div>

                <div align="center">
                  <label class="formbold-form-label">ใส่ราคากลางย่อยหน่วยบาท</label>
                  <input style="text-align: center; width: 350px; height: 40px; border: 1px #cdcdcd solid;"
                    id="price-input" type="text" step="0.01" maxlength="12" placeholder="(ราคากลางย่อย)">
                </div>

                <div>
                  <label for=""></label>
                  <button type="button" id="add-button" class="addbt">ADD</button>
                </div>
              </div>

              <!-- Show sub details and price here -->
              <div class="backde">

                <!-- in this line i use a javascript to run this -->
                <div id="item-list">

                </div>
                <div class="mt-3 row" style="border-top: 1px #c7c7c7 solid ; padding-top: 10px; padding-left:70px;">
                  <div class="col-6">
                    <label style="font-weight: bold;">รวมราคากลางสุทธิ :</label>
                  </div>
                  <div class="col-2" style="padding-left: 51px; text-align:center;">
                    <span id="total-price">0</span>
                  </div>
                  <div class="col-4" style="padding-left: 50px; text-align: center;">
                    <span id="price-status"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <center id="summary-form">
            <div class="col mt-4">
              <!-- will change it to id="btn-summary" -->
              <button type="button" class="btsum" id="btn-summary">สรุปข้อมูล</button>
            </div>
          </center>

          <!-- Hidden for summary a data in code -->
          <center class="row" id="submit-form" style="display:none;">
            <div class="col mt-4">
              <button type="button" class="btn-submit" id="btn-submit">เสนออนุมัติ</button>
            </div>
            <div class="col mt-4">
              <button type="button" class="btn-edit" id="btn-edit">แก้ไขข้อมูล</button>
            </div>
          </center>
          <div id="errorTab1" style="color: red;"></div>

          <div class="adder2 headhis mt-4">
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
                  <tbody id="history-project">
                  </tbody>

                </table>
              </div>
            </div>
          </div>

        </div>
    </div>
    </form>
  </div>

  <div>
    <button id="test">
      Test
    </button>
  </div>

  </div>

</body>

</html>

<script type="module" src="js/calculate.js"></script>
<script src="js/assign-subprice.js"></script>
<!-- 
<script src="../fetchClass.js"></script>
<script src="../alertClass.js"></script> -->
<!-- <script src="js/assign.js"></script> -->