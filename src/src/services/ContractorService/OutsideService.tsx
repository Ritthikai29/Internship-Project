import { CreateVendorOutsideUnList } from "../../models/Contractor/IOutside";
import { apiUrl } from "../utilitity";

const ListProvinceVendor = async () => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/listProvince.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const ListDistractByProvinceName = async (provinceName : string) => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/listDistractByProvinceName.php?prov=${provinceName}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}

const ListLocationVendor = async () => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/listLocation.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}


const ListUserStaff = async () => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/listUserStaff.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json()
    return resJson;
}

const ListVendorSearching = async (vendorName: string) => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/listVendorUnlistByName.php?search=${vendorName}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"

        }
    )
    const resJson = await res.json()
    return resJson
}

const CreateVendorUnList = async (data : CreateVendorOutsideUnList) => {

    let prepareBody = {
        reason: data.reason,
        verifier_id: data.verifier_id,
        approver_id: data.approver_id,
        cc_send_id : data.cc_send_id || undefined,  // <-- will send when user want to send a cc data
        project_id: data.project_id,
        unlistVendor: data.unlistVendor,
    }

    const res = await fetch(
        `${apiUrl}/vendorProjects/createVendorsUnlistOfProject.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include": "same-origin",
            body: JSON.stringify(
                prepareBody
            )
        }
    );

    const resJson = await res.json();
    return resJson
}


const GetProjectContractorByKey = async (project_key : string) => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/getProjectByKey.php?project_key=${project_key}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin",
        }
    );
    const resJosn = await res.json();
    return resJosn;

}

const GetRejectProjectByKey = async (project_key: string) => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/getRejectReasonUnlist.php?project_key=${project_key}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"

        }
    )
    const resJson = await res.json()
    return resJson
}


export {
    ListProvinceVendor,
    ListDistractByProvinceName,
    ListLocationVendor,
    ListUserStaff,
    GetProjectContractorByKey,
    ListVendorSearching,
    CreateVendorUnList,
    GetRejectProjectByKey
}