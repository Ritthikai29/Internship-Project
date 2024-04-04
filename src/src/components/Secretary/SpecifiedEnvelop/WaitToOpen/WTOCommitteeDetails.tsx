import CheckMark from "../../../../assets/Secretary/CheckMark.png";
import CrossMark from "../../../../assets/Secretary/CrossMark.png";

import SecretaryBanner from "../../SecretaryBanner"
import { BiSolidLeftArrow } from "react-icons/bi"


export default function WTOCommitteeDetails() {
    return (
        <div className="bg-[#F5F5F5]">
            {
                <SecretaryBanner />
            }
            <div className="px-[8rem] py-12 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-32 py-14 flex flex-col gap-8">
                        <p className="text-3xl text-[#2B3467] font-bold text-center">รายละเอียดกรรมการที่เข้าร่วมประกวดราคา</p>
                        <div className="grid grid-cols-3 ">
                            <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                                <p className="text-xl">ประธาน</p>
                                <img src={CrossMark} className="h-[90px]" />
                                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                                <p className="text-xl">0/1</p>
                            </div>
                            <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                                <p className="text-xl">กรรมการ</p>
                                <img src={CrossMark} className="h-[90px]" />
                                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                                <p className="text-xl">0/2</p>
                            </div>
                            <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                                <p className="text-xl">เลขา</p>
                                <img src={CrossMark} className="h-[90px]" />
                                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                                <p className="text-xl">0/1</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-32 py-14 flex flex-col gap-3">
                        <p className="text-2xl mb-6">รายชื่อกรรมการที่แจ้งเข้าร่วมแล้ว</p>
                        <div className="grid grid-cols-3 justify-items-center">
                            <p className="text-xl ">ลำดับ</p>
                            <p className="text-xl ">ชื่อ-สกุล</p>
                            <p className="text-xl ">ตำแหน่งในการเปิดซอง</p>
                        </div>
                        <hr></hr>
                        <div className="grid grid-cols-3 justify-items-center">
                            <p className="text-xl">1</p>
                            <p className="text-xl">นาย กกกกกกก กกกกกกกกกกกก</p>
                            <p className="text-xl">กรรมการ</p>
                        </div>
                        <div className="grid grid-cols-3 justify-items-center">
                            <p className="text-xl">2</p>
                            <p className="text-xl">นาย กกกกกกก กกกกกกกกกกกก</p>
                            <p className="text-xl">เลขา</p>
                        </div>
                    </div>
                </div>
                <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center">
                    <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                    ย้อนกลับ
                </button>

            </div >
        </div >
    )
}