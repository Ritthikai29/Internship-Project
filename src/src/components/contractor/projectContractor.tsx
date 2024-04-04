import { BsDownload } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "./ProjectContext";



export default function ProjectContractor() {
    const detailProject = useContext(ProjectContext)
    const showFileOnClick = (filePath: string) => {
        window.open((import.meta.env.DEV ? import.meta.env.VITE_URL_DEV : import.meta.env.VITE_URL_PRODUCTION) + filePath);
    }
    const formatDate = (inputDate: string) => {
        const months = [
            "ม.ค.",
            "ก.พ.",
            "มี.ค.",
            "เม.ย.",
            "พ.ค.",
            "มิ.ย.",
            "ก.ค.",
            "ส.ค.",
            "ก.ย.",
            "ต.ค.",
            "พ.ย.",
            "ธ.ค.",
        ];
    
        const dateParts = inputDate.split("/");
        const day = parseInt(dateParts[0], 10);
        const monthIndex = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10) + 543;
    
        return `${day} ${months[monthIndex]} ${year}`;
    };
    const formattedDate = detailProject?.add_datetime ? formatDate(detailProject.add_datetime) : "";
    useEffect(() => {
        console.log(111)
        console.log(detailProject)
    }, []);

    //const firstKey = detailProject.length > 0 ? detailProject[0].key : '';
    return (
        <div className="bg-[#F5F5F5]">
            {/* container */}
            <div className="px-[2rem] pt-12 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="bg-[#1D5182] pt-3 pb-8 text-white rounded-t-xl">
                        <p className="text-lg text-end pr-4"><b>เลขที่เอกสาร :</b> {detailProject?.key/*?มีไหมกัน undefine*/}</p>
                        <div className="grid grid-cols-11">
                    <label className="text-4xl font-bold pl-16 pb-2 col-span-2">
                      <p>โครงการ :</p>
                    </label>
                    <label className="text-4xl font-bold text-left pb-2 col-span-7 ">
                      <p className="inline"> {detailProject?.name}</p>
                    </label>
                  </div>
                        {/* <label className="text-4xl font-bold pl-16"><b>โครงการ :</b> {detailProject?.name} </label> */}
                    </div>
                    <div className="px-32 py-6 flex flex-col gap-4">
                    <div className="grid grid-cols-11">
                    <label className="text-[#2B3467] text-2xl font-bold basis-1/2 col-span-2">
                      <p>สังกัด </p>
                    </label>
                    <label className="text-[#2B3467] text-2xl font-bold basis-1/2 col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-[#2B3467] text-2xl font-bold basis-1/2 col-span-7 pr-5">
                      <p className="inline"> {detailProject?.department_name} / {detailProject?.division_name} / {detailProject?.section_name} / {detailProject?.subsection_name}</p>
                    </label>
                  </div> 
                  <div className="grid grid-cols-11">
                    <label className="text-[#2B3467] text-2xl font-bold basis-1/2 col-span-2">
                      <p>วันที่เพิ่มโครงการ </p>
                    </label>
                    <label className="text-[#2B3467] text-2xl font-bold basis-1/2 col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-[#2B3467] text-2xl font-bold basis-1/2 col-span-7 pr-5">
                      <p className="inline"> {formattedDate}</p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-[#2B3467] text-2xl font-bold basis-1/2 col-span-2">
                      <p>ไฟล์แนบ </p>
                    </label>
                    <label className="text-[#2B3467] text-2xl font-bold basis-1/2 col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-[#2B3467] text-2xl font-bold basis-1/2 col-span-7 pr-5">
                            <button className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-lg text-2xl px-6 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2"
                                onClick={() => {
                                    showFileOnClick(detailProject?.Job_description_uri || "")
                                }}>
                                <BsDownload className="text-xl w-5 h-5 mr-2" />
                                ใบแจ้งงาน
                            </button>
                            <button className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-lg text-2xl px-2 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2"
                                onClick={() => {
                                    showFileOnClick(detailProject?.Tor_uri || "")
                                }}>
                                <BsDownload className="text-xl w-5 h-5 mr-2" />
                                TOR
                            </button>
                    </label>
                  </div>
                        
                        {/* <div className="flex flex-row items-center">
                            <label className="mr-5 text-[#2B3467] text-2xl font-bold">ไฟล์แนบ :</label>
                            <button className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-lg text-2xl px-6 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2"
                                onClick={() => {
                                    showFileOnClick(detailProject?.Job_description_uri || "")
                                }}>
                                <BsDownload className="text-xl w-5 h-5 mr-2" />
                                ใบแจ้งงาน
                            </button>
                            <button className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-lg text-2xl px-2 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2"
                                onClick={() => {
                                    showFileOnClick(detailProject?.Tor_uri || "")
                                }}>
                                <BsDownload className="text-xl w-5 h-5 mr-2" />
                                TOR
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>

        </div>
    )
}