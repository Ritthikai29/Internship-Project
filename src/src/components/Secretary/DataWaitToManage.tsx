import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { PiPaperclipLight } from "react-icons/pi";
import { GetAllProjectWaitForOpenBidding } from "../../services/SecretaryService/HttpClientService";
import { showFileOnClick } from "../../services/utilitity";
import TableLoader from "../PreLoadAndEtc/ComponentLoader";

export default function DataWaitToManage() {
  interface ConsultInterface {
    key: string;
    name: string;
    division_name: string;
    department_name: string;
    SECTION: string;
    SUBSECTION: string;
    Tor_uri: string;
    totalVendor: string;
    totalVendorRegistor: string;
  }

  const [loading, setLoading] = useState(true);
  const [consults, setConsults] = useState<ConsultInterface[]>([]);
  const [consultsSearch, setConsultsSearch] = useState<ConsultInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Event handler for handling changes in the input field
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (searchTerm === "") {
      setConsults(consultsSearch);
    } else {
      const foundProject = consultsSearch.filter((consults) => {
        return (
          consults.name.toLowerCase().includes(searchTerm) ||
          consults.key.toLowerCase().includes(searchTerm)
        );
      });
      setConsults(foundProject);
    }
  };

  const getAllProjectWaitForOpenBidding = async () => {
    try {
      const res = await GetAllProjectWaitForOpenBidding();
      if (res.status !== 200) {
        alert(res.err);
      }
      setConsults(res.data);
      setConsultsSearch(res.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllProjectWaitForOpenBidding();
    const requestInterval = setInterval(getAllProjectWaitForOpenBidding, 6000);
    return () => {
      clearInterval(requestInterval);
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col m-3 px-10 py-12 rounded-2xl">
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
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="rounded-lg border mt-8">
          <table className="w-full rounded-lg table-fixed">
            <thead className="text-white bg-[#2B2A2A] h-14 rounded-lg">
              <tr className="rounded-lg text-xl">
                <th className="rounded-tl-lg">เลขที่เอกสาร</th>
                <th>ชื่อโครงการ</th>
                <th>สังกัด</th>
                <th>TOR</th>
                <th className="rounded-tr-lg">จำนวนผู้เข้าร่วมประกวด</th>
              </tr>
            </thead>
            {loading ? (
              <TableLoader column={5} />
            ) : (
              <tbody className="border-b-lg rounded-xl h-14">
                {Array.isArray(consults) &&
                  consults.map((item) => (
                    <tr
                      key={item.key}
                      className="border-b text-xl text-center h-16"
                      style={{ verticalAlign: "top" }}
                    >
                      <td className="pt-4 pb-4">{item.key}</td>
                      <td className="pt-4 pb-4 text-left">{item.name}</td>
                      <td className="pt-4 pb-4 pl-3 text-left">
                      <p
                            className="inline"
                            title={
                                `${item.division_name} / ${item.department_name} / ${item.SECTION} / ${item.SUBSECTION} `.length > 20 ? 
                                `${item.division_name} / ${item.department_name} / ${item.SECTION} / ${item.SUBSECTION}` : undefined
                            }
                        >
                            {`$${item.division_name} / ${item.department_name} / ${item.SECTION} / ${item.SUBSECTION}`.length> 20
                                ?`${item.division_name} / ${item.department_name} / ${item.SECTION} / ${item.SUBSECTION}`.slice(0, 20) + "..."
                                : `${item.division_name} / ${item.department_name} / ${item.SECTION} / ${item.SUBSECTION}`}
                        </p>
                        
                      </td>
                      <td className="flex justify-center items-centet py-3 pt-4 pb-4">
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
                      <td className="text-[#005EEA] pt-4 pb-4">
                        {item.totalVendorRegistor}/{item.totalVendor}
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
