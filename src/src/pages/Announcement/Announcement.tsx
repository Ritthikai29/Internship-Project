import { BsSearch } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import { GiMegaphone } from "react-icons/gi";
import { BiSolidLeftArrow } from "react-icons/bi";
import { Link } from "react-router-dom";
import {
  AllListProjectService,
  GetAllListStatus,
} from "../../services/ProjectServices";
import { useEffect, useState } from "react";
import { showFileOnClick } from "../../services/utilitity";
import { status } from "../../models/Project/IProject";
import ReactPaginate from "react-paginate";
import { FaChevronDown } from "react-icons/fa6";

export interface IAnnouncement {
  id: number;
  Job_description_uri: string;
  Tor_uri: string;
  add_datetime: string;
  adder_user_staff_id: string;
  approve: string;
  approver_id: string;
  coordinator_id: string;
  creator_id: string;
  department: string;
  deposit_money: string;
  detail_datetime: string;
  division_id: string;
  division_name: string;
  department_name: string;
  SECTION: string;
  SUBSECTION: string;
  end_datetime: string;
  is_active: string;
  is_approver_send: string | null;
  job_type: string;
  key: string;
  name: string;
  opendate_id: string;
  project_id: string;
  project_setting_id: string;
  project_type: string;
  start_datetime: string;
  status_id: string;
  status_name: string;
}

export default function Announcement() {
  const [projects, setProject] = useState<IAnnouncement[]>([]);
  const [status, setStatus] = useState<
    Array<{ id: string; status_name: string }>
  >([
    { id: "all", status_name: "ทั้งหมด" },
    // ... other status options
  ]);
  const [statusBar, setStatusBar] = useState<status[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<IAnnouncement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  // const listProject = async () => {
  //   const res = await AllListProjectService();
  //   setProject(res.data);
  //   console.log(res.data)
  // };
  const getStatus = async () => {
    try {
      const res = await GetAllListStatus();
      setStatus(res.data);
      listProject(); // เรียก listProject() ทันทีหลังจากที่ได้รับข้อมูลสถานะ
    } catch (error) {
      console.error("Error loading status:", error);
    }
  };

  const dateFormat = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    const month = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()+543}`;
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
    if (event.target.value === "all") {
      setFilteredProjects(projects);
    } else {
      const foundProjects = projects.filter(
        (project) => project.status_name === event.target.value
      );
      setFilteredProjects(foundProjects);
    }
  };

  const timeFormat = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    return `${date.getHours().toString().padStart(2, "0")} : ${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} น.`;
  };

  useEffect(() => {
    getStatus();
    setSelectedStatus("");
  }, []);

  const listProject = async () => {
    const res = await AllListProjectService();
    setProject(res.data);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    setCurrentIndex(selected * itemsPerPage);
  };

  useEffect(() => {
    // กรองโครงการตามสถานะและคำค้นหา
    const filtered = projects.filter(
      (project) =>
        (selectedStatus === "" || project.status_name === selectedStatus) &&
        (searchTerm === "" ||
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${project.department_name} / ${project.division_name} / ${project.SECTION} / ${project.SUBSECTION}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );

    setFilteredProjects(filtered);
  }, [selectedStatus, searchTerm, projects]);

  return (
    <div>
      {/* banner */}
      <div className="bg-[#1D5182] w-full h-[20rem] flex justify-center items-center">
        <label className="text-white text-5xl font-bold border-[6px] border-white  px-[8rem] py-[4rem] flex flex-row">
          <GiMegaphone className=" -rotate-45 mx-3" />
          <p>ประกาศงานประมูล / ประกาศเชิญชวนทั่วไป</p>
        </label>
      </div>

      {/* container */}
      <div className="px-[2rem] py-2 rounded-2xl">
        <div className="flex justify-between my-12">
        <div className="relative">
          {/* Dropdown for Status */}
            <select
            className="px-6 py-2 rounded-full border-2 text-2xl bg-white shadow-md appearance-none pr-12"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option disabled value="">
              เลือกสถานะโครงการ
            </option>
            <option value="">โครงการทั้งหมด</option>
            {status.map((statusOption) => (
              <option key={statusOption.id} value={statusOption.status_name}>
                {statusOption.status_name}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute top-0 right-0 mt-4 mr-6 pointer-events-none" />
        </div>
          {/* Search Input */}
          <div className="relative">
            <div>
              <form>
                <input
                  type="search"
                  className="block w-[25rem] p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-300 rounded-lg bg-white"
                  placeholder="ค้นหาโครงการ"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
              </form>
            </div>
          </div>
        </div>
        {/* </div> */}

        <div>
          <table className="my-[1.5rem] w-full  rounded-lg table-fixed">
            <thead className="text-white text-2xl bg-[#EB455F] h-14">
              <tr className="rounded py-[6rem]">
                <th className="w-[10rem] rounded-tl-lg">ลำดับ</th>
                <th className="rounded-tr-lg">โครงการ</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="flex flex-col gap-5">
          {filteredProjects
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .filter(
              (project) =>
                selectedStatus === "" || project.status_name === selectedStatus
            )
            .filter(
              (project) =>
                searchTerm === "" ||
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${project.department_name} / ${project.division_name} / ${project.SECTION} / ${project.SUBSECTION}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
            .map((project, index) => (
              <div
                key={index}
                className="flex flex-row bg-white drop-shadow-lg rounded-lg border"
              >
                <div className="px-[5rem] py-[8rem]">
                  <label className="text-3xl ">
                    {currentIndex + index + 1}
                  </label>
                </div>
                <div className="bg-white drop-shadow-lg rounded-lg border w-full my-4 mr-5">
                  
                <div className="grid grid-cols-11">
                    <label className="mx-16 my-4 text-[#2B3467] text-2xl font-bold col-span-3">
                      <p>ชื่อโครงการ </p>
                    </label>
                    <label className="mx-7 my-4 text-[#2B3467] text-2xl font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="mx-5 my-4 text-[#2B3467] text-2xl font-bold col-span-7 pr-5 text-left">
                      <p className="inline"> {project.name}</p>
                    </label>
                  </div>
                  <hr></hr>
                  <div className="flex flex-col gap-2 justify-center mx-16 my-4">
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold col-span-3">
                      <p>ระยะเวลารับสมัคร</p>
                    </label>
                    <label className="text-xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-xl col-span-7 pr-5">
                      <p className="inline"> 
                      {project.start_datetime
                          ? dateFormat(project.start_datetime)
                          : "ยังไม่กำหนด"}{" "}
                        -{" "}
                        {project.end_datetime
                          ? dateFormat(project.end_datetime)
                          : "ยังไม่กำหนด"}
                      </p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold col-span-3">
                      <p>เวลาปิดรับสมัคร</p>
                    </label>
                    <label className="text-xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-xl col-span-7 pr-5">
                      <p className="inline"> 
                      {project.end_datetime
                          ? timeFormat(project.end_datetime)
                          : "ยังไม่กำหนด"}
                      </p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold col-span-3">
                      <p>สังกัด</p>
                    </label>
                    <label className="text-xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-xl col-span-7 pr-5">
                      <p className="inline"> 
                      {project.department_name} / {project.division_name} /{" "}
                        {project.SECTION} / {project.SUBSECTION}
                      </p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold col-span-3">
                    <p
                        className={`text-xl basis-1/2 ${getStatusColor(
                          project.status_name
                        )}`}
                      >สถานะโครงการ</p>
                    </label>
                    <label className="text-xl text-left font-bold col-span-1 mr-3">
                    <p
                        className={`text-xl basis-1/2 ${getStatusColor(
                          project.status_name
                        )}`}
                      >:</p>
                    </label>
                    <label className="text-xl col-span-7 pr-5">
                    <p
                        className={`text-xl basis-1/2 ${getStatusColor(
                          project.status_name
                        )}`}
                      > 
                      {project.status_name}
                      </p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold col-span-3">
                      <p>รายละเอียดเพิ่มเติม</p>
                    </label>
                    <label className="text-xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-xl col-span-7 pr-5">
                    <button
                        className="p-1 pl-3.5 w-[11rem] border-4 border-gray-300 col-start-1 col-end-5 rounded-3xl bg-white text-xl drop-shadow-md grid grid-cols-4 justify-self-center"
                        onClick={() => {
                          showFileOnClick(project?.Tor_uri || "");
                        }}
                      >
                        <BsDownload className="col-start-1 text-xl self-center" />
                        <p className="col-start-2 col-end-4 items-center text-xl  text-[#4B82A9]">
                          TOR
                        </p>
                      </button>
                    </label>
                  </div>
                    {/* <div className="flex flex-row gap-6 items-center">
                      <p className="text-2xl text-[#4B82A9]">
                        ดูรายละเอียดเพิ่มเติม
                      </p>
                      <button
                        className="p-1.5 pl-3.5 w-[11rem] border-4 border-gray-300 col-start-1 col-end-5 rounded-3xl bg-white text-xl drop-shadow-md grid grid-cols-4 justify-self-center"
                        onClick={() => {
                          showFileOnClick(project?.Tor_uri || "");
                        }}
                      >
                        <BsDownload className="col-start-1 text-xl self-center" />
                        <p className="col-start-2 col-end-4 items-center text-xl text-[#4B82A9]">
                          TOR
                        </p>
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-between my-12">
          <p>
            Showing {currentPage + 1} to{" "}
            {Math.ceil(filteredProjects.length / itemsPerPage)} of{" "}
            {filteredProjects.length} entries
          </p>
          <div className="flex justify-end">
            <ReactPaginate
              className="flex gap-5 col-start-10 col-end-12 "
              pageClassName="flex justify-center items-center w-10 h-10 text-[#EB455F] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100 border"
              activeClassName="w-10 h-10 text-white transition-colors duration-150 bg-[#EB455F] border border-r-0 border-[#EB455F] rounded-full focus:shadow-outline"
              nextLinkClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
              previousClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
              breakClassName="text-[#EB455F]"
              onPageChange={handlePageChange}
              pageCount={Math.ceil(filteredProjects.length / itemsPerPage)}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              nextLabel=">"
              previousLabel="<"
            />
          </div>
        </div>
        <Link
          to={"/"}
          className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
        >
          <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
          ย้อนกลับ
        </Link>
      </div>
    </div>
  );
}

function getStatusColor(statusName: string) {
  switch (statusName) {
    case "เปิดรับผู้เข้าร่วมประกวดราคา":
      return "text-[#559744]";
    case "ล้ม":
      return "text-red-500";
    case "กำลังประกวดราคา":
      return "text-[#FFC048]";
    default:
      return "text-[#2B3467]";
  }
}
