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
          <h3 style="border-bottom: 1px solid #c7c7c7; padding-bottom: 10px;">
            โครงการ : งานติดตั้งกล้องวงจรปิด AI
          </h3>
          <div class="row mt-3">
            <div class="col-5">
              <h5 class="card-title2">เลขที่เอกสาร: 11111111</h5>
            </div>
            <div class="col-4">
              <h5 class="card-title2">สถานะ: เสร็จสิ้น</h5>
            </div>
          </div>

          <div class="row">
            <div class="col-4">
              <h5 class="date-add">วันที่เพิ่ม: 19/03/65</h5>
            </div>
            <div class="col-4">

            </div>
            <h4 class="mt-4 mb-3">
              ดาวน์โหลดเอกสาร
            </h4>
            <div class="row">
              <div class="col-2"><button type="button" class="bt2"><i class="bi bi-file-earmark-arrow-down-fill"></i>
                  TOR</button></div>
              <div class="col-2"><button type="button" class="bt3"><i class="bi bi-file-earmark-arrow-down-fill"></i>
                  ใบแจ้งงาน</button></div>
            </div>
          </div>
        </div>
        <div class="adder">
          <h3>
            สรุปราคากลาง
          </h3>
          <div>
            <label for="auction_file" class="formbold-form-label ">
              1.ไฟล์แนบ PDF ที่ผ่านการคำนวณมา
              <span style="color: red">(โปรดเก็บรักษาเป็นความลับและห้ามพิมพ์ออกมาเด็ดขาด)</span>
            </label>

            <div class="row" style="padding-left: 10px;">
              <div class="in file col-5">ราคากลาง.pdf </div>
              <div class="col-1 ms-0 me-0" style="padding-left: 0px;"><button type="button" class="bt1">ตรวจสอบ</button>
              </div>
            </div>

          </div>
          <div id="errorAuction_file" style="color: red;"></div>

          <div class="formbold-input-flex">
            <div class="mt-3">
              <label for="auction" class="formbold-form-label">
                2.ราคากลางสุทธิ(รวม) หน่วยบาท
              </label>
              <input disabled class="in" type="text" id="auction" value="200" step="0.01" maxlength="12"
                placeholder="(ราคากลางสุทธิ)" class="formbold-form-input" />
            </div>

            <div class="mt-3">
              <label for="edit_auction" class="formbold-form-label">
                ราคากลางสุทธิ(ขอแก้ไข)
              </label>
              <input type="text" name="edit_auction" id="edit_auction" oninput="validateDecimal(this)" step="0.01"
                maxlength="12" placeholder="(ราคากลางสุทธิ)" class="formbold-form-input" />
            </div>
            <div id="errorAuctionPrice" style="color: red;"></div>
          </div>


          <div class="mt-3">
            <label for="confirm_auction" class="formbold-form-label">
              3.ราคากลางย่อยที่ต้องใช้กำหนดเปรียบเทียบในการประกวดราคา
            </label>
            <label>
              <input id="radioButtonId1" type="radio" name="option[]" value="1"
                onclick="toggleInput(true)">มีราคากลางย่อย
            </label>
            <label>
              <input disabled id="radioButtonId2" type="radio" name="option[]" value="0"
                onclick="toggleInput(false)">ไม่มีราคากลางย่อย
            </label>
            <!-- Hidden  Field-->
            <div id="sub-field" style="display:none" class="mt-3">
              <div id="errorSubPrice" style="color: red;"></div>

              <!-- Show sub details and price here -->
              <div class="backde">
                <div id="item-list">
                  <!-- ตัวอย่างข้อมูล -->
                  <div class="formbold-input-flex" style="margin: 0;">
                    <span class="item-number" style="padding: 10px; padding-left: 80px; width:50px;">ลำดับ</span>
                    <span class="item-number" style="padding: 10px; width: 350px;">รายการ</span>
                    <span class="item-number" style="padding: 10px; width: 350px;">ราคากลางย่อย</span>
                    <span class="item-number" style="padding: 10px; width: 350px;">(ขอแก้ไข)</span>
                  </div>

                  <div class="formbold-input-flex" style="margin: 0;">
                    <span class="item-number" style="padding: 10px; padding-left: 80px; width:50px;">1</span>
                    <input disabled class="in2" style="width: 350px;" type="text" name="sub_detail[]"
                      value="รายการที่ 1" placeholder="(รายละเอียดงาน)" contenteditable>
                    <input disabled class="in2" style="width: 350px;" type="text" oninput="validateDecimal(this)"
                      name="sub_price[]" value="100" oninput="validateDecimal(this)" step="0.01" maxlength="12"
                      placeholder="(ราคากลางย่อย)" contenteditable>
                    <input class="formbold-form-input" style="width: 350px;" type="text" name="editsub_price[]" value=""
                      oninput="validateDecimal(this)" step="0.01" maxlength="12" placeholder="(ราคากลางย่อย)"
                      contenteditable>
                  </div>

                  <div class="formbold-input-flex">
                    <span class="item-number" style="padding: 10px; padding-left: 80px; width:50px;">2</span>
                    <input disabled class="in2" style="width: 350px;" type="text" name="sub_detail[]"
                      value="รายการที่ 2" placeholder="(รายละเอียดงาน)" contenteditable>
                    <input disabled class="in2" style="width: 350px;" type="text" oninput="validateDecimal(this)"
                      name="sub_price[]" value="100" oninput="validateDecimal(this)" step="0.01" maxlength="12"
                      placeholder="(ราคากลางย่อย)" contenteditable>
                    <input class="formbold-form-input" style="width: 350px;" type="text" name="editsub_price[]" value=""
                      oninput="validateDecimal(this)" step="0.01" maxlength="12" placeholder="(ราคากลางย่อย)"
                      contenteditable>
                  </div>


                </div>
                <div class="row" style="border-top: 1px #aeaeae solid ; padding: 5px 0; padding-left:70px;">
                  <div class="col-4">
                    <label style="font-weight: bold;">รวมราคากลางสุทธิ :</label>
                    <span id="total-price">0</span>
                    <span id="price-status"></span>
                  </div>
                  <div class="col-4"></div>
                  <div class="col-4">
                    <label style="font-weight: bold; padding-left:15px;">รวมราคากลางสุทธิแก้ไข :</label>
                    <span id="editTotal-price">0</span>
                    <span id="editPrice-status"></span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="d-flex mt-4">
            <div class="me-auto p-2">
              <button type="button" class="btsum">สรุปข้อมูล</button>
            </div>
            <div class="p-2">
              <button type="button" class="btrefuse">ปฏิเสธ</button>
            </div>
          </div>

          <div id="errorTab1" style="color: red;"></div>

        </div>

        <!-- ------------ History Log ------------  -->
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
                <tbody>
                  <tr>
                    <td class="text-center">02/12/2022 04:08:36</td>
                    <td class="text-center">Submit</td>
                    <td class="text-center">Ekkaphong Meesuk</td>
                  </tr>
                  <tr>
                    <td class="text-center">02/12/2022 04:08:36</td>
                    <td class="text-center">Verify & Approve/Reject</td>
                    <td class="text-center">Ekkaphong Meesuk</td>
                  </tr>
                </tbody>

              </table>
            </div>
          </div>
      </form>
    </div>
  </div>

</body>

</html>



<script>
  $(document).ready(async function () {
    setOriginalTotalPrice();

    document.getElementById('radioButtonId1').checked = true;
    toggleInput(true);
  });
</script>


<script src="../fetchClass.js"></script>
<script src="../alertClass.js"></script>
<!-- <script src="js/assign.js"></script> -->
<script src="js/approve-subprice.js"></script>