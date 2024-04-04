<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Staff Login</title>
    <link rel="stylesheet" href="css/login.css" />
</head>

<body>
    <div class="container center">
        <h2>Staff Login</h2>
        <form id="login-form">
            <div class="form-group">
                <label for="username">EmployeeId</label>
                <div class="employee-input">
                    <span class="prefix">0150-0</span>
                    <input type="text" id="employee-id" name="employee-id" required>
                </div>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
                <input type="submit" value="Login">
            </div>
            <div id="alert-part"></div>
        </form>
    </div>


    <!-- include a Jquery -->
    <script src="https://code.jquery.com/jquery-3.7.0.js"
        integrity="sha256-JlqSTELeR4TLqP0OG9dxM7yDPqX1ox/HfgiSLBj8+kM=" crossorigin="anonymous"></script>

    <script type="module" src="./js/login.js"></script>

</body>



</html>