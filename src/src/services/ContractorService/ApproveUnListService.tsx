import { RejectApproveVendorProjectinterface } from "../../models/Contractor/IVerify";
import { apiUrl } from "../utilitity";

const ApproveUnlistVendorService = async (approve_id : string) => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/approverApprove.php?avpId=${approve_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const CreateRejectApproveVnedorProject = async (data : RejectApproveVendorProjectinterface) => {
    let prepare = {
        avp_id : data.avp_id,
        reject_topic_id: data.reject_topic_id,
        reject_detail : data.reject_detail
    }
    const res = await fetch(
        `${apiUrl}/vendorProjects/approverReject.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include": "same-origin",
            body: JSON.stringify(prepare)
        }
    );
    const resJson = await res.json();
    return resJson;
}

const VerifyUserIsAApprover = async (approve_id:string) => {
    const res = await fetch(
        `${apiUrl}/vendorProjects/verifyIsAApprover.php?avpId=${approve_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}

export {
    ApproveUnlistVendorService,
    CreateRejectApproveVnedorProject,
    VerifyUserIsAApprover
}