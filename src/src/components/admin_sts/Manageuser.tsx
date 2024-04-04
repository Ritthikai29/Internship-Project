import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import Presentuser from './Presentuser';
import Adduser from './Adduser';

export default function Manageuser() {
    const location = useLocation();
    const enableComponent = location.state?.project_set;
    const [paging, setPaging] = useState<string>(
        enableComponent || "manageuser"
      );

      const setPresentuser = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("presentuser");
      };
    
      const setAdduser = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("adduser");
      };
    
  return (
    <div>
        <div className="gird grid-cols-2 justify-center items-center">
                <div className="grid grid-cols-2 gap-2  h-16 text-2xl font-bold rounded-bl-lg rounded-br-lg my-4">
                    <button className={`border rounded-lg
                        ${paging === "presentuser" ? "bg-[#1D5182] text-white" : "bg-[#4B82A9] text-white"}`}
                        onClick={setPresentuser}>
                        ผู้ใช้ปัจจุบัน</button>
                    <button className={`border rounded-lg
                        ${paging === "adduser" ? "bg-[#1D5182] text-white" : "bg-[#4B82A9] text-white"}`}
                        onClick={setAdduser}>
                        เพิ่มผู้ใช้</button>
                </div>
                {
                    paging === "presentuser" && <Presentuser />
                }
                {
                    paging === "adduser" && < Adduser/>
                }
            </div>
          
    </div>
  )
}
