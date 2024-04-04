import { apiUrl } from "../utilitity";

async function GetMdApprovalByPid(pid: string) {
    let res = await fetch(
        `${apiUrl}/biddingResult/getMdApprovalByPid.php?pid=${pid}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}

export {
    GetMdApprovalByPid
}