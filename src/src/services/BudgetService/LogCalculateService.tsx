import { apiUrl } from "../utilitity"

const GetLogByProjectKeyWithLimit = async (
    projectKey: string,
    page: number
) => {
    const offset = page * 5;
    const res = await fetch(
        `${apiUrl}/STSSP_LOG/getLogNext.php?key=${projectKey}&ofs=${offset}&lim=${10}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json();
    return resJson
}

export {
    GetLogByProjectKeyWithLimit
}