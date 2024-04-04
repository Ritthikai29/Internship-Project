import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import img from "../../assets/Secretary/folder.png";
import { DetailProject } from "../../services/ProjectServices";
import { DetailProjectInterface } from "../../models/Project/IListWaitProject";

import { BsDownload } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi";
import CommitteePriceList from "../../components/Committee/CommitteeManagementHistory/SummaryContestResults/CommitteePriceList";
import CommitteeComment from "../../components/Committee/CommitteeManagementHistory/SummaryContestResults/CommitteeComment";

import { GetVendorResultPriceCompare } from "../../services/SecretaryService/ComparisionService";

import { ProjectInterface } from "../../models/Secretary/CompareInterface";

export default function CommitteeSummaryContestResults() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [key] = useState<string>(queryParameters.get("key") || "");

  const navigate = useNavigate();

  const [detailProject, setdetailProject] = useState<DetailProjectInterface>();
  const [infoProject, setProjectInfo] = useState<ProjectInterface>();

  const getDetailProject = async (key: string) => {
    let res = await DetailProject(key);

    if (res.status !== 200) {
      alert("err");
      return;
    }
    setdetailProject(() => res.data);
  };

  const getInfoCompare = async (key: string) => {
    let res = await GetVendorResultPriceCompare(key);
    console.log(res.result);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setProjectInfo(() => res.project);
  };

  const showFileOnClick = (filePath: string) => {
    window.open(
      (import.meta.env.DEV
        ? import.meta.env.VITE_URL_DEV
        : import.meta.env.VITE_URL_PRODUCTION) + filePath
    );
  };

  useEffect(() => {
    getDetailProject(key);
    getInfoCompare(key);
  }, []);

  return (
    <div>
      <div className=" flex flex-row ">
        <div className="flex flex-col basis-2/8 bg-[#2B3467] py-10 px-24 ">
          <div className="flex justify-center">
            <img className=" fill-white" src={img}></img>
          </div>
          <h1 className="text-white font-bold text-3xl text-center">
            สรุปผลการประกวด
          </h1>
        </div>
        <div className=" flex-col  w-full pb-6 ">
          <div className="bg-[#1D5182] text-white font-bold text-4xl pl-28 py-5 ">
            <div className=" ">โครงการ : {detailProject?.name} </div>
          </div>
          <div className="flex flex-row w-full bg-white text-[#2B3467] font-bold text-2xl pl-10 py-6 pb-5">
            <div className="pl-10 basis-1/2 text-3xl">
              เลขที่เอกสาร : {detailProject?.key}
            </div>
            <div className=" ">สถานะ : {detailProject?.status_name}</div>
          </div>
          {/* ปุ่มสรุป */}
          <div className="flex flex-row w-full bg-white text-[#2B3467] font-bold text-2xl pl-10 py-5  ">
            <div className="pl-10  basis-1/2">
              วันที่เพิ่ม : {detailProject?.add_datetime}
            </div>
            <button
              className=" text-[#2B3467] bg-white border-4 border-[#2B3467] rounded-lg py-1 pr-3 "
              onClick={() => {
                showFileOnClick(infoProject?.calculate_uri || "");
              }}
            >
              <BsDownload className="inline-flex ml-3 mr-2" />{" "}
              รายละเอียดราคากลาง
            </button>
          </div>
        </div>
      </div>
      {<CommitteePriceList />}
      {<CommitteeComment />}
      <div className="px-[8rem] pb-8 rounded-2xl">
        <button
          className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
          onClick={() => navigate("/committee/list-select")}
        >
          <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
}
