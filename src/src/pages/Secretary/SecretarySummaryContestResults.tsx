import { useNavigate } from "react-router-dom";

import img from "../../assets/Secretary/folder.png"

import { BsDownload } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi"
import SCRComment from "../../components/Secretary/SummaryContestResults/SCRComment";
import SCRPriceList from "../../components/Secretary/SummaryContestResults/SCRPriceList";

export default function SecretrySummaryContestResults() {
    const navigate = useNavigate();

    return (
        <div>
            <div className=" flex flex-row ">
                <div className="flex flex-col basis-2/8 bg-[#2B3467] py-10 px-24 ">
                    <div className="flex justify-center">
                        <img className=' fill-white' src={img}></img>
                    </div>
                    <h1 className='text-white font-bold text-3xl text-center'>สรุปผลการประกวด</h1>
                </div>
                <div className=' flex-col  w-full pb-6 '>
                    <div className='bg-[#1D5182] text-white font-bold text-4xl pl-28 py-5 '>
                        <div className=' '>โครงการ : งานติดตั้งกล้องวงจรปิด AI</div>
                    </div>
                    <div className='flex flex-row w-full bg-white text-[#2B3467] font-bold text-2xl pl-10 py-6 pb-5'>
                        <div className='pl-10 basis-1/2 text-3xl'>
                            เลขที่เอกสาร : CAMERA20/11/65
                        </div>
                        <div className=' '>
                            สถานะ : เสร็จสิ้น
                        </div>
                    </div>
                    {/* ปุ่มสรุป */}
                    <div className='flex flex-row w-full bg-white text-[#2B3467] font-bold text-2xl pl-10 py-5  '>
                        <div className='pl-10  basis-1/2'>
                            วันที่เพิ่ม : 20/11/2565
                        </div>
                        <button className=' text-[#2B3467] bg-white border-4 border-[#2B3467] rounded-lg py-1 pr-3 '>
                            <BsDownload className="inline-flex ml-3 mr-2" /> รายละเอียดราคากลาง
                        </button>
                    </div>
                </div>
            </div>
            {
                <SCRPriceList />
            }
            {
                <SCRComment />
            }
            <div className="px-[8rem] pb-8 rounded-2xl">
                <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
                    onClick={() => navigate("/secretary/list-select")}>
                    <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                    ย้อนกลับ
                </button>
            </div>
        </div>
    )
}