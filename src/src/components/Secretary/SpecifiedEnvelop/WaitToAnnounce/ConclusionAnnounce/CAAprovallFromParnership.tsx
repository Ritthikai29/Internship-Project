import { useEffect, useState } from "react";
import { IProjectMdApproval } from "../../../../../models/Secretary/ProjectMdApproval";
import { GetMdApprovalByPid } from "../../../../../services/SecretaryService/SecretaryCommentService";
import { dateWithTimeFormatter } from "../../../../../services/utilitity";

export default function CAApprovalFromPartnership() {
    const queryParameters = new URLSearchParams(window.location.search);
    const [pid] = useState<string>(queryParameters.get("pid") || "");

    const [mdApproval, setMdApproval] = useState<IProjectMdApproval>();

    const getMdApprovalByPid = async (pid: string) => {
        let res = await GetMdApprovalByPid(pid);
        console.log(res);
    
        if (res.status !== 200) {
          alert("err");
          return;
        }
        setMdApproval(() => res.data);
      };

      useEffect(() => {
        getMdApprovalByPid(pid)
      }, []);
    return (
        <div>
            <div className=" pb-8 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full mt-5 mr-5">
                    <div className="px-10 py-10 flex flex-col gap-8">
                        <div className="grid grid-cols-5">
                            <p className="text-3xl text-[#2B3467] font-bold col-start-1">สถานะการอนุมัติ :</p>
                            {/* <p className="text-3xl text-[#0AB926] font-bold col-start-2 col-end-5">: {mdApproval?.is_approve === 1 ? 'อนุมัติ': 'ไม่อนุมัติ'} </p> */}
                            {mdApproval?.is_approve === "1" ? (
                                <p className="text-3xl text-[#2FAC10] font-bold col-start-2 col-end-5">
                                    ได้รับการอนุมัติแล้ว
                                </p>
                                ) : (
                                <p className="text-3xl text-[#ec7332] font-bold col-start-2 col-end-5">
                                    ไม่อนุมัติ
                                </p>
                                )}
                        </div>
                        <div className="grid grid-cols-4 text-2xl text-[#373C38] ">
                            <p className="col-start-2">{mdApproval?.nametitle_t } {mdApproval?.firstname_t } {mdApproval?.lastname_t }</p>
                            <p>{mdApproval?.position}</p>
                            <p>{dateWithTimeFormatter(mdApproval?.approve_datetime)}</p>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}