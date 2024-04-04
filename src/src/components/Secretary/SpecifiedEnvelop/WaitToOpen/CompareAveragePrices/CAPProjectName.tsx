import { useEffect, useState } from "react";
import { IProject } from "../../../../../models/Secretary/IProjectSecretary";
import {
  dateWithTimeFormatter,
  showFileOnClick,
} from "../../../../../services/utilitity";
import { GetProjectPriceProcess } from "../../../../../services/ProjectService/ProjectService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LuFolders } from "react-icons/lu";

export default function CAPProjectName(project: {
  project: IProject | undefined;
}) {
  const [showPrice, setShowPrice] = useState<any>();
  const queryParameters = new URLSearchParams(window.location.search);
  const [projectId] = useState<string>(queryParameters.get("project_id") || "");
  const MySwal = withReactContent(Swal);
  const getProjectPriceProcessByProjectId = async () => {
    const res = await GetProjectPriceProcess(projectId);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    setShowPrice(res);
  };

  useEffect(() => {
    console.log(project);
    getProjectPriceProcessByProjectId();
  }, []);

  const handleDownloadClick = () => {
    MySwal.fire({
      html: (
        <div className="bg-[#ffffff] p-10 rounded-lg">
          <p className="mb-2 text-xl">
            โปรดทราบ ไฟล์แนบรายละเอียดราคากลางนี้
            เป็นไฟล์แนบเบื้องต้นจากผู้คำนวณเท่านั้น{" "}
          </p>
          <p className="mb-8 text-xl">
            {" "}
            อาจมีการแก้ไขจากผู้อนุมัติ
            โดยราคากลางจากไฟล์แนบอาจไม่ตรงกับราคาที่แสดง
          </p>

          <div className="flex justify-center">
            <button
              className="bg-[#2B3467] hover:bg-[#161b37] text-white text-xl font-bold py-3 px-5 mr-5 rounded"
              onClick={() => {
                handleConfirm();
                MySwal.close(); // Close the popup after opening the file
              }}
            >
              เปิดไฟล์
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-3 px-8 ml-5 rounded"
              onClick={handleCancel}
            >
              ปิด
            </button>
          </div>
        </div>
      ),
      showConfirmButton: false, // Hide the default OK button
    });
  };

  const handleConfirm = () => {
    showFileOnClick(project.project?.calculate_uri as string);
  };

  const handleCancel = () => {
    MySwal.close();
  };
  return (
   <div className="">
  <div className="mt-5 xl:border py-2 w-full bg-[#2B3467] rounded-xl mx-auto">
    <div className="flex xl:flex-row flex-col w-full justify-center bg-[#2B3467] rounded-xl">
      <div className="bg-[#2B3467] text-white flex justify-center items-center flex-col p-4 rounded-xl xl:rounded-r-none xl:rounded-l-xl w-full xl:w-1/3">
        <LuFolders className="text-9xl" />
        <p className="text-3xl text-center">
          สรุปผล <br /> การประกวด
        </p>
      </div>
      <div className="bg-white drop-shadow-lg rounded-r-lg border my-2 mr-5 w-full mx-auto">
        <div className="px-2 pt-2 pb-2 gap-2">

          <div className="bg-[#2B3467] pt-4 pb-4 text-white rounded-r-xl ml-4">
            <div className="text-[#ffffff] text-xl font-bold basis-1/2 text-right  ">
              <label className=" font-normal pr-4">
                เลขที่เอกสาร : {project.project?.key}
              </label>
            </div>
            <div className="grid grid-cols-11">
              <label className="text-[#ffffff] text-3xl font-bold pb-2  pl-5 col-span-2">
                  <p >โครงการ </p>
              </label>
              <label className="text-[#ffffff] text-3xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#ffffff] text-3xl font-bold pb-2 col-span-7">
                  <p className="inline"> {project.project?.name}</p>
              </label>
          </div>
            {/* <label className="text-3xl font-bold pl-5">
              <b>โครงการ :</b> {project.project?.name}
            </label> */}
          </div>
          <div className="px-6 py-6 flex flex-col">
                <div className="grid grid-cols-11">
              <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-3">
                  <p >สังกัด</p>
              </label>
              <label className="text-[#2B3467] text-xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-7">
                  <p className="inline"> {project.project?.division_name} / {project.project?.department_name} / {project.project?.SECTION} / {project.project?.SUBSECTION}</p>
              </label>
          </div>

          <div className="grid grid-cols-11">
            <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-3">
              วันที่เพิ่มโครงการ 
            </label>
            <label className="text-[#2B3467] text-xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-7">
                  <p className="inline"> {dateWithTimeFormatter(project.project?.add_datetime as string)}{" "}น. </p>
              </label>
          </div>

          <div className="grid grid-cols-11">
            <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-3">
            ไฟล์แนบผู้คำนวณ 
            </label>
            <label className="text-[#2B3467] text-xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#2B3467] text-xl font-medium pb-2 col-span-7">
              <button
                  className="  rounded-lg bg-[#2B3467] text-white text-lg  px-4 "
                  onClick={handleDownloadClick}
                >
                  ดาวโหลด
                </button>
              </label>
          </div>
          <div className="grid grid-cols-11">
            <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-3">
            ราคากลางจากผู้คำนวณ 
            </label>
            <label className="text-[#2B3467] text-xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-7">
                  <p className="inline"> <span className=" font-bold col-start-3 col-end-5 text-[#2B3467]">
                  {showPrice != null && showPrice.cal?.CAL_price != null
                    ? Number(showPrice.cal.CAL_price).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                      }
                    )
                    : "ไม่ได้ระบุราคาในระบบ"}
                </span>{" "}
                {showPrice != null && showPrice.cal?.CAL_price != null && (
                  <span className="col-start-5 text-center text-[#2B3467] font-bold">
                    {project.project?.project_unit_price}
                  </span>
                )}</p>
              </label>
          </div>

          <div className="grid grid-cols-11">
            <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-3">
            ราคากลางที่อนุมัติ  
            </label>
            <label className="text-[#2B3467] text-xl text-center font-bold pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-7">
                  <p className="inline"><span className="text-xl font-bold  text-[#c03cfe] ">
                {" "}
                {project.project?.price != null ?
                  new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(project.project.price) :
                  'N/A'
                }{" "}
              </span>
              {project.project?.project_unit_price}
                </p>
              </label>
          </div>


          </div>

        </div>
      </div>
    </div>
  </div>
</div>
  );
}
