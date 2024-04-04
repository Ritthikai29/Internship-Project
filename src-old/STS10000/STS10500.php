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
    <title>Paticipant</title>
</head>
</head>

<body class="back">
    <!-- table-->
    <!-- <div class="container-fluid    "> -->
    <section class="vh-130">
        <!-- <div class="container-fluid h-100"> -->
        <!-- <div class="row d-flex  h-100"> -->
        <!-- <div class="col-lg-12 col-xl-12  "> -->
        <!-- <div class="card text-black bg-gradient-light   bg-light  shadow " style="border-radius: 25px; "> -->
        <!-- <h2 class="mt-5 text-primary fw-bold  ms-3 text-center ">รายชื่อคณะกรรมการเปิดซอง</h2> -->
        <div class="card-body p-md-5">

            <div class="row">
                <div class=" col-md-10 col-lg-6 col-xl-12">
                </div>
            </div>
            <div class="card text-black bg-gradient-light  bg-light  shadow " style="border-radius: 25px; ">
                <h5 class="headpar1"><i class='fas fa-user-tie' style="padding-left: 10px; padding-right: 10px; border-right: 2px solid;"></i> รายชื่อคณะกรรมการเปิดซอง</h5>
                <div class="card-body p-md-5">

                    <div class="row">
                        <div class="col-md-10 col-lg-6 col-xl-12 table-responsive ">
                            <div>

                                <table id="committee-table" class="table table-hover  ">
                            </div>
                            <thead class="thead-dark">
                                <tr>
                                    <td> ชื่อ-นามสกุล</td>
                                    <td class="text-center">ตำแหน่ง</td>
                                    <td class="text-center">บทบาท</td>
                                    <td class="text-center">อีเมลล์</td>
                                </tr>
                            </thead>
                            <tbody class="tbmore">
                                <tr>
                                    <td>ธีรภัทร์ สังข์ไชย</td>
                                    <td class="text-center">Developer</td>
                                    <td class="text-center">เลขากรรมการ</td>
                                    <td class="text-center">thiraphatsangch@gmail.com</td>
                                </tr>

                            </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
            <!-- <h2 class="mt-5 text-primary fw-bold text-center">รายชื่อผู้รับเหมา</h2> -->

        </div>
        <div class="card text-black bg-gradient-light  mt-5 bg-light  shadow " style="border-radius: 25px; ">
            <h5 class="headpar2"><i class='fas fa-hard-hat' style="padding-left: 10px; padding-right: 10px; border-right: 2px solid;"></i>
                <th colspan="4">ผู้รับเหมาที่เข้าร่วม</th>
            </h5>
            <div class="card-body p-md-5">
                <div class="row">
                    <div>

                    </div>

                    <div class="col-md-10 col-lg-6 col-xl-2 "></div>


                    <table id="vendor-table" class="table table-hover ">
                        <thead class="thead-dark">



                            <tr>
                                <td>ชื่อบริษัท</td>
                                <td class="text-center">สถานะ</td>
                                <td class="text-center">ราคาที่เสนอ</td>
                                <td class="text-center">ราคาเสนอใหม่</td>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>บริษัท ปลอดภัยจำกัด</td>
                                <td class="text-center">ได้รับการคัดเลือก</td>
                                <td class="text-center">100000</td>
                                <td class="text-center">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>

        <div class="">
            <div class="col-2 mt-5" style="width: 186px;"><a href="Home" class=""><button type="button" class="btn bth btn-danger"><span class="bi bi-arrow-left-circle-fill"></span> กลับ</button></a></div>
        </div>

    </section>
</body>

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
    window.onload = async function() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        const url = "../controller/cont_load_paticipant";
        await FetchAPI.fetchData(url, token).then(async (jsonData) => {
            if (jsonData) {
                await populateCommittee(jsonData.committeeData);
                await populateVendor(jsonData.vendorData);
            } else window.replace("Current-Project");
        });
    }
</script>

</html>