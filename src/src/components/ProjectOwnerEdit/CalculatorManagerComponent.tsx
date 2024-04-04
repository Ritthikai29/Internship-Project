import React, { useEffect, useState } from 'react'
import { GiReceiveMoney } from 'react-icons/gi'
import AsyncSelect from 'react-select/async'
import {components} from 'react-select'
import { GetAllManagerOfProjectByProjectKey } from '../../services/EditProjectService/EditProjectService'

export default function CalculatorManagerComponent() {
  const queryParameters = new URLSearchParams(location.search)

  const [calculator, setCalculator] = useState<any>();
  const [verifier, setVerifier] = useState<any>();
  const [verifier2, setVerifier2] = useState<any>();
  const [approver1, setApprover1] = useState<any>();
  const [approver2, setApprover2] = useState<any>();

 
  const getAllManager = async () => {
    let res = await GetAllManagerOfProjectByProjectKey(queryParameters.get("project_key") || "");
    setCalculator({
      label: res.data[0].employeeNO +" "+ res.data[0].nametitle_t +" "+ res.data[0].firstname_t +" "+ res.data[0].lastname_t ,
      value: res.data[0].firstname_t 
    })
    setVerifier({
      label: res.data[1].employeeNO +" "+ res.data[1].nametitle_t +" "+ res.data[1].firstname_t +" "+ res.data[1].lastname_t ,
      value: res.data[1].firstname_t 
    })
    setVerifier2({
      label: res.data[2].employeeNO +" "+ res.data[2].nametitle_t +" "+ res.data[2].firstname_t +" "+ res.data[2].lastname_t ,
      value: res.data[2].firstname_t 
    })
    setApprover1({
      label: res.data[3].employeeNO +" "+ res.data[3].nametitle_t +" "+ res.data[3].firstname_t +" "+ res.data[3].lastname_t ,
      value: res.data[3].firstname_t 
    })
    setApprover2({
      label: res.data[4].employeeNO +" "+ res.data[4].nametitle_t +" "+ res.data[4].firstname_t +" "+ res.data[4].lastname_t ,
      value: res.data[4].firstname_t 
    })
    console.log(res.data)
  }
  

  useEffect(() => {
    getAllManager();
  }, [])
  return (
    <div className='mt-5 xl:border p-2 w-full rounded-lg bg-zinc-200'>
      <div className='py-2 pl-2 bg-[#2B3467] rounded-t-2xl mx-4 mt-4 flex items-center'>
        <GiReceiveMoney className="text-5xl m-4 text-white" />
        <p className='font-black text-3xl m-4 text-white'>รายชื่อผู้กำหนดราคากลาง</p>
      </div>
      <div className='border rounded-2xl m-4 px-2 md:px-1 lg:px-28 my-4 bg-white'>
        <ul className='flex flex-col gap-4 justify-center items-center my-4'>
          <li className='my-0.5  w-full'>
          <span className="text-black md:text-xl  font-bold w-full pl-2 "> ผู้คำนวณราคากลาง</span>
            <AsyncSelect 
             placeholder="ผู้คำนวณราคากลาง"
            defaultOptions={[calculator]}
            value={calculator}
            />
          </li>
          <li className='my-0.5  w-full'>
          <span className="text-black md:text-xl  font-bold w-full pl-2 "> ผู้ตรวจสอบราคากลาง</span>
          <AsyncSelect 
           placeholder="ผู้ตรวจสอบราคากลาง"
            defaultOptions={[verifier]}
            value={verifier}/>
          </li>
          <li className='my-0.5  w-full'>
          <span className="text-black md:text-xl  font-bold w-full pl-2 "> ผู้ตรวจสอบราคากลาง 2 <span className="text-red-500 md:text-lg  font-bold w-full pl-2 ">( ถ้ามี )</span></span>
          <AsyncSelect 
           placeholder="ผู้ตรวจสอบราคากลาง 2"
            defaultOptions={[verifier2]}
            value={verifier2}/>
          </li>
          <li className='my-0.5  w-full'>
          <span className="text-black md:text-xl  font-bold w-full pl-2 "> ผู้อนุมัติลำดับที่ 1
          <span className="text-red-500 md:text-lg  font-bold w-full pl-2 ">( หากราคากลางของโครงการมากกว่า 500,000 จะส่งไปให้ผู้อนุมัติ 2 อัตโนมัติ )</span>
          </span>
          <AsyncSelect 
           placeholder="ผู้อนุมัติลำดับที่ 1"
            defaultOptions={[approver1]}
            value={approver1}/>
          </li>
          <li className='my-0.5  w-full'>
          <span className="text-black md:text-xl  font-bold w-full pl-2 "> ผู้อนุมัติลำดับที่ 2</span>
          <AsyncSelect 
           placeholder="ผู้อนุมัติลำดับที่ 2"
            defaultOptions={[approver2]}
            value={approver2}/>
          </li>
        </ul>
      </div>
    </div>
  )
}
