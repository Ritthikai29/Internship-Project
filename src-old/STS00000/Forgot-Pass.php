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
        label {
            margin-bottom: 0;
        }

        a {
            color: #e1e1e1;
        }

        a:focus,
        a:hover {
            color: #ff0000;
        }

        .checkbox-inline+.checkbox-inline,
        .radio-inline+.radio-inline {
            margin-top: 6px;
        }

        body.login {
            background: rgba(255, 255, 255, 1);
        }

        .relative {
            position: relative;
        }

        .switcher {
            margin-bottom: 110px;
        }

        ul.switcher li {
            list-style-type: none;
            width: 100%;
            position: absolute;
            top: 0;
        }

        .first {
            left: 0;
        }

        .second {
            right: 0;
        }

        .login-container-wrapper {
            max-width: 500px;
            height: 450px;
            margin: 2% auto 5%;
            padding: 40px;
            box-sizing: border-box;
            background: rgba(57, 89, 116, 0.8);
            position: relative;
            box-shadow: 0px 30px 60px -5px #000;
            background-color: white;
            background-size: cover;
            background-blend-mode: saturation;
        }

        .login-container-wrapper .logo,
        .login-container-wrapper .welcome {
            font-size: 16px;
            letter-spacing: 1px;
        }

        .login-container-wrapper li {
            text-align: center;
            padding: 0 15px;
            background-color: whitesmoke;
            height: 50px;
            line-height: 50px;
            box-shadow: inset 0 -2px 0 0 #ccc;
            cursor: pointer;
        }

        .login-container-wrapper li a {
            color: #fff;
        }

        .login-container-wrapper li a:hover {
            color: #ccc;
            text-decoration: none;
        }

        .login-container-wrapper li a:active,
        .login-container-wrapper li a:focus {
            color: #fff;
            text-decoration: none;
        }

        .login-container-wrapper li.active {
            background-color: transparent;
            box-shadow: none;
        }

        .login-container-wrapper li.active a {
            border-bottom: 2px solid #fff;
            padding-bottom: 5px;
        }

        .login input:focus+.fa {
            color: #25a08d;
        }

        .login-form .form-group {
            margin-right: 0;
            margin-left: 0;
        }

        .login-form i {
            position: absolute;
            top: 0;
            left: 19px;
            line-height: 52px;
            color: rgba(40, 52, 67, 1);
            z-index: 100;
            font-size: 16px;
        }

        .login-form .input-lg {
            font-size: 16px;
            height: 52px;
            padding: 10px 25px;
            border-radius: 0;
        }

        .login input[type="email"],
        .login input[type="password"],
        .login input:focus {
            background-color: rgba(40, 52, 67, 0.75);
            border: 0px solid #4a525f;
            color: #eee;
            border-left: 45px solid #93a5ab;
            border-radius: 40px;
        }

        .login input:focus {
            border-left: 45px solid #eee;
        }

        input:-webkit-autofill,
        textarea:-webkit-autofill,
        select:-webkit-autofill {
            background-color: rgba(40, 52, 67, 0.75) !important;
            background-image: none;
            color: rgb(0, 0, 0);
            border-color: #FAFFBD;
        }

        .login .checkbox label,
        .login .checkbox a {
            color: #ddd;
            vertical-align: top;
        }

        input[type="checkbox"]:checked+label::before,
        .checkbox-success input[type="radio"]:checked+label::before {
            background-color: #25a08d !important;
        }

        .btn-success {
            background-color: #ff0000;
            background-image: none;
            padding: 8px 50px;
            margin-top: 20px;
            border-radius: 40px;
            border: 1px solid #25a08d;
            -webkit-transition: all ease 0.8s;
            -moz-transition: all ease 0.8s;
            transition: all ease 0.8s;
        }

        .btn-success:focus,
        .btn-success:hover,
        .btn-success.active,
        .btn-success.active:hover,
        .btn-success:active:hover,
        .btn-success:active:focus,
        .btn-success:active {
            background-color: #25a08d;
            border-color: #25a08d;
            box-shadow: 0px 5px 35px -5px #25a08d;
            text-shadow: 0 0 8px #fff;
            color: #FFF;
            outline: none;
        }
    </style>
</head>

<body>
    <?php include("template/header-login-register.php"); ?>

    <section class="vh-50">

        <div class="container mt-2 ">
            <div class="login-container-wrapper clearfix">
                <ul class="switcher clearfix">

                    <li class="second logo" data-tab="sign_up">
                        <a>ลืมรหัสผ่าน</a>
                    </li>
                </ul>

               
                <div class="tab-content ">
                    <div class="tab-pane active    " id="login">
                        <form class="form-horizontal login-form">
                            <div class="form-group relative   ">
                                <label class="form-label" for="form1Example13">กรุณากรอกEmail</label>
                                <input type="email" autocomplete="username" id="form1Example13" name="email" class="form-control form-control-lg  shadow  rounded-3" />
                            </div>
                           

                            <div class=" text-center   " style="margin-top: 50px;">
                                <button type="submit" class="btn btn-danger text-white btn-lg btn-block mt-1 w-100  shadow  rounded-3 ">ส่ง OTP</button>
                            </div>



                        </form>
                    </div>






                </div>
            </div>
        </div>



        <?php include('template/footer-login.php'); ?>


    </section>

</body>
<script type="text/javascript" src="js/login.js"></script>
<script>
    $(document).ready(function() {

        $('ul.switcher li').click(function() {
            var tab_id = $(this).attr('data-tab');

            $('li').removeClass('active');
            $('div.tab-pane').removeClass('active');

            $(this).addClass('active');
            $("#" + tab_id).addClass('active');
        })

    })
</script>

</html>