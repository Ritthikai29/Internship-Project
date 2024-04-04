import { apiUrl } from "../utilitity";

const ApproveResultBidding = async (projectKey : string) => {
    const res = await fetch(
        `${apiUrl}/mdApproval/approveResultBidding.php?key=${projectKey}&is_approve=1`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson
}

const RejectResultBidding = async (projectKey : string) => {
    const res = await fetch(
        `${apiUrl}/mdRejection/rejectResultBidding.php?key=${projectKey}&is_approve=0`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson
}

const BargainResultBidding = async (projectKey : string) => {
    const res = await fetch(
        `${apiUrl}/mdBargain/bargainBidding.php?key=${projectKey}`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson
}

export {
    ApproveResultBidding,
    RejectResultBidding,
    BargainResultBidding
}