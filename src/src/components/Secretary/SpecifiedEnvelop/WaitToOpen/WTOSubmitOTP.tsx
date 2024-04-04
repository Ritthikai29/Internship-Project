import { BiSolidLeftArrow } from "react-icons/bi";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ConsultInterface } from "../../../../models/Secretary/ConsultInterface";
import {
  GetConsultById,
  PasscodeVerify,
  UpdateCommitteePasscode
} from "../../../../services/SecretaryService/HttpClientService";
import { dateWithTimeFormatter } from "../../../../services/utilitity";
import LimitStringWithUrl from "../../../PreLoadAndEtc/LongLetter";
import validator from "validator";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function WTOSubmitOTP() {
  interface openBiddingInterface {
    open_id: string;
    passcode: string;
  }

  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(location.search);
  const [openId] = useState(queryParameters.get("open_id"));

  const [consult, setConsult] = useState<ConsultInterface>();

  const [passcode, setPasscode] = useState<Partial<openBiddingInterface>>({
    open_id: openId || "",
  });

  const getConsultDetailById = async () => {
    const res = await GetConsultById(openId || "");
    if (res.status !== 200) {
      alert(res.err);
    }
    setConsult(res.data);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setPasscode({
      ...passcode,
      [name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const res = await PasscodeVerify(passcode);
    if (res.status !== 200) {
      alert(res.err);
      return;
    } else {
      localStorage.setItem("passcode", passcode.passcode || "");
      navigate(
        `/secretary/specifiedevenelope/wto/detailspasscord?open_id=${openId}`
      );
    }
  };

  function hideEmail(email : any) {
    if (!email) {
      return '';
    }
  
    // const [username, domain] = email.split('@');
    // const hiddenUsername = username.slice(0, -3) + '***';
  
    // return `${hiddenUsername}@${domain}`;
    return `${email}`;
  }

  const handleGetNewPass = async () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <p className="text-[#2B3467] text-4xl">ยืนยันการดำเนินการ</p>,
      text: `ระบบจะดำเนินการ ส่ง Passcode ไปยัง ${hideEmail(consult?.email)}`,
      confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>,
      icon: "question",
      confirmButtonColor: "#EB455F",
      showCancelButton: true,
      cancelButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>,
      cancelButtonColor: "#979797",
      preConfirm: async () => {
        const res = await UpdateCommitteePasscode(openId || "");
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
      }
    });
  };

  useEffect(() => {
    getConsultDetailById();
  }, []);

  return (
    <div className="bg-[#F5F5F5]">
      {/* container */}
      <div className="px-[8rem] py-12 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="bg-[#1D5182] pt-8 pb-8 text-white rounded-xl">
            <label className="text-3xl font-bold pl-16">
              การเปิดซองวันที่ :{" "}
              {dateWithTimeFormatter(consult?.open_datetime || "")} น.
            </label>
          </div>
          <div className="px-32 py-14 flex flex-col gap-8">
            <div className="flex flex-row ">
              <label className="text-[#2B3467] text-xl basis-1/2">
                <b>สถานที่เปิดซอง :</b>{" "}
                <LimitStringWithUrl
                  string={consult?.open_place || ""}
                  maxChars={35}
                />
              </label>
              <label className="text-[#2B3467] text-xl">
                <b>จำนวนโครงการทั้งหมด :</b> {consult?.totalProject} โครงการ
              </label>
            </div>
          </div>
        </div>
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="px-32 py-10 ">
            <p className="text-2xl text-[#2B3467] font-bold ">
              รหัส OTP สำหรับการเปิดซองถูกส่งไปยังอีเมลของท่านก่อนล่วงหน้า 1 วัน
            </p>
            <div className="grid grid-cols-9 items-center my-8">
              <p className="text-xl text-center col-start-1 col-end-3">
                กรอกรหัส OTP เปิดซอง :
              </p>
              <input
                type="text"
                placeholder="กรอกรหัส OTP เปิดซอง"
                name="passcode"
                value={validator.trim(passcode.passcode || "")}
                className="col-start-3 col-end-6 border rounded-lg py-1.5 text-2xl text-center"
                onChange={handleChangeInput}
                autoComplete="off"
                maxLength={5}
              ></input>
              <div className="col-start-6 col-end-9 ml-4">
                <p className="">ยังไม่ได้รหัสผ่าน</p>
                <button
                  className="text-[#0066FF] underline"
                  onClick={() => {
                    handleGetNewPass();
                  }}
                >
                  ส่งอีกครั้ง
                </button>
              </div>
            </div>
            <hr className="mb-8" />
            <div className="grid grid-cols-3 ">
              <button
                className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
                onClick={() =>
                  navigate("/secretary/waittomanage", {
                    state: {
                      project_set: "specifiedenvelope",
                      open_bid: "waittoopen",
                    },
                  })
                }
              >
                <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                ย้อนกลับ
              </button>

              <div className="flex justify-center">
                <button
                  className="px-8 py-2.5 w-[180px] rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl col-start-2 text-center"
                  onClick={handleSubmit}
                >
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
