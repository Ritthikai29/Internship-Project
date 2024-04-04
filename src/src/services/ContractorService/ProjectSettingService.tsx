import { apiUrl } from "../utilitity";


const ApproveProjectSettingService = async (projectId : string) => {
    const res = await fetch(
        `${apiUrl}/ProjectSetting/approveProjectSetting.php?project_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson
}

const RejectProjectSettingService = async (projectId : string) => {
    const res = await fetch(
        `${apiUrl}/ProjectSetting/rejectProjectSetting.php?project_id=${projectId}`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson
}

const finishCompetition = async (
    projectKey : string
) => {
    let res = await fetch(
        `${apiUrl}/contractorCheckReg/finishCompetition.php`,
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

const UpdateVendorEmailById = async (id : string, email : string) => {
    const prepareData = new FormData();
    prepareData.append("vendor_id", id);
    prepareData.append("email", email);

    let res = await fetch(
        `${apiUrl}/contractor/changeVendorInfo.php`,
        {
            method: 'POST',
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: prepareData
        }
    )
    let resJson = await res.json();
    return resJson;
}

export {
    ApproveProjectSettingService,
    finishCompetition,
    RejectProjectSettingService,
    UpdateVendorEmailById
}