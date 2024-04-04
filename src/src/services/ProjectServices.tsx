import { ProjectInterface } from "../models/Project/IProject";
import { apiUrl } from "./utilitity";

async function getDepartments() {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/getDepartments.php`,
        {
            method: 'GET',
            credentials: "include"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function getAffiliation() {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/getAffiliation.php`,
        {
            method: 'GET',
            credentials: "include"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function getAffiliationByID(
    $affiliationID: string,
) {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/getAffiliationByID.php?affiliationID=${$affiliationID}`,
        {
            method: 'GET',
            credentials: "include"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function getDivision() {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/getDivisions.php`,
        {
            method: "GET",
            credentials: "include"
        }
    )
    let resJson = await res.json();
    return resJson;
}

async function getProjectType() {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/getProjectTypes.php`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function getJobType() {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/getJobTypes.php`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function GetAllListStatus() {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/getAllListProjectStatus.php`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function SearchEmployeeByNameOrEmpId(search: string) {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/getUserStaffForSearch.php?user=${search}`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function SearchMDByNameOrEmpId(search: string) {
    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/getMDForSearch.php?user=${search}`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function CreateProjectWithManager(data: ProjectInterface) {
    const formData = new FormData();
    // prepare a data before send api file
    formData.append("projectTypeId", String(data.projectTypeId))
    formData.append("projectJobTypeId", String(data.projectJobTypeId))
    formData.append("departmentId", String(data.departmentId))
    formData.append("divisionId", String(data.divisionId))
    formData.append("affiliationId", String(data.affiliationId))
    formData.append("projectName", String(data.projectName))
    formData.append("tor", data.tor as Blob);
    formData.append("jobDescription", data.jobDescription as Blob);
    formData.append("calculator_id", data.calculator_id as string);
    formData.append("verifier_id", data.verifier_id as string);
    formData.append("approver_id", data.approver_id as string);
    if (data.approver2_id !== undefined) {
        formData.append("approver2_id", data.approver2_id as string);
    }
    if (data.verifier2_id !== undefined) {
        formData.append("verifier2_id", data.verifier2_id as string);
    }
    formData.append("affiliationName", data.affiliationName);

    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/addProjectWithManager.php`,
        {
            method: "POST",
            body: formData,
            credentials: "include" // to run a session token in defference ip (can disable in server)
        }
    );
    let resJson = await res.json();

    return resJson
}

async function CreateProject(data: ProjectInterface,unit : string) {
    const formData = new FormData();

    formData.append("projectTypeId", String(data.projectTypeId))
    formData.append("projectJobTypeId", String(data.projectJobTypeId))
    formData.append("affiliationId", String(data.affiliationId))
    formData.append("projectName", String(data.projectName))
    formData.append("tor", data.tor);
    formData.append("jobDescription", data.jobDescription);
    formData.append("calculateFile", data.calculateFile);
    formData.append("price", String(data.price));
    formData.append("unit", String(unit));
    formData.append("affiliationName", data.affiliationName);

    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/addProject.php`,
        {
            method: "POST",
            body: formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    console.log(resJson);

    return resJson
}

async function CreateProjectWithSubPrice(data: ProjectInterface,unit : string) {
    const formData = new FormData();

    formData.append("projectTypeId", String(data.projectTypeId))
    formData.append("projectJobTypeId", String(data.projectJobTypeId))
    formData.append("affiliationId", String(data.affiliationId))
    formData.append("projectName", String(data.projectName))
    formData.append("tor", data.tor);
    formData.append("jobDescription", data.jobDescription);
    formData.append("calculateFile", data.calculateFile);
    formData.append("price", String(data.price));
    formData.append("subPrice", JSON.stringify(data.subPrice))
    formData.append("unit", String(unit));
    formData.append("affiliationName", data.affiliationName);

    let res = await fetch(
        `${apiUrl}/STS10000/STS10600/addProjectWithSub.php`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const ListProjectService = async () => {
    let res = await fetch(
        `${apiUrl}/project/listProject.php`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}
const AllListProjectService = async () => {
    let res = await fetch(
        `${apiUrl}/project/listProject.php?ofs=0&lim=104`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}
const AllListProjectHistory = async () => {
    const res = await fetch(
        `${apiUrl}/project/listProjectHistory.php?ofs=0&lim=9999`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}
async function DetailProject(key: string) {
    let res = await fetch(
        `${apiUrl}/project/detailProjectByKey.php?key=${key}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}

async function DetailProjectSecretary(key: string) {
    let res = await fetch(
        `${apiUrl}/project/detailProjectSecretaryByKey.php?key=${key}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}


const listProjectWaitToApproveInviteToJoin = async (
    offset = 0,
    limit = 5,
) => {
    let res = await fetch(
        `${apiUrl}/project/listProjectAproveInvite.php?ofs=${offset}&lim=${limit}`
    );
    let resJson = await res.json();
    return resJson
}

const detailmanager = async (key: string) => {
    let res = await fetch(
        `${apiUrl}/project/getdetailmanager.php?key=${key}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}

const UnlistWaitInfo = async (key: string) => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/getVendorUnlistInfo.php?key=${key}`,
        {
            method:"GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}
export {
    getDepartments,
    getProjectType,
    getJobType,
    GetAllListStatus,
    getDivision,
    getAffiliation,
    getAffiliationByID,
    SearchEmployeeByNameOrEmpId,
    CreateProjectWithManager,
    CreateProject,
    CreateProjectWithSubPrice,
    ListProjectService,
    
    listProjectWaitToApproveInviteToJoin,
    AllListProjectService,
    AllListProjectHistory,
    DetailProject,
    detailmanager,
    DetailProjectSecretary,

    SearchMDByNameOrEmpId,
    UnlistWaitInfo
}