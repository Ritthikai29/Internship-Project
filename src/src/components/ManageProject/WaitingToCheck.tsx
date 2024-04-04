import { useEffect, useRef, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi"
import { RxCrossCircled } from "react-icons/rx"
import { ListTopicValidateProject, ProjectWaitInterface, RejectProjectValidateInterface } from "../../models/Project/IListWaitProject";
import { ListDocsWaitingProject, ListProjectWithStatusSearch } from "../../services/ProjectWithStatusService/ProjectWithStatusService";
import { datetimeFormatter } from "../../services/utilitity";
import ReactPaginate from "react-paginate";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  ApproveProjectByKey,
  ListRejectTopicValidate,
  RejectProjectByKey,
} from "../../services/ProjectWithStatusService/ProjectWaitingService";
import { showFileOnClick } from "../../services/utilitity";

export default function SendInviteLatter() {
    const [listProjects, setListProjects] = useState<ProjectWaitInterface[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalProject, setTotalProject] = useState(0);
    const [listReject, setListReject] = useState<ListTopicValidateProject[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const selectionRef = useRef<HTMLSelectElement>(null);
    const inputDetailRejectRef = useRef<HTMLTextAreaElement>(null);

    const listProject = async (numberOfPage: number, searchName: string) => {
        let res;
        if (searchName.trim() === "") {
            res = await ListDocsWaitingProject(numberOfPage * 5, 5);
        } else {
            res = await ListProjectWithStatusSearch(numberOfPage * 5, 5, 1, searchName);
        }
        // Update the state with the fetched projects
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

  const handleApproveOnClick = (key: string) => {
    let MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <p className="text-[#2B3467] text-4xl">ยืนยันการดำเนินการ</p>,
      confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>,
      icon: "question",
      confirmButtonColor: "#EB455F",
      showCancelButton: true,
      cancelButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>,
      cancelButtonColor: "#979797",
      preConfirm: async () => {
        let res = await ApproveProjectByKey(key);
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
        setListProjects([]);
        listProject(currentPage, searchTerm);
      }
    });
  };

    const handleRejectOnClick = async (key: string) => {
        let MySwal = withReactContent(Swal);
        MySwal.fire({
          title: <p>กรุณาระบุเหตุผล</p>,
          icon: "question",
          html: (
            <div>
              <p className="text-red-500 text-xl font-extrabold">
                คำเตือน หากยืนยันแล้วจะไม่สามารถแก้ไขได้
              </p>
              <p className="text-red-500 mb-3 text-xl font-extrabold">
                กรุณาตรวจสอบอีกครั้งก่อนยืนยัน
              </p>
              <div className="flex flex-col gap-4">
                <select
                  className="border p-2 text-2xl"
                  defaultValue={"DEFAULT"}
                  ref={selectionRef}
                >
                  <option key={"DEFAULT"} value={"DEFAULT"} disabled>
                    เหตุผลการปฏิเสธ
                  </option>
                  {listReject.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.reason}
                    </option>
                  ))}
                </select>
                <textarea
                  className="border p-2 text-2xl"
                  placeholder="รายละเอียดเพิ่มเติม"
                  ref={inputDetailRejectRef}
                />
              </div>
            </div>
          ),
          showCancelButton: true,
          confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>,
          confirmButtonColor: "#EB455F",
          cancelButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>,
          preConfirm: async () => {
            let data: RejectProjectValidateInterface = {
              project_key: key,
              reject_id: parseInt(
                (selectionRef.current?.value as string) || "",
                10
              ),
              comment: inputDetailRejectRef.current?.value || "",
            };
    
            let res = await RejectProjectByKey(data);
            if (res.status !== 200) {
              MySwal.showValidationMessage(res.err);
            }
            return res.data;
          },
        }).then((response) => {
          if (response.isConfirmed) {
            MySwal.fire({
              title: <h1 className="text-4xl text-[#4BAE4F]">ดำเนินการสำเร็จ!</h1>,
              icon: "success",
              confirmButtonText: (
                <p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>
              ),
              confirmButtonColor: "#2B3467",
            });
            setListProjects([]);
            listProject(currentPage, searchTerm);
          }
        });
      };
    

    const loadRejectTopic = async () => {
        let reject = await ListRejectTopicValidate();
        setListReject(reject.data);
      };    

  // handle when user click a project
  const handleOnClickProject = (keyInput: string) => {
    let MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <p className="text-[#2B3467] text-4xl">ตรวจสอบโครงการ</p>,
      html: (
        <div className="flex justify-between gap-4">
          <div>
            <button
              className="flex rounded-lg flex-col justify-center items-center py-12 px-14 bg-[#2B3467] text-white text-2xl"
              onClick={() => handleApproveOnClick(keyInput)}
            >
              <BiSearchAlt className="text-8xl mb-3" />
              อนุมัติ
            </button>
          </div>
          <div>
            <button
              className="flex rounded-lg flex-col justify-center items-center py-12 px-14 bg-[#DF1E3C] text-white text-2xl"
              onClick={() => handleRejectOnClick(keyInput)}
            >
              <RxCrossCircled className="text-8xl mb-3" />
              ปฏิเสธ
            </button>
          </div>
        </div>
      ),
      showConfirmButton: false,
    });
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
        loadRejectTopic();
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
                        <td className="text-center py-3">{listProject.key}</td>
                        <td className="text-left py-3">{listProject.name}</td>
                        <td className="text-center py-3">
                          {datetimeFormatter(listProject.add_datetime)}
                        </td>
                        <td
                          className="text-center text-lg py-3 hover:text-violet-400"
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
                        <td className="text-center grid grid-cols-4 mx-4.5 py-4 justify-center">
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
                        <td className="text-center py-3">
                          {listProject.status_name}
                        </td>
                        <td className="text-center py-3">
                          <button
                            data-modal-target="popup-modal"
                            data-modal-toggle="popup-modal"
                            className="p-1.5 border rounded-3xl px-10 bg-white text-[#F22738] text-lg drop-shadow-md"
                            onClick={() =>
                              handleOnClickProject(listProject.key || "")
                            }
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
                  nextLinkClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                  previousClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                  breakClassName="text-[#EB455F]"
                  onPageChange={handlePaginationClick}
                  pageCount={totalPages}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={1}
                  nextLabel=">"
                  previousLabel="<"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
