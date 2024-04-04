import { RejectProjectValidateInterface } from "../../models/Project/IListWaitProject";
import { apiUrl } from "../utilitity";


const ApproveProjectByKey = async (
    projectKey : string
) => {
    let res = await fetch(
        `${apiUrl}/verifyProject/approveProject.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(
                {
                    project_key : projectKey
                }
            )
        }
    );
    let resJson = await res.json();
    return resJson
}

const RejectProjectByKey = async (
    data : RejectProjectValidateInterface
) => { 
    let res = await fetch(
        `${apiUrl}/verifyProject/rejectProject.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(data)
        }
    );
    let resJson = await res.json()
    return resJson

}

const ListRejectTopicValidate = async () => {
    let res = await fetch(
        `${apiUrl}/verifyProject/listRejectTopic.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    let resJson = await res.json();
    return resJson
}



export {
    ApproveProjectByKey,
    ListRejectTopicValidate,
    RejectProjectByKey
}