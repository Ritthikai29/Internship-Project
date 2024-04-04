import { useContext, useEffect, useState } from "react";
import {
  projectsetting,
  ProjectSettingInfo,
} from "../../models/ProjectSetting/IProjectSetting";
import { getProjectSettingByKey } from "../../services/ProjectSettingService";

import { ProjectContext } from "./ProjectContext";
import { uselengthlistContext } from "../../pages/contractor/AllProjectParticipants";
import CurrencyInput from "react-currency-input-field";
import { apiUrl } from "../../services/utilitity";
import { showFileOnClick } from "../../services/utilitity";
import { SendApproveProject } from "../../services/ContractorService/SendApproveSetting";
import { useNavigate } from "react-router-dom";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

interface EmployeeOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export default function SetUpProjectWaitSend() {
  // ปุ่มสรุปข้อมูล
  const queryParameters = new URLSearchParams(window.location.search);
  const projectKey = queryParameters.get("key") || "";

  const navigate = useNavigate();

  const detailProject = useContext(ProjectContext);
  const { job_type, setjob_type } = uselengthlistContext();

  const [projectsetting, setprojectsetting] = useState<Partial<projectsetting>>(
    {
      project_id: detailProject?.id,
      job_type: job_type,
    }
  );
  const [infoProjectSetting, setInfoProjectSetting] = useState<ProjectSettingInfo>();

  const handleOnClick = () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <p className="text-[#2B3467] text-4xl">ยืนยันการดำเนินการ</p>,
      confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>,
      icon: "question",
      confirmButtonColor: "#EB455F",
      showCancelButton: true,
      cancelButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>,
      cancelButtonColor: "#979797",
      preConfirm: async () => {
        const id = String(detailProject?.id);
        const res = await SendApproveProject(id);
        if (res.status !== 200) {
          MySwal.showValidationMessage(res.err);
        }
        return res;
      },
    }).then((data) => {
      if (data.isConfirmed) {
        MySwal.fire({
          title: <h1 className="text-4xl text-[#4BAE4F]">ดำเนินการสำเร็จ!</h1>,
          icon: "success",
          confirmButtonText: (
            <p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>
          ),
          confirmButtonColor: "#2B3467",
        });
        navigate("/project/waitingtomanaged", {
          state: {
              project_manage: "sending"
          },
      });
      }
    });
  };

  const getSettingInfo = async (key: string) => {
    const res = await getProjectSettingByKey(key);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    console.log(res.data);
    setInfoProjectSetting(() => res.data);
  };

  useEffect(() => {
    setprojectsetting({
      ...projectsetting,
      job_type: job_type,
    });
    getSettingInfo(projectKey);
  }, []);

  return (
    <div>
      <div className="bg-white">
        <div className="bg-[#1D5182] w-full h-[120px] flex items-center">
          <label className="text-3xl text-white px-32">2. ตั้งค่าโครงการ</label>
        </div>

        <div className="px-[8rem] py-12 rounded-2xl">
          <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
            <div className="bg-white drop-shadow-lg rounded-lg border m-10">
              <div className="px-32 py-14 flex flex-col gap-4">
                <label className="text-2xl font-bold">
                  1) กำหนดระยะรับสมัคร
                </label>
                <div className="grid grid-cols-12 items-center">
                  <p className="col-start-1 text-xl text-end text-gray-500 mr-3">
                    เริ่มต้น
                  </p>
                  <input
                    placeholder="เริ่มต้น"
                    className="col-start-2 col-end-5 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                    id="State-date"
                    type="date"
                    pattern="dd-mm-yyyy"
                    name="datetime_start"
                    value={infoProjectSetting?.start_date}
                    disabled={true}
                  ></input>
                  <p className="col-start-5 text-xl text-end text-gray-500 mr-3">
                    สิ้นสุด
                  </p>
                  <input
                    placeholder="สิ้นสุด"
                    className="col-start-6 col-end-9 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                    id="end-date"
                    type="date"
                    pattern="dd-mm-yyyy"
                    name="datetime_end"
                    value={infoProjectSetting?.end_date}
                    disabled={true}
                  ></input>
                  <p className="col-start-9 col-end-11 text-xl text-end text-gray-500 mr-3">
                    เวลาปิดรับสมัคร
                  </p>
                  <input
                    pattern="hh:mm"
                    placeholder="เวลา"
                    className="col-start-11 col-end-13 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                    id="closing-time"
                    type="time"
                    name="time_end"
                    value={infoProjectSetting?.end_time}
                    disabled={true}
                  ></input>
                </div>
                <div>
                  <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                    2) เงินประกันซอง
                  </p>
                  <div className="grid grid-cols-12 items-center">
                    <CurrencyInput
                      placeholder="เงินประกันซอง"
                      className="col-start-1 col-end-4 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                      id="security-money"
                      type="text"
                      name="deposit_money"
                      value={infoProjectSetting?.deposit_money}
                      disabled={true}
                    ></CurrencyInput>
                    <p className="col-start-4 text-2xl text-end text-gray-500 ">
                      บาท
                    </p>
                  </div>
                </div>
                <div>
                  <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                    3) ผู้อนุมัติหนังสือเชิญ
                  </p>
                  <div className="grid grid-cols-12">
                    <div className="col-start-1 col-end-12 rounded-full border">
                      <div className=" border-[#CCCCCC] p-2 pl-6 text-xl">
                        {/* Display text instead of AsyncSelect */}
                        {infoProjectSetting?.approver_info.firstname_t}{" "}
                        {infoProjectSetting?.approver_info.lastname_t} /{" "}
                        {infoProjectSetting?.approver_info.position} /{" "}
                        {infoProjectSetting?.approver_info.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-[#2B2A2A] w-full h-[120px] flex items-center">
        <label className="text-3xl text-white px-32">
          3. รายละเอียดเพิ่มเติมและไฟล์แนบในหนังสือเชิญ
        </label>
      </div>

      <div className="px-[8rem] py-12 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="bg-white drop-shadow-lg rounded-lg border px-32 py-14 flex flex-col gap-5">
            <div>
              <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                1. วันรับฟังคำชี้แจง
              </p>
              <div className="grid grid-cols-12 items-center">
                <p className="col-start-1 text-xl text-center text-gray-500">
                  วันที่
                </p>
                <input
                  placeholder="เริ่มต้น"
                  className="col-start-2 col-end-5 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                  id="State-date"
                  type="date"
                  pattern="dd-mm-yyyy"
                  name="date_details"
                  value={infoProjectSetting?.detail_date}
                  disabled={true}
                ></input>

                <p className="col-start-5 text-xl text-center text-gray-500 ml-6">
                  เวลา
                </p>
                <input
                  pattern="hh:mm"
                  placeholder="เวลา"
                  className="col-start-6 col-end-9 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                  id="closing-time"
                  type="time"
                  name="time_details"
                  value={infoProjectSetting?.detail_time}
                  disabled={true}
                ></input>
              </div>
            </div>
            <div>
              <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                2) ผู้ประสานงานโครงการ{" "}
              </p>
              <div className="grid grid-cols-12">
                <div className="col-start-1 col-end-12 rounded-full border">
                  <div className=" border-[#CCCCCC] p-2 pl-6 text-xl">
                    {/* Display text instead of AsyncSelect */}
                    {infoProjectSetting?.coordinator_info.firstname_t}{" "}
                    {infoProjectSetting?.coordinator_info.lastname_t} /{" "}
                    {infoProjectSetting?.coordinator_info.position} /{" "}
                    {infoProjectSetting?.coordinator_info.email}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                3) แบบฟอร์มเงื่อนไขการประกวดราคา หรือ เอกสารที่เกี่ยวข้องอื่นๆ
              </p>
              <div className="inline-flex items-center">
              {infoProjectSetting?.file_name && <div className="border border-[#CCCCCC] p-2 px-32 text-xl rounded-md">
                  {infoProjectSetting?.file_name}
                </div>
              }
              {!infoProjectSetting?.file_name && <p className="border border-[#CCCCCC] p-2 px-32 text-xl rounded-md">ไม่มีการแนบไฟล์</p>}
              {infoProjectSetting?.file_name &&  <button
                  className="ml-5 py-2.5 px-5 border rounded-xl bg-red-500 text-white text-lg"
                  onClick={() =>
                    showFileOnClick(
                      infoProjectSetting?.file_uri.replace("/STSBidding", "") ||
                        ""
                    )
                  }
                >
                  ตรวจสอบ
                </button>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mb-12">
        <button
          className="justify-center rounded-lg px-10 py-4 bg-[#559744] hover:bg-[#4b853c] text-white text-3xl font-bold"
          onClick={
            handleOnClick
          }
        >
          ส่งอนุมัติหนังสือ
        </button>
      </div>
    </div>
  );
}
