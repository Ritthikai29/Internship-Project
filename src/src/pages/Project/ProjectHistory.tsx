import { BsSearch } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import Pic from "../../assets/Vender/banner_vender_history.png";
import { IListProject } from "../../models/Project/IProject";
import {
  AllListProjectHistory,
  GetAllListStatus,
} from "../../services/ProjectServices";
import { showFileOnClick } from "../../services/utilitity";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { ProjectWaitInterface } from "../../models/Project/IListWaitProject";
import PageLoad from "../../components/PreLoadAndEtc/PageLoader";
import { FaChevronDown } from "react-icons/fa6";

export default function ProjectHistory() {
  const [loading, setLoading] = useState(true);
  const [projects, setProject] = useState<IListProject[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<IListProject[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [status, setStatus] = useState<
    Array<{ id: string; status_name: string }>
  >([
    { id: "all", status_name: "ทั้งหมด" },
    // ... other status options
  ]);
  const listProject = async () => {
    const res = await AllListProjectHistory();
    setLoading(false);

    setProject(res.data);
    console.log(res.data);
  };
  const [listProjects, setListProjects] = useState<ProjectWaitInterface[]>([]);
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
    return `${date.getDate()}  ${
      month[date.getMonth()]
    }  ${date.getFullYear()+543}`;
  };
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };
  const getStatus = async () => {
    try {
      const res = await GetAllListStatus();
      setStatus(res.data);
      listProject(); // เรียก listProject() ทันทีหลังจากที่ได้รับข้อมูลสถานะ
    } catch (error) {
      console.error("Error loading status:", error);
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };
  const navigate = useNavigate();
  const handleClickopen = (key: any) => {
    navigate(`/project/AnnouncementResultComponent/${key}`);
  };

  useEffect(() => {
    // กรองโครงการตามสถานะและคำค้นหา
    const filtered = projects.filter(
      (project) =>
        (selectedStatus === "" || project.status_name === selectedStatus) &&
        (searchTerm === "" ||
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.add_year
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          project.SECTION.toLocaleLowerCase().includes(
            searchTerm.toLocaleLowerCase()
          ) ||
          project.SUBSECTION.toLocaleLowerCase().includes(
            searchTerm.toLocaleLowerCase()
          ) ||
          project.department_name
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          project.division_name
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase()))
    );

    setFilteredProjects(filtered);
  }, [selectedStatus, searchTerm, projects]);
  useEffect(() => {
    setListProjects([]);
    listProject();
    getStatus();
  }, []);

  return (
    <div>
      <div className="px-4">
        <div
          style={{
            backgroundImage: `url(${Pic})`,
          }}
          className="px-full h-96 flex justify-end items-end"
        >
          <p className="pb-12 pr-12 text-white text-7xl font-bold">
            ประวัติการเข้าร่วม
          </p>
        </div>
      </div>
      {/* container */}

      <div className="px-[2rem] py-2 rounded-2xl">
        <div className="flex justify-between my-6">
          {/* dropdown */}
          <div className="relative inline-block text-left">
            <div className="flex gap-4">
              <div className="relative">
                <select
                  className="px-6 py-2 rounded-full border-2 text-2xl bg-white shadow-md appearance-none pr-12"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  <option disabled value="">
                    สถานะโครงการทั้งหมด
                  </option>
                  <option value="">โครงการทั้งหมด</option>
                  {status.map((statusOption) => (
                    <option
                      key={statusOption.id}
                      value={statusOption.status_name}
                    >
                      {statusOption.status_name}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute top-0 right-0 mt-4 mr-6 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* search */}
          <div className="flex justify-end">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BsSearch />
              </div>
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
      </div>

      {/* second container  */}
      {loading ? (
        <PageLoad />
      ) : (
        <div className="grid grid-cols-6 mx-8 my-2  bg-white border-2 drop-shadow-xl rounded-2xl">
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
                project.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.add_year
                  .toLocaleLowerCase()
                  .includes(searchTerm.toLocaleLowerCase()) ||
                project.SECTION.toLocaleLowerCase().includes(
                  searchTerm.toLocaleLowerCase()
                ) ||
                project.SUBSECTION.toLocaleLowerCase().includes(
                  searchTerm.toLocaleLowerCase()
                ) ||
                project.department_name
                  .toLocaleLowerCase()
                  .includes(searchTerm.toLocaleLowerCase()) ||
                project.division_name
                  .toLocaleLowerCase()
                  .includes(searchTerm.toLocaleLowerCase())
            )
            .map((project: IListProject) => (
              <div
                key={project.id}
                className="col-span-3 border-b-2 border-e-2 "
              >
                <div className="grid grid-flow-row auto-rows-auto ml-12 mt-8 mb-4">
                  <div className="grid grid-cols-11">
                    <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-11">
                      <p
                        className="inline"
                        title={
                          project.name.length > 30 ? project.name : undefined
                        }
                      >
                        ชื่อโครงการ :{" "}
                        {project.name.length > 30
                          ? project.name.slice(0, 30) + "..."
                          : project.name}
                      </p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold pb-2 col-span-3">
                      <p>เลขที่เอกสาร </p>
                    </label>
                    <label className="text-xl text-left font-bold pb-2 col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-xl pb-2 col-span-7 pr-5">
                      <p className="inline"> {project.key}</p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold pb-2 col-span-3">
                      <p>สังกัด</p>
                    </label>
                    <label className="text-xl text-left font-bold pb-2 col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-xl  col-span-7 pr-5 block overflow-hidden">
                    <p
                        className="inline"
                        title={
                          `${project.department_name} / ${project.division_name} / ${project.SECTION} / ${project.SUBSECTION}`.length > 30 ? 
                          `${project.department_name} / ${project.division_name} / ${project.SECTION} / ${project.SUBSECTION}` : undefined
                        }
                      >
                      {`${project.department_name} / ${project.division_name} / ${project.SECTION} / ${project.SUBSECTION}`.length> 30
                          ?`${project.department_name} / ${project.division_name} / ${project.SECTION} / ${project.SUBSECTION}`.slice(0, 30) + "..."
                          : `${project.department_name} / ${project.division_name} / ${project.SECTION} / ${project.SUBSECTION}`}
                      </p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold pb-2 col-span-3">
                      <p>สถานะ </p>
                    </label>
                    <label className="text-xl text-left font-bold pb-2 col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-xl pb-2 col-span-7 pr-5">
                      <p className="inline"> {project.status_name}</p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold pb-2 col-span-3">
                      <p>วันที่เพิ่ม </p>
                    </label>
                    <label className="text-xl text-left font-bold pb-2 col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-xl pb-2 col-span-7 pr-5">
                      <p className="inline">
                        {" "}
                        {project.start_datetime
                          ? dateFormat(project.start_datetime)
                          : "ยังไม่กำหนด"}{" "}
                      </p>
                    </label>
                  </div>
                  <div className="grid grid-cols-11">
                    <label className="text-xl font-bold pb-2 col-span-3">
                      <p>วันที่สิ้นสุด </p>
                    </label>
                    <label className="text-xl text-left font-bold pb-2 col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-xl pb-2 col-span-7 pr-5">
                      <p className="inline">
                        {" "}
                        {project.end_datetime
                          ? dateFormat(project.end_datetime)
                          : "ยังไม่กำหนด"}
                      </p>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 mt-5 mr-5">
                    <button
                      className="text-[#559744] bg-white border-4 rounded-3xl text-base px-6 py-1 inline-flex items-center justify-center  mx-3 mb-2"
                      onClick={() => {
                        showFileOnClick(project.Tor_uri);
                      }}
                    >
                      <BsDownload className="text-xl w-4 h-4 mr-2" />
                      TOR
                    </button>
                    <button
                      className="text-[#2B3467] bg-white border-4 rounded-3xl text-base px-6 py-1 text-center inline-flex items-center justify-center mx-3 mb-2"
                      onClick={() => {
                        showFileOnClick(project?.Job_description_uri || "");
                      }}
                    >
                      <BsDownload className="text-xl w-4 h-4 mr-2" />
                      ใบแจ้งงาน
                    </button>

                    <button
                      className={`${
                        project?.status_name === "เสร็จสิ้นการประกวด"
                          ? "text-[#559744] bg-white border-4 rounded-3xl text-base font-extralight px-6 py-1 text-center inline-flex items-center justify-center mx-3 mb-2"
                          : "text-gray-500 bg-gray-200 border-4 rounded-3xl text-base font-extralight px-6 py-1 text-center inline-flex items-center justify-center mx-3 mb-2 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (project.status_name === "เสร็จสิ้นการประกวด") {
                          handleClickopen(project.key);
                        }
                      }}
                    >
                      {" "}
                      ประกาศผล
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="flex justify-between my-6 px-[2rem]">
        <p className="py-2">
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
    </div>
  );
}
