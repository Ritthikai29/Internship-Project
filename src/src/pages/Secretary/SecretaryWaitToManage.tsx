import { useState } from "react";
import { useLocation } from "react-router-dom";
import Pic from "../../assets/ProjectWaitingToManaged.png";
import DataWaitToManage from "../../components/Secretary/DataWaitToManage";
import OpendingSchedule from "../../components/Secretary/OpeningSchedule";
import SpecifiedEnvelope from "../../components/Secretary/SpecifiedEnvelope";

export default function SecretaryWaitToManage() {
    const location = useLocation();
    const enableComponent = location.state?.project_set;
    const [paging, setPaging] = useState<string>(
      enableComponent || "waittomanage"
    );

  const setWaittomanage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPaging("waittomanage");
  };

  const setOpeningschedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPaging("openingschedule");
  };

  const setSpecifiedenvelope = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPaging("specifiedenvelope");
  };
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
        <div className="gird grid-cols-12 justify-center items-center drop-shadow-md">
          <div className="grid grid-cols-3 border border-separate h-20 text-2xl font-bold rounded-bl-lg rounded-br-lg">
            <button
              className={`border rounded-bl-lg

                       ${
                         paging === "waittomanage"
                           ? "bg-[#188493] text-white"
                           : "bg-white text-[#4B82A9]"
                       }`}
              onClick={setWaittomanage}
            >
              ข้อมูลโครงการที่รอจัดการ
            </button>
            <button
              className={`border
                                ${
                                  paging === "openingschedule"
                                    ? "bg-[#188493] text-white"
                                    : "bg-white text-[#4B82A9]"
                                }`}
              onClick={setOpeningschedule}
            >
              กำหนดวันเปิดซองใหม่
            </button>
            <button
              className={`border
                        ${
                          paging === "specifiedenvelope"
                            ? "bg-[#188493] text-white"
                            : "bg-white text-[#4B82A9]"
                        }`}
              onClick={setSpecifiedenvelope}
            >
              รายละเอียดการเปิดซองที่กำหนดแล้ว
            </button>
          </div>
        </div>

        {paging === "waittomanage" && <DataWaitToManage />}
        {paging === "openingschedule" && <OpendingSchedule setPaging={setPaging}/>}
        {paging === "specifiedenvelope" && <SpecifiedEnvelope />}
      </div>
    </div>
  );
}
