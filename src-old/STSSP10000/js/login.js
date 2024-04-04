const apiUrl = "/STSBidding/service/";

const loginForm = document.getElementById("login-form");

async function Login(data) {
    const reqOpt = {
        method: "POST",
        body: JSON.stringify(data),
    };
    const res = await fetch(apiUrl + "STSSP10000/login.php", reqOpt)
        .then((response) => response.json())
        .then((res) => {
            return res;
        });
    return res;
}

document.addEventListener("DOMContentLoaded", () => {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        let element = event.target;
        let empNO = element.querySelector("#employee_no");
        let password = element.querySelector("#password");

        let data = {
            employee_no: empNO.value,
            password: password.value,
            project_key: localStorage.getItem("pj_key"),
        };

        document.getElementById("alert-part").innerHTML =
            "<span style='color: black;'>Loading...</span>";

        let res = await Login(data);

        if (res.status === 200) {
            token = res.access_token;
            res = res.data;
            let userid = res.userStaff.id;
            let projectId = res.project.id;
            let managerId = res.manager.id;

            localStorage.setItem("u_id", userid);
            localStorage.setItem("pj_id", projectId);
            localStorage.setItem("m_id", managerId);
            localStorage.setItem("at", token);

            window.location.href = './calculate.php';
        } else {
            document.getElementById(
                "alert-part"
            ).innerHTML = `<span style='color: red;'>${res.err}</span>`;
        }

    });
});

