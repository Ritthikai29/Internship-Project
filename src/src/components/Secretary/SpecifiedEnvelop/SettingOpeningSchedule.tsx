import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PiPaperclipLight } from "react-icons/pi";
import {
  UpdateProjectConsultDate,
  GetAllProjectByOpenId,
} from "../../../services/SecretaryService/HttpClientService";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { showFileOnClick } from "../../../services/utilitity";
import TableLoader from "../../PreLoadAndEtc/ComponentLoader";
import TimeInput from "../../PreLoadAndEtc/TimeInput";
import { GetConsultById } from "../../../services/SecretaryService/HttpClientService";
// import { datetimeFormatter } from "../../../services/utilitity";
import dayjs, { Dayjs } from 'dayjs';

export default function SettingOpendingSchedule() {
  const mySwal = withReactContent(Swal);
  const queryParameters = new URLSearchParams(window.location.search);

  // load a project successful to show in table
  const [project, setProject] = useState<any>([]);
  const [opendetail, setOpendetail] = useState<OpenInterface>();
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

  const [dateDisable, setDateDisable] = useState<boolean>(false);

  const navigate = useNavigate();

  interface ConsultInterface {
    op_id?: string;
    date: string;
    time: string;
    place: string;
    projects: string[];
  }

  interface OpenInterface {
    open_datetime: string;
    open_place: string;
  }

  const [consult, setConsult] = useState<Partial<ConsultInterface>>({
    projects: [],
  });

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const loadPreviousOpen = async (op_id: string) => {
    try {
      const res = await GetConsultById(op_id);

      if (res.status !== 200) {
        mySwal.fire({
          title: "คุณไม่มีสิทธิ์ในการเข้าถึง",
          html: <p>{res.err}</p>,
        });
        throw new Error("Permission error");
      }

      setOpendetail(res.data);
      return res.data;
    } catch (error) {
      console.error("Error loading previous open detail:", error);
      throw error;
    }
  };

  const loadProject = async () => {
    const res = await GetAllProjectByOpenId(
      queryParameters.get("open_id") || ""
    );
    if (res.status !== 200) {
      mySwal.fire({
        title: "คุณไม่มีสิทธิ์ในการเข้าถึง",
        html: <p>{res.err}</p>,
      });
      return;
    }
    setProject(res.data);
  };

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const projects = [...(consult.projects as string[]), e.target.value];

      setConsult({
        ...consult,
        projects: projects,
      });
      const projectDate = projects.map((id) => {
        const data = project.filter((item: any) => item.id == id)[0];
        return new Date(data.end_datetime);
      });
      if (projectDate.length !== 0) {
        setDateDisable(false);
      } else {
        setDateDisable(true);
      }
      const maxDate = new Date(
        Math.max(...projectDate.map(Number)) + 24 * 60 * 60 * 1000
      );
      const dateFormat = `${maxDate.getFullYear()}-${String(
        maxDate.getMonth() + 1
      ).padStart(2, "0")}-${String(maxDate.getDate()).padStart(2, "0")}`;
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

      const projectDate = projects.map((id) => {
        const data = project.filter((item: any) => item.id == id)[0];
        return new Date(data.end_datetime);
      });
      if (projectDate.length !== 0) {
        setDateDisable(false);
      } else {
        setDateDisable(true);
      }
      const maxDate = new Date(
        Math.max(...projectDate.map(Number)) + 24 * 60 * 60 * 1000
      );
      const dateFormat = `${maxDate.getFullYear()}-${String(
        maxDate.getMonth() + 1
      ).padStart(2, "0")}-${String(maxDate.getDate()).padStart(2, "0")}`;
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
              โดยสามารดูรายละเอียดผู้เข้าร่วมได้ที่     
              <br/> 
              "รอส่งอีเมลเปิดซอง"
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
          const res = await UpdateProjectConsultDate(consult);
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
              navigate("/secretary/waittomanage", {
                state: {
                  project_set: "specifiedenvelope",
                  open_bid: "waitsendemail",
                },
              });
            });
        }
      });
  };

  const handleValidate = async () => {
    // console.log(consult);
    // if (!consult.date) {
    //   mySwal.fire({
    //     title: "ไม่พบข้อมูลโครงการ",
    //     text: "ไม่พบวันที่",
    //   });
    //   return;
    // }
    // if (!consult.time) {
    //   mySwal.fire({
    //     title: "ไม่พบข้อมูลโครงการ",
    //     text: "ไม่พบเวลา",
    //   });
    //   return;
    // }
    // if (!consult.place) {
    //   mySwal.fire({
    //     title: "ไม่พบข้อมูลโครงการ",
    //     text: "ไม่พบสถานที่",
    //   });
    //   return;
    // }

    setIsSubmit(true);
  };

  // Function to format date to "yyyy-MM-dd"
  const formatDate = (datetimeString: any) => {
    if (!datetimeString) return "2000-01-01"; // Default value if datetimeString is falsy

    const date = new Date(datetimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Function to format time to "HH:mm"
  const formatTime = (datetimeString: any) => {
    if (!datetimeString) return "00:00"; // Default value if datetimeString is falsy

    const date = new Date(datetimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadProject();

        const opId = queryParameters.get("open_id");
        if (opId !== null) {
          const loadedOpenDetail = await loadPreviousOpen(opId);
          setConsult((prevConsult) => ({
            ...prevConsult,
            op_id: opId,
          }));

          // Now you can log the updated value of opendetail
          console.log(loadedOpenDetail);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex flex-col m-3 px-10 py-12 rounded-2xl">
        <div className="bg-white rounded-lg drop-shadow-lg border my-3 px-6 py-16">
          <div className="px-20 pb-8 flex flex-col gap-5">
            <label className="text-[#2B3467] text-3xl font-bold basis-1/2">
              รายการงานที่จะเปิดซอง
            </label>
          </div>
          <div className="rounded-lg border mx-20 mb-8">
            <table className=" w-full rounded-lg table-auto">
              <thead className="text-white bg-[#2B2A2A] h-14 rounded-lg">
                <tr className="rounded-lg text-xl">
                  <th className="w-1/12 rounded-tl-lg"></th>
                  <th className="w-1/12">เลขที่เอกสาร</th>
                  <th className="w-4/12">ชื่อโครงการ</th>
                  <th className="w-3/12">หน่วยงาน</th>
                  <th className="w-1/12">TOR</th>
                  <th className="w-2/12 rounded-tr-lg">
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
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="h-7 w-7"
                            onChange={handleCheckBox}
                            value={item.id}
                            checked={true}
                            disabled
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
                        <td className="text-[#535353]">
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
          <div className=" px-11 py-14 flex flex-col gap-5">
            <label className="text-[#2B3467] text-3xl font-bold basis-1/2">
              กำหนดวันและเวลาเปิดโครงการ
            </label>
            <div className="ml-12 my-2">
              <p className="basis-1/2 text-2xl text-gray-700 mb-4">
                1. โปรดเลือกวัน/เวลาที่จะเปิดซอง
              </p>
              <div className="ml-4 my-2">
              <div className="flex flex-col lg:flex-row">
                <div className="flex items-center mb-4 px-8 lg:mb-3">
                  <p className="text-xl text-gray-500">วันเดิม</p>
                  <input
                    type="date"
                    placeholder="เริ่มต้น"
                    className="border rounded-full p-2.5 w-56 text-xl text-center ml-3"
                    style={{ backgroundColor: "#D4D4D4" }}
                    value={formatDate(opendetail?.open_datetime)}
                    name="date"
                    disabled={true}
                  />
                </div>
                <div className="flex items-center mb-4 lg:mb-0">
                  <div>
                  <p className="text-xl text-gray-500 p-3 ml-14">เวลาเดิม</p>
                  </div>
                  <input
                    type="time"
                    placeholder="เริ่มต้น"
                    className="border rounded-full p-2.5 w-36 text-xl text-center"
                    style={{ backgroundColor: "#D4D4D4" }}
                    value={formatTime(opendetail?.open_datetime)}
                    name="time"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
            <div className="ml-12 my-2">
              <div className="flex flex-col lg:flex-row">
                <div className="flex items-center mb-4 lg:mb-0 lg:w-1/3">
                  <p className="text-xl text-[#434dd7] mr-3">วันใหม่</p>
                  <input
                    type="date"
                    placeholder="เริ่มต้น"
                    className="border rounded-full p-2.5 w-full lg:w-8/12 text-xl text-center"
                    min={minDate}
                    onChange={handleChangeInput}
                    name="date"
                    disabled={dateDisable ? dateDisable : isSubmit}
                  />
                </div>
                <div className="flex items-center">
                  <p className="text-xl text-[#434dd7] mr-3 ml-16">เวลาใหม่</p>
                  <div className=" w-44">
                  <TimeInput
                    label="เวลา"
                    value={selectedTime ? dayjs(selectedTime):dayjs("สูตรลับครับน้อง")}
                    onChange={handleTimeChange}
                    disabled={dateDisable ? dateDisable : isSubmit}
                  />
                  </div>
                </div>
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
                value={opendetail?.open_place}
                className="border rounded-full p-2.5 mr-3 pl-6 w-5/12 text-xl"
                name="place"
                disabled={true}
              ></input>
              <input
                type="text"
                placeholder="สถานที่ประชุมใหม่"
                value={consult.place || ""}
                className="border rounded-full p-2.5 pl-6 w-5/12 text-xl"
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
                  ยืนยัน
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
