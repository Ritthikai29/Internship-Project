import { CalculateInterface } from "../../models/Budget/Calculate/ICalculate";
import { apiUrl } from "../utilitity";

const checkCalculateProject = async (projectKey: string) => {
    let res = await fetch(
        `${apiUrl}/STSSP10000/check.php?project_key=${projectKey}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );

    let resJson = await res.json();
    return resJson
}

const CheckUserPermission = async (projectId : string) => {
    let res = await fetch(
        `${apiUrl}/STSSP10000/userPermission.php`,
        {
            method: "POST",
            body:JSON.stringify({
                "projectId": projectId
            }),
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json()
    return resJson;
}

const GetProjectById = async (projectId : string) => {
    let res = await fetch(
        `${apiUrl}/STSSP10000/get/get_project.php?pj_id=${projectId}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const CreateCalculate = async (data: CalculateInterface) => {
    const formData = new FormData();

    formData.append("budget", String(data.budget));
    formData.append("pj_id", String(data.pj_id));
    formData.append("auction_file", data.auction_file);

    let res = await fetch(
        `${apiUrl}/STSSP10000/post/create.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include": "same-origin",
            body: formData
        }
    );

    let resJson = await res.json();

    return resJson

}

const CreateCalculateWithSubPrice = async (data: CalculateInterface) => {
    const formData = new FormData();

    formData.append("budget", String(data.budget))
    formData.append("pj_id", String(data.pj_id))
    formData.append("auction_file", data.auction_file);
    formData.append("sub_price", JSON.stringify(data.sub_price));


    let res = await fetch(
        `${apiUrl}/STSSP10000/post/create-sub.php`,
        {
            method:"POST",
            credentials:import.meta.env.DEV ? "include": "same-origin",
            body: formData
        }
    );
    
    let resJson = await res.json();

    return resJson;

}

const GetRejectOld = async (projectKey: string) => {
    let res = await fetch(
        `${apiUrl}/STSSP10000/get/getRejectReason.php?key=${projectKey}`,
        {
            method: "GET",
            credentials:import.meta.env.DEV ? "include": "same-origin",
        }
    );
    let resJson = await res.json();
    return resJson;
}

const GetOldBudgetCalculate = async(projectKey : string) =>{
    let res = await fetch(
        `${apiUrl}/STSSP10000/get/getPrevBudget.php?key=${projectKey}`,
        {
            method: "GET",
            credentials:import.meta.env.DEV ? "include": "same-origin",
        }
    );
    let resJson = await res.json()
    return resJson
}

const GetAllManagerInProject = async (projectKey : string) => {
    let res = await fetch( 
        `${apiUrl}/STSSP10000/get/getManager.php?key=${projectKey}`,
        {
            method: "GET",
            credentials:import.meta.env.DEV ? "include": "same-origin",
        }
    )
    let resJson = await res.json();
    return resJson
}

export {
    checkCalculateProject,
    CheckUserPermission,
    GetProjectById,
    CreateCalculate,
    CreateCalculateWithSubPrice,
    GetRejectOld,
    GetOldBudgetCalculate,
    GetAllManagerInProject
}