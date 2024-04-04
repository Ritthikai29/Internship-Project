import { apiUrl } from "../utilitity";

async function SendContractorAnnounce(key: string) {
    console.log(key)
    let res = await fetch(
        `${apiUrl}/sendContractorAnnounce/sendCA.php?key=${key}`,
        {
            method:"POST",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}

export {
    SendContractorAnnounce
}