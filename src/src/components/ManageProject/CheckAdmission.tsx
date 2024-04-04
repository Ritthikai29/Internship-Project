import { useEffect, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import {
  ProjectWaitInterface,
  ListTopicValidateProject,
} from "../../models/Project/IListWaitProject";
import { ListOpenInvite, ListProjectWithStatusSearch } from "../../services/ProjectWithStatusService/ProjectWithStatusService";
import ReactPaginate from "react-paginate";
import { datetimeFormatter } from "../../services/utilitity";
import { showFileOnClick } from "../../services/utilitity";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SendInviteLatter() {
  const navigate = useNavigate();
  const [listProjects, setListProjects] = useState<ProjectWaitInterface[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProject, setTotalProject] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const listProject = async (numberOfPage: number, searchName: string) => {
    let res;
    if (searchName.trim() === "") {
        res = await ListOpenInvite(numberOfPage * 5, 5);
    } else {
        res = await ListProjectWithStatusSearch(numberOfPage * 5, 5, 5, searchName);
    }
    setListProjects(res.data);
    setTotalProject(res.total);
    let totalPage = Math.ceil(res.total / 5);
    setTotalPages(totalPage);
  };

  const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
  };

  const handlePaginationClick = (e: { selected: number }) => {
    setCurrentPage(e.selected);
  };

  const showFullaffiliationNamePopup = (name: string) => {
    Swal.fire({
      title: "สังกัด",
      html: `<div>${name}</div>`,
      confirmButtonText: "ปิด",
      width: "40%",
    });
  };

  useEffect(() => {
    setListProjects([]);
    listProject(currentPage, searchTerm);
    const requestInterval = setInterval(() => {
      listProject(currentPage, searchTerm);
    }, 5500);
    return () => {
      clearInterval(requestInterval);
    };
  }, [currentPage, searchTerm]);
  return (
    <div>
      <div className="flex flex-col m-3 px-10 py-2 rounded-2xl">
        {/* search */}
        <div className="flex justify-end">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <BsSearch />
            </div>
            <input
              type="search"
              className="block w-[25rem] p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-300 rounded-lg bg-white "
              placeholder="ค้นหา"
              onChange={handleOnSearch}
            />
          </div>
        </div>

        {/* lists */}
        <div className="rounded-lg border mt-8">
          <table className="w-full rounded-lg table-fixed">
            <thead className="text-white bg-[#2B2A2A] h-14 rounded-lg">
              <tr className="rounded-lg text-xl">
                <th className="rounded-tl-lg">เลขที่เอกสาร</th>
                <th>ชื่อโครงการ</th>
                <th>วันที่เพิ่มโครงการ</th>
                <th>สังกัด</th>
                <th className="w-[12rem]">ดาวน์โหลดเอกสาร</th>
                <th>สถานะ</th>
                <th className="rounded-tr-lg">ตรวจสอบโครงการ</th>
              </tr>
            </thead>
            {Array.isArray(listProjects) &&
              listProjects.map((listProject) => (
                <tbody className="border-b-lg rounded-xl h-14">
                  <tr
                    key={listProject.id}
                    className="border-b text-xl"
                    style={{ verticalAlign: "top" }}
                  >
                    <td className="text-center py-4">{listProject.key}</td>
                    <td className="text-left py-4">{listProject.name}</td>
                    <td className="text-center py-4">
                      {datetimeFormatter(listProject.add_datetime)}
                    </td>
                    <td
                      className="text-left text-lg py-3 hover:text-violet-400"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        showFullaffiliationNamePopup(
                          `${listProject.division_name} / ${listProject.department_name} / ${listProject.SECTION} / ${listProject.SUBSECTION}`
                        )
                      }
                    >
                      {`${listProject.division_name} / ${listProject.department_name} / ${listProject.SECTION} / ${listProject.SUBSECTION}`
                        .length > 15
                        ? `${`${listProject.division_name} / ${listProject.department_name} / ${listProject.SECTION} / ${listProject.SUBSECTION}`.substring(
                            0,
                            12
                          )}...`
                        : `${listProject.division_name} / ${listProject.department_name} / ${listProject.SECTION} / ${listProject.SUBSECTION}`}
                    </td>
                    <td className="text-center grid grid-cols-4 mx-4.5 my-4 justify-center">
                      <button
                        className="p-1.5 pl-3.5 w-[11rem] border col-start-1 col-end-5 rounded-3xl bg-white text-[#2B3467] text-base drop-shadow-md grid grid-cols-4 justify-self-center"
                        onClick={() => {
                          showFileOnClick(
                            listProject?.Job_description_uri || ""
                          );
                        }}
                      >
                        <BsDownload className="col-start-1 text-xl self-center" />
                        <p className="col-start-2 col-end-4 items-center text-lg">
                          ใบแจ้งงาน
                        </p>
                      </button>
                      <div className="my-1"> </div>
                      <button
                        className="p-1.5 pl-3.5 w-[11rem] border col-start-1 col-end-5 rounded-3xl bg-white text-[#559744] text-base drop-shadow-md grid grid-cols-4 justify-self-center"
                        onClick={() => {
                          showFileOnClick(listProject?.Tor_uri || "");
                        }}
                      >
                        <BsDownload className="col-start-1 text-xl self-center" />
                        <p className="col-start-2 col-end-4 items-center text-lg">
                          TOR
                        </p>
                      </button>
                    </td>
                    <td className="text-center py-4">
                      {listProject.status_name}
                    </td>
                    <td className="text-center py-4">
                      <button
                        className="p-1.5 border rounded-3xl px-10 bg-white text-[#F22738] text-lg drop-shadow-md"
                        onClick={() => {
                          navigate(
                            `/contractor/contractorchecklist?key=${listProject.key}`
                          );
                        }}
                      >
                        คลิก
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>

        <div className="my-12">
          <p>
            Showing {currentPage + 1} to {totalPages} of {totalProject} entries
          </p>
          <div className="flex justify-end">
            <ReactPaginate
              className="flex gap-5 col-start-10 col-end-12 "
              pageClassName="flex justify-center items-center w-10 h-10 text-[#EB455F] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100 border"
              activeClassName="w-10 h-10 text-white transition-colors duration-150 bg-[#EB455F] border border-r-0 border-[#EB455F] rounded-full focus:shadow-outline"
              onPageChange={handlePaginationClick}
              breakClassName="text-[#EB455F]"
              pageCount={totalPages}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              nextLabel=">"
              previousLabel="<"
              nextLinkClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
              previousClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
