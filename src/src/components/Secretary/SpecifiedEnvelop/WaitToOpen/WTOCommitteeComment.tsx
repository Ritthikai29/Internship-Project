import { useNavigate } from "react-router-dom";
import img from "../../../../assets/Secretary/folder.png";

import { BsDownload } from "react-icons/bs";
// import CCPriceList from "./CommitteeComment/CCPriceList";
import CAPPriceList from "./CompareAveragePrices/CAPPriceList";
import CCComment from "./CommitteeComment/CCComment";
import CCSummaryBiddingResults from "./CommitteeComment/CCSummaryBiddingResults";
import { createContext, useContext, useEffect, useState } from "react";
import {
  IProject,
  ISecretarySave,
  IVendorProject,
} from "../../../../models/Secretary/IProjectSecretary";
import {
  CreateSaveToConsult,
  CreateSectatySum,
  GetAllVendorProjectBidResultByProjectKey,
  GetDirectorByOpenId,
  GetProjectByOpenIdAndProjectId,
} from "../../../../services/SecretaryService/HttpClientService";
import {
  dateWithTimeFormatter,
  showFileOnClick,
} from "../../../../services/utilitity";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import { GetAllProjectOfConsultId } from "../../../../services/SecretaryService/HttpClientService";
import PageLoad from "../../../PreLoadAndEtc/PageLoader";
import { GetProjectPriceProcess } from "../../../../services/ProjectService/ProjectService";
import CAPProjectName from "./CompareAveragePrices/CAPProjectName";


// context for send data to backend
export interface secretarySumContent {
  secretarySum: Partial<ISecretarySave>;
  setSecretarySum: React.Dispatch<
    React.SetStateAction<Partial<ISecretarySave>>
  >;
  isSuccess: boolean;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const secretarySumContext = createContext<secretarySumContent>({
  secretarySum: {},
  setSecretarySum: () => {},
  isSuccess: false,
  setIsSuccess: () => {},
});

export const useSecretarySumContext = () => useContext(secretarySumContext);

export default function WTOCommitteeComment() {
  interface ProjectInterface {
    id?: number;
    key: string;
    name: string;
    division_name: string;
    is_have: boolean;
  }

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const queryParameters = new URLSearchParams(window.location.search);
  const mySwal = withReactContent(Swal);
  const [openId] = useState<string>(queryParameters.get("open_id") || "");
  const [projectId] = useState<string>(queryParameters.get("project_id") || "");

  const [project, setProject] = useState<IProject>();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [listVendors, setListVendors] = useState<IVendorProject[]>([]);

  const [listProject, setListProject] = useState<ProjectInterface[]>([]);

  const [showPrice, setShowPrice] = useState<any>();

  const [secretarySum, setSecretarySum] = useState<Partial<ISecretarySave>>({
    project_id: projectId,
    open_id: openId,
    passcode: localStorage.getItem("passcode") || "",
  });

  const getProjectPriceProcessByProjectId = async () => {
    const res = await GetProjectPriceProcess(projectId);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    console.log(res.data)
    setShowPrice(res);
  };

  const getProjectByOpenIdAndProjectId = async () => {
    const res = await GetProjectByOpenIdAndProjectId(openId, projectId);
    if (res.status !== 200) {
      alert(res.err);
    }
    setProject(res.data);
    await getAllVendorResultByProjectId(res.data.key);
  };

  const getAllVendorResultByProjectId = async (key: string) => {
    const res = await GetAllVendorProjectBidResultByProjectKey(key);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    setListVendors(res.data);
  };

  const GetAllProject = async () => {
    const res = await GetAllProjectOfConsultId(openId);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    setListProject(res.data);
  };

  const handleSuccessBtn = async () => {
    console.log(secretarySum);
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
          const res = await CreateSectatySum(secretarySum as ISecretarySave);
          if (res.status !== 200) {
            mySwal.showValidationMessage(res.err);
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
                if (listProject.length === 1) {
                    navigate("/secretary/waittomanage", {
                        state: {
                            project_set: "specifiedenvelope",
                            open_bid: "waittoopen",
                        },
                    });
                } else {
                    navigate(`/secretary/specifiedevenelope/wto/selectjobstoopen?open_id=${openId}`);
                }
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

  const handleSubmitSave = async () => {
    mySwal
      .fire({
        title: <p className="text-4xl">ยืนยันการบันทึกเพื่อเจรจา</p>,
        html: (
          <div className="p-4">
            <p className="text-2xl text-red-500">
              หากท่านยืนยันแล้ว <br />
              ระบบจะไม่สามารถแก้ไขได้
            </p>
          </div>
        ),
        showCancelButton: true,
        confirmButtonText: <p className="text-2xl">ยืนยัน</p>,
        confirmButtonColor: "#EB455F",
        cancelButtonText: <p className="text-2xl">ยกเลิก</p>,
        preConfirm: async () => {         
          const res = await CreateSaveToConsult(secretarySum as ISecretarySave);
          if (res.status !== 200) {
            mySwal.showValidationMessage(res.err);
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
              if (listProject.length == 1) {
                navigate("/secretary/waittomanage", {
                    state: {
                        project_set: "specifiedenvelope",
                        open_bid: "waittoopen",
                    },
                });
              } else {
                navigate(
                  `/secretary/specifiedevenelope/wto/selectjobstoopen?open_id=${openId}`
                );
              }
            });
        }
      });
  };

  useEffect(() => {
    document.title = "สรุปผลการประกวดราคา";
    const fetchData = async () => {
      try {
        await getProjectByOpenIdAndProjectId();
        await GetAllProject();
        getProjectPriceProcessByProjectId();
        setLoading(false);
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);

  return (
    <secretarySumContext.Provider
      value={{
        secretarySum: secretarySum,
        setSecretarySum: setSecretarySum,
        isSuccess,
        setIsSuccess,
      }}
    >
      
      {loading ? (
        <PageLoad />
      ) : (
        <>
      
      <div className="px-[2rem] py-6 rounded-2xl">
      <div className="pb-4">
            {<CAPProjectName project={project as IProject} />}
          </div>
      {<CAPPriceList vendor={listVendors} project={project as IProject} />}
      {<CCComment />}
      {<CCSummaryBiddingResults />}
      <div className="w-full pb-8 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="px-24 py-14 flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-20">
              <button
                className="px-8 py-2.5 rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl col-start-1 text-center"
                onClick={handleSubmitSave}
              >
                บันทึกข้อมูลเพื่อเจรจาต่อรอง
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
      </div>
      </div>
      

      </>
      )}
    </secretarySumContext.Provider>
  );
}
