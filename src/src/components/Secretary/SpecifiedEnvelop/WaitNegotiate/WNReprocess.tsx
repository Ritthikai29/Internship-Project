import { useNavigate } from "react-router-dom";
import img from "../../../../assets/Secretary/folder.png";

import { BiSolidLeftArrow } from "react-icons/bi";
import RPComment from "./ReProcess/RPComment";
import RPSummaryBiddingResults from "./ReProcess/RPSummaryBiddingResults";
import { createContext, useContext, useEffect, useState } from "react";
import {
  GetProjectById,
  SaveUnSuccessBargain,
  SaveSuccessBargain,
} from "../../../../services/SecretaryService/HttpClientService";
import {
  dateWithTimeFormatter,
  showFileOnClick,
} from "../../../../services/utilitity";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  IProject,
  IVendorProject,
} from "../../../../models/Secretary/IProjectSecretary";
import { GetAllVendorProjectBidResultByProjectKey } from "../../../../services/SecretaryService/HttpClientService";
import { GetProjectPriceProcess } from "../../../../services/ProjectService/ProjectService";
import CAPPriceList from "../WaitToOpen/CompareAveragePrices/CAPPriceList";
import PageLoad from "../../../PreLoadAndEtc/PageLoader";
import CAPProjectName from "../WaitToOpen/CompareAveragePrices/CAPProjectName";

export interface IWNRprocessContext {
  summary: Partial<ISummary>;
  setSummary: React.Dispatch<React.SetStateAction<Partial<ISummary>>>;
  isSuccess: boolean;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ISummary {
  project_id: string;
  topic_id: string;
  comment: string;
}

const SummaryComtext = createContext<IWNRprocessContext>({
  summary: {},
  setSummary: () => {},
  isSuccess: false,
  setIsSuccess: () => {},
});
export const useIWNRprocessContext = () => useContext(SummaryComtext);

export default function WNReprocess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const mySwal = withReactContent(Swal);
  const queryParameters = new URLSearchParams(window.location.search);
  const [projectId] = useState<string>(queryParameters.get("project_id") || "");
  const [listVendor, setListVendor] = useState<IVendorProject[]>([]);

  const [project, setProject] = useState<IProject | undefined>();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [summary, setSummary] = useState<Partial<ISummary>>({
    project_id: projectId,
  });
  const [showPrice, setShowPrice] = useState<any>();

  const getProjectById = async () => {
    const res = await GetProjectById(projectId);
    if (res.status !== 200) {
      alert(res.err);
    }
    setProject(res.data);
    console.log(res.data);

    await getAllVendorPrice(res.data.key);
  };

  const getAllVendorPrice = async (projectKey: string) => {
    const res = await GetAllVendorProjectBidResultByProjectKey(projectKey);
    console.log(5566)
    console.log(res)
    setListVendor(res.data);
  };

  const getProjectPriceProcessByProjectId = async () => {
    const res = await GetProjectPriceProcess(projectId);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    console.log(res.data)
    setShowPrice(res);
  };

  const handleUnSuccess = async () => {
    mySwal
      .fire({
        title: <p className="text-4xl">ยืนยันการบันทึกเพื่อเจรจา</p>,
        html: (
          <div className="p-4">
            <p className="text-2xl text-red-500">
              หากท่านยืนยันการบันทึกเพื่อเจรจาแล้ว <br />
              ระบบจะไม่สามารถแก้ไขได้
            </p>
          </div>
        ),
        showCancelButton: true,
        confirmButtonText: <p className="text-2xl">ยืนยัน</p>,
        confirmButtonColor: "#EB455F",
        cancelButtonText: <p className="text-2xl">ยกเลิก</p>,
        preConfirm: async () => {
          const res = await SaveUnSuccessBargain(summary as ISummary);
          if (res.status !== 200) {
            if(res.err === "ไม่พบข้อมูล topic id"){
              mySwal.showValidationMessage('โปรดเลือกสรุปผลความคิดเห็น');
            }else if(res.err === "ไม่พบข้อมูล comment"){
              mySwal.showValidationMessage('โปรดระบุความคิดเห็นเพิ่มเติม');
            }else{
              mySwal.showValidationMessage(res.err);
            }
          }
          return res.data;
        },
      })
      .then((response) => {
        if (response.isConfirmed) {
          mySwal
            .fire({
              title: (
                <h3 className="text-4xl text-green-500">ดำเนินการสำเร็จ</h3>
              ),
              icon: "success",
              confirmButtonText: <p className="text-2xl">ยืนยัน</p>,
            })
            .then(() => {
              navigate("/secretary/waittomanage", {
                state: {
                  project_set: "specifiedenvelope",
                  open_bid: "waitnegotiate",
                },
              });
            });
        }
      });
  };

  const handleSuccessBtn = async () => {
    mySwal
      .fire({
        title: <p className="text-4xl">ยืนยันการเสนออนุมัติ</p>,
        html: (
          <div className="p-4">
            <p className="text-red-500 text-2xl">
              หากท่านยืนยันการเสนออนุมัติขั้นสุดท้ายแล้ว <br />
              ระบบจะไม่สามารถแก้ไขได้
            </p>
          </div>
        ),
        showCancelButton: true,
        confirmButtonText: <p className="text-2xl">ยืนยัน</p>,
        confirmButtonColor: "#EB455F",
        cancelButtonText: <p className="text-2xl">ยกเลิก</p>,
        preConfirm: async () => {
          const res = await SaveSuccessBargain(summary as ISummary);
          if (res.status !== 200) {
            if(res.err === "ไม่พบข้อมูล topic id"){
              mySwal.showValidationMessage('โปรดเลือกสรุปผลความคิดเห็น');
            }else if(res.err === "ไม่พบข้อมูล comment"){
              mySwal.showValidationMessage('โปรดระบุความคิดเห็นเพิ่มเติม');
            }else{
              mySwal.showValidationMessage(res.err);
            }
          }
          return res.data;
        },
      })
      .then((response) => {
        if (response.isConfirmed) {
          if (response.isConfirmed) {
            mySwal
              .fire({
                title: (
                  <h3 className="text-4xl text-green-500">ดำเนินการสำเร็จ</h3>
                ),
                icon: "success",
                confirmButtonText: <p className="text-2xl">ยืนยัน</p>,
              })
              .then(() => {
                navigate("/secretary/waittomanage", {
                  state: {
                    project_set: "specifiedenvelope",
                    open_bid: "waitnegotiate",
                  },
                });
              });
          }
        }
      });
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
    
    showFileOnClick(project?.calculate_uri || "");
  };

  const handleCancel = () => {
    mySwal.close();
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProjectById();
        getProjectPriceProcessByProjectId();
        setLoading(false);
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  return (
    <SummaryComtext.Provider
      value={{
        summary,
        setSummary,
        isSuccess,
        setIsSuccess,
      }}
    >
      <div>
        {loading ? (
          <PageLoad />
        ) : (
          <>
           <div className="w-11/12 mx-auto">
          {<CAPProjectName project={project as IProject} />}
          </div>
            <div className="w-11/12 mx-auto py-6 rounded-2xl">
            
              {
                <CAPPriceList
                  vendor={listVendor}
                  project={project as IProject}
                />
              }
            </div>
            <div className=" pb-5 rounded-4xl w-11/12 mx-auto">
            {<RPComment />} 
            </div>
            <div className=" pb-5 rounded-4xl w-11/12 mx-auto">
            {<RPSummaryBiddingResults />}
            </div>
            
            <div className="w-11/12 mx-auto pb-8 rounded-2xl">
              <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                <div className="px-24 py-14 flex flex-col gap-8">
                  <p className="text-2xl font-bold">การดำเนินการต่อ</p>
                  <div className="grid grid-cols-2 gap-20">
                    <button
                      className="px-8 py-2.5 rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl col-start-1 text-center"
                      onClick={handleUnSuccess}
                    >
                      บันทึกข้อมูลเพื่อเจรจา
                    </button>
                    {isSuccess && (
                      <button
                        className="px-8 py-2.5 rounded-lg bg-[#559744] drop-shadow-lg text-white text-2xl col-start-2 text-center"
                        onClick={handleSuccessBtn}
                      >
                        ประกวดแล้วเสร็จ เสนออนุมัติขั้นสุดท้าย
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
                onClick={() =>
                  navigate("/secretary/waittomanage", {
                    state: {
                      project_set: "specifiedenvelope",
                      open_bid: "waitnegotiate",
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
    </SummaryComtext.Provider>
  );
}
