import { fileVenderInterface } from "../../models/Vendor/IVendor";
import { apiUrl } from "../utilitity";

const getDetailVendor = async () => {
    let res = await fetch(
        `${apiUrl}/Vendor/detailVendor.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();

    return resJson;
}

const getRetreat = async () => {
    let res = await fetch(
        `${apiUrl}/Vendor/Retreat.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();

    return resJson;
}

const getListVendorHistory = async ( 
    status : string 
    // , offset : 0 
    // , limit : 5
    ) => {
    let res = await fetch(
        `${apiUrl}/project/listProjectByVendorId.php?status=${status}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();

    return resJson;
}

const uploadCertiFileVendor = async (data: fileVenderInterface) =>{
    const formData = new FormData();

    formData.append("vendor_file",data.vendor_file);
    formData.append("vendor_key",String(data.vendor_key))

    
    let res = await fetch(
        `${apiUrl}/Vendor/addCertificateFileVendor.php`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const uploadVATFileVendor = async (data: fileVenderInterface) =>{
    const formData = new FormData();

    formData.append("vendor_file",data.vendor_file as Blob);
    formData.append("vendor_key",String(data.vendor_key))

    
    let res = await fetch(
        `${apiUrl}/Vendor/addVATFileVendor.php`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    console.log(resJson)
    return resJson;
}

const uploadBookFileVendor = async (data: fileVenderInterface) =>{
    const formData = new FormData();

    formData.append("vendor_file",data.vendor_file)
    
    formData.append("vendor_key",String(data.vendor_key))
    
    let res = await fetch(
        `${apiUrl}/Vendor/addBookBankFileVendor.php`,
        {
            method: "POST",
            body: formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const listVendorProject = async (    
    offset = 0,
    limit = 5
    ) =>
    {
    let res = await fetch(
        `${apiUrl}/Vendor/listProjectForVendor.php?ofs=${offset}&lim=${limit}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const VendorCalcelProjectByKey = async (
    projectKey : string,
    reject_id: number,
    comment : string
) => {
    let res = await fetch(
        `${apiUrl}/vendorProjects/cancelProject.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(
                {
                    project_key : projectKey,
                    reject_id: reject_id,
                    comment : comment,
                }
            )
        }
    );
    let resJson = await res.json();
    return resJson
}

async function CreateProjectCancelVenderRegister(
    key: String,
    ) {

    let res = await fetch(
        `${apiUrl}/vendorProjects/vendorcancelRegister.php?key=${key}`,
        {
            method: "POST",
            body: JSON.stringify(
                {
                    project_key : key,
                }
            ),
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

export{
    getDetailVendor,
    uploadCertiFileVendor,
    uploadBookFileVendor,
    uploadVATFileVendor,
    listVendorProject,
    getListVendorHistory,
    getRetreat,
    VendorCalcelProjectByKey,
    CreateProjectCancelVenderRegister
}