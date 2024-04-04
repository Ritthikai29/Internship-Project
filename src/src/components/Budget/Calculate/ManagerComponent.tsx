import React, { useEffect, useState } from 'react'
import { GetAllManagerInProject } from '../../../services/BudgetService/CalculateService';
import { ManagerCalculator } from '../../../models/Budget/Calculate/ICalculate';

export default function ManagerComponent() {

    // should be check a parameter on url 
    const queryParameters = new URLSearchParams(window.location.search)
    const [projectKey] = useState<string>(queryParameters.get("pj") || "");
    const [managers, setManagers] = useState<ManagerCalculator[]>([]);

    const getAllManagerOfProject = async () => {
        let res = await GetAllManagerInProject(projectKey);
        if (res.status !== 200) {
            alert("ไม่พบข้อมูล กรุณาลองใหม่")
        }
        setManagers(res.data)
    }

    useEffect(() => {
        getAllManagerOfProject();
    }, [])
    return (
        <div className='flex border flex-col my-3 rounded-2xl p-10 drop-shadow-xl bg-white'>
            <div className='mb-6'>
                <h3 className='text-4xl font-bold'>รายชื่อผู้กำหนดราคากลาง</h3>
            </div>
            <hr className='mb-3' />

            <table className='table-fixed w-full'>
                <thead className='bg-[#1D5182]'>
                    <tr>
                        <th className='py-4 text-lg text-white text-center rounded-tl-lg '>
                            รหัสพนักงาน
                        </th>
                        <th className='py-4 text-lg text-white text-center'>
                            ชื่อผู้เกี่ยวข้อง
                        </th>
                        <th className='py-4 text-lg  text-white text-center rounded-tr-lg '>
                            ผู้ดำเนินการ
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        managers.map((item) => (
                            <tr className='border w-full'>
                                <td className='whitespace-no-wrap text-lg text-center border rounded py-2 px-2 focus:outline-none '>
                                    {item.employee.employeeNO}
                                </td>
                                <td className='whitespace-no-wrap text-lg text-center border rounded py-2 px-2 focus:outline-none ' >
                                    {item.employee.nametitle_t} {item.employee.firstname_t} {item.employee.lastname_t}
                                </td>
                                <td className='py-2 text-lg items-center justify-center text-center '>
                                    {item.user_role.name_t}
                                </td>
                            </tr>
                            
                        ))
                    }

                </tbody>
            </table>
        </div>
    )
}
