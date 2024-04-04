const loginForm = document.getElementById("login-form");

const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

const alertElement = document.getElementById("alert-part");

import { Login } from "./service/loginService.js";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let projectKey = localStorage.getItem("pj_key");
  let email = inputEmail.value;
  let password = inputPassword.value;
  let data = {
    employee_no: email,
    password: password,
    project_key: projectKey,
  };
  alertElement.innerText = "waiting...";
  
  
  let res = await Login(data);

  if (res.err) {
    alertElement.innerText = res.err;
    return;
  }
  alertElement.innerText = "successful";

  // id ของ user ที่ login
  localStorage.setItem("u_id", res.data.manager.id);
  // id ของ project ที่เราจะเข้าไป
  localStorage.setItem("pj_key", res.data.project.key);

  window.location.href = './checker.php';

  console.log(res);
});
