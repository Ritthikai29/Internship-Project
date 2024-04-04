import { Link, useNavigate } from "react-router-dom";
import Pic from "../../assets/ProjectWaitingToManaged.png";
import { useEffect, useState } from "react";
import { GetAllProjectByUserId } from "../../services/ProjectService/ProjectService";
import { GetAllListStatus } from "../../services/ProjectServices";
import {
  datetimeFormatter,
  showFileOnClick,
} from "../../services/utilitity";
import { IListProject } from "../../models/Project/IProject";
import { status } from "../../models/Project/IProject";
import ReactPaginate from "react-paginate";
import { BsDownload } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";

const statusall = {
  key: "99",
  id: "99", // ตัวอย่าง: ให้ใช้ฟังก์ชันที่สร้าง ID ใหม่
  status_name: "สถานะโครงการทั้งหมด",
  category: "ทั้งหมด",
};

export default function ManageProject() {
  // allow to use any for speed code
  const [project, setProject] = useState<IListProject[]>([]);
  const [projectSearch, setProjectSearch] = useState<IListProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<IListProject[]>([]);

  // const [statusSearch, setStatusSearch] = useState<any>();
  const [status, setStatus] = useState<status[]>([]);
  const [statusBar, setStatusBar] = useState<status[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number>(99);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  
  const handleClickopen = ( key : any) => {
    navigate(`/project/AnnouncementResultComponent/${key}`);
}

const handleClickEditopen = ( key : any , id : any) => {
  navigate(`/project/edit?project_key=${key}&project_id=${id}`);
}
  // const [totalProject, setTotalProject] = useState(0);
  const getListProjects = async () => {
    const res = await GetAllProjectByUserId(0,9999);
    setProject(res.data);
    setProjectSearch(res.data);
    console.log(res.data)
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };
  

  const getStatus = async () => {
    const res = await GetAllListStatus();
    setStatus(res.data);
    setStatusBar([statusall, ...res.data]);
  };

  // State for the search input value
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Event handler for handling changes in the input field
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  
    if (searchTerm === '' && String(selectedStatus) === "99") {
      setProject(projectSearch);
    } else {
      const foundProject = projectSearch.filter((project) => {
        return (
          project.name.toLowerCase().includes(searchTerm) ||
          project.key.toLowerCase().includes(searchTerm) ||
          project.add_year.toLowerCase().includes(searchTerm)
        );
      });
  
      if (String(selectedStatus) !== "99") {
        const filteredProjects = foundProject.filter(
          (project) =>
            project.status_name.includes(statusBar[selectedStatus].status_name)
        );
        setProject(filteredProjects);
      } else {
        setProject(foundProject);
      }
    }
  };
  
  

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedStatus(selectedValue);
  
    if (selectedValue === 99) {
      setProject(projectSearch);
    } else {
      const foundProject = projectSearch.filter((project) => {
        return (
          (
            project.name.toLowerCase().includes(searchTerm) ||
            project.key.toLowerCase().includes(searchTerm) ||
            project.add_year.toLowerCase().includes(searchTerm) 
          && project.status_name.includes(status[selectedValue - 1].status_name)
        ));
      });
  
      if (String(selectedStatus) !== "99") {
        const filteredProjects = foundProject.filter(
          (project) =>
            project.status_name.includes(statusBar[selectedStatus + 1].status_name)
        );
        setProject(filteredProjects);
      } else {
        setProject(foundProject);
      }
    }
  };
  
  
  
  

  useEffect(() => {
    getListProjects();
    getStatus();
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
            จัดการโครงการ
          </p>
        </div>
      </div>
      <div className="px-[2rem] mx-auto py-12 rounded-2xl">
        {/* button */}
        <div className="grid">
          <Link
            to={"/project/create"}
            className="py-5 bg-[#EB455F] hover:bg-[#EB455F]/70 text-white text-center text-4xl rounded-lg"
          >
            เพิ่มโครงการ +
          </Link>
        </div>

        {/* drop down + search */}
        <div className="flex justify-between my-6">
        <div className="relative">
          <select
            className=" px-6 py-2 rounded-full border-2 text-2xl bg-white shadow-md appearance-none pr-12"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option disabled value="" className="text-gray-400"></option>
            {statusBar.map((item: status) => (
              <option value={item.id} key={item.id} defaultValue={99}>
                {item.status_name}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute top-0 right-0 mt-4 mr-6 pointer-events-none" />
          </div>
          <div className="relative">
            <div>
              <form>
                <input
                  className="block w-[25rem] p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-300 rounded-lg bg-white"
                  type="text"
                  placeholder="ค้นหาโครงการ"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
              </form>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full table-auto overflow-hidden rounded-lg">
  <thead className="h-14 border-b-2">
    <tr className="bg-[#2B2A2A] text-white text-lg">
      <th className="w-[20rem] rounded-tl-lg">เลขที่เอกสาร</th>
      <th className="w-[90rem]">ชื่อโครงการ</th>
      <th className="w-[40rem]">วันที่เพิ่ม</th>
      <th className="w-[40rem]">เอกสาร</th>
      <th className="w-[10rem]">ประกาศผล</th>
      <th className="w-[10rem]">การจัดการ</th>
      <th className="w-[70rem] rounded-tr-lg">สถานะ</th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(project) &&
      project
        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        .map((item, index) => (
          <tr key={index} className="text-lg text-center border-2 rounded-lg" style={{ verticalAlign: "top" }}>
            <td className="py-3.5">{item.key}</td>
            <td className="py-3.5 text-left">{item.name}</td>
            <td className="py-3.5">{datetimeFormatter(item.add_datetime)}</td>
            <td className="py-3.5 text-center space-y-1">
              <button
                className="w-[11rem] p-1.5 pl-3.5 mx-auto border rounded-3xl bg-white text-[#2B3467] text-lg drop-shadow-md grid grid-cols-4 justify-self-center"
                onClick={() => {
                  showFileOnClick(item.Job_description_uri);
                }}
              >
                <BsDownload className="text-xl self-center " />
                <p className="col-span-3 text-lg">ใบแจ้งงาน</p>
              </button>
              <div className="my-1"></div>
              <button
                className="w-[11rem] p-1.5 pl-3.5 mx-auto border rounded-3xl bg-white text-[#559744] text-lg drop-shadow-md grid grid-cols-4 justify-self-center"
                onClick={() => {
                  showFileOnClick(item.Tor_uri);
                }}
              >
                <BsDownload className="text-xl self-center" />
                <p className="col-span-3 text-lg">TOR</p>
              </button>
            </td>
            <td className="py-3.5">
              <button
                className={`${
                  item.status_name === "เสร็จสิ้นการประกวด"
                    ? "text-[#42a339] bg-white w-[5rem] border-4 rounded-3xl font-extralight px-3 py-1 text-center inline-flex items-center justify-center mx-3 mb-2"
                    : "text-gray-500 bg-gray-200 w-[5rem] border-4 rounded-3xl font-extralight px-3 py-1 text-center inline-flex items-center justify-center mx-3 mb-2 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (item.status_name === "เสร็จสิ้นการประกวด") {
                    handleClickopen(item.key);
                  }
                }}
              >
                คลิก
              </button>
            </td>
            <td className="py-3.5">
              <button
                className={`${
                  item.status_name === "ต้องแก้ไขเอกสาร"
                    ? "text-[#D43232] bg-white w-[5rem] border-4 rounded-3xl font-extralight px-3 py-1 text-center inline-flex items-center justify-center mx-3 mb-2"
                    : "text-gray-500 bg-gray-200 w-[5rem] border-4 rounded-3xl font-extralight px-3 py-1 text-center inline-flex items-center justify-center mx-3 mb-2 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (item.status_name === "ต้องแก้ไขเอกสาร") {
                    handleClickEditopen(item.key, item.id);
                  }
                }}
              >
                แก้ไข
              </button>
            </td>
            <td className="py-3.5 pr-4">{item.status_name}</td>
          </tr>
        ))}
  </tbody>
</table>

       
        </div>
        <div className="flex justify-between my-6 ">
        <p className="px-[2rem]">Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, project.length)} of {project.length} entries</p>
                     <div className="flex justify-end">
                        <ReactPaginate
                            className="flex gap-5 col-start-10 col-end-12 "
                            pageClassName="flex justify-center items-center w-10 h-10 text-[#EB455F] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100 border"
                            activeClassName="w-10 h-10 text-white transition-colors duration-150 bg-[#EB455F] border border-r-0 border-[#EB455F] rounded-full focus:shadow-outline"
                            nextLinkClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                            previousClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                            breakClassName="text-[#EB455F]"
                            onPageChange={handlePageChange}
                            pageCount={Math.ceil(project.length / itemsPerPage)}  
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={1}
                            nextLabel=">"
                            previousLabel="<"
                            breakLabel={'...'}
                        />
                    </div>
                </div>
      </div>
    </div>
  );
}
