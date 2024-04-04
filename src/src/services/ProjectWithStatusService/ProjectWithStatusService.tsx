import { apiUrl } from "../utilitity"

const ListWaitProject = async (
    offset = 0,
    limit = 5,
    status = "all"
) => {
    let res: any;
    if (status === "all") {
        res = await fetch(
            `${apiUrl}/verifyProject/listProject.php?ofs=${offset}&lim=${limit}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        )
    } else {
        res = await fetch(
            `${apiUrl}/verifyProject/listProjectWithStatus.php?ofs=${offset}&lim=${limit}&st=${status}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        )
    }

    let resJson = await res.json()
    return resJson.data
}

const ListAllProject = async (
    offset = 0,
    limit = 5,
) => {
    let res = await fetch(
        `${apiUrl}/project/listProject.php?ofs=${offset}&lim=${limit}`
    );
    let resJson = await res.json();
    return resJson
}

const ListDocsWaitingProject = async (
    offset = 0,
    limit = 5
) => {
    let res = await fetch(
        `${apiUrl}/project/listProjectWaitVerify.php?ofs=${offset}&lim=${limit}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson
}

const ListOpenProject = async (
    offset =0,
    limit=5) =>{
        let res = await fetch(
            `${apiUrl}/project/listProjectOpenProject.php?ofs=${offset}&lim=${limit}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        );
        let resJson = await res.json();
        return resJson;
}

const ListAproveInvite = async (
    offset =0,
    limit=5) =>{
        let res = await fetch(
            `${apiUrl}/project/listProjectAproveInvite.php?ofs=${offset}&lim=${limit}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        );
        let resJson = await res.json();
        return resJson;
}

const ListVendorInvite = async (
    offset =0,
    limit=5) =>{
        let res = await fetch(
            `${apiUrl}/project/listProjectVendorInvite.php?ofs=${offset}&lim=${limit}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        );
        let resJson = await res.json();
        return resJson;
}
const ListOpenInvite = async (
    offset =0,
    limit=5) =>{
        let res = await fetch(
            `${apiUrl}/project/listProjectOpenInvite.php?ofs=${offset}&lim=${limit}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        );
        let resJson = await res.json();
        return resJson;
}

const listWaitOpenPrice = async (
    offset =0,
    limit=5) =>{
        let res = await fetch(
            `${apiUrl}/project/listProjectWaitOpenPrice.php?ofs=${offset}&lim=${limit}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        );
        let resJson = await res.json();
        return resJson;
}

const listWaitNegotiate = async (
    offset =0,
    limit=5) =>{
        let res = await fetch(
            `${apiUrl}/project/listProjectWaitNegotiate.php?ofs=${offset}&lim=${limit}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        );
        let resJson = await res.json();
        return resJson;
}

const listProjectAnnouncementResult = async (
    offset =0,
    limit=5) =>{
        let res = await fetch(
            `${apiUrl}/project/listProjectAnnouncementResult.php?ofs=${offset}&lim=${limit}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        );
        let resJson = await res.json();
        return resJson;
}

const ListProjectWithStatusSearch = async (
    offset = 0,
    limit = 5,
    status_id : number,
    search_input : string
) => {
    let res = await fetch(
        `${apiUrl}/project/listProjectWaitWithStatus.php?ofs=${offset}&lim=${limit}&project_status=${status_id}&search_input=${search_input}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson
}
export {
    ListWaitProject,
    ListDocsWaitingProject,
    ListAllProject,
    ListOpenProject,
    ListAproveInvite,
    ListOpenInvite,
    listWaitOpenPrice,
    listWaitNegotiate,
    listProjectAnnouncementResult,
    ListVendorInvite,
    ListProjectWithStatusSearch
}