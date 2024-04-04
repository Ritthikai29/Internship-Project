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
  <link rel="stylesheet" href="../../asset/css/dataTable-1.13.1.css" />
  <link rel="stylesheet" href="../../asset/css/bootstrap-icons.css" />
  <link rel="stylesheet" href="../../asset/css/font-awesome.css">
  <link rel="stylesheet" href="../../asset/css/font-awesome.min.css">
  <link rel="stylesheet" href="css/guest-style.css" />
  <link rel="stylesheet" href="css/page-style.css" />
  <link rel="stylesheet" href="css/assign.css" />
  <title>Assign Project</title>
</head>

<body>
  <div class="formbold-main-wrapper">
    <!-- Author: FormBold Team -->
    <!-- Learn More: https://formbold.com -->
    <div class="formbold-form-wrapper">

      <form id="project_adder_form">
        <div class="formbold-steps">
          <ul>
            <li class="formbold-step-menu1 active">
              <span>1</span>
              ข้อมูลโครงการ
            </li>
            <li class="formbold-step-menu2">
              <span>2</span>
              ข้อมูลราคากลาง
            </li>

          </ul>
        </div>
        <div class="adder">
          <div class="formbold-form-step-1 active">
            <div>
              <label for="project" class="formbold-form-label">
                ชื่อโครงการ
              </label>
              <input type="text" name="project" id="project" maxlength="100" placeholder="(ชื่อโครงการ)"
                class="formbold-form-input" />
            </div>
            <div class="formbold-input-flex">
              <div>
                <label for="project_type_select" class="formbold-form-label">
                  ประเภทโครงการ
                </label>
                <select class="form-select" aria-label="Default select example" name="project_type_select"
                  id="project_type_select" required>
                  <option selected disabled value="">เลือกประเภทโครงการ</option>
                </select>
              </div>

              <div>
                <label for="work_type_select" class="formbold-form-label">
                  ประเภทงาน
                </label>
                <select class="form-select" aria-label="Default select example" name="work_type_select"
                  id="work_type_select" required>
                  <option selected disabled value="">เลือกประเภทงาน</option>
                </select>
              </div>
            </div>

            <div class="formbold-input-flex">
              <div>
                <label for="division_select" class="formbold-form-label">
                  ส่วนงาน
                </label>
                <select class="form-select" aria-label="Default select example" name="division_select"
                  id="division_select" required>
                  <option selected disabled value="">เลือกส่วนงาน</option>
                </select>
              </div>

              <div>
                <label for="department_select" class="formbold-form-label">
                  หน่วยงาน
                </label>
                <select class="form-select" aria-label="Default select example" name="department_select"
                  id="department_select" required>
                  <option selected disabled value="">เลือกหน่วยงาน</option>
                </select>
              </div>
            </div>

            <div>
              <label for="tor" class="formbold-form-label mt-4">
                เอกสาร TOR
                <span style="color: red">(PDF ขนาดไม่เกิน 2 MB)</span>
              </label>
              <input type="file" class="form-control" name="tor" id="tor" aria-label="file example"
                accept="application/pdf" required />
            </div>
            <div id="errorTor" style="color: red"></div>
            <div>
              <label for="description" class="formbold-form-label mt-4">
                เอกสารแจ้งงาน
                <span style="color: red">(PDF ขนาดไม่เกิน 2 MB)</span>
              </label>
              <input type="file" class="form-control" name="description" id="description" aria-label="file example"
                accept="application/pdf" required />
            </div>
            <div id="errorDescription" style="color: red"></div>
            <div id="errorMenu1" style="color: red"></div>
          </div>

          <div class="formbold-form-step-2">
            <div style="font-size:20px; font-weight: bold; text-align: center; color:#2B3467;">เลือกวิธีการเพิ่มราคากลาง
            </div>
            <div class="container-fluid mt-3">
              <div class="row">

                <div class="col mt-0">
                  <div class="tab active" data-tab="tab1">
                    <div class="row">

                      <div class="col-6 m-auto" style="font-size: 20px;">เพิ่มราคากลางที่มีอยู่</div>
                      <div class="col-6"><i class="icon bi bi-file-earmark-pdf-fill"></i></div>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="tab" data-tab="tab2">
                    <div class="row">
                      <div class="col-6"><i class="icon bi bi-file-earmark-plus-fill"></i></div>
                      <div class="col-6 m-auto" style="font-size: 20px;">อนุมัติราคากลางใหม่</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- in this hidden input element is for show type of input -->
              <!-- 1. mean add with price, 2. mean add to calculates -->
              <input type="hidden" id="create-type" value="1" />
              <!-- TAB 1 -->
              <div class="tab-content active" id="tab1-content">

                <div>
                  <label for="auction_file" class="formbold-form-label ">
                    1.โปรดแนบไฟล์ PDF ที่ผ่านการคำนวณมา
                    <span style="color: red">(โปรดเก็บรักษาเป็นความลับและห้ามพิมพ์ออกมาเด็ดขาด)</span>
                  </label>
                  <input type="file" class="form-control" name="auction_file" id="auction_file"
                    aria-label="file example" accept="application/pdf" required />
                </div>
                <div id="errorAuction_file" style="color: red;"></div>

                <div class="mt-3">
                  <label for="auction" class="formbold-form-label">
                    2.โปรดใส่ราคากลางสุทธิ(รวม) หน่วยบาท
                  </label>
                  <input type="text" name="auction" id="auction" oninput="validateDecimal(this)" step="0.01"
                    maxlength="12" placeholder="(ราคากลางสุทธิ)" class="formbold-form-input" />
                </div>
                <div id="errorAuctionPrice" style="color: red;"></div>

                <div class="mt-3">
                  <label for="confirm_auction" class="formbold-form-label">
                    3.ท่านมีราคากลางย่อยที่ต้องใช้กำหนดเปรียบเทียบในการประกวดราคาหรือไม่
                  </label>
                  <label>
                    <input type="radio" name="is_sub_price" value="1" onclick="toggleInput(true)">มีราคากลางย่อย
                  </label>
                  <label>
                    <input type="radio" name="is_sub_price" value="0" onclick="toggleInput(false)">ไม่มีราคากลางย่อย
                  </label>
                  <!-- Hidden  Field-->
                  <div id="sub-field" style="display:none" class="mt-3">
                    <div id="errorSubPrice" style="color: red;"></div>
                    <div class="formbold-input-flex">
                      <div>
                        <label class="formbold-form-label" style="margin-left: 25px;">รายละเอียด</label>
                        <input style="margin-left: 25px; width: 350px; height: 40px; border: 1px #cdcdcd solid;"
                          id="detail-input" type="text" placeholder="(รายละเอียดงาน)">
                      </div>

                      <div>
                        <label class="formbold-form-label">ใส่ราคากลางย่อยหน่วยบาท</label>
                        <input style="width: 350px; height: 40px; border: 1px #cdcdcd solid;" id="price-input"
                          type="text" oninput="validateDecimal(this)" step="0.01" maxlength="12"
                          placeholder="(ราคากลางย่อย)">
                      </div>


                      <div>
                        <label for=""></label>
                        <button type="button" id="add-button" class="addbt">ADD</button>
                      </div>
                    </div>


                    <div id="item-list"></div>

                    <div style="border-top: 1px #c7c7c7 solid ; padding: 5px 0">
                      <label style="font-weight: bold;">รวมราคากลางสุทธิ :</label>
                      <span id="total-price">0</span>
                      <span id="price-status"></span>
                    </div>

                  </div>
                </div>

                <script>
                  function toggleInput(show) {
                    var subField = document.getElementById("sub-field");
                    if (show) {
                      subField.style.display = "block";
                    } else {
                      subField.style.display = "none";
                    }
                  }
                </script>


                <div id="errorTab1" style="color: red;"></div>
              </div>
              <!-- TAB 2 -->
              <div class="tab-content" id="tab2-content">

                <label for="Calculator" class="formbold-form-label">ผู้คำนวณราคากลาง</label>
                <div class="row grand-relative">
                  <div class="col">
                    <input type="text" id="calculator" class="formbold-form-input" maxlength="30"
                      placeholder="(ป้อนรหัสพนักงาน หรือชื่อพนักงาน)">
                    <input type="hidden" id="calculator-id">
                    <!-- dropdown for user selection -->
                    <ul class="dropdown-main" style="display: none;" id="cal-list">

                    </ul>
                  </div>

                  <div id="errorCal" style="color: red;"></div>
                </div>

                <ul id="result_cal"></ul>


                <label for="Checker" class="formbold-form-label">ผู้ตรวจสอบราคากลาง</label>
                <div class="row grand-relative">
                  <div class="col">
                    <input type="text" id="checker" class="formbold-form-input" maxlength="30" empid="15"
                      placeholder="(ป้อนรหัสพนักงาน หรือชื่อพนักงาน)">
                    <input type="hidden" id="checker-id">
                    <!-- dropdown for user selection -->
                    <ul class="dropdown-main" style="display: none;" id="checker-list">

                    </ul>
                  </div>

                  <div id="errorChecker" style="color: red;"></div>
                </div>
                <ul id="result_checker"></ul>


                <label for="Approver" class="formbold-form-label">ผู้อนุมัติราคากลาง</label>
                <div class="row grand-relative">
                  <div class="col">
                    <input type="text" id="approver" class="formbold-form-input" maxlength="30"
                      placeholder="(ป้อนรหัสพนักงาน หรือชื่อพนักงาน)">
                    <input type="hidden" id="approver-id">
                    <!-- dropdown for user selection -->
                    <ul class="dropdown-main" style="display: none;" id="approver-list">

                    </ul>
                  </div>

                  <div id="errorApprover" style="color: red;"></div>
                </div>
                <ul id="result_approver"></ul>



                <label for="Approver2" class="formbold-form-label">ผู้อนุมัติราคากลาง 2 <span
                    style="color:red;">(ถ้ามี)</span></label>
                <div class="row grand-relative">
                  <div class="col">
                    <input type="text" id="approver2" class="formbold-form-input" maxlength="30"
                      placeholder="(ป้อนรหัสพนักงาน หรือชื่อพนักงาน)">
                    <input type="hidden" id="approver2-id">
                    <!-- dropdown for user selection -->
                    <ul class="dropdown-main" style="display: none;" id="approver2-list">

                    </ul>
                  </div>
                  <div id="errorApprover" style="color: red;"></div>
                </div>
                <ul id="result_approver2"></ul>

                <div id="errorTab2" style="color: red;"></div>
              </div>
            </div>
          </div>


          <div class="formbold-form-btn-wrapper">
            <button class="formbold-back-btn">กลับ</button>
            <button class="formbold-btn" id="next">ต่อไป</button>
          </div>
        </div>
      </form>

      <div>
        <button id="login">
          Login Test
        </button>
      </div>
    </div>
  </div>

</body>

</html>
<!-- <script src="js/assign.js"></script> -->
<script src="js/assign-step.js"></script>
<script src="js/assign-subprice.js"></script>

<script type="module" src="js/STS10600/calculateSelection.js"></script>
<script type="module" src="js/STS10600/loadSelection.js"></script>

<script src="../Template/JSGeneral.js"></script>
<script src="../Template/JSHttpRequest.js"></script>
<script src="../Template/JSSweetAlert.js"></script>

<script>
  fetch('../Template/STS10000_header.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('body').insertAdjacentHTML('afterbegin', data);
    });
</script>

<script>
  fetch('../Template/footer.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('body').insertAdjacentHTML('beforeend', data);
    });
</script>