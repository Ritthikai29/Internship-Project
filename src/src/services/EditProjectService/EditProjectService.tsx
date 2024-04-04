import { ProjectEditOwnerInterface } from "../../models/Project/IProject";
import { apiUrl } from "../utilitity"


const GetEditProjectByKey = async (projectKey: string) => {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10700/getProject.php?key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    )
    let resJson = await res.json()
    return resJson;
}

const UpdateProjectByProjectKey = async (project: ProjectEditOwnerInterface) => {
    const prepareData = new FormData();
    prepareData.append("project_key", project.key);
    prepareData.append("project_name", project.name);
    prepareData.append("division_id", String(project.division_id));
    prepareData.append("department_id", String(project.department_id));
    prepareData.append("project_type_id", String(project.project_type_id));
    prepareData.append("job_type_id", String(project.job_type_id));

    // add file if is have..
    if (project.tor !== undefined) {
        prepareData.append("tor", project.tor)
    }
    if (project.job_description !== undefined) {
        prepareData.append("job_description", project.job_description)
    }
    let res = await fetch(
        `${apiUrl}/STS10000/STS10700/updateProject.php`,
        {
            method: 'POST',
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: prepareData
        }
    )
    let resJson = await res.json();
    return resJson;
}

const GetAllManagerOfProjectByProjectKey = async (
    projectKey: string
) => {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10700/getManagerOfProject.php?key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    let resJson = await res.json();
    return resJson;
}

const GetReasonProjectEdit = async (
    project_id: string
) => {
    console.log(245)
    let res = await fetch(
        `${apiUrl}/projectEdit/getReasonProjectEdit.php?project_id=${project_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    let resJson = await res.json();
    return resJson;
}


export {
    GetEditProjectByKey,
    UpdateProjectByProjectKey,
    GetAllManagerOfProjectByProjectKey,
    GetReasonProjectEdit
}