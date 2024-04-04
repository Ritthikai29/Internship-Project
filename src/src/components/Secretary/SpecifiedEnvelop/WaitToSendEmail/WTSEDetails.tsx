import { useEffect, useState } from "react";
import { PiPaperclipLight } from "react-icons/pi";
import { BiSolidLeftArrow } from "react-icons/bi";
import SecretaryBanner from "../../SecretaryBanner";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import { SendInviteCommittee } from "../../../../services/SecretaryService/SendInviteSecretary";
import {
  GetConsultById,
  GetAllProjectByOpenId,
} from "../../../../services/SecretaryService/HttpClientService";
import {
  openUploadFile,
  showFileOnClick,
} from "../../../../services/utilitity";

interface ConsultInterface {
  date: string;
  time: string;
  place: string;
  projects: string[];
}

export default function WTSEDetails() {
    const mySwal = withReactContent(Swal);

  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const [consultDetail, setConsultDetail] = useState<any>({});
  const [consultProject, setConsultProject] = useState<any>();

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const getConsultDetail = async () => {
    let res = await GetConsultById(queryParameters.get("open_id") || "");
    console.log(res);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    setConsultDetail(res.data);
  };

  const getConsultProject = async () => {
    let res = await GetAllProjectByOpenId(queryParameters.get("open_id") || "");
    console.log(res);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    setConsultProject(res.data);
  };

const handleSendOnClick = (op_id: string) => {
    let MySwal = withReactContent(Swal)
    console.log(op_id);
    MySwal.fire({
        title: <p className="text-[#2B3467] text-4xl">ยืนยันการดำเนินการ</p>,
        confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>,
        icon: "question",
        confirmButtonColor: "#EB455F",
        showCancelButton: true,
        cancelButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>,
        cancelButtonColor: "#979797",
        preConfirm: async () => {
            Swal.showLoading();
            let res = await SendInviteCommittee(op_id);
            if (res.status !== 200) {
              Swal.hideLoading();
                MySwal.showValidationMessage(res.err)
            }
            return res
        }
    }).then(
        (data) => {
            if (data.isConfirmed) {
                MySwal.fire({
                    title: (<h1 className="text-4xl text-[#4BAE4F]">ดำเนินการสำเร็จ!</h1>),
                    icon: "success",
                    confirmButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>),
                    confirmButtonColor: "#2B3467",
                })
            }
        }
    )
}

  useEffect(() => {
    getConsultDetail();
    getConsultProject();
  }, []);

  return (
    <div className="bg-[#F5F5F5]">
      {<SecretaryBanner />}
      <div className="flex flex-col m-3 px-10 py-12 rounded-2xl">
        <div className="bg-white rounded-lg drop-shadow-lg border mb-3">
          <div className="px-32 py-14 flex flex-col gap-5">
            <label className="text-[#2B3467] text-3xl font-bold basis-1/2">
              1. วันและเวลาเปิดโครงการ
            </label>
            <div className="ml-12 my-2">
              <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                1) วัน/เวลา
              </p>
              <div className="grid grid-cols-12 items-center">
                <p className="col-start-1 text-xl text-gray-500 mr-3">วัน</p>
                <input
                  type="date"
                  value={
                    consultDetail.open_datetime
                      ? consultDetail.open_datetime.substring(0, 10)
                      : ""
                  }
                  name="date"
                  placeholder="เริ่มต้น"
                  className="col-start-2 col-end-5 border rounded-full p-2.5 w-[250px] text-xl text-center"
                  disabled
                ></input>
                <p className="col-start-5 text-xl text-gray-500 mr-3">เวลา</p>
                <input
                  type="time"
                  value={
                    consultDetail.open_datetime
                      ? consultDetail.open_datetime.substring(11, 16)
                      : ""
                  }
                  name="time"
                  pattern="hh:mm"
                  placeholder="เวลา"
                  className="col-start-6 col-end-9 border rounded-full p-2.5 w-[250px] text-xl text-center"
                  disabled
                ></input>
              </div>
            </div>
            <div className="ml-12 my-2">
              <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                2) สถานที่{" "}
              </p>
              <div className="grid grid-cols-12">
                <input
                  type="text"
                  value={consultDetail.open_place || ""}
                  placeholder="สถานที่ประชุม"
                  className="col-start-1 col-end-12 border rounded-full p-2.5 pl-6 text-xl"
                  name="place"
                  disabled
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white drop-shadow-lg border py-16">
        <div className="px-32 pb-8 flex flex-col gap-5">
          <label className="text-[#2B3467] text-3xl font-bold basis-1/2">
            2. เลือกงานที่จะเปิดซอง
          </label>
          <div className="rounded-lg border my-8">
            <div className="grid grid-cols-6 justify-items-center text-white text-xl bg-[#2B2A2A] rounded-lg py-3.5">
              <p className="w-[4rem]"></p>
              <p>เลขที่เอกสาร</p>
              <p>ชื่อโครงการ</p>
              <p>หน่วยงาน</p>
              <p>TOR</p>
              <p>จำนวนผู้เข้าร่วมประกวด</p>
            </div>
            {Array.isArray(consultProject) &&
              consultProject.map((item, index) => (
                <div className="grid grid-flow-col grid-cols-6 text-xl justify-items-center items-center">
                  <input
                    type="checkbox"
                    className="h-7 w-7"
                    value={item.id}
                    checked={true}
                    disabled
                  ></input>
                  <p>{item.key}</p>
                  <p>{item.name}</p>
                  <p>{item.division_name}</p>
                  <div className="flex justify-center items-centet py-3">
                    <button
                      className="border w-40 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center"
                      onClick={() => {
                        showFileOnClick(item.Tor_uri);
                      }}
                    >
                      <p className="col-start-2">TOR.pdf</p>
                      <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " />
                    </button>
                  </div>
                  <p className="text-[#005EEA]">
                    {item.totalVendorRegistor}/{item.totalVendor}
                  </p>
                </div>
              ))}
          </div>
          <div className="flex justify-between">
            <button
              className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
              onClick={() => navigate("/secretary/waittomanage")}
            >
              <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
              ย้อนกลับ
            </button>
            <button className="px-8 py-2.5 w-[330px] rounded-lg bg-[#559744] drop-shadow-lg text-white text-2xl text-center"
                    onClick={() => {
                        handleSendOnClick(queryParameters.get("open_id") || "")
                    }}
            >
              ส่งอีเมลหาคณะกรรมการซ้ำ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
