import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../../../assets/Secretary/folder.png";
import { BiSolidLeftArrow } from "react-icons/bi";

import { DetailProjectSecretary } from "../../../../services/ProjectServices";
import { DetailProjectInterface } from "../../../../models/Project/IListWaitProject";

import { BsDownload } from "react-icons/bs";
import CComment from "./Conclusion/CComment";
import CPriceList from "./Conclusion/CPriceList";
import CSummaryBiddingResults from "./Conclusion/CSummaryBiddingResults";
import CApprovalFromPartnership from "./Conclusion/CApprovalFromPartnership";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import { dateWithTimeFormatter } from "../../../../services/utilitity";

import { showFileOnClick } from "../../../../services/utilitity";

import { GetAllVendorProjectBidResultByProjectKey } from "../../../../services/SecretaryService/HttpClientService";

import { GetProjectPriceProcess } from "../../../../services/ProjectService/ProjectService";

import { IProject, IVendorProject } from "../../../../models/Secretary/IProjectSecretary";
import PageLoad from "../../../PreLoadAndEtc/PageLoader";
import CAPProjectName from "../WaitToOpen/CompareAveragePrices/CAPProjectName";
import { LuFolders } from "react-icons/lu";

export default function WTARConclusion() {
  const navigate = useNavigate();
  const mySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(true);
  const queryParameters = new URLSearchParams(window.location.search);
  const [key] = useState<string>(queryParameters.get("key") || "");
  const [project, setProject] = useState<IProject>();
  const [detailProject, setdetailProject] = useState<DetailProjectInterface>();
  const [listVendor, setListVendor] = useState<IVendorProject[]>([]);
  const [showPrice, setShowPrice] = useState<any>();

  const getDetailProject = async (key: string) => {
    const res = await DetailProjectSecretary(key);
    console.log(res);

    if (res.status !== 200) {
      alert("err");
      return;
    }
    setdetailProject(() => res.data);
    console.log(res.data)
    getProjectPriceProcessByProjectId(res.data.id);
  };

  const getAllVendorPrice = async (projectKey: string) => {
    const res = await GetAllVendorProjectBidResultByProjectKey(projectKey);
    setListVendor(res.data);
  };

  const getProjectPriceProcessByProjectId = async (projectId: string) => {
    const res = await GetProjectPriceProcess(projectId);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    console.log(res.data);
    setShowPrice(res);
  };

  const handleDownloadClick = () => {
    mySwal.fire({
      html: (
        <div className="bg-[#ffffff] p-10 rounded-lg">
          <p className="mb-2 text-xl">
            โปรดทราบ ไฟล์แนบรายละเอียดกลางนี้
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
              onClick={handleConfirm}
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
    showFileOnClick(detailProject?.calculate_uri || "");
  };

  const handleCancel = () => {
    mySwal.close();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllVendorPrice(key);
        await getDetailProject(key);
        setLoading(false);
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [key]);

  return (
    <div>
      {loading ? (
        <PageLoad />
      ) : (
        <>
          <div className=" px-[2rem]">  
            <div className="mt-5 xl:border  bg-[#2B3467] rounded-xl mx-auto p-2">
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
                เลขที่เอกสาร : {detailProject?.key}
              </label>
            </div>
            <label className="text-3xl font-bold pl-5">
              <b>โครงการ :</b> {detailProject?.name}
            </label>
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
                  <p className="inline"> {detailProject?.division_name} / {detailProject?.department_name} / {detailProject?.SECTION} / {detailProject?.SUBSECTION}</p>
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
                  <p className="inline"> {dateWithTimeFormatter(detailProject?.add_datetime as string)}{" "}น. </p>
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
                    {detailProject?.project_unit_price}
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
                {detailProject?.price != null ?
                  new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(detailProject?.price) :
                  'N/A'
                }{" "}
              </span>
              {detailProject?.project_unit_price}
                </p>
              </label>
          </div>


          </div>

        </div>
      </div>
    </div>
  </div>
          </div>
          
          {
            <CPriceList
              vendor={listVendor}
              project={detailProject as DetailProjectInterface}
            />
          }
          <div className="px-[2rem]">
             {<CComment />}
             {<CSummaryBiddingResults />}
             {<CApprovalFromPartnership />}
          </div>
         
          
          <div className="flex items-center justify-center">
            <button
              className="my-6 px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
              onClick={() =>
                navigate("/secretary/waittomanage", {
                  state: {
                    project_set: "specifiedenvelope",
                    open_bid: "waittoapprove",
                  },
                })
              }
            >
              <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
              ย้อนกลับ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
