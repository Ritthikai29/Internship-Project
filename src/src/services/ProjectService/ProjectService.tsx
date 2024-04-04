import { apiUrl } from "../utilitity"

const GetAllProjectByUserId = async (
    offset: number,
    limit: number
) => {
    const res = await fetch(
        `${apiUrl}/project/listProjectByUserId.php?offset=${offset}&limit=${limit}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json()
    return resJson
}


const GetLimitProjectByUserIdAndStatusName = async (
    statusName:string,
    offset: number
) => {
    const res = await fetch(
        `${apiUrl}/project/listProjectByUserId.php?status=${statusName}&offset=${offset}&limit=${5}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json()
    return resJson
}

const GetProjectCount = async () => {
    const res = await fetch(
        `${apiUrl}/project/getProjectCount.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json()
    return resJson
}

const GetProjectPriceProcess = async (
    project_id : string
) => {
    const res = await fetch(
        `${apiUrl}/OpenBidding/getAllPriceProcess.php?project_id=${project_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json()
    return resJson
}

const GetUnitPrice = async () => {
    const res = await fetch(
        `${apiUrl}/project/getUnitPrice.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json()
    return resJson
}

const UpdateUnitPriceOfProject = async (
    pj_id: string,
    unit: string
    ) => {        
        const payload = {
            pj_id: pj_id,
            unit: unit
        };
    const res = await fetch(
        `${apiUrl}/project/saveUnitPrice.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(payload)
        }
    );
    const resJson = await res.json();
    return resJson;
}


export {
    GetAllProjectByUserId,
    GetLimitProjectByUserIdAndStatusName,
    GetProjectCount,
    GetProjectPriceProcess,
    GetUnitPrice,
    UpdateUnitPriceOfProject
}