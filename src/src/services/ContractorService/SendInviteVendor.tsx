import { apiUrl } from "../utilitity";

const SendInviteVendorProject = async (
    projectKey : string
) => {
    let res = await fetch(
        `${apiUrl}/sendInvite/sendInviteVendor.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(
                {
                    key : projectKey
                }
            )
        }
    );
    let resJson = await res.json();
    return resJson
}

const SendInviteVendorProjectAgain = async (
    projectKey : string
) => {
    let res = await fetch(
        `${apiUrl}/sendInvite/sendInviteVendorAgain.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(
                {
                    key : projectKey
                }
            )
        }
    );
    let resJson = await res.json();
    return resJson
}

export {
    SendInviteVendorProject,
    SendInviteVendorProjectAgain
}