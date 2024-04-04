import { ClickService, PermissionApprove } from "./services/approveService.js";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const checkProject = async () => {
    // query a server is a ready for Click
    const check = await ClickService(urlParams.get("key"));
    if (check.status !== 200) {
        Swal.fire({
            title: "project is not allow",
            text: `${check.err}`,
            icon: "error",
            confirmButtonText: "รับทราบ!",
        });
        return;
    }
    let projectId = check.data.project.id;
    let role = check.data.clientRole;
    const permission = await PermissionApprove(projectId, role);
    localStorage.setItem("pj_key", check.data.project.key)
        
    if (permission.status !== 200) {
        location.href = "./login.php"
    }else if(permission.role_name === "approver 1"){
        location.href = "./approver1.php"
    }else if(permission.role_name === "approver 2"){
        location.href = "./approver2.php"
    }else{
        location.href = "./login.php"
    }
};

checkProject();
