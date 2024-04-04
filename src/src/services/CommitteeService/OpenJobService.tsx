import { apiUrl } from "../utilitity";

const ListProjectWaitOpen = async (openId: string) => {
    let res = await fetch(
        `${apiUrl}/biddingVerify/listBidVerifyProject.php?op_id=${openId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const getAllWaitConsult = async (openId: string) => {
    let res = await fetch(
        `${apiUrl}/biddingVerify/listBidVerifyProject.php?op_id=${openId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const getProjectCurrentStatus = async (openId: string,projectId: string) => {
    let res = await fetch(
        `${apiUrl}/biddingResult/biddingCheckCloseProject.php?op_id=${openId}&pj_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

export{
    ListProjectWaitOpen,
    getAllWaitConsult,
    getProjectCurrentStatus
}