import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ConsultInterface } from "../../models/Secretary/ConsultInterface";
import { GetAllConsultInDay } from "../../services/SecretaryService/HttpClientService";
import { BsSearch } from "react-icons/bs";
import Pic from "../../assets/ProjectWaitingToManaged.png";
import { dateWithTimeFormatter } from "../../services/utilitity";
import LimitStringWithUrl from "../../components/PreLoadAndEtc/LongLetter";
import ReactPaginate from "react-paginate";

export default function CommitteeProjectWaitToOpen() {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProject, setTotalProject] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [originalConsults, setOriginalConsults] = useState<ConsultInterface[]>(
    []
  );
  const [originalforsearchConsults, setOriginalforsearchConsults] = useState<
    ConsultInterface[]
  >([]);
  const getAllConsultInDay = async (pageNumber: any) => {
    const res = await GetAllConsultInDay();
    console.log(res);
    if (res.status !== 200) {
      alert(res.err);
    }
    const itemsPerPage = 5;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentConsults = res.data.slice(startIndex, endIndex);
    let totalPage = Math.ceil(res.data.length / 5);
    setConsults(currentConsults);
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
        return project.open_place.toLowerCase().includes(searchTerm);
      });

      setConsults(filteredConsults);
    }
  };

  const handlePaginationClick = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1);
    console.log(e.selected);
  };
  const [consults, setConsults] = useState<ConsultInterface[]>([]);
  useEffect(() => {
    getAllConsultInDay(currentPage);
    console.log(333);
  }, [currentPage]);

  return (
    <div className="bg-[#F5F5F5]">
      <div className="px-4 mb-12">
        <div
          style={{
            backgroundImage: `url(${Pic})`,
          }}
          className="w-full h-96 flex justify-end items-end"
        >
          <p className="pb-12 pr-12 text-white text-7xl font-bold">
            โครงการที่รอเปิดซอง
          </p>
        </div>
      </div>

      {/* search */}
      <div className="flex justify-end mx-20">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BsSearch />
          </div>
          <input
            type="search"
            className="block w-[25rem] p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-400 rounded-lg bg-white "
            placeholder="ค้นหารายการ"
            value={searchTerm}
            onChange={InputChange}
          />
        </div>
      </div>

      <div className=" mx-20 my-12">
        <table className="w-full rounded-lg">
          <thead className="text-white bg-[#2B2A2A] h-14 rounded-lg">
            <tr className="rounded-lg text-xl">
              <th className="w-[12rem] rounded-tl-lg">ลำดับ</th>
              <th className="w-[]">วัน/เวลาเปิดซอง</th>
              <th className="w-[]">จำนวนโครงการ</th>
              <th className="w-[]">สถานที่</th>
              <th className="w-[] rounded-tr-lg">เปิดซอง</th>
            </tr>
          </thead>
          <tbody className="bg-white border-b-lg rounded-xl h-14">
            {Array.isArray(consults) &&
              consults.map((item, index) => (
                <tr className="border-b text-xl text-center h-16">
                  <td>{index + 1}</td>
                  <td>{dateWithTimeFormatter(item.open_datetime)} น.</td>
                  <td>{item.totalProject}</td>
                  <td>
                    <LimitStringWithUrl
                      string={item.open_place}
                      maxChars={30}
                    />
                  </td>
                  <td>
                    <Link
                      to={`/committee/projectwaittoopen/passcode?open_id=${item.id}`}
                      className="border border-gray-400 text-lg py-1 px-8 rounded-lg text-center"
                    >
                      คลิก
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="grid grid-cols-2 mt-4">

            
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
    </div>
  );
}
