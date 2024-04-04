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
    <link rel="stylesheet" href="css/page-style.css"/>
    <title>Home</title>
</head>

<body class="back">
    <div class="img"></div>

    <!-- table-->
    <div class="container-fluid mb-4 mt-5">
        <div class="container-fluid mt-5 mb-5">
            <div class=""></div>
        </div>
        <div class="box1">
            <div class="row">

                <div class="col-lg-4 ms-0 container border-end border-3">
                    <center><img src="../../asset/images/hook.png" alt="" style="width: 250px;">
                        <p class="head1">ประกาศรายละเอียด</p>
                        <p class="head2">โครงการประกวดราคา</p>
                    </center>
                </div>

                <div class="col-lg-7 me-2 m-auto">
                    <div class="container-fluid ">
                        <div class="row">

                            <div class="col-xl-12 col-lg-12 text-cente">
                                <div class="table-responsive  ">
                                    <table id="tb_project" class="table col-lg-12 table-hover text-nowrap">
                                        <thead>
                                            <tr class="tbhead">
                                                <th scope="col">โครงการ</th>
                                                <th scope="col">ช่วงวันรับสมัคร</th>
                                                <th scope="col">เวลาปิดรับสมัคร</th>
                                                <th scope="col">สถานะโครงการ</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mt-3 m-auto "><a href="STS10200.php"><button type="button" class="btn bth btn-danger">ดูทั้งหมด</button></a>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>

        <div class="container-fluid  mt-5">
            <div class="">

            </div>
        </div>

    </div>

    <div class="modal fade" id="md_project" tabindex="-1" aria-labelledby="md_projectLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary fw-bold" id="md_projectLabel">รายละเอียดโครงการ</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid mb-4">
                        <section class="vh-130">
                            <div class="container-fluid h-100   ">
                                <div class="row d-flex  h-100">
                                    <div class="col-lg-12 col-xl-12  ">
                                        <div class="card text-black bg-gradient-dark   bg-light   shadow " style="border-radius: 25px; ">
                                            <div class="card-body p-md-5   ">
                                                <div class="row">
                                                    <div class="col-md-10 col-lg-6 col-xl-11 ">
                                                        <h6 class="text-start fw-bold">ชื่อโครงการ : <span id="md_projectName"><span></h6>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-10 col-lg-6 col-xl-11">
                                                        <h6 class="text-start fw-bold">ช่วงวันรับสมัคร : <span id="md_openDate"></span></h5>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-10 col-lg-6 col-xl-11">
                                                        <h6 class="text-start fw-bold">เวลาปิดรับสมัคร : <span id="md_endtime"></span></h6>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-10 col-lg-6 col-xl-11">
                                                        <h6 class="text-start fw-bold">เงินประกันซองที่ต้องชำระ : <span id="md_insurance"></span></h6>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-10 col-lg-6 col-xl-11">
                                                        <h6 class="text-start fw-bold">ไฟล์ TOR : <a id="md_tor" href="#">ดาวน์โหลด</a></h6>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-10 col-lg-6 col-xl-11">
                                                        <h6 class="text-start fw-bold">สถานะโครงการ : <span id="md_status"></span></h6>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
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
    const pathUrl = "../../service/STS00000/";
    $(document).ready(async function() {
        await getProject();
    });

    async function getProject() {
        const url = pathUrl + "STS00100/getProject";
        const jsonData = await HttpRequest.Get(url);

        const table = $("#tb_project");
        const tbody = $("<tbody></tbody>");
        table.append(tbody);

        if (jsonData.length > 0) {
            for (let item of jsonData) {
                const tr = $("<tr></tr>");
                tr.attr("data-bs-toggle", "modal");
                tr.attr("data-bs-target", "#md_project");
                tr.hover(function() {
                    $(this).css('cursor', 'pointer');
                });
                tbody.append(tr);

                tr.append(`
                    <td class="text-start">${item.ProjectName}</td>
                    <td>${item.StartDate + " - " + item.EndDate}</td>
                    <td>${item.EndTime} น.</td>
                    <td style="color:${item.Hex}">${item.Status}</td>
                `);
                tr.on('click', function() {
                    addModalData(item.ProjectName, item.StartDate, item.EndDate, item.EndTime, item.Hex, item.Insurance, item.Tor, item.Status);
                });
            }
        }
    }

    function addModalData(ProjectName, StartDate, EndDate, EndTime, Hex, Insurance, Tor, Status) {
        const modal = $("#md_project");
        modal.find("#md_projectName").text(ProjectName);
        modal.find("#md_openDate").text(StartDate + " - " + EndDate);
        modal.find("#md_endtime").text(Insurance + " บาท");
        modal.find("#md_tor").val(Tor);
        modal.find("#md_status").text(Status);
        modal.find("#md_status").css("color", Hex);
    }
</script>