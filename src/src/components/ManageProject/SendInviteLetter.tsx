import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import SendApproveLetter from "./SendApproveLetter";
import SendInviteVendor from "./SendInviteVendor";

export default function SendInviteLatter() {
  const [paging, setPaging] = useState<string>("Approve");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleClick = (page: string) => {
    setPaging(page);
  };

  const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
};

  return (
    <div>
      <div className="flex flex-col m-3 px-2 rounded-2xl">
        {/* search */}
        <div className="flex justify-end">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <BsSearch />
            </div>
            <input
              type="search"
              className="block w-[25rem] py-3 px-3 pl-10 text-xl text-gray-700 border border-gray-300 rounded-lg bg-white "
              placeholder="ค้นหา"
              onChange={handleOnSearch}
            />
          </div>
        </div>

        {/* button */}
        <div className="mt-4 grid grid-cols-2">
          <div>
            <button
              className="w-5/6 py-4 px-5 mr-2 rounded-lg bg-[#0083FF] text-white text-xl hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
              style={{ margin: "0 0 0 50px" }}
              onClick={() => {
                handleClick("Approve");
              }}
            >
              ส่งอนุมัติหนังสือเชิญ
            </button>
          </div>
          <div className="text-end">
            <button
              className="w-5/6 py-4 px-5 ml-2 rounded-lg bg-[#EB455F] text-white text-xl hover:bg-red-700 focus:outline-none focus:shadow-outline-red active:bg-red-800"
              style={{ margin: "0 50px 0 0" }}
              onClick={() => {
                handleClick("Vendor");
              }}
            >
              ส่งหนังสือเชิญให้ Vendor
            </button>
          </div>
        </div>

        <div>
          {paging === "Approve" && <SendApproveLetter searchTerm={searchTerm}/>}
          {paging === "Vendor" && <SendInviteVendor searchTerm={searchTerm}/>}
        </div>
      </div>
    </div>
  );
}
