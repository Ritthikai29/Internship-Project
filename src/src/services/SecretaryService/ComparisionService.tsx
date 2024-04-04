import { apiUrl } from "../utilitity";

const GetVendorResultPriceCompare = async (projectKey: string) => {
    const res = await fetch(
        `${apiUrl}/secretaryCompareResult/compareVendorPrice.php?key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson
}

const getVendorProjectforAnouncement = async (projectKey: string) => {
    console.log(projectKey)
    const res = await fetch(
        `${apiUrl}/contractor/getVendorProjectforanouncement.php?key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson
}
export {
    GetVendorResultPriceCompare,
    getVendorProjectforAnouncement
}