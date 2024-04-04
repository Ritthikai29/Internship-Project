 import { BiSolidLeftArrow } from "react-icons/bi";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CrossMark from "../../../assets/Committee/CrossMark.png";
import CheckMark from "../../../assets/Committee/CheckMark.png";

import Pic from "../../../assets/ProjectWaitingToManaged.png";
import {
  GetCommitteeOfTheProject,
  SecretaryStartProject,
} from "../../../services/SecretaryService/HttpClientService";

export default function WaitForOtherCommittee() {
  const navigate = useNavigate();

  const queryParameters = new URLSearchParams(window.location.search);

  const [committee, setCommittee] = useState<any>({});
  const getCheckCommitteeIsJoin = async () => {
    let res = await GetCommitteeOfTheProject(
      queryParameters.get("open_id") || ""
    );
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    if (res.data.is_start) {
      navigate(
        `/committee/projectwaittoopen/joblists?open_id=${queryParameters.get(
          "open_id"
        )}`
      );
    }
    setCommittee(res.data);
  };

  useEffect(() => {
    getCheckCommitteeIsJoin();

    const requestInterval = setInterval(getCheckCommitteeIsJoin, 6000);
    return () => {
      clearInterval(requestInterval);
    };
  }, []);

  return (
    <div>
      <div className="px-4">
        <div
          style={{
            backgroundImage: `url(${Pic})`,
          }}
          className="w-full h-96 flex justify-end items-end"
        >
          <p className="pb-12 pr-12 text-white text-7xl font-bold">
            โครงการที่รอจัดการ
          </p>
        </div>
      </div>

      <div className="px-[8rem] pt-4 pb-12 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="px-32 py-14 flex flex-col gap-8">
            <p className="text-4xl text-[#2B3467] font-bold text-center">

            ระบบจะนำท่านเข้าสู่การเปิดซองเมื่อกรอก Passcode ครบทุกท่านเท่านั้น

            </p>
            <div className="grid grid-cols-3 ">
              <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                <p className="text-xl">ประธาน</p>
                <img
                  src={
                    committee.chairman?.is_active == committee.chairman?.total
                      ? CheckMark
                      : CrossMark
                  }
                  className="h-[90px]"
                />
                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                <p className="text-xl">
                <p className="text-xl">{committee.chairman?.is_active || 0} / 1 </p>
                </p>
              </div>
              <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                <p className="text-xl">กรรมการ</p>
                <img
                  src={
                    committee.committee?.is_active == committee.committee?.total
                      ? CheckMark
                      : CrossMark
                  }
                  className="h-[90px]"
                />
                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                <p className="text-xl">{committee.committee?.is_active || 0} / 2</p>
              </div>
              <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                <p className="text-xl">เลขา</p>
                <img
                  src={
                    committee.secretary?.is_active == committee.secretary?.total
                      ? CheckMark
                      : CrossMark
                  }
                  className="h-[90px]"
                />
                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                <p className="text-xl">{committee.secretary?.is_active || 0} / 1</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="px-32 py-14 flex flex-col gap-3">
            <p className="text-2xl mb-6">รายชื่อกรรมการที่ใส่ Passcord แล้ว</p>
            <div className="grid grid-cols-3 justify-items-center">
              <p className="text-xl ">ลำดับ</p>
              <p className="text-xl ">ชื่อ-สกุล</p>
              <p className="text-xl ">ตำแหน่งในการเปิดซอง</p>
            </div>
            <hr></hr>
            {Array.isArray(committee?.user_committee) &&
              committee?.user_committee
                .filter((item: any) => item.is_join === "1").sort((a: any, b: any) => {
                  // เรียงลำดับตามตำแหน่ง: ประธาน, กรรมการ, เลขา
                   const positionsOrder: { [key: string]: number } = {
                      'ประธาน': 1,
                      'กรรมการ': 2,
                      'เลขาคณะกรรมการเปิดซอง': 3,
                  };
                  return positionsOrder[a.role_name_t] - positionsOrder[b.role_name_t];
              })
                .map((item: any, index: any) => (
                  <div className="grid grid-cols-3 justify-items-center" key={index}>
                    <p className="text-xl">{index + 1}</p>
                    <p className="text-xl">
                      {item.nametitle_t} {item.firstname_t} {item.lastname_t}{" "}
                    </p>
                    <p className="text-xl">{item.role_name_t}</p>
                  </div>
                ))}
          </div>
        </div>
        <div className="grid grid-cols-3 ">
          <button
            className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
            onClick={() =>
              navigate(
                `/committee/projectwaittoopen/passcode?open_id=${queryParameters.get(
                  "open_id"
                )}`
              )
            }
          >
            <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
            ย้อนกลับ
          </button>

          {/* <div className="flex justify-center">

                        <button className="px-8 py-2.5 w-[330px] rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl col-start-2 text-center"
                            onClick={() => navigate("/committee/projectwaittoopen/joblists")}>
                            กดสรุปผลการประกวดราคา
                        </button>
                    </div> */}
        </div>
      </div>
    </div>
  );
}