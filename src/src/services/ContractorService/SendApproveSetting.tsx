import { apiUrl } from "../utilitity";

const SendApproveProject = async (
    projectId : string
) => {
    let res = await fetch(
        `${apiUrl}/ProjectSetting/sendAskForApprove.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(
                {
                    project_id : projectId
                }
            )
        }
    );
    let resJson = await res.json();
    return resJson
}

export {
    SendApproveProject
}