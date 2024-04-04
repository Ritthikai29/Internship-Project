import { apiUrl } from "./utilitity";

async function checkValidateUserStaff() {
    let res = await fetch(`${apiUrl}/Login/verify.php`, {
        method: "GET",
        credentials: "include",
    });
    const resJson = await res.json();
    return resJson;
}

export { checkValidateUserStaff };
