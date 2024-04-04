import { useEffect, useState } from "react";
import { DetailProjectInterface } from "../../models/Project/IListWaitProject";
import { DetailProject } from "../../services/ProjectServices";
import { LuFolders } from "react-icons/lu";
import { BsDownload } from "react-icons/bs";
import { showFileOnClick } from "../../services/utilitity";

export default function ProjectConType() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [key] = useState<string>(queryParameters.get("key") || "");
  const [detailProject, setdetailProject] = useState<DetailProjectInterface>();
  const getDetailProject = async (key: string) => {
    let res = await DetailProject(key);
    console.log(res.data);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setdetailProject(() => res.data);
  };
  

  useEffect(() => {
    console.log("test");
    getDetailProject(key || "");
  }, []);

  return (
    <div className=' xl:border p-2 w-11/12 bg-[#2B3467] rounded-xl mx-auto '>
      <div className='flex xl:flex-row flex-col p-2 w-full justify-center  bg-[#2B3467]rounded-xl'>
        <div className='bg-[#2B3467] text-white flex justify-center items-center flex-col p-4 rounded-xl xl:rounded-r-none xl:rounded-l-xl w-full xl:w-1/3'>
          <LuFolders className="text-9xl " />
          <p className='text-3xl text-center'>ตรวจสอบการ <br /> รับสมัคร</p>
        </div>
        {/* ชื่อโครงการ */}
        <div className='border p-4 box-border w-full rounded-r-xl bg-white'>
          <form className='flex flex-col gap-3'>
            <div className="bg-[#2B3467] pt-4 pb-8 text-white rounded-r-xl">
              <div className="text-[#ffffff] text-xl font-bold basis-1/2 text-right  ">
                <label className=" font-normal pr-4">
              เลขที่เอกสาร : {detailProject?.key}
              </label>
              </div>
            
            <label className="text-4xl font-bold pl-16">
              <b>โครงการ :</b> {detailProject?.name}{" "}
              </label>
          </div> 

            <div className='flex flex-col box-content md:flex-row gap-2 w-full'>
              
              
            <div className="px-6 py-3 flex flex-col ">
            <div className="grid grid-cols-11">
              <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-3">
                  <p >ประเภทงาน</p>
              </label>
              <label className="text-[#2B3467] text-2xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-7">
                  <p className="inline"> {detailProject?.job_type_name}</p>
              </label>
            </div>
            <div className="grid grid-cols-11">
              <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-3">
                  <p >สังกัด</p>
              </label>
              <label className="text-[#2B3467] text-2xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-7">
                  <p className="inline"> {detailProject?.department_name}/{detailProject?.division_name}/{detailProject?.subsection_name}/{detailProject?.section_name}</p>
              </label>
            </div>
            <div className="grid grid-cols-11">
              <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-3">
                  <p >วันที่เพิ่มโครงการ</p>
              </label>
              <label className="text-[#2B3467] text-2xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-7">
                  <p className="inline">{detailProject?.add_datetime}  </p>
              </label>
            </div>
            <div className="grid grid-cols-11">
              <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-3">
                  <p >ไฟล์แนบ</p>
              </label>
              <label className="text-[#2B3467] text-2xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-7">
              <div className="flex justify-start ">
                                <div>
                                <button
                                  className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-xl text-lg px-2 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                                  onClick={(event) => {
                                      event.preventDefault();
                                      showFileOnClick(detailProject?.Tor_uri || "");
                                  }}
                              >
                                  <BsDownload className="text-2xl w-5 h-5 mr-2" />
                                  TOR
                              </button>
                                    <button
                                        className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-xl text-lg px-6 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                                        onClick={(event) => {
                                          event.preventDefault();
                                            showFileOnClick(detailProject?.Job_description_uri || "")
                                        }}>
                                        <BsDownload className="text-2xl w-5 h-5 mr-2" />
                                        ใบแจ้งงาน
                                    </button>
                                </div>
                                <div>
                                </div>
                            </div>
              </label>
            </div>
             
             
            
            </div>
           
         </div>
    
          </form>
        </div>
      </div>
    </div>
  );
}
