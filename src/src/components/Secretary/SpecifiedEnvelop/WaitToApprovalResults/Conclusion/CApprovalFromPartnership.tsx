import { useEffect, useState } from "react";

import { DetailProjectSecretary } from "../../../../../services/ProjectServices";
import { DetailProjectInterface } from "../../../../../models/Project/IListWaitProject";

import WTAConclusion from "../../WaitToAnnounce/WTAConclusion";


export default function CApprovalFromPartnership() {
    const queryParameters = new URLSearchParams(window.location.search);
    const [key] = useState<string>(queryParameters.get("key") || "");

    const [detailProject, setdetailProject] = useState<DetailProjectInterface>();

    const getDetailProject = async (key: string) => {
        let res = await DetailProjectSecretary(key);
        console.log(res);
    
        if (res.status !== 200) {
          alert("err");
          return;
        }
        setdetailProject(() => res.data);
      };

      useEffect(() => {
        getDetailProject(key);
      }, []);

    return (
        <div>
            <div className="w-full pb-4 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full mt-5 mr-5">
                    <div className="px-10 py-10 flex flex-row gap-10">
                        <p className="text-3xl text-[#2B3467] font-bold">การอนุมัติจาก กจก</p>
                        <p className="text-3xl text-[#2B3467] font-bold"> : </p>
                        <p className="text-3xl text-[#DDB010] font-bold">{detailProject?.status_name}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}