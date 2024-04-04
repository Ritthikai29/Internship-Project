<?php
session_start();
// Create CSRF token
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Kanit:ital,wght@0,100;1,100;1,200&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
    <link rel=”stylesheet” href=”https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css” />
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <title>Document</title>
    <style>
        * {
            margin-top: 0px;
            margin-left: 0px;
            margin-right: 0px;
            font-family: 'Kanit', sans-serif;
            font-weight: 900;
            font-size: 17px;

        }

        /* .row {
   
        padding-right: calc(var(--bs-gutter-x) * .0);
        margin-right: calc(var(--bs-gutter-x) * 0);
    

 } */

        .card {
            background: linear-gradient(to bottom, #FFFFFf 0%, #FFFFFf 100%);
        }

        a:active {
            color: red;
        }

        .nav-item a:hover {
            background-color: #f36c60;
        }
    </style>
</head>

<body>
    <?php
    include("template/header-login-register.php");
    ?>
    <div class="container-fluid  ">
        <section class="vh-150   ">
            <div class="container-fluid h-100 mt-3 ">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-lg-12 col-xl-11 ">
                        <div class="card text-black bg-gradient-danger    bg-danger  shadow " style="border-radius: 25px; ">
                            <div class="card-body p-md-5   ">
                                <div class="row justify-content-center ">
                                    <div class="col-md-10 col-lg-6 col-xl-6  mt-1   order-2 order-lg-1 ">
                                        <h4 class="text-center font-weight-bold  ">ลงทะเบียนสมาชิก</h4>

                                        <form id="register-user-form" class="mt-5 ">
                                            <div class="row">
                                                <div class=" col-md-10 col-lg-6 col-xl-6">
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <i class="fa fa-user fa-lg me-3  fa-fw"></i>
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="text" id="form3Example1c" class="form-control shadow " placeholder="ชื่อ" name="fname" style="border-radius: 15px;" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-10 col-lg-6 col-xl-6">
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <i class="fa fa-user-circle fa-lg me-3 fa-fw"></i>
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="text" id="form3Example1c" class="form-control shadow " placeholder="นามสกุล" name="lname" style="border-radius: 15px;" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class=" col-md-10 col-lg-6 col-xl-6">
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <i class="fa fa-users fa-lg me-3 fa-fw"></i>
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="text" id="form3Example1c" class="form-control shadow " placeholder="ตำแหน่ง" name="position" style="border-radius: 15px;" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-10 col-lg-6 col-xl-6">
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <i class="fa fa-phone fa-lg me-3 fa-fw"></i>
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="text" id="form3Example1c" class="form-control shadow " placeholder="เบอร๋โทรศัพท์" name="tel" style="border-radius: 15px;" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class=" col-md-10 col-lg-6 col-xl-6">
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <i class="fa fa-envelope fa-lg me-3 fa-fw"></i>
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="text" id="form3Example1c" class="form-control shadow " placeholder="อีเมล์" name="email" style="border-radius: 15px;" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-10 col-lg-6 col-xl-6">
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <i class="fa fa-unlock-alt fa-lg me-3 fa-fw"></i>
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="password" id="form3Example1c" class="form-control shadow " placeholder="รหัสผ่าน" name="password" style="border-radius: 15px;" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class=" col-md-10 col-lg-6 col-xl-6"></div>
                                                <div class="col-md-10 col-lg-6 col-xl-6">
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <i class="fa fa-key fa-lg me-3 fa-fw"></i>
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="password" id="form3Example1c" class="form-control shadow " placeholder="ยืนยันรหัสผ่าน" name="confirmpassword" style="border-radius: 15px;" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xl-12">
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <i class="fa fa-university fa-lg me-3 fa-fw"></i>
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="text" id="form3Example1c" class="form-control shadow " placeholder="ชื่อบริษัท" name="coname" style="border-radius: 15px;" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xl-12">
                                                    <div class="d-flex flex-row align-items-center mb-4">
                                                        <i class="fa fa-font fa-lg me-3 fa-fw"></i>
                                                        <div class="form-outline flex-fill mb-0">
                                                            <input type="text" id="form3Example1c" class="form-control shadow " placeholder="ที่อยู่ชื่อบริษัท" name="colocation" style="border-radius: 15px;" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token'] ?>">
                                            <div class="row">
                                                <div class="col-xl-6 mt-4  ">
                                                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4 ">
                                                        <button type="button" class="btn btn-primary btn-lg bg-danger" style="border-radius: 10px;">ย้อนกลับ</button>
                                                    </div>
                                                </div>
                                                <div class="col-xl-6 mt-4  ">
                                                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4 ">
                                                        <button type="submit" class="btn btn-primary btn-lg bg-info" style="border-radius: 10px;">สมัครสมาชิก</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                    </div>
                                    <div class="col-md-10 col-lg-6 col-xl-5 d-flex align-items-center order-1 order-lg-2">
                                        <img src="../../../asset/images/logoscg3.png" class="img-fluid" alt="Phone image">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <?php include('template/footer-login.php'); ?>
        </section>
    </div>
</body>
<script src="../../fetchClass.js"></script>
<script src="js/register.js"></script>

</html>