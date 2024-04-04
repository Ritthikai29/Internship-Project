import { apiUrl } from "../utilitity";

const SendBiddingResultService = async (key : string) => {
    const res = await fetch(
        `${apiUrl}/sendBiddingResultToVendor/sendMailToVendor.php?key=${key}`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

export{
    SendBiddingResultService
}