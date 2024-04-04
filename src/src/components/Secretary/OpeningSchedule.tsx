import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { PiPaperclipLight } from "react-icons/pi";
import {
  CreateProjectConsultDate,
  GetAllProjectWaitForOpenBidding,
} from "../../services/SecretaryService/HttpClientService";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { showFileOnClick } from "../../services/utilitity";
import TableLoader from "../PreLoadAndEtc/ComponentLoader";
import TimeInput from "../PreLoadAndEtc/TimeInput";
import { Dayjs } from 'dayjs';

interface SecretaryWaitToManageProps {
  setPaging: Dispatch<SetStateAction<string>>;
}

export default function OpendingSchedule({
  setPaging,
}: SecretaryWaitToManageProps) {
  const mySwal = withReactContent(Swal);

  // load a project successful to show in table
  const [project, setProject] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = React.useState<Dayjs | null>(null);

  const handleTimeChange = (newTime: Dayjs | null) => {
    setSelectedTime(newTime);
    const name = "time";
    const value = newTime ? newTime.format('HH:mm') : '';
  
    setConsult({
      ...consult,
      [name]: value,
    });
  };
  

  const now = new Date();
  const [minDate, setMinDate] = useState<string>(
    `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  );

  const [dateDisable, setDateDisable] = useState<boolean>(true);

  const navigate = useNavigate();

  interface ConsultInterface {
    date: string;
    time: string;
    place: string;
    projects: string[];
  }
  const [consult, setConsult] = useState<Partial<ConsultInterface>>({
    projects: [],
  });

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const loadProject = async () => {
    try {
      const res = await GetAllProjectWaitForOpenBidding();
      if (res.status !== 200) {
        mySwal.fire({
          title: "คุณไม่มีสิทธิ์ในการเข้าถึง",
          html: <p>{res.err}</p>,
        });
        return;
      }
      setProject(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const projects = [...(consult.projects as string[]), e.target.value];

      setConsult({
        ...consult,
        projects: projects,
      });
      // const projectDate = projects.map((id) => {
      //   const data = project.filter((item: any) => item.id == id)[0];
      //   return new Date(data.end_datetime);
      // });
      if (project.length !== 0) {
        setDateDisable(false);
      } else {
        setDateDisable(true);
      }

      // const maxDate = new Date(
      //   Math.max(...projectDate.map(Number)) + 24 * 60 * 60 * 1000
      // );
      const maxDate = new Date();
      const dateFormat = `${maxDate.getFullYear()}-${String(
        maxDate.getMonth() + 1
      ).padStart(2, "0")}-${String(maxDate.getDate()+1).padStart(2, "0")}`;
      console.log(dateFormat);
      setMinDate(dateFormat);
    } else {
      if (!consult.projects) {
        return;
      }
      const index = consult.projects.indexOf(e.target.value);
      const start = consult.projects.slice(0, index);
      const end = consult.projects.slice(index + 1);

      const projects = [...start, ...end];
      setConsult({
        ...consult,
        projects: projects,
      });

      // const projectDate = projects.map((id) => {
      //   const data = project.filter((item: any) => item.id == id)[0];
      //   return new Date(data.end_datetime);
      //});
      if (project.length !== 0) {
        setDateDisable(false);
      } else {
        setDateDisable(true);
      }
 
      // const maxDate = new Date(
      //   Math.max(...projectDate.map(Number)) + 24 * 60 * 60 * 1000
      // );
      const maxDate = new Date();
      const dateFormat = `${maxDate.getFullYear()}-${String(
        maxDate.getMonth() + 1
      ).padStart(2, "0")}-${String(maxDate.getDate()+1).padStart(2, "0")}`;
      console.log(dateFormat);
      setMinDate(dateFormat);
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setConsult({
      ...consult,
      [name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    await mySwal
      .fire({
        title: <h4 className="text-4xl">ยืนยันการดำเนินการ</h4>,
        html: (
          <div className=" p-4">
            <p className="text-2xl text-red-500">
              หากท่านดำเนินการแล้วจะไม่สามารถแก้ไขได้
              โดยสามารดูรายละเอียดผู้เข้าร่วมได้ที่ "รอส่งอีเมลเปิดซอง"
            </p>
          </div>
        ),
        icon: "question",
        confirmButtonText: <p className="text-3xl">ยืนยัน</p>,
        confirmButtonColor: "#2B3467",
        showCancelButton: true,
        cancelButtonText: <p className="text-3xl">ยกเลิก</p>,
        preConfirm: async () => {
          mySwal.showLoading();
          const res = await CreateProjectConsultDate(consult);
          if (res.status !== 200) {
            mySwal.showValidationMessage(res.err);
          }
          console.log(res.data);
          return res.data;
        },
      })
      .then((response) => {
        if (response.isConfirmed) {
          mySwal.hideLoading();
          mySwal
            .fire({
              title: (
                <h4 className="text-4xl text-green-600">ดำเนินการสำเร็จ</h4>
              ),
              confirmButtonText: <p className="text-3xl">ยืนยัน</p>,
              confirmButtonColor: "#2B3467",
            })
            .then(() => {
              setPaging("specifiedenvelope");
            });
        }
      });
  };

  const handleValidate = async () => {
    if (!consult.date) {
      mySwal.fire({
        title: "ไม่พบข้อมูลโครงการ",
        text: "ไม่พบวันที่",
      });
      return;
    }
    if (!consult.time) {
      mySwal.fire({
        title: "ไม่พบข้อมูลโครงการ",
        text: "ไม่พบเวลา",
      });
      return;
    }
    if (!consult.place) {
      mySwal.fire({
        title: "ไม่พบข้อมูลโครงการ",
        text: "ไม่พบสถานที่",
      });
      return;
    }
    if (!consult.projects || consult.projects.length == 0) {
      mySwal.fire({
        title: "ไม่พบข้อมูลโครงการ",
        text: "ไม่พบข้อมูลโครงการ",
      });
      return;
    }

    setIsSubmit(true);
  };

  useEffect(() => {
    loadProject();
  }, []);

  return (
    <div>
      <div className="flex flex-col   rounded-2xl">
        <div className="bg-white rounded-lg drop-shadow-lg border my-3  py-8">
          <div className="px-5  flex flex-col gap-5 py-5">
            <label className="text-[#2B3467] text-3xl font-bold basis-1/2">
              1. เลือกงานที่จะเปิดซอง
            </label>
          </div>
          <div className="rounded-lg border mx-8">
            <table className=" w-full rounded-lg table-auto">
              <thead className="text-white bg-[#2B2A2A] h-14 rounded-lg">
                <tr className="rounded-lg text-lg">
                  <th className="w-[2rem] rounded-tl-lg"></th>
                  <th className="w-[10rem]">เลขที่เอกสาร</th>
                  <th className="w-[20rem]">ชื่อโครงการ</th>
                  <th className="w-[20rem]">สังกัด</th>
                  <th className="w-[11rem]">TOR</th>
                  <th className="w-[15rem] rounded-tr-lg">
                    จำนวนผู้เข้าร่วมประกวด
                  </th>
                </tr>
              </thead>
              {loading ? (
                <TableLoader column={6} />
              ) : (
                <tbody className="border-b-lg rounded-xl h-14">
                  {!isSubmit &&
                    Array.isArray(project) &&
                    project.map((item) => (
                      <tr
                        className="border-b text-xl text-center h-16"
                        key={item.id}
                        style={{ verticalAlign: "top" }}
                      >
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            className="h-7 w-7"
                            onChange={handleCheckBox}
                            value={item.id}
                            checked={
                              consult.projects &&
                              consult.projects.includes(item.id)
                            }
                          />
                        </td>
                        <td className="py-4">{item.key}</td>
                        <td className="py-4 text-left px-10">{item.name}</td>
                        <td className="py-4 text-left px-10">{item.division_name} / {item.department_name} / {item.SECTION} / {item.SUBSECTION}  </td>
                        <td className="flex justify-center items-centet py-3">
                          <button
                            className="border w-40 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center"
                            onClick={() => {
                              showFileOnClick(item.Tor_uri);
                            }}
                          >
                            <p className="col-start-2">TOR.pdf</p>
                            <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " />
                          </button>
                        </td>
                        <td className="text-[#005EEA] py-4">
                          {item.totalVendorRegistor}/{item.totalVendor}
                        </td>
                      </tr>
                    ))}
                  {isSubmit &&
                    Array.isArray(project) &&
                    project
                      .filter(
                        (item) =>
                          consult.projects && consult.projects.includes(item.id)
                      )
                      .map((item) => (
                        <tr
                          className="border-b text-xl text-center h-16"
                          key={item.id}
                        >
                          <td>
                            <input
                              type="checkbox"
                              className="h-7 w-7"
                              onChange={handleCheckBox}
                              value={item.id}
                              disabled
                              checked
                            />
                          </td>
                          <td>{item.key}</td>
                          <td>{item.name}</td>
                          <td>{item.division_name}</td>
                          <td className="flex justify-center items-centet py-3">
                            <button
                              className="border w-40 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center"
                              onClick={() => {
                                showFileOnClick(item.Tor_uri);
                              }}
                            >
                              <p className="col-start-2">TOR.pdf</p>
                              <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " />
                            </button>
                          </td>
                          <td className="text-[#005EEA]">
                            {item.totalVendorRegistor}/{item.totalVendor}
                          </td>
                        </tr>
                      ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg drop-shadow-lg border mb-3 pb-16">
          <div className="px-32 py-14 flex flex-col gap-5">
            <label className="text-[#2B3467] text-3xl font-bold basis-1/2">
              2. กำหนดวันและเวลาเปิดโครงการ
            </label>
            <div className="ml-12 my-2">
              <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                1. โปรดเลือกวัน/เวลาที่จะเปิดซอง
              </p>
              <div className="flex flex-col lg:flex-row">
                <div className="flex items-center mb-4 lg:mb-0 lg:w-1/2">
                  <p className="text-xl text-gray-500 mr-3">วัน</p>
                  <input
                    type="date"
                    placeholder="เริ่มต้น"
                    className="border rounded-full p-2.5 w-full lg:w-5/12 text-xl text-center"
                    min={minDate}
                    onChange={handleChangeInput}
                    name="date"
                    disabled={dateDisable ? dateDisable : isSubmit}
                  />
                </div>
                <div className="flex items-center lg:w-1/3">
                  <p className="text-xl text-gray-500 mr-3">เวลา</p>
                  <TimeInput label="เวลา" value={selectedTime} onChange={handleTimeChange} disabled={dateDisable ? dateDisable : isSubmit}
                  
                  />
                </div>
              </div>
            </div>
            <div className="ml-12 my-2">
              <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                2. สถานที่{" "}
              </p>
              <input
                type="text"
                placeholder="สถานที่ประชุม"
                value={consult.place || ""}
                className="border rounded-full p-2.5 pl-6 w-6/12 text-xl"
                name="place"
                onChange={handleChangeInput}
                disabled={dateDisable ? dateDisable : isSubmit}
                
              ></input>
            </div>
          </div>
          <div className="flex justify-around">
            {!isSubmit && (
              <button
                className="px-20 py-3 bg-[#559744] text-2xl text-white rounded-lg drop-shadow-lg border"
                onClick={handleValidate}
                disabled={dateDisable ? dateDisable : isSubmit}
              >
                สรุป
              </button>
            )}
            {isSubmit && (
              <>
                <button
                  className="px-20 py-3 bg-[#559744] text-2xl text-white rounded-lg drop-shadow-lg border"
                  onClick={handleSubmit}
                >
                  สรุป
                </button>
                <button
                  className="px-20 py-3 bg-[#D9C304] text-2xl text-white rounded-lg drop-shadow-lg border"
                  onClick={() => setIsSubmit(false)}
                >
                  แก้ไข
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
