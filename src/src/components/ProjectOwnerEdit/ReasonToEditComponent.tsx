import {  LuFileEdit } from "react-icons/lu";
import {  GetReasonProjectEdit } from '../../services/EditProjectService/EditProjectService'
import { useEffect, useState } from "react";
import { ReasonEditProjectInterface } from "../../models/Project/IProject";

export default function ReasonToEditComponent() {
    const queryParameters = new URLSearchParams(location.search)
    const [reason, setReason] = useState<Partial<ReasonEditProjectInterface>>({});
    const getReasonById = async () => {
        let projectId = queryParameters.get("project_id");
        if (projectId == null) {
          alert("ไม่พบโครงการ")
          throw new Error("not found project id");
        }
        let res = await GetReasonProjectEdit(projectId);
        setReason(res.data)
        console.log(res.data)
      }
    
      useEffect(() => {
        
        getReasonById()
      }, []);

        return(
            <div className='mt-5 xl:border p-2 w-full rounded-lg bg-zinc-200'>
            <div className='py-2 pl-2 bg-[#EB455F] rounded-t-2xl mx-4 mt-4 flex items-center'>
              <LuFileEdit className="text-5xl m-4 text-white" />
              <p className='font-black text-3xl m-4 text-white'>เหตุผลการปฏิเสธจากหน่วยงานจ้างเหมา</p>
            </div>
            <div className='border rounded-2xl m-4 px-2 md:px-1 lg:px-28 my-4 bg-white'>
              <ul className='flex flex-col gap-4 justify-center items-center mx-auto my-auto'>
              <li className='flex flex-col text-lg md:text-2xl  ml-4 font-bold w-full pl-2'>
                <span className="mb-4 mt-4">เหตุผลการปฏิเสธ</span>
                <span className='text-xl my-0.5 py-2 w-full  p-4 mx-auto rounded-md border-2 border-solid border-gray-300 pb-10 font-normal'>
                    {reason.reason}</span>
            </li>
            <li className='flex flex-col text-lg md:text-2xl mb-4 ml-4 font-bold w-full pl-2'>
                <span className="mb-4 mt-4"> ความคิดเห็นเพิ่มเติม</span>
                <span className='text-xl my-0.5 py-2 w-full  p-4 mx-auto rounded-md border-2 border-solid border-gray-300 pb-10 font-normal'>
                {reason.detial}</span>
                <span className="text-red-500 md:text-xl  font-bold w-full pl-2 mb-4 mt-4"> *โปรดแก้ไขข้อมูลจากเหตุผลการปฏิเสธข้างต้น เมื่อท่านดำเนินการแก้ไขเสร็จแล้ว สามารถกด "บันทึก" ระบบจะส่งข้อมูลไปยังหน่วยงานจ้างเหมาต่อไป</span>
            </li>

              </ul>
            </div>
          </div>
        )
}