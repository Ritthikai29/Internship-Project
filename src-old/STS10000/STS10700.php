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
  <link rel="stylesheet" href="../../asset/css/bootstrap-icons.css" />
  <link rel="stylesheet" href="../../asset/css/font-awesome.css">
  <link rel="stylesheet" href="../../asset/css/font-awesome.min.css">
  <link rel="stylesheet" href="css/guest-style.css" />
  <link rel="stylesheet" href="css/page-style.css" />
  <title>Edit Project</title>
</head>

<body class="back">
  <div class="container-fluid mb-4 mt-5">
    <section id="section" class="vh-130 hide-content">
      <div class="container-fluid h-100   ">
        <div class="row d-flex  h-100">
          <div class="col-lg-12 col-xl-12  ">

            <form id="editproject_form" class="needs-validation" novalidate>
              <div class="container frame row text-black bg-gradient-light bg-light  shadow m-auto">
                <div class="col-3 headedit" style="border-radius: 25px 0 0 25px;   height: 343.6px;">
                  <div class=" text-center textedit">
                    <i class='fas fa-paste' style="font-size: 90px;"></i>
                    <h2 class="" style="font-weight: bold;">ข้อมูลโครงการ </h2>
                    <h2 style="font-weight: bold;">เบื้องต้น</h2>
                  </div>
                </div>
                <div class="boxedit1 col-9 card-body p-md-5" style="border-radius: 0 25px 25px 0 ;">
                  <div class="row">
                    <div class=" col-md-10 col-lg-6 col-xl-1"></div>
                    <div class=" col-md-10 col-lg-6 col-xl-10">
                      <div class="d-flex flex-row align-items-center mb-4">
                        <h5 class="mt-3 ms-2 fw-bold" for="project_name">ชื่อโครงการ :</h5>
                        <div class="form-outline flex-fill mb-0">
                          <input type="text" class="form-control shadow ms-2 " placeholder="ชื่อโครงการ" name="project"
                            id="project" required style="border-radius: 15px;" />
                        </div>
                      </div>
                    </div>
                    <div class=" col-md-10 col-lg-6 col-xl-2"></div>
                  </div>
                  <div class="row">
                    <div class=" col-md-10 col-lg-6 col-xl-1"></div>
                    <div class=" col-md-10 col-lg-6 col-xl-4">
                      <div class="d-flex flex-row align-items-center mb-4">
                        <h5 class="mt-3 ms-2 fw-bold" for="project_type_select">ประเภทโครงการ :</h5>
                        <div class="form-outline flex-fill mb-0">
                          <select class="form-select ms-2" aria-label="Default select example"
                            name="project_type_select" id="project_type_select" style=" border-radius: 15px;" required>
                            <option selected disabled value="">Choose...</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class=" col-md-10 col-lg-6 col-xl-2"></div>
                    <div class=" col-md-10 col-lg-6 col-xl-4">
                      <div class="d-flex flex-row align-items-center mb-4">
                        <h5 class="mt-3 ms-2 fw-bold" for="work_type_select">ประเภทงาน :</h5>
                        <div class="form-outline flex-fill mb-0">
                          <select class="form-select ms-2" aria-label="Default select example" name="work_type_select"
                            id="work_type_select" style="border-radius: 15px;" required>
                            <option selected disabled value="">Choose...</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class=" col-md-10 col-lg-6 col-xl-1"></div>
                    <div class=" col-md-10 col-lg-6 col-xl-4">
                      <div class="d-flex flex-row align-items-center ">
                        <h5 class="mt-3 ms-2 fw-bold" for="division_select">ส่วนงาน :</h5>
                        <div class="form-outline flex-fill mb-0">
                          <div class="form-outline flex-fill mb-0">
                            <select class="form-select ms-2" aria-label="Default select example" name="division_select"
                              id="division_select" style="border-radius: 15px;" required>
                              <option selected disabled value="">Choose...</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class=" col-md-10 col-lg-6 col-xl-2"></div>
                    <div class=" col-md-10 col-lg-6 col-xl-4">
                      <div class="d-flex flex-row align-items-center ">
                        <h5 class="mt-3 ms-2  fw-bold" for="department_select">หน่วยงาน :</h5>
                        <div class="form-outline flex-fill mb-0">
                          <select class="form-select ms-2" aria-label="Default select example" name="department_select"
                            id="department_select" style="border-radius: 15px;" required>
                            <option selected disabled value="">Choose...</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>



              <div class="container mt-5 card text-black bg-gradient-dark   bg-light   shadow "
                style="border-radius: 25px; ">
                <div class="card-body ">
                  <div class="headedit2">
                    <h2 class="textedit"><i class='far fa-newspaper'></i> ข้อมูลงาน</h2>
                  </div>
                  <div class="boxedit1 mt-2" style="padding : 20px 200px;">
                    <div class="row">
                      <div class="">
                        <h5 class="mt-4 ms-2 fw-bold" for="tor ">เอกสารTOR (PDF ขนาดไม่เกิน 2 MB)</h5>
                        <input type="file" class="form-control mt-2" name="tor" id="tor" aria-label="file example"
                          style=" border-radius: 10px;">
                        <label id="file_label1"></label>
                        <div class="invalid-feedback">Example invalid form file feedback</div>
                      </div>
                    </div>
                    <div class="row  ">
                      <div class=" ">
                        <h5 class="mt-1 ms-2 fw-bold" for="description">เอกสารแจ้งงาน (PDF ขนาดไม่เกิน 2 MB)</h5>
                        <input type="file" class="form-control mt-2" name="description" id="description"
                          aria-label="file example" style=" border-radius: 10px;">
                        <label id="file_label2"></label>
                        <div class="invalid-feedback">Example invalid form file feedback</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- </div> -->
              <div class="container">

                <div class="row  mt-5">

                  <div class="row">

                    <div class="m-auto col-2"><a href="Current-Project" class="">
                        <button type="button" class="btn bth btn-danger">
                          <span class="bi bi-arrow-left-circle-fill"></span> กลับ
                        </button></a>
                    </div>

                    <div class="m-auto col-4">
                      <button class="btn btn-success rounded-pill float-end fw-blod  btn-lg"
                        data-bs-target="#exampleModal" style="height: 37px; font-size: 14px;">บันทึก</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
    </section>
  </div>
</body>
<script src="js/edit.js"></script>

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

<script>
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  $(document).ready(async function () {
    await populateData();
  });
</script>

</html>