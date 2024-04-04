import { apiUrl } from "../utilitity";
import { ProjectSettingEditInterface } from "../../models/Contractor/IRegisInfo";

const ListRegisterVendor = async (project_key : string) => {
    let res = await fetch(
        `${apiUrl}/projectRegisters/getListVendorRegisterInfoByProjectKey.php?key=${project_key}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const InListRegisterVendor = async (project_key : string) => {
    let res = await fetch(
        `${apiUrl}/projectRegisters/getInListVender.php?key=${project_key}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const UnListRegisterVendor = async (project_key : string) => {
    let res = await fetch(
        `${apiUrl}/projectRegisters/getUnListVender.php?key=${project_key}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}


const ListRegisterVendorByDocumentStatus = async (project_key : string, document_id : string) => {
    let res = await fetch(
        `${apiUrl}/projectRegisters/getListVenderByStatus.php?key=${project_key}&status_id=${document_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const SearchListRegisterVendor = async (project_key : string, search : string) => {
    let res = await fetch(
        `${apiUrl}/projectRegisters/getVendorRegisterByCompanyNameAndStatus.php?key=${project_key}&search=${search}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}


const GetVendorRegisterStatus = async () => {
    let res = await fetch(
        `${apiUrl}/projectRegisters/getVendorRegisterStatus.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}


const GetProjectSetting = async (project_key : string) => {
    let res = await fetch(
        `${apiUrl}/ProjectSetting/getProjectSetting.php?key=${project_key}`,

        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const UpdateProjectSettingByProjectKey = async (project_setting: ProjectSettingEditInterface) => {
    const prepareData = new FormData();
    prepareData.append("project_key", project_setting.key);
    prepareData.append("end_datetime", String(project_setting.end_datetime));
    prepareData.append("deposit_money", String(project_setting.deposit_money));
    console.log(prepareData);
    let res = await fetch(
        `${apiUrl}/ProjectSetting/updateProjectSetting.php`,
        {
            method: 'POST',
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: prepareData
        }
    )
    let resJson = await res.json();
    return resJson;
}

export{
    ListRegisterVendor,
    InListRegisterVendor,
    UnListRegisterVendor,
    ListRegisterVendorByDocumentStatus,
    SearchListRegisterVendor,
    GetProjectSetting,
    GetVendorRegisterStatus,
    UpdateProjectSettingByProjectKey
}