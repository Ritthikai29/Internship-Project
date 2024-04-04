<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../../asset/css/googlefont-kanit.css">
  <link rel="stylesheet" href="../../asset/css/font-awesome-4.7.0.css">
  <link rel="stylesheet" href="../../asset/css/bootstrap-5.3.0.css">
  <script src="../../asset/js/bootstrap-5.3.0.js"></script>
  <script src="../../asset/js/sweetalert2-11.7.3.js"></script>
  <script src="../../asset/js/jQuery-3.5.1.js"></script>
  <link rel="stylesheet" href="../../asset/css/bootstrapIcon.css">
  <link rel="stylesheet" href="css/guest-style.css">
  <title>Login</title>
</head>

<body>

<?php include("../Template/STS00000_header.html"); ?>

  <!-- Form Section -->
  <div class="login-page">
    <div class="form mt-5 mb-5">
      <h2 id="login-selector" class="text-center mb-3">เลือกประเภทผู้ใช้</h2>

      <!-- Select Login -->
      <div id="login-selection">
        <div class="icon-container justify-content-between">
          <div style="width: 150px;" class="icon" id="user-icon" onclick="showLoginForm('user-form', this)">
            <img src="../../asset/images/engineer.png" alt="User Login">
            <span>Vendor Login</span>
          </div>

          <div class="vertical"></div>

          <div style="width: 150px;" class="icon" id="staff-icon" onclick="showLoginForm('staff-form', this)">
            <img src="../../asset/images/profile.png" alt="Staff Login">
            <span>Staff Login</span>
          </div>
        </div>
      </div>
      <!-- Select Login -->

      <!-- Login Form-->
      <form id="user-form" class="login-form" style="display: none;">
        <h3 style="margin-top: 20;">Vendor</h3>
        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="vendor_email" name="vendor_email" placeholder="name@example.com" autocomplete="off">
          <label for="vendor_email">Email address</label>
        </div>
        <div class="form-floating">
          <input type="password" class="form-control" id="vendor_password" name="vendor_password" placeholder="Password" autocomplete="off">
          <label for="vendor_password">Password</label>
          <div class="d-flex justify-content-between align-items-center">
            <span>ยังไม่มีบัญชี? <a class="link_pointer" onclick="showRegisterForm('register-form', this)">สร้างบัญชี</a></span>
            <a href="#">ลืมรหัสผ่าน?</a>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3">Sign In</button>
      </form>

      <form id="staff-form" class="login-form" style="display: none;">
        <h3 style="margin-top: 20;">Staff</h3>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="emp_id" name="emp_id" placeholder="00000" autocomplete="off">
          <label for="emp_id">Staff ID</label>
        </div>
        <div class="form-floating">
          <input type="password" class="form-control" id="emp_password" name="emp_password" placeholder="Password" autocomplete="off">
          <label for="emp_password">Password</label>
          <div class="d-flex justify-content-between align-items-center">
            <div></div>
            <a href="#">ลืมรหัสผ่าน?</a>
          </div>

        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3">Sign In</button>
      </form>
      <!-- Login Form-->

      <!-- Register Form-->
      <form id="register-form" class="register-form" style="display: none;">
        <h3 style="margin-top: 20;">สร้างบัญชี</h3>
        <div class="row">
          <div class="col">
            <div class="form-floating">
              <input type="text" class="form-control" id="firstName" name="firstName" placeholder="First name" required>
              <label for="firstName">ชื่อ</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating">
              <input type="text" class="form-control" id="lastName" name="lastName" placeholder="Last name" required>
              <label for="lastName">นามสกุล</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-floating">
              <input type="text" class="form-control" id="position" name="position" placeholder="Last name" required>
              <label for="position">ตำแหน่ง</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating">
              <input type="tel" class="form-control" id="tel" name="tel" placeholder="Last name" maxlength="10" required>
              <label for="tel">เบอร์โทรศัพท์</label>
            </div>
          </div>
        </div>
        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="email" name="email" placeholder="name@example.com" autocomplete="off" required>
          <label for="email">Email address</label>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="password" name="password" placeholder="Password" autocomplete="off" required>
          <label for="password">Password</label>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Password" autocomplete="off" required>
          <label for="confirm_password">Confirm Password</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="company" name="company" placeholder="Company Name" autocomplete="off" required>
          <label for="company">ชื่อบริษัท</label>
        </div>
        <div class="form-floating mb-3">
          <textarea class="form-control" id="location" name="location" placeholder="Location" required></textarea>
          <label for="location">ที่อยู่บริษัท/หน่วยงาน</label>
          <div style="color: red;" id="error"></div>
          <div class="d-flex justify-content-between align-items-center">
            <a class="link_pointer" onclick="showLoginForm('user-form', 'staff-icon')">มีบัญชีอยู่แล้ว?</a>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 mb-3">Sign Up</button>
      </form>
      <!-- Register Form-->
    </div>
  </div>
  <!-- Form Section -->

  <script>
    function showLoginForm(formId, icon) {
      var login_selector = document.getElementById("login-selector");
      var login_selection = document.getElementById("login-selection");
      login_selector.style.display = 'block';
      login_selection.style.display = 'block';
      // Hide all forms
      var forms = document.getElementsByClassName('login-form');
      for (var i = 0; i < forms.length; i++) {
        forms[i].style.display = 'none';
      }
      var register_form = document.getElementById('register-form');
      register_form.style.display = 'none';

      // Show the selected form
      var form = document.getElementById(formId);
      form.style.display = 'block';
      // Add blue border to the selected icon
      var icons = document.getElementsByClassName('icon');
      for (var i = 0; i < icons.length; i++) {
        icons[i].classList.remove('selected');
      }
      icon.classList.add('selected');
    }

    function showRegisterForm(formId, icon) {
      // Hide all forms
      var forms = document.getElementsByClassName('login-form');
      for (var i = 0; i < forms.length; i++) {
        forms[i].style.display = 'none';
      }
      // Show the selected form
      var form = document.getElementById(formId);
      form.style.display = 'block';
      var login_selector = document.getElementById("login-selector");
      var login_selection = document.getElementById("login-selection");
      login_selector.style.display = 'none';
      login_selection.style.display = 'none';
      // Add blue border to the selected icon
    }
  </script>
</body>

<!-- footter-->
<?php include("../owner/template/footer.php"); ?>

</html>

<script src="../fetchClass.js"></script>
<script src="../alertClass.js"></script>
<script src="js/login.js"></script>
<script src="js/register.js"></script>
<script src="js/register-valid.js"></script>
