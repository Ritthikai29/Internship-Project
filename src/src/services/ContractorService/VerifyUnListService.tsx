import { RejectApproveVendorProjectinterface } from "../../models/Contractor/IVerify";
import { apiUrl } from "../utilitity";

const VerifyUnlistVendorService = async (approve_id : string) => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/verifierApprove.php?avpId=${approve_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const VerifyUserVerifyUnlistVendor = async () => {
    const res = await fetch(
        `${apiUrl}/Login/verify.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}

const VerifyUserIsAVerifier = async (approve_id:string) => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/verifyIsAVerifier.php?avpId=${approve_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}

const ListRejectTopicApproveVendorProject = async () => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/getAllRejectTopic.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}

const CreateRejectVerifyApproveVnedorProject = async (data : RejectApproveVendorProjectinterface) => {
    let prepare = {
        avp_id : data.avp_id,
        reject_topic_id: data.reject_topic_id,
        reject_detail : data.reject_detail
    }
    const res = await fetch(
        `${apiUrl}/vendorProjects/verifierReject.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include": "same-origin",
            body: JSON.stringify(prepare)
        }
    );
    const resJson = await res.json();
    return resJson;
}

export {
    VerifyUnlistVendorService,
    VerifyUserVerifyUnlistVendor,
    VerifyUserIsAVerifier,
    ListRejectTopicApproveVendorProject,
    CreateRejectVerifyApproveVnedorProject
}