const formLogin = document.getElementById("login-form");

const alertElement = document.getElementById("alert-part");

import { Login } from "./services/approveService.js";

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const employeeId = document.getElementById("employee-id");
    const password = document.getElementById("password");
    let projectKey = localStorage.getItem("pj_key");

    if (employeeId.value == "" || password.value == "" || projectKey == null) {
        alertElement.innerText = "กรอกข้อมูลไม่ครบ";
        return;
    }
    let data = {
        employee_no: employeeId.value,
        password: password.value,
        project_key: projectKey,
    };
    alertElement.innerText = "waiting...";
    console.log(data);
    let res = await Login(data);

    if (res.status !== 200) {
        console.log(res.err);
        alertElement.innerText = res.err;
        return;
    }

    if (res.data.role === "approver 1") {
        location.href = "./approver1.php";
    } else if (res.data.role === "approver 2") {
        location.href = "./approver2.php";
    } else {
        console.log("some thing wrong");
        return;
    }

    console.log(res.data.role);
});
