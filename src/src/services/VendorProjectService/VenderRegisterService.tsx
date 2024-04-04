import { apiUrl } from "../utilitity";
import { VenderRegisterprojectinfoInterface } from "../../models/Project/IVenderRegister";




async function CreateProjectVenderRegister(
    key: String,
    data: VenderRegisterprojectinfoInterface) {
    const formData = new FormData();

    formData.append("price", String(data.price))
    formData.append("AuctionPrice", String(data.AuctionPrice))
    formData.append("boq_uri", data.boq_uri)
    formData.append("receipt_uri", data.receipt_uri)
    formData.append("explaindetails", data.Explaindetails)
    formData.append("subPrice", JSON.stringify(data.subPrice));

    console.log(formData);
    let res = await fetch(
        `${apiUrl}/projectRegisters/vendorRegister.php?key=${key}`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function getVendorRegister(projectKey: string){
    let res = await fetch(
        `${apiUrl}/projectRegisters/getVendorRegisterInfo.php?key=${projectKey}`,
        {
            method: "GET",         
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

async function UpdateProjectVenderRegister(
    key: String,
    data: VenderRegisterprojectinfoInterface) {
    const formData = new FormData();
    formData.append("p_key",String(key))
    formData.append("price", String(data.price))
    formData.append("AuctionPrice", String(data.AuctionPrice))
    
    formData.append("boq_uri", data.boq_uri)
    formData.append("receipt_uri", data.receipt_uri)
    formData.append("subPrice", String(data.subPrice));
    console.log(data)
    let res = await fetch(
        `${apiUrl}/projectRegisters/updateVendorRegister.php?`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}
async function CheckPasscode(passcode: string,project_key: string){
const body ={
    "passcode": passcode,
    "project_key": project_key
}
    let res = await fetch(
        `${apiUrl}/projectRegisters/passcodeVerify.php`,
        {
            method: "POST",
            body: JSON.stringify(body),        
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

export{
    CheckPasscode,
    UpdateProjectVenderRegister,
    getVendorRegister,
    CreateProjectVenderRegister
}