import { LoginInterface } from "../models/ILogin";
import { apiUrl } from "./utilitity";


async function LoginService(login: LoginInterface) {
    const res = await fetch(`${apiUrl}/Login/staffLogin.php`, {
        method: "POST",
        body: JSON.stringify(login),
        credentials: "include",
    });
    const resJson = await res.json();
    return resJson;
}
async function LoginServiceVend(login: LoginInterface) {
    const res = await fetch(`${apiUrl}/Login/vendorLogin.php`, {

        method: "POST",
        body: JSON.stringify(login),
        credentials: "include",
    });
    const resJson = await res.json();
    return resJson;
}

const LogoutService = async () => {
    const res = await fetch(
        `${apiUrl}/Login/logout.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    return res;
}

export {
    LoginService,
    LoginServiceVend,
    LogoutService
};