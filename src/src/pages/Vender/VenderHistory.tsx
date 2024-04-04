import { BsSearch, BsDownload } from "react-icons/bs";
import Pic from "../../assets/Vender/banner_vender_history.png";
import { divisionInterface } from "../../models/Project/IProject";
import { listVendorHistory } from "../../models/Vendor/IVendor";
import { getDivision } from "../../services/ProjectServices";
import { getListVendorHistory } from "../../services/VendorService/VendorService";
import { useEffect, useState } from "react";
import { showFileOnClick, datetimeFormatter } from "../../services/utilitity";
import ReactPaginate from "react-paginate";


export default function VenderHistory() {
  const [projects, setProject] = useState<listVendorHistory[]>([]);
  const [projectSearch, setProjectSearch] = useState<listVendorHistory[]>([]);
  const [division, setDivision] = useState<divisionInterface[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number>(99);
  const [selectedDivision, setSelectedDivision] = useState<number>(99);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProject, setTotalProject] = useState(0);
  const [originalConsults, setOriginalConsults] = useState<listVendorHistory[]>(
    []
  );
  const [originalforsearchConsults, setOriginalforsearchConsults] = useState<
  listVendorHistory[]
  >([]);

  const handlePaginationClick = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1);
    console.log(e.selected);
  };
  const [consults, setConsults] = useState<listVendorHistory[]>([]);

  const listVendorProject = async (pageNumber: any) => {
    let res = await getListVendorHistory(status);
    setProject(res.data);
    console.log(res.data)
    setProjectSearch(res.data);
    const itemsPerPage = 6;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentConsults = res.data.slice(startIndex, endIndex);
    let totalPage = Math.ceil(res.data.length / 6);
    setConsults(currentConsults);
    console.log(currentConsults)
    setTotalPages(totalPage);
    setOriginalConsults(res.data);
    setOriginalforsearchConsults(currentConsults);
    setTotalProject(res.data.length);
  };
  const InputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    console.log(searchTerm);
    setSearchTerm(searchTerm);
    if (searchTerm === "") {
      setConsults(originalforsearchConsults);
    } else {
      const filteredConsults = originalConsults.filter((project) => {
        return project.name.toLowerCase().includes(searchTerm);
      });

      setConsults(filteredConsults);
    }
  };

  const listDivision = async () => {
    let res = await getDivision();
    setDivision(res.data);
  };

  const handleOnSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (searchTerm === "" && String(selectedStatus) == "99") {
      setProject(projectSearch);
    } else {
      const foundProject = projectSearch.filter(
        (project) =>
          project.name.includes(searchTerm) || project.key.includes(searchTerm)
      );

      if (String(selectedStatus) !== "99") {
        let key =
          selectedStatus === 1
            ? "ชนะการประกวด"
            : selectedStatus === 2
            ? "แพ้การประกวด"
            : selectedStatus === 3
            ? "รอเสนอราคาอีกครั้ง"
            : selectedStatus === 4
            ? "เสนอราคาแล้ว"
            : selectedStatus === 5
            ? "สละสิทธิ์"
            : "สถานะทั้งหมด";
        const filteredProjects = foundProject.filter((project) =>
          project.status_name_th.includes(key)
        );
        setProject(filteredProjects);
      } else {
        setProject(foundProject);
      }
    }
  };

  const handleOnStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    let key = "สถานะทั้งหมด";
    if (selectedValue !== 99) {
      key =
        selectedValue === 1
          ? "ชนะการประกวด"
          : selectedValue === 2
          ? "แพ้การประกวด"
          : selectedValue === 3
          ? "รอเสนอราคาอีกครั้ง"
          : selectedValue === 4
          ? "เสนอราคาแล้ว"
          : selectedValue === 5
          ? "สละสิทธิ์"
          : "สถานะทั้งหมด";
    }
    setSelectedStatus(selectedValue);
  
    if (selectedValue === 99) {
      setProject(projectSearch);
    } else {
      getListVendorHistory(selectedValue.toString()).then((res) => {
        setProject(res.data);
        setProjectSearch(res.data);
        const itemsPerPage = 6;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentConsults = res.data.slice(startIndex, endIndex);
        let totalPage = Math.ceil(res.data.length / 6);
        setConsults(currentConsults);
        setTotalPages(totalPage);
        setOriginalConsults(res.data);
        setOriginalforsearchConsults(currentConsults);
        setTotalProject(res.data.length);
      }).catch(error => {
        console.error("Error fetching projects:", error);
      });
    }
  };

  useEffect(() => {
    listDivision();
    listVendorProject(currentPage);
  }, [currentPage, projects]);

  return (
    <div>
      <div className="px-4">
        <div
          style={{ backgroundImage: `url(${Pic})` }}
          className="px-full h-96 flex justify-end items-end"
        >
          <p className="pb-12 pr-12 text-white text-7xl font-bold">
            ประวัติการเข้าร่วม
          </p>
        </div>
      </div>
      <div className=" flex justify-between items-center">
      <div className="px-[2rem] py-12 rounded-2xl">
        <div className=" relative inline-block text-left">
          <div className="flex gap-4">
            <select
              className=" px-6 py-2 rounded-full border-2 text-xl bg-[#2B2A2A] text-white"
              value={selectedStatus}
              onChange={handleOnStatusChange}
            >
              <option value={99} key={99}>
                สถานะทั้งหมด
              </option>
              <option value={1} key={1}>
                ชนะการประกวด
              </option>
              <option value={2} key={2}>
                แพ้การประกวด
              </option>
              <option value={3} key={3}>
                รอเสนอราคาอีกครั้ง
              </option>
              <option value={4} key={4}>
                เสนอราคาแล้ว
              </option>
              <option value={5} key={5}>
                สละสิทธิ์
              </option>
            </select>
          </div>
        </div>
        </div>
        <div className="flex justify-end px-[3rem]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <BsSearch />
            </div>
            <input
              type="search"
              className="block w-[25rem] p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-300 rounded-lg bg-white "
              placeholder="ค้นหารายการ"
              value={searchTerm}
              onChange={InputChange}
            />
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="grid grid-cols-6 mx-10 my-10  bg-white border-2 drop-shadow-xl rounded-2xl">
        {consults.map((project: listVendorHistory) => (
          <div key={project.id} className="col-span-3 border-b-2 border-e-2 ">
            <div className="grid grid-flow-row auto-rows-auto ml-12 mt-8 mb-4">
              <p className="text-[#2B3467] text-2xl font-bold">
                ชื่อโครงการ : {project.name}
              </p>
              <div className="grid grid-cols-10">
              <label className="text-black text-base font-bold pb-2 col-span-2">
                  <p >สังกัด</p>
              </label>
              <label className="text-black text-base text-center font-normal pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-black text-base font-normal pb-2 col-span-7 mr-2">
              {project.division_name} / {project.department_name} / {project.SECTION} / {project.SUBSECTION}
                  </label>
            </div>
            <div className="grid grid-cols-10">
              <label className="text-black text-base font-bold pb-2 col-span-2">
                  <p >เลขที่เอกสาร </p>
              </label>
              <label className="text-black text-base text-center font-normal pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-black text-base font-normal pb-2 col-span-7">
              {project.key}
                  </label>
            </div>
            <div className="grid grid-cols-10">
              <label className="text-black text-base font-bold pb-2 col-span-2">
                  <p >ระยะเวลาโครงการ </p>
              </label>
              <label className="text-black text-base text-center font-normal pb-2 col-span-1 mr-3">
                  <p >:</p>
              </label>
              <label className="text-black text-base font-normal pb-2 col-span-7">
              {project.start_datetime
                  ? datetimeFormatter(project.start_datetime)
                  : "ยังไม่กำหนด"}{" "}
                -{" "}
                {project.end_datetime
                  ? datetimeFormatter(project.end_datetime)
                  : "ยังไม่กำหนด"}
                  </label>
            </div>
              <div className="grid grid-cols-3 mt-5 mr-5">
                <button
                  className="text-[#559744] bg-white border-4 rounded-3xl text-lg px-6 py-1 inline-flex items-center justify-center  mx-3 mb-2"
                  onClick={() => {
                    showFileOnClick(project.Tor_uri);
                  }}
                >
                  <BsDownload className="text-lg w-4 h-4 mr-2" />
                  TOR
                </button>
                <button className="text-[#2B3467] bg-white border-4 rounded-3xl text-lg px-1 py-1 text-center inline-flex items-center justify-center mx-2 mb-2">
                  {project.status_name_th}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
     
          <div className="my-12 flex justify-between items-center px-[3rem]">        
            <div className="">
              <p>
                Showing {currentPage} to {totalPages} of {totalProject} entries
              </p>
            </div>
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
  );
}
