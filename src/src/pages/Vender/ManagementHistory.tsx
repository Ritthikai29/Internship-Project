import { createContext, useContext, useEffect, useState } from 'react'
import fimg from '../../assets/vender/folder 1.png'
import { BsDownload } from "react-icons/bs";
import { AiFillCaretLeft,AiFillCaretRight } from "react-icons/ai";
import withReactContent from "sweetalert2-react-content";
import Swal from 'sweetalert2'
import { FaPersonDigging } from "react-icons/fa6";
import { SlUser } from "react-icons/sl";

const handleApproveOnClick = () => {
    let MySwal = withReactContent(Swal)
    MySwal.fire({
        title: <p className="text-[#2B3467]">ยืนยันการดำเนินการ</p>,
        confirmButtonText: "ยืนยัน",
        icon: "question",
        confirmButtonColor: "#EB455F",
        showCancelButton: true,
        cancelButtonText: "ปิด",
        cancelButtonColor: "#979797",
        
    }).then(
        (data) => {
            if (data.isConfirmed) {
                MySwal.fire({
                    title: "ส่งสำเร็จ!",
                    icon: "success"
                })
                
            }
        }
    )
}

const handleRejectOnClick = async (key: string) => {
    let MySwal = withReactContent(Swal)
    MySwal.fire(
        {
            title: <p className="text-[#2B3467]">ยืนยันการดำเนินการ</p>,
        confirmButtonText: "ยืนยัน",
        icon: "question",
        confirmButtonColor: "#EB455F",
        showCancelButton: true,
        cancelButtonText: "ปิด",
        cancelButtonColor: "#979797",
        
    }).then(
        (data) => {
            if (data.isConfirmed) {
                MySwal.fire({
                    title: "ส่งสำเร็จ!",
                    icon: "success"
                })
                
            }
        }
    )
}



// handle when user click a project
const handleOnClickProject = (keyInput: string) => {
    let MySwal = withReactContent(Swal);
    MySwal.fire({
        title: (
            <p className="text-[#2B3467]">ส่งผลการประกวด</p>
        ),
        html: (
            <div className="flex justify-between gap-4">
                <div>
                    <button className="flex rounded-lg flex-col justify-center items-center py-12 px-14 bg-[#2B3467] text-white"
                        onClick={() => handleApproveOnClick()}
                    >
                        <SlUser className="text-8xl pb-5" />
                        ผู้จัดการสาขา
                    </button>
                </div>
                <div>
                    <button className="flex rounded-lg flex-col justify-center items-center py-12 px-14 bg-[#2B3467] text-white mb-10"
                        onClick={() => handleRejectOnClick(keyInput)}
                    >
                        <FaPersonDigging className="text-8xl pb-5" />
                        ผู้รับเหมา
                    </button>
                </div>
            </div>
        ),
        showConfirmButton: false,

    })
}

export default function ManagementHistory() {

    return (
        <div>
            <div className=" flex flex-row ">

                <div className="flex flex-col basis-2/6 bg-[#2B3467] py-10 px-24 ">
                    <div>
                        <img className=' pb-10 pl-10 fill-white' src={fimg}></img>
                    </div>
                    <h1 className='text-white font-bold text-3xl text-center'>สรุปผลการประกวด</h1>
                </div>
                <div className=' flex-col basis-4/6 w-full pb-10 '>
                    <div className='bg-[#1D5182] text-white font-bold text-4xl pl-10 py-5 '>
                        <div className=' '>โครงการ : งานติดตั้งกล้องวงจรปิด AI</div>
                    </div>
                    <div className='flex flex-row w-full bg-white text-[#2B3467] font-bold text-xl pl-10 py-5 pb-5'>
                        <div className='pl-10 basis-1/2 '>
                            เลขที่เอกสาร : CAMERA20/11/65
                        </div>
                        <div className=' '>
                            สถานะ : เสร็จสิ้น
                        </div>
                    </div>
                    
                    {/* ปุ่มสรุป */}
                    <div className='flex flex-row w-full bg-white text-[#2B3467] font-bold text-xl pl-10 py-5  '>
                        <div className='pl-10  basis-1/2'>
                            วันที่เพิ่ม : 20/11/2565
                        </div>
                        <button className=' text-white bg-[#2B3467] rounded-lg py-1 pr-3 '>
                            <BsDownload className="inline-flex ml-3 mr-2" /> รายละเอียดราคากลาง
                        </button>
                    </div>
                </div>


            </div>
            {/* หัวข้อตาราง */}
            <div className=' bg-[#E0E0E0] py-20'>
                <div className='flex flx-row mx-20 bg-[#6C6C6C] text-white rounded-md  text-center py-2'>

                    <div className=' flex-1'>
                        ชื่อบริษัท/หน่วยงาน
                    </div>
                    <div className=' flex-1'>
                        สถานะ
                    </div>
                    <div className=' flex-1'>
                        ราคาที่เสนอ
                    </div>
                    <div className=' flex-1'>
                        ราคาเสนอใหม่
                    </div>
                </div>

                {/* ข้อมูล 1 */}
                <div className=' bg-[#E0E0E0] '>
                    <div className='flex flx-row mx-20 bg-[#FFF] text-black  text-center py-3'>

                        <div className=' flex-1'>
                            บริษัท ปลอดภัยจำกัด
                        </div>
                        <div className=' flex-1 text-[#2FAC10]'>
                            ชนะการประกวด
                        </div>
                        <div className=' flex-1'>
                            1,100,000
                        </div>
                        <div className=' flex-1'>
                            1,000,000
                        </div>
                    </div>
                </div>

                {/* ข้อมูล 2 */}
                <div className=' bg-[#E0E0E0] '>
                    <div className='flex flx-row mx-20 bg-[#FFF] text-black  text-center py-3'>

                        <div className=' flex-1'>
                            บริษัท ปลอดภัยจำกัด
                        </div>
                        <div className=' flex-1 text-[#F00]'>
                            แพ้การประกวด
                        </div>
                        <div className=' flex-1'>
                            1,200,000
                        </div>
                        <div className=' flex-1'>
                            -
                        </div>
                    </div>
                </div>

                {/* ข้อมูล 3 */}
                <div className=' bg-[#E0E0E0] '>
                    <div className='flex flx-row mx-20 bg-[#FFF] text-black  text-center py-3'>

                        <div className=' flex-1'>
                            บริษัท ปลอดภัยจำกัด
                        </div>
                        <div className=' flex-1 text-[#F00]'>
                            แพ้การประกวด
                        </div>
                        <div className=' flex-1'>
                            ไม่เปิดเผย
                        </div>
                        <div className=' flex-1'>
                            -
                        </div>
                    </div>
                </div>

                {/* ข้อมูล 4 */}
                <div className=' bg-[#E0E0E0] '>
                    <div className='flex flx-row mx-20 bg-[#FFF] text-black  text-center py-3'>

                        <div className=' flex-1'>
                            บริษัท ปลอดภัยจำกัด
                        </div>
                        <div className=' flex-1 text-[#F00]'>
                            แพ้การประกวด
                        </div>
                        <div className=' flex-1'>
                            ไม่เปิดเผย
                        </div>
                        <div className=' flex-1'>
                            -
                        </div>
                    </div>
                </div>

                {/* ข้อมูล 5 */}
                <div className=' bg-[#E0E0E0] '>
                    <div className='flex flx-row mx-20 bg-[#FFF] text-black  text-center py-3'>

                        <div className=' flex-1'>
                            บริษัท ปลอดภัยจำกัด
                        </div>
                        <div className=' flex-1 text-[#F00]'>
                            แพ้การประกวด
                        </div>
                        <div className=' flex-1'>
                            ไม่เปิดเผย
                        </div>
                        <div className=' flex-1'>
                            -
                        </div>
                    </div>
                </div>
            </div>

            <div className='  w-full bg-black text-white text-5xl text-center py-8 '>
                ความเห็นของคณะกรรมการ
            </div>

            {/* หัวข้อตาราง */}
            <div className=' bg-[#E0E0E0] py-20'>
                <div className='flex flx-row mx-20 bg-[#6C6C6C] text-white rounded-md  text-center py-2'>

                    <div className=' flex-1'>
                        ชื่อ-นามสกุล
                    </div>
                    <div className=' flex-1'>
                        บทบาท
                    </div>
                    <div className=' flex-1'>
                        ความคิดเห็น
                    </div>
                    <div className=' flex-1'>
                        อื่นๆ
                    </div>
                    
                </div>

                {/* ข้อมูล 1 */}
                <div className=' bg-[#E0E0E0] '>
                    <div className='flex flx-row mx-20 bg-[#FFF] text-black  text-center py-3'>

                        <div className=' flex-1'>
                            นาย กนก ก.ไก่
                        </div>
                        <div className=' flex-1'>
                            ประธาน
                        </div>
                        <div className=' flex-1 text-[#1F7600]'>
                            เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง
                        </div>
                        <div className=' flex-1'>
                            -
                        </div>
                        
                    </div>
                </div>

                {/* ข้อมูล 2 */}
                <div className=' bg-[#E0E0E0] '>
                    <div className='flex flx-row mx-20 bg-[#FFF] text-black  text-center py-3'>

                        <div className=' flex-1'>
                            นาย กนก ก.ไก่
                        </div>
                        <div className=' flex-1'>
                            กรรมการ
                        </div>
                        <div className=' flex-1 text-[#1F7600]'>
                            เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง
                        </div>
                        <div className=' flex-1'>
                            -
                        </div>
                        
                    </div>
                </div>

                {/* ข้อมูล 3 */}
                <div className=' bg-[#E0E0E0] '>
                    <div className='flex flx-row mx-20 bg-[#FFF] text-black  text-center py-3'>

                        <div className=' flex-1'>
                            นาย กนก ก.ไก่
                        </div>
                        <div className=' flex-1'>
                            กรรมการ
                        </div>
                        <div className=' flex-1 text-[#1F7600]'>
                            เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง
                        </div>
                        <div className=' flex-1'>
                            เห็นชอบ
                        </div>
                        
                    </div>
                </div>

                {/* ข้อมูล 4 */}
                <div className=' bg-[#E0E0E0] '>
                    <div className='flex flx-row mx-20 bg-[#FFF] text-black  text-center py-3'>

                        <div className=' flex-1'>
                            นาย กนก ก.ไก่
                        </div>
                        <div className=' flex-1'>
                            กรรมการ
                        </div>
                        <div className=' flex-1 text-[#1F7600]'>
                            เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง
                        </div>
                        <div className=' flex-1'>
                            -
                        </div>
                        
                    </div>
                </div>

                <div className='pt-16  ml-20 mr-20'>
<div className='text-black text-2xl font-bold'>
    อื่นๆเพิ่มเติม
</div>
    <input
     className="flex-auto   rounded-lg   py-10 mt-2 pl-10 w-full text-gray-700 bg-[#ffffff] text-2xl "
     id="additional-things"
     type="text"
     placeholder="อื่นๆเพิ่มเติม"
     name="Text"
    
    ></input>

                </div>
                <div className="ml-20 text-2xl my-4 text-[#2B3467] pt-10">
                    <span className="ml-10">

                        <button className=" ml-5 rounded-lg bg-[#EB455F] text-white px-4 py-2">
                            <AiFillCaretLeft className="inline-flex pb-0.5" size="1rem" /> ย้อนกลับ
                        </button>
                    </span>
                    <span className=" ml-80">

                        <button 
                        className=" -ml-32 rounded-lg bg-[#2B3467] text-white px-10 py-2"
                        onClick={() => handleOnClickProject ("")}
                        >
                             ส่งผลยืนยัน
                        </button>
                    </span>
                    
                </div >



            </div>
        </div>
    )
}