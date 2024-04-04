import { apiUrl } from "./utilitity";

const CheckAndApply = async (open_Id: string) => {
    let res = await fetch(
        `${apiUrl}/SetDirector/VerifyAuthorizeAndSetDirect.php?openId=${open_Id}`,
        {
            // mode: 'no-cors',
            method: "GET",
            // body: JSON.stringify({ open_Id }),
            
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();

    return resJson;
}
export{
    CheckAndApply
}