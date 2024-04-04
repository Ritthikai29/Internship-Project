import { BsDownload } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { DetailProjectInterface } from "../../models/Project/IListWaitProject";
import { DetailProject } from "../../services/ProjectServices";
import { useParams } from "react-router-dom";
import { ProjectContext } from "../contractor/ProjectContext";

export default function ProjectSecretary() {
  const showFileOnClick = (filePath: string) => {
    window.open(
      (import.meta.env.DEV
        ? import.meta.env.VITE_URL_DEV
        : import.meta.env.VITE_URL_PRODUCTION) + filePath
    );
  };

  const { key } = useParams();
  const [detailProject, setdetailProject] = useState<DetailProjectInterface>(); //ไม่เอาแบบมีbuckect <DetailProjectInterface[]>([]) ก็dataมันมีแค่ตัวเดียว
  const getDetailProject = async (key: string) => {
    let res = await DetailProject(key);

    if (res.status !== 200) {
      alert("err");
      return;
    }
    setdetailProject(() => res.data);
  };

  useEffect(() => {
    getDetailProject(key || "");
  }, []);

  return (
    <div className="bg-[#F5F5F5]">
      {/* container */}
      <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
        <div className="bg-[#1D5182] pt-3 pb-8 text-white rounded-xl">
          <p className="text-lg text-end pr-4">
            <b>เลขที่เอกสาร :</b> {detailProject?.key /*?มีไหมกัน undefine*/}
          </p>
          <label className="text-4xl font-bold pl-16">
            <b>โครงการ :</b> {detailProject?.name}{" "}
          </label>
        </div>
        <div className="px-32 py-14 flex flex-col gap-10">
          <div className="flex flex-row">
            <label className="text-[#2B3467] text-2xl font-bold basis-1/2">
              <b>หน่วยงาน :</b> {detailProject?.department_name}
            </label>
            <label className="text-[#2B3467] text-2xl font-bold basis-1/2">
              <b>วันที่เพิ่มโครงการ :</b> {detailProject?.add_datetime}
            </label>
          </div>
          <div className="flex flex-row items-center">
            <label className="mr-5 text-[#2B3467] text-2xl font-bold">
              ไฟล์แนบ :
            </label>
            <button
              className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-lg text-2xl px-6 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2"
              onClick={() => {
                showFileOnClick(detailProject?.Job_description_uri || "");
              }}
            >
              <BsDownload className="text-xl w-5 h-5 mr-2" />
              ใบแจ้งงาน
            </button>
            <button
              className="text-white bg-[#559744] hover:bg-[#3D6D31] border-2 border-[#3D6D31] rounded-lg text-2xl px-2 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2"
              onClick={() => {
                showFileOnClick(detailProject?.Tor_uri || "");
              }}
            >
              <BsDownload className="text-xl w-5 h-5 mr-2" />
              TOR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
