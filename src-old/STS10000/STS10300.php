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
  <link rel="stylesheet" href="css/guest-style.css"/>
  <link rel="stylesheet" href="css/page-style.css"/>
  <title>Current Project</title>
</head>

<body class="">
  <div class="container-fluid ">
    <div class="img3">
      <div class="titlename">
        <h2><i class="bi bi-pencil-square"></i> จัดการโครงการ</h2>
      </div>
    </div>
    <div class="row backhead m-auto">
    </div>
    <section class="main-content">
      <!-- Table and Pagination -->
      <div class="container">
        <div class="row">
          <div class="col-lg-12 col-xl-12 d-grid gap-5 d-md-flex justify-content-md-start">
            <div class="container-fluid">
              <div class="row mt-4">
                <div class="col-lg-12 col-xl-12 d-grid gap-5 d-md-flex justify-content-md-end">
                  <button type="button" class="btn btn-danger rounded-pill float-start p-2 mb-0" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    เพิ่มโครงการ +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mt-5 ">
        <div class="table-responsive">
          <table id="project-table" class="table col-lg-12 text-nowrap mt-5">
            <thead>
              <tr class="tbhead">
                <th class="text-center" scope="col">ลำดับ</th>
                <th class="text-center" scope="col">เลขที่เอกสาร</th>
                <th class="text-center" scope="col">ชื่อโครงการ</th>
                <th class="text-center" scope="col">วันที่เพิ่ม</th>
                <th class="text-center" scope="col">วันสิ้นสุด</th>
                <th class="text-center" scope="col">ใบ TOR</th>
                <th class="text-center" scope="col">ใบแจ้งงาน</th>
                <th class="text-center" scope="col">ผู้มีส่วนร่วม</th>
                <th class="text-center" scope="col">การจัดการ</th>
                <th class="text-center" scope="col">สถานะ</th>
                <th class="text-center" scope="col">สถานะราคากลาง</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-info">คลิก</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-danger">แก้ไข</button></td>
                <td class="text-center">1</td>
              </tr>
              <tr>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-info">คลิก</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-danger">แก้ไข</button></td>
                <td class="text-center">1</td>
              </tr>
              <tr>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-info">คลิก</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-danger">แก้ไข</button></td>
                <td class="text-center">1</td>
              </tr>
              <tr>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-info">คลิก</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-danger">แก้ไข</button></td>
                <td class="text-center">1</td>
              </tr>
              <tr>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-info">คลิก</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-danger">แก้ไข</button></td>
                <td class="text-center">1</td>
              </tr>
              <tr>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-success">ดาวน์โหลด</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-info">คลิก</button></td>
								<td class="text-center"><button  class="btcur btn btn-outline-danger">แก้ไข</button></td>
                <td class="text-center">1</td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

    </section>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel" style="font-size: 30px;   font-weight: bold;">
              เลือกวิธีการเพิ่มโครงการ
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="row">
            <div class="modal-body col-2">
              <a href="STS10600.php"><button class="bt-disabled btn btn-secondary">
                  <h6><i class="bi bi-file-earmark-plus-fill"></i></h6>
                  <h6 style="font-weight: bold; font-size: 20px;">เพิ่มโดยแนบเอกสารใหม่</h6>
                </button></a>
            </div>
            <div class="modal-body col-2">
              <a href="Assign-Project"><button class="bt-add btn btn-danger">
                  <h6><i class="bi bi-file-earmark-bar-graph-fill"></i></h6>
                  <h6 style="font-weight: bold; font-size: 20px;">เพิ่มโดยแนบเอกสารเดิม</h6>
                </button></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>

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
  $(document).ready(async function() {
    await loadTable();
    let table = new DataTable("#project-table");
  });
</script>

