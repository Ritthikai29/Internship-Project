import { IVendorBargain } from "../../components/Secretary/SpecifiedEnvelop/WaitNegotiate/WNOfferNewPrice";
import { ISummary } from "../../components/Secretary/SpecifiedEnvelop/WaitNegotiate/WNReprocess";
import { ISecretarySave, ISecretarySum } from "../../models/Secretary/IProjectSecretary";
import { apiUrl } from "../utilitity";

const GetAllProjectWaitForOpenBidding = async () => {
    let res = await fetch(
        `${apiUrl}/OpenBidding/getAllProjectWaitConsult.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const GetAllProjectWaitSend = async () => {
    let res = await fetch(
        `${apiUrl}/sendCommitteeInvite/getAllOpenBiddSend.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const CreateProjectConsultDate = async (data: any) => {
    let time = new Date(data.date + " " + (data.time))
    let prepare = {
        open_datetime: time,
        open_place: data.place,
        project_list: data.projects
    }
    let res = await fetch(
        `${apiUrl}/OpenBidding/NewDateOpenProjectAndInvite.php`,
        {
            method: "POST",
            body: JSON.stringify(prepare),
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson;
}

const GetAllConsultInDay = async () => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/getAllOpenBiddingWaitingStart.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    )
    let resJson = await res.json();
    return resJson;
}

const GetConsultById = async (openId: string) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/getOpenBiddingById.php?open_id=${openId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    let resJson = await res.json();
    return resJson
}

const PasscodeVerify = async (data: any) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/committeeLoginProject.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(data)
        }
    )
    let resJson = await res.json();
    return resJson;
}

const GetCommitteeOfTheProject = async (open_id: string) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/checkCommitteeJoin.php?op_id=${open_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}

const SecretaryStartProject = async (open_id: string) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/biddingVerifyStart.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify({
                open_id: open_id
            })
        }
    );
    const resJson = await res.json();
    return resJson;
}

const GetAllProjectOfConsultId = async (openId: string) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/listBidVerifyProject.php?op_id=${openId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}

const GetAllProjectByOpenId = async (openId: string) => {
    const res = await fetch(
        `${apiUrl}/OpenBidding/ListWaitReSendOpenProject.php?op_id=${openId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}

const GetProjectByOpenIdAndProjectId = async (
    openId: string,
    projectId: string
) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/getBiddingByProject.php?op_id=${openId}&pj_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}


const GetAllVendorProjectBidResultByProjectKey = async (key: string) => {
    const res = await fetch(
        `${apiUrl}/secretaryCompareResult/compareVendorPrice.php?key=${key}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson
}

const GetAllTopicCommentDirector = async () => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/getAllTopicComment.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}

const getDetailComment = async (project_id: string) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/getDetailComment.php?project_id=${project_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}

const CreateCommentProjectDirector = async (data: any) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/createCommentOfCommittee.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(data)
        }
    );
    const resJson = await res.json();
    return resJson;
}

const UpdateCommentProjectDirector = async (data: any) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/updateCommentOfCommittee.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(data)
        }
    );
    const resJson = await res.json();
    return resJson;
}

const GetAllProjectWaitFinalCommentByOpenId = async (
    open_id: string
) => {
    const res = await fetch(
        `${apiUrl}/biddingResult/getAllprojectWaitSummary.php?open_id=${open_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson
}

const GetAllCommentProjectByProjectId = async (projectId: string) => {
    const res = await fetch(
        `${apiUrl}/biddingResult/getAllCommentByProjectId.php?project_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}

const GetSummaryCommmentByProjectId = async (projectId: string) => {
    const res = await fetch(
        `${apiUrl}/biddingResult/getSummaryCommentByPid.php?project_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}

const GetDirectorByOpenId = async (openId: string) => {
    const res = await fetch(
        `${apiUrl}/biddingResult/getDirectorByOpenID.php?open_id=${openId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    return resJson;
}

const CreateSectatySum = async (data: ISecretarySave) => {
    const res = await fetch(
        `${apiUrl}/biddingResult/createResultBidding.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(data)
        }
    )
    const resJson = await res.json();
    return resJson;
}

const CreateSaveToConsult = async (data: ISecretarySave) => {
    const res = await fetch(
        `${apiUrl}/biddingResult/saveUnsuccessResult.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(data)
        }
    );
    const resJson = await res.json();
    return resJson;
}

const GetAllProjectBargain = async () => {
    const res = await fetch(
        `${apiUrl}/vendorBargain/getAllProjectWaitBargain.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json();
    return resJson
}

const GetProjectById = async (projectId: string) => {
    const res = await fetch(
        `${apiUrl}/project/getProjectById.php?project_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    );
    const resJson = await res.json();
    console.log(456)
    console.log(resJson)
    return resJson;
}

const GetFinalCommentByProjectId = async (projectId: string) => {
    const res = await fetch(
        `${apiUrl}/vendorBargain/getProjectFinalResult.php?project_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json();
    return resJson;
}

const GetAllVendorProjectByProjectId = async (projectId: string) => {
    const res = await fetch(
        `${apiUrl}/vendorBargain/getAllVendorInProject.php?project_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json();
    return resJson;
}

const GetAllVendorProjectWaitToOfferByProjectId = async (projectId: string) => {
    const res = await fetch(
        `${apiUrl}/vendorBargain/getAllVendorWaitToOffer.php?project_id=${projectId}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json();
    return resJson;
}

const CreateOrUpdateBargain = async (data: IVendorBargain) => {
    const res = await fetch(
        `${apiUrl}/vendorBargain/createBargain.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(data)
        }
    );
    const resJson = await res.json();
    return resJson
}

const SaveUnSuccessBargain = async (summary: ISummary) => {
    const res = await fetch(
        `${apiUrl}/newBidding/saveUnSuccessBargain.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(summary)
        }
    );
    const resJson = await res.json();
    return resJson
}

const SaveSuccessBargain = async (summary: ISummary) => {
    const res = await fetch(
        `${apiUrl}/newBidding/successBidding.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(summary)
        }
    );
    const resJson = await res.json();
    return resJson
}

const GetAllApproveProject = async () => {
    const res = await fetch(
        `${apiUrl}/vendorBargain/getAllProjectWaitApprove.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json();
    return resJson;
}

const GetAllAnnouceProject = async () => {
    const res = await fetch(
        `${apiUrl}/project/listProjectMDApproveResult.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json();
    return resJson;
}

const UpdateProjectConsultDate = async (data: any) => {
    const time = new Date(data.date + " " + (data.time))
    const prepare = {
        op_id: data.op_id,
        open_datetime: time,
        open_place: data.place,
    }
    const res = await fetch(
        `${apiUrl}/OpenBidding/updateDateTime.php`,
        {
            method: "POST",
            body: JSON.stringify(prepare),
            credentials: import.meta.env.DEV ? "include" : "same-origin"
        }
    );
    const resJson = await res.json();
    return resJson;
}

const UpdateCommitteePasscode = async (open_id: string) => {
    const res = await fetch(
        `${apiUrl}/biddingVerify/sendNewPasscode.php`,
        {
            method: "POST",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
            body: JSON.stringify(
                {
                open_id : open_id
                }
            )
        }
    );
    const resJson = await res.json();
    return resJson;
}

const GetPreviousVendorHistory = async (project_id : string) => {
    const res = await fetch(
        `${apiUrl}/vendorBargain/showHistorySendVendor.php?project_id=${project_id}`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include" : "same-origin",
        }
    )
    const resJson = await res.json();
    return resJson;
}

const CheckCommitteePermission = async (openId : string) => {
    let res = await fetch(
        `${apiUrl}/biddingVerify/checkUserCommittee.php`,
        {
            method: "POST",
            body:JSON.stringify({
                "open_id": openId
            }),
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json()
    return resJson;
}

export {
    CreateOrUpdateBargain,
    GetAllProjectWaitForOpenBidding,
    CreateProjectConsultDate,
    GetAllConsultInDay,
    GetConsultById,
    PasscodeVerify,
    getDetailComment,
    GetCommitteeOfTheProject,
    SecretaryStartProject,
    GetAllProjectOfConsultId,
    GetProjectByOpenIdAndProjectId,
    GetAllVendorProjectBidResultByProjectKey,
    GetAllTopicCommentDirector,
    CreateCommentProjectDirector,
    GetAllProjectWaitFinalCommentByOpenId,
    GetAllCommentProjectByProjectId,
    GetDirectorByOpenId,
    CreateSectatySum,
    CreateSaveToConsult,
    UpdateCommentProjectDirector,
    GetAllProjectBargain,
    GetProjectById,
    GetFinalCommentByProjectId,
    GetAllVendorProjectByProjectId,
    SaveUnSuccessBargain,
    GetAllProjectWaitSend,
    GetAllProjectByOpenId,
    GetAllApproveProject,
    GetAllAnnouceProject,
    GetSummaryCommmentByProjectId,
    GetAllVendorProjectWaitToOfferByProjectId,
    SaveSuccessBargain,
    UpdateProjectConsultDate,
    UpdateCommitteePasscode,
    GetPreviousVendorHistory,
    CheckCommitteePermission
}