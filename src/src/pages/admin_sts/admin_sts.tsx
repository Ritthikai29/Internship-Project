import React, { useState } from 'react'
// import Pic from "../../assets/ProjectWaitingToManaged.png";
import { useLocation } from 'react-router-dom';
import projectHeader from "../../assets/project/projectHeader.png";
import Manageuser from '../../components/admin_sts/Manageuser';
import ManageVenderList from '../../components/admin_sts/manageVenderList/ManageVenderList';
export default function Admin_sts() {
    const location = useLocation();
    const enableComponent = location.state?.project_set;
    const [paging, setPaging] = useState<string>(
        enableComponent || "manageuser"
      );

      const setManageuser = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("manageuser");
      };
    
      const setUpdatevendorlist = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("updatevendorlist");
      };
    
      const setUpdatedatabase = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("updatedatabase");
      };
  return (
    <div>
      <div className="px-4">
        <div
          style={{
            backgroundImage: `url(${projectHeader})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}
          className="w-full h-96 flex justify-end items-end"
        >
        </div>
        <div className="gird grid-cols-12 justify-center items-center drop-shadow-md">
          <div className="grid grid-cols-3 border border-separate h-20 text-2xl font-bold rounded-bl-lg rounded-br-lg">
            <button
              className={`border rounded-bl-lg

                       ${
                         paging === "manageuser"
                           ? "bg-[#188493] text-white"
                           : "bg-white text-[#4B82A9]"
                       }`}
              onClick={setManageuser}
            >
              จัดการผู้ใช้
            </button>
            <button
              className={`border
                                ${
                                  paging === "updatevendorlist"
                                    ? "bg-[#188493] text-white"
                                    : "bg-white text-[#4B82A9]"
                                }`}
              onClick={setUpdatevendorlist}
            >
              Update Vendor ในList ทะเบียน
            </button>
            <button
              className={`border
                        ${
                          paging === "specifiedenvelope"
                            ? "bg-[#188493] text-white"
                            : "bg-white text-[#4B82A9]"
                        }`}
              onClick={setUpdatedatabase}
            >
              Update Database พนักงาน
            </button>
          </div>
        </div>

        {paging === "manageuser" && <Manageuser />}
        {paging === "updatevendorlist" && <ManageVenderList />}
      </div>
    </div>
  )
}
