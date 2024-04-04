const apiUrl = "/STSBidding/service/";

const ClickService = async (projectKey) => {
    const reqOpt = {
        method: "GET"
    }
    const resRaw = await fetch(
        apiUrl + `STSSP30000/check.php?key=${projectKey}`,
        reqOpt
    )
    const res = await resRaw.json();

    return res;
}

const PermissionApprove = async (projectId, role) => {
    const reqOpt = {
        method: "GET"
    }
    const resRaw = await fetch(
        apiUrl + `STSSP30000/userPermission.php?role=${role}&id=${projectId}`,
        reqOpt
    )
    const res = await resRaw.json();
    return res;
}

const Login = async (data) => {
    const reqOpt = {
        method: "POST",
        body: JSON.stringify(data)
    }
    const resRaw = await fetch(
        apiUrl + `STSSP30000/login.php`,
        reqOpt
    )
    const res = await resRaw.json();

    return res
}

export {
    ClickService,
    PermissionApprove,
    Login
};