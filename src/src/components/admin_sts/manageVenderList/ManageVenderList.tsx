import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import UpdateVenderList from './UpdateVenderList'
import AddVenderList from './AddVenderList';


export default function ManageVenderList() {
  const location = useLocation();
  const enableComponent = location.state?.project_set;
  const [paging, setPaging] = useState<string>(
    enableComponent || "updatevendorlist"
  );

  const setUpdateVenderList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPaging("updateVenderList");
  };

  const setAddVenderList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPaging("addVenderList");
  };

  useEffect(() => {
    setPaging("updateVenderList");
  },[])
  return (
    <div>
        <div className="gird grid-cols-2 justify-center items-center">
                <div className="grid grid-cols-2 gap-2  h-16 text-2xl font-bold rounded-bl-lg rounded-br-lg my-4">
                    <button className={`border rounded-lg
                        ${paging === "updateVenderList" ? "bg-[#1D5182] text-white" : "bg-[#4B82A9] text-white"}`}
                        onClick={setUpdateVenderList}>
                        ข้อมูล Vender ใน list ปัจจุบัน</button>
                    <button className={`border rounded-lg
                        ${paging === "addVenderList" ? "bg-[#1D5182] text-white" : "bg-[#4B82A9] text-white"}`}
                        onClick={setAddVenderList}>
                        เพิ่มข้อมูล Vender ใน list</button>
                </div>
                {
                    paging === "updateVenderList" && <UpdateVenderList />
                }
                {
                    paging === "addVenderList" && < AddVenderList/>
                }
            </div>
          
    </div>
  )
}
