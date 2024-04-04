import { apiUrl } from "../utilitity"

const GetBossEmployeeById = async ()  => {
    const res = await fetch(
        `${apiUrl}/Employee/getBossEmployeeById.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}

export {
    GetBossEmployeeById
}