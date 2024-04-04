import { useEffect, useState } from 'react'
import { ProjectInterface } from '../../../models/Budget/Approve1/IApprove';
import { GetProjectApproveByKey } from '../../../services/BudgetService/ApproveService';
import { BsDownload } from "react-icons/bs";
import { datetimeFormatter } from '../../../services/utilitity';

export default function ViewApprove2Project() {

    const showFileOnClick = (filePath: string) => {
        window.open((import.meta.env.DEV ? import.meta.env.VITE_URL_DEV : import.meta.env.VITE_URL_PRODUCTION) + filePath);
    }
    const queryParameters = new URLSearchParams(window.location.search);
    const [projectKey] = useState<string>(queryParameters.get("pj") || "");
    const [project, setProject] = useState<ProjectInterface>();
    const dateTimeFormatter = (date: string) => {
        const dateFormat = new Date(date)
        return `${dateFormat.getDate()} / ${dateFormat.getMonth() + 1} / ${dateFormat.getFullYear()}`
    }

    const getProjectByKey = async () => {
        const res = await GetProjectApproveByKey(projectKey);
        setProject(res.data)
    }

    useEffect(() => {
        getProjectByKey()
    }, [])
    return (
        <div className="my-5">
            <div className="flex flex-col justify-center">
                <div className="flex flex-col border px-12 py-12 rounded-2xl bg-white drop-shadow-lg">
                    <h1 className="text-5xl font-bold text-[#2B3467] mb-4 ">{project?.name}</h1>
                    <hr />
                    <div className=" md:grid-cols-2 mb-6 ml-6">
                        <div className="mt-3 grid grid-cols-11">
                    <label className="text-2xl font-bold col-span-2">
                      <p>เลขที่เอกสาร</p>
                    </label>
                    <label className="text-2xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-2xl col-span-7 pr-5">
                      <p className="inline"> 
                      {project?.key}
                      </p>
                    </label>
                  </div>
                  <div className="mt-3 grid grid-cols-11">
                    <label className="text-2xl font-bold col-span-2">
                      <p>สถานะ</p>
                    </label>
                    <label className="text-2xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-2xl col-span-7 pr-5">
                      <p className="inline"> 
                      {project?.status_name}
                      </p>
                    </label>
                  </div>
                  <div className="mt-3 grid grid-cols-11">
                    <label className="text-2xl font-bold col-span-2">
                      <p>วันที่เพิ่ม</p>
                    </label>
                    <label className="text-2xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-2xl col-span-7 pr-5">
                      <p className="inline"> 
                      {datetimeFormatter(project?.add_datetime || "")}
                      </p>
                    </label>
                  </div>
                  </div>

                    <div className="flex flex-col ml-6">
                        <h3 className="text-3xl text-[#575757] font-bold ">ดาวน์โหลดเอกสาร</h3>
                        <div className="flex justify-start mt-5">
                            <div>
                                <button
                                    className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f]  rounded-3xl text-2xl px-2 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                                    onClick={() => {
                                        showFileOnClick(project?.Tor_uri || "")
                                    }}>
                                    <BsDownload className="text-xl w-5 h-5 mr-2" />
                                    TOR</button>
                            </div>
                            <div>
                                <button
                                    className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-3xl text-2xl px-6 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                                    onClick={() => {
                                        showFileOnClick(project?.Job_description_uri || "")
                                    }}>
                                    <BsDownload className="text-xl w-5 h-5 mr-2" />
                                    ใบแจ้งงาน
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
