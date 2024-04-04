import { apiUrl } from "../utilitity";

const GetAllLogCalculateByProjectKey = async (projectKey: string) => {
    let res = await fetch(
        `${apiUrl}/STSSP_LOG/getLog.php?key=${projectKey}`,
        {
            method:"GET",
            credentials:import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json()
    return resJson;
}


export {
    GetAllLogCalculateByProjectKey
}