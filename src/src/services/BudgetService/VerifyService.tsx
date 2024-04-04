import { SubmitBudget2Interface, SubmitBudgetInterface } from "../../models/Budget/Verify/IVerify";
import { apiUrl } from "../utilitity"

const CheckVerifyProject = async (projectKey: string) => {
    let res = await fetch(
        `${apiUrl}/STSSP20000/check.php?key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"

        }
    )
    let resJson = res.json();
    return resJson;
}

const CheckVerifyPermission = async (projectId: string) => {
    let res = await fetch(
        `${apiUrl}/STSSP20000/userPermission.php?pj_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json()
    return resJson
}

const GetBudgetCalculate = async (projectKey: string, haveVerify_2: boolean) => {
    let res = await fetch(
        `${apiUrl}/STSSP20000/getBudgetCalculate.php?key=${projectKey}&haveVerify_2=${haveVerify_2}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const GetVerifyProject = async (projectKey: string,  haveVerify_2: any) => {
    let res = await fetch(
        `${apiUrl}/STSSP20000/getProject.php?key=${projectKey}&haveVerify_2=${haveVerify_2}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"

        }
    );
    let resJson = await res.json();
    return resJson;
}

const VerifySubmit = async (data : SubmitBudgetInterface) => {
    let res = await fetch(
        `${apiUrl}/STSSP20000/verifyBC.php`,
        {
            method: "POST",
            body: JSON.stringify(data),
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}

const Verify2Submit = async (data : SubmitBudget2Interface) => {
    let res = await fetch(
        `${apiUrl}/STSSP20000/verify2_BC.php`,
        {
            method: "POST",
            body: JSON.stringify(data),
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}

const GetVerifyReason = async () => {
    let res = await fetch(
        `${apiUrl}/STSSP20000/getReason.php`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    )
    let resJson = await res.json()
    return resJson;
}

const GetUnitOfProject = async (projectKey: string) => {
    let res = await fetch(
        `${apiUrl}/project/getUnitOfProject.php?project_key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"

        }
    );
    let resJson = await res.json();
    return resJson;
}

export {
    CheckVerifyProject,
    CheckVerifyPermission,
    GetBudgetCalculate,
    GetVerifyProject,
    VerifySubmit,
    Verify2Submit,
    GetVerifyReason,
    GetUnitOfProject
}