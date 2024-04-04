import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CommitteeOpenInterface } from "../../../models/Committee/ICommittee";
import { ListProjectWaitOpen } from "../../../services/CommitteeService/OpenJobService";

import Pic from "../../../assets/ProjectWaitingToManaged.png";

export default function CommitteeJobLists() {
  const queryParameters = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [openId] = useState<string>(queryParameters.get("open_id") || "");

  const [waitOpen, setWaitOpen] = useState<CommitteeOpenInterface[]>([]);

  const getAllProject = async () => {
    let res = await ListProjectWaitOpen(openId);
    console.log(res.data);
    if (res.status !== 200) {
      alert(res.err);
    }
    setWaitOpen(res.data);
  };

  useEffect(() => {
    getAllProject();
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
            เปิดซองโครงการ
          </p>
        </div>
      </div>

      <div className="flex flex-col m-3 px-10 pb-12 rounded-2xl">
        <div className="px-10 py-10 flex flex-col gap-5">
          <p className="text-3xl font-extrabold text-[#2B3467]">
            1. เลือกงานที่จะเปิดซอง
          </p>
          <table className="w-full drop-shadow-lg rounded-lg table-fixed">
            <thead className="text-white text-2xl uppercase rounded-lg bg-[#2B2A2A] h-14">
              <tr>
                <th className="rounded-l-lg">เปิดซอง</th>
                <th>เลขที่เอกสาร</th>
                <th>ชื่อโครงการ</th>
                <th className="rounded-r-lg">หน่วยงาน</th>
              </tr>
            </thead>
            <tbody className="bg-white border-b-lg rounded-xl h-14">
              {Array.isArray(waitOpen) &&
                waitOpen.map((item, index) => (
                  <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center"
                  style={{ verticalAlign: "top" }}>
                    <td className="h-16 py-3">
                      {!item.is_have ? (
                        <button
                          className="border drop-shadow-md bg-[#559744] text-white w-32 h-10 text-lg py-1 rounded-lg items-center"
                          onClick={() =>
                            navigate(
                              `/committee/projectwaittoopen/jobdetails?open_id=${openId}&project_id=${item.id}`
                            )
                          }
                        >
                          เปิด
                        </button>
                      ) : (
                        <button
                          className="border drop-shadow-md bg-[#c7c558] text-white w-32 h-10 text-lg py-1 rounded-lg items-center"
                          onClick={() =>
                            navigate(
                              `/committee/projectwaittoopen/jobdetails?open_id=${openId}&project_id=${item.id}`
                            )
                          }
                        >
                          แก้ไข
                        </button>
                      )}
                    </td>

                    <td className="h-16 py-3">{item.key}</td>
                    <td className="h-16 py-3">{item.name}</td>
                    <td className="h-16 py-3 px-1">{item.division_name} / {item.department_name} / {item.SECTION} / {item.SUBSECTION}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
