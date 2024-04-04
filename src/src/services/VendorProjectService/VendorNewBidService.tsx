import { apiUrl } from "../utilitity";
import { VenderRegisterprojectinfoInterface } from "../../models/Project/IVenderRegister";

async function CreateNewProjectVenderRegister(
    key: String,
    data: VenderRegisterprojectinfoInterface) {
    const formData = new FormData();

    formData.append("price", String(data.price))
    formData.append("boq_uri", data.boq_uri)
    formData.append("explaindetails_uri", data.Explaindetails)
    formData.append("subPrice", JSON.stringify(data.subPrice));
    console.log(11111);
    console.log(formData);
    console.log(11111);
    let res = await fetch(
        `${apiUrl}/newBidding/vendorNewBidding.php?key=${key}`,
        {
            method: "POST",
            body:formData,
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    console.log(resJson);
    return resJson;
}

async function getPreviousRegister(projectKey: string){
    let res = await fetch(
        `${apiUrl}/newBidding/getAllDataNewBid.php?key=${projectKey}`,
        {
            method: "GET",         
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

export {
    CreateNewProjectVenderRegister,
    getPreviousRegister
}