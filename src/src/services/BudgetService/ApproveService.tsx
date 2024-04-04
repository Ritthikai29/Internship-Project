import { Approve1IsApproveInterface, RequestRejectInterface } from "../../models/Budget/Approve1/IApprove";
import { ReqRejectApprove2Interface } from "../../models/Budget/Approve2/IApprove2";
import { apiUrl } from "../utilitity"

const CheckApproveProject = async(projectKey : string) => {
    let res = await fetch(
        `${apiUrl}/STSSP30000/check.php?key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )

    let resJson = await res.json();
    return resJson
}

const UserPermissionApprove = async(clientRole: string, projectid:string) => {
    let res = await fetch(
        `${apiUrl}/STSSP30000/userPermission.php?role=${clientRole}&id=${projectid}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}

const GetProjectApproveByKey = async (projectKey : string) => {
    let res = await fetch(
        `${apiUrl}/STSSP30000/getProject.php?key=${projectKey}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson
}

const GetLatestBudgetCalculate = async (projectKey : string) => {
    let res = await fetch(
        `${apiUrl}/STSSP30000/getBudgetAndSub.php?key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson
}


const CreateApproveOfApprove1 = async (data : any) => {
    let prepare : Approve1IsApproveInterface = {
        project_key: data.projectKey,
        price: data.price,
        is_edit: data.isEdit,
        sub_prices: data.subPrices,
        reasonedit: data.reasonedit
    }
    let res = await fetch(
        `${apiUrl}/STSSP30000/approve1.php`,
        {
            method: "POST",
            body: JSON.stringify(prepare),
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();

    return resJson;
}

const ListRejectReason = async () => {
    let res = await fetch(
        `${apiUrl}/STSSP30000/listReasonCalculate.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson
}

const RejectBudgetByApprove1 = async (data: RequestRejectInterface) => {
    let res = await fetch(
        `${apiUrl}/STSSP30000/approve1Reject.php`,
        {
            method:"POST",
            body: JSON.stringify(data),
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}


const GetLatestApprove1ByProjectKey = async ( projectKey : any ) => {
    let res = await fetch(
        `${apiUrl}/STSSP30000/getLatestApprove1.php?key=${projectKey}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const RejectApprove2ByProjectKey = async (data: ReqRejectApprove2Interface) => {
    let res = await fetch(
        `${apiUrl}/STSSP30000/approve2Reject.php`,
        {
            method: "POST",
            body: JSON.stringify(data),
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}

const Approve2ApproveByProjectKey = async (projectKey: string) => {
    let res = await fetch(
        `${apiUrl}/STSSP30000/approve2.php`,
        {
            method: "POST",
            body: JSON.stringify(
                {
                    project_key: projectKey
                }
            ),
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
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
    CheckApproveProject,
    UserPermissionApprove,
    GetProjectApproveByKey,
    GetLatestBudgetCalculate,
    CreateApproveOfApprove1,
    GetLatestApprove1ByProjectKey,
    ListRejectReason,
    RejectBudgetByApprove1,
    RejectApprove2ByProjectKey,
    Approve2ApproveByProjectKey,
    GetUnitOfProject
}