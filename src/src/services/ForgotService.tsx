import { apiUrl } from "./utilitity";

async function SendEmailResetPassword(email : string) {
    const formData = new FormData();
    formData.append("email_input", String(email));

    let res = await fetch(
        `${apiUrl}/resetPassW/sendResetPassword.php`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function SendEmailVendorResetPassword(email : string) {
    const formData = new FormData();
    formData.append("email_input", String(email));

    let res = await fetch(
        `${apiUrl}/resetPassW/sendResetPasswordVendor.php`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function GetEmpInfoByEmpNo(token : string) {
    const res = await fetch(
        `${apiUrl}/resetPassW/getResetUser.php?user_code=${token}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}

async function GetVendInfoByVendNo(token : string) {
    const res = await fetch(
        `${apiUrl}/resetPassW/getResetVendorUser.php?user_code=${token}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}

async function ResetNewPassword(token : string, password : string) {
    const formData = new FormData();
    formData.append("token", String(token));
    formData.append("password", String(password));

    let res = await fetch(
        `${apiUrl}/resetPassW/resetPassword.php`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function ResetNewPasswordVendor(token : string, password : string) {
    const formData = new FormData();
    formData.append("token", String(token));
    formData.append("password", String(password));

    let res = await fetch(
        `${apiUrl}/resetPassW/resetVendorPassword.php`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

export {
    SendEmailResetPassword,
    GetEmpInfoByEmpNo,
    ResetNewPassword,
    SendEmailVendorResetPassword,
    GetVendInfoByVendNo,
    ResetNewPasswordVendor
}