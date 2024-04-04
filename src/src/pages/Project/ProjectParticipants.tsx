import React, { useEffect, useState, useRef } from 'react';
import CommitteeIcon from "../../assets/project/committee-icon.png";
import VenderIcon from "../../assets/project/vener-icon.png";

import { BiSolidLeftArrow } from "react-icons/bi"
import { detailmanager } from '../../services/ProjectServices';
import { detailmanagerInterface } from '../../models/Project/IProjectSetting';


export default function ProjectParticipants() {

    const [Detailmanager, setDetailmanager] = useState<detailmanagerInterface>();


const getDetadetailmanager = async (key: string) => {
    let res = await detailmanager(key);
    if (res.status !== 200) {
        alert("err")
        return;
    }
    
    setDetailmanager(res.data);
   
    console.log(res.data)

}


useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const idString = queryParams.get('key');

    // ตรวจสอบว่า idString ไม่ใช่ null หรือ undefined ก่อนที่จะแปลงเป็น number
    if (idString !== null && idString !== undefined) {
        const projectKey = String(idString);
        getDetadetailmanager(projectKey);

    }


}, []);

    return (
        <div className="bg-[#F3F3F3]">
            <div className="px-[8rem] py-12 rounded-2xl">
                <div className="bg-[#F3F3F3] drop-shadow-lg rounded-3xl border w-full mb-12">
                    <div className="bg-[#2B3467] pl-16 py-3 my-3 mx-3 text-white rounded-t-2xl flex items-center">
                        <img src={CommitteeIcon} className="h-14" />
                        <p className="text-white text-3xl font-bold ml-8">รายชื่อคณะกรรมการเปิดซอง</p>
                    </div>
                    <div className="bg-white rounded-3xl border drop-shadow-md px-12 py-3 my-3 mx-3">
                        <div className="overflow-x-auto">
                            <table className="table-auto overflow w-full rounded-lg  mb-4">
                                <thead className="border-b-2 h-14">
                                    <tr className="text-2xl text-gray-700">
                                        <th>ชื่อ-นามสกุล</th>
                                        <th>ตำแหน่ง</th>
                                        <th>บทบาท</th>
                                        <th>อีเมลล์</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   
                                    {Array.isArray(Detailmanager) &&
                                                    Detailmanager.map((item, index) => (
                                                        <tr key={index} className="text-xl text-center border-b-2 rounded-lg h-14 ">
                                                            {/* <td className="rounded-bl-lg">{index + 1}</td> */}
                                                            <th>{item.firstname_t + item.lastname_t}</th>
                                                            <th>{item.department}</th>
                                                            <th>{item.role_name_t }</th>
                                                            <th>{item.email}</th>
                                                            
                                                        </tr>
                                                    ))}
                                    
                                   
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>



                <div className="bg-[#F3F3F3] drop-shadow-lg rounded-3xl border w-full my-5 mb-10">
                    <div className="bg-[#EB455F] pl-16 py-3 my-3 mx-3 text-white rounded-t-2xl flex items-center">
                        <img src={VenderIcon} className="h-14" />
                        <p className="text-white text-3xl font-bold ml-8">รายชื่อผู้รับเหมา</p>
                    </div>
                    <div className="bg-white rounded-3xl border drop-shadow-md px-12 py-3 my-3 mx-3">
                        <div className="overflow-x-auto">
                            <table className="table-auto overflow w-full rounded-lg  mb-4">
                                <thead className="border-b-2 h-14">
                                    <tr className="text-2xl text-gray-700">
                                        <th>ชื่อบริษัท/หน่วยงาน</th>
                                        <th>สถานะ</th>
                                        <th>ราคาที่เสนอ</th>
                                        <th>ราคาเสนอใหม่</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-xl text-center border-b-2 rounded-lg h-14">
                                        <td>บริษัท ปลอดภัยจำกัด</td>
                                        <td className="text-[#2FAC10]">ชนะการประกวด</td>
                                        <td>1,100,000</td>
                                        <td>กำลังเจรจา</td>
                                    </tr>
                                    <tr className="text-xl text-center border-b-2 rounded-lg h-14">
                                        <td>บริษัท ปลอดภัยจำกัด</td>
                                        <td className="text-[#FF0000]">แพ้การประกวด</td>
                                        <td>1,200,000</td>
                                        <td>-</td>
                                    </tr>
                                    <tr className="text-xl text-center border-b-2 rounded-lg h-14">
                                        <td>บริษัท ปลอดภัยจำกัด</td>
                                        <td className="text-[#FF0000]">แพ้การประกวด</td>
                                        <td>ไม่เปิดเผย</td>
                                        <td>-</td>
                                    </tr>
                                    <tr className="text-xl text-center border-b-2 rounded-lg h-14">
                                        <td>บริษัท ปลอดภัยจำกัด</td>
                                        <td className="text-[#FF0000]">แพ้การประกวด</td>
                                        <td>ไม่เปิดเผย</td>
                                        <td>-</td>
                                    </tr>
                                    <tr className="text-xl text-center border-b-2 rounded-lg h-14">
                                        <td>บริษัท ปลอดภัยจำกัด</td>
                                        <td className="text-[#FF0000]">แพ้การประกวด</td>
                                        <td>ไม่เปิดเผย</td>
                                        <td>-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center">
                    <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                    ย้อนกลับ
                </button>





            </div>
        </div>
    )
}