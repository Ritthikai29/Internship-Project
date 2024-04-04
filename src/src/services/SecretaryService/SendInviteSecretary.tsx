import { apiUrl } from "../utilitity";

const SendInviteCommittee = async (
    openId : string
) => {
    let res = await fetch(
        `${apiUrl}/OpenBidding/ReSendDateOpenProjectAndInvite.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(
                {
                    op_id : openId
                }
            )
        }
    );
    let resJson = await res.json();
    return resJson
}

const ReSendCommitteePasscode = async (
    openId : string
) => {
    let res = await fetch(
        `${apiUrl}/sendRemindAgain/remindAndCodeCommit.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(
                {
                    op_id : openId
                }
            )
        }
    );
    let resJson = await res.json();
    return resJson
}

export {
    SendInviteCommittee,
    ReSendCommitteePasscode
}