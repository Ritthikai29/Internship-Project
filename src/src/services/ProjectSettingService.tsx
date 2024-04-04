import { projectsetting } from "../models/ProjectSetting/IProjectSetting";
import { apiUrl } from "./utilitity";

async function CreateProjectSetting(data: projectsetting) {
    const formData = new FormData();
    // prepare a data before send api file
    formData.append("project_id", String(data.project_id))
    formData.append("datetime_start", String(data.datetime_start))
    formData.append("datetime_end", String(data.datetime_end))
    formData.append("time_end", String(data.time_end))
    formData.append("time_details", String(data.time_details))
    formData.append("date_details", String(data.date_details))    
    formData.append("deposit_money", String(data.deposit_money))  
    formData.append("job_type", data.job_type as string)    
    // about people in project
    formData.append("coordinator", data.coordinator as string);
    formData.append("approver", data.approver as string);
    
    // for (const file of data.addiFile) {
    //     formData.append("addiFile[]", file, file.name);
    // } 
    // data.addiFile.forEach((file) => {
    //     formData.append("addiFile[]", file, file.name);
    // }); 
    if(data.addiFile !== undefined){
        for (let i = 0; i < data.addiFile.length; i++) {
            formData.append(data.addiFile[i].name, data.addiFile[i] as Blob); //มีไฟล์เดียวยังไม่จำเป็น
            console.log(data.addiFile[i].name);
        }
    }
    
    
    // for (const file of data.addiFile) {  
    //     const blob = new Blob([file], { type: 'application/pdf' });
    //     formData.append(file.name, blob);
    //     }

    let res = await fetch(
        `${apiUrl}/ProjectSetting/createProjectSetting.php`,
        {
            method: "POST",
            body: formData,
            credentials: import.meta.env.DEV ? "include": "same-origin" // to run a session token in defference ip (can disable in server)
        }
    );
    let resJson = await res.json();

    return resJson
}

const getProjectSettingByKey = async (projectKey : string) => {
    const res = await fetch(
        `${apiUrl}/ProjectSetting/getProjectSetting.php?key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson
}

export {
    CreateProjectSetting,
    getProjectSettingByKey
}