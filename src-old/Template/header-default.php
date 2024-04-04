<style>
    li {
        font-family: 'Kanit', sans-serif;
        font-weight: 900;
        font-size: 18px;
    }

    a {
        text-decoration: none;
    }
</style>

<div class="container-fluid  sticky-top ">
    <nav class="navbar navbar-expand-sm  navbar-dark  shadow-lg  p-3 bg-body-tertiary rounded" style="background-color: #EEEEEE;">
        <div class="col-5 ">
            <!-- Brand-->
            <a href="index"><img src="asset/images/po2.png" class="figure-img img-fluid rounded float-start mt-0 ms-2   " style="height: 20% ; width:20%;  " alt="..."></a>
        </div>
        <button class="navbar-toggler bg-danger" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="col-7 collapse navbar-collapse justify-content-end pe-3" id="collapsibleNavbar">
            <ul class="navbar-nav   fw-bol db  float-end  fs-6  m-1-1-3-3">
                <li class="nav-item ">
                    <a class="nav-link m-3 " style="color: #000000;" href="index">หน้าหลัก</a>
                </li>
            </ul>
            <a href="src/guest/view/Login">
                <div class="ms-3">
                    <span class="material-symbols-outlined user-pic ms-3" onclick="toggleMenu()">account_circle</span>
                    <p class="text-dark" style="text-decoration:none">เข้าสู่ระบบ</p>
                </div>
            </a>

            <!-- <div class="sub-menu-wrap" id="subMenu">
					<div class="sub-menu">
						<div class="uer-info">
							<span class="material-symbols-outlined " style="font-size: 30px;">account_circle</span>
							<h4 class="mt-2 ms-1">admin</h4>
						</div>
						<hr>
					</div>

				</div> -->


        </div>
    </nav>
</div>