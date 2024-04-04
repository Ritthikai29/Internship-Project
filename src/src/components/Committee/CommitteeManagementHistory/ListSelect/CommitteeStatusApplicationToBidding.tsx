import { useNavigate } from "react-router-dom";

import { PiPaperclipLight } from "react-icons/pi"

export default function CommitteeStatusApplicationToBidding() {
    const navigate = useNavigate();


    return (
        <div className="bg-white drop-shadow-lg">
            <div className="w-full h-[120px] flex items-center" >
                <label className="text-3xl px-32">4. สถานะการสมัครเข้าร่วมประกวดราคา</label>
            </div>
            <div className="px-[8rem] pb-12 rounded-2xl">
                <div className="flex flex-row justify-end items-center mb-12">
                    <button className=" mr-10 rounded-lg bg-[#2B3467] text-white text-2xl p-2 px-5"
                        onClick={() => navigate("/committee/summary-contest-results")}>
                        ไฟล์ผลประกวดราคา</button>
                    <p className="text-3xl"><b>สถานะ :</b> แล้วเสร็จ</p>
                </div>

                <div className="scroll-x overflow-x-scroll rounded-lg">
                    <div className="w-[152vw] grid grid-cols-14 justify-items-center text-white text-xl bg-[#2B2A2A] rounded-lg">
                        <p className="py-3 pl-2">ลำดับ</p>
                        <p className="py-3 pl-2">ตรวจสอบ</p>
                        <p className="py-3 pl-2">สถานะ</p>
                        <p className="py-3 pl-2">วัน/เวลาสมัคร</p>
                        <p className="py-3 pl-2">ไฟล์เงินประกันซอง</p>
                        <p className="py-3 pl-2">ประเภท</p>
                        <p className="py-3 pl-2">เลขสมาชิก</p>
                        <p className="py-3 pl-2">ชื่อ หจก./บริษัท</p>
                        <p className="py-3 pl-2">ชื่อผู้จัดการ</p>
                        <p className="py-3 pl-2">อีเมล์</p>
                        <p className="py-3 pl-2">เบอร์โทร</p>
                        <p className="py-3 pl-2">หนังสือรับรองบริษัท</p>
                        <p className="py-3 pl-2">ทะเบียนภาษีมูลค่าเพิ่ม</p>
                        <p className="py-3 pl-2">หน้า Book Bank</p>
                    </div>
                    <div className="w-[152vw] grid grid-cols-14 text-black text-lg bg-[#DEDEDE] rounded-lg drop-shadow-2xl justify-items-center items-center gap-y-2 mt-2 ">
                        {/* row 1 */}
                        <p className="py-5 pl-2">1</p>
                        <p className="py-5 pl-2 text-[#1F7600]">ถูกต้องครบถ้วน</p>
                        <p className="py-5 pl-2">สมัครแล้ว</p>
                        <p className="py-5 pl-2">14/06/2023 08:00</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>
                        <p className="py-5 pl-2">ใน List ทะเบียน</p>
                        <p className="py-5 pl-2">A00001</p>
                        <p className="py-5 pl-2">หจก.ทุ่งสงสุคนธการ</p>
                        <p className="py-5 pl-2">MRO/BSE/CCOD</p>
                        <p className="py-5 pl-2">abc@gmail.com</p>
                        <p className="py-5 pl-2">099-XXXXXXX</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>

                        {/* row 2 */}
                        <p className="py-5 pl-2">2</p>
                        <p className="py-5 pl-2 text-[#1F7600]">ถูกต้องครบถ้วน</p>
                        <p className="py-5 pl-2">สมัครแล้ว</p>
                        <p className="py-5 pl-2">14/06/2023 08:00</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>
                        <p className="py-5 pl-2">ใน List ทะเบียน</p>
                        <p className="py-5 pl-2">A00001</p>
                        <p className="py-5 pl-2">หจก.ทุ่งสงสุคนธการ</p>
                        <p className="py-5 pl-2">MRO/BSE/CCOD</p>
                        <p className="py-5 pl-2">abc@gmail.com</p>
                        <p className="py-5 pl-2">099-XXXXXXX</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>

                        {/* row 3 */}
                        <p className="py-5 pl-2">3</p>
                        <p className="py-5 pl-2 text-[#1F7600]">ถูกต้องครบถ้วน</p>
                        <p className="py-5 pl-2">สมัครแล้ว</p>
                        <p className="py-5 pl-2">14/06/2023 08:00</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>
                        <p className="py-5 pl-2">ใน List ทะเบียน</p>
                        <p className="py-5 pl-2">A00001</p>
                        <p className="py-5 pl-2">หจก.ทุ่งสงสุคนธการ</p>
                        <p className="py-5 pl-2">MRO/BSE/CCOD</p>
                        <p className="py-5 pl-2">abc@gmail.com</p>
                        <p className="py-5 pl-2">099-XXXXXXX</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>

                        {/* row 4 */}
                        <p className="py-5 pl-2">4</p>
                        <p className="py-5 pl-2 text-[#FF0000]">ไม่แนบเงินประกันซอง</p>
                        <p className="py-5 pl-2">สมัครแล้ว</p>
                        <p className="py-5 pl-2">14/06/2023 08:00</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>
                        <p className="py-5 pl-2">นอก List ทะเบียน</p>
                        <p className="py-5 pl-2">A00001</p>
                        <p className="py-5 pl-2">หจก.ทุ่งสงสุคนธการ</p>
                        <p className="py-5 pl-2">MRO/BSE/CCOD</p>
                        <p className="py-5 pl-2">abc@gmail.com</p>
                        <p className="py-5 pl-2">099-XXXXXXX</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>

                        {/* row 5 */}
                        <p className="py-5 pl-2">5</p>
                        <p className="py-5 pl-2 text-[#FF0000]">ไม่แนบเงินประกันซอง</p>
                        <p className="py-5 pl-2">สมัครแล้ว</p>
                        <p className="py-5 pl-2">14/06/2023 08:00</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>
                        <p className="py-5 pl-2">นอก List ทะเบียน</p>
                        <p className="py-5 pl-2">A00001</p>
                        <p className="py-5 pl-2">หจก.ทุ่งสงสุคนธการ</p>
                        <p className="py-5 pl-2">MRO/BSE/CCOD</p>
                        <p className="py-5 pl-2">abc@gmail.com</p>
                        <p className="py-5 pl-2">099-XXXXXXX</p>
                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>                        <p className="py-5 pl-2">
                            <button className="bg-white border border-black w-36 h-10 text-lg py-1 rounded-lg grid grid-cols-3 items-center" >
                                <p className="col-start-2"></p>
                                <PiPaperclipLight className="rotate-180 text-2xl justify-self-end col-start-3 " /></button>
                        </p>
                    </div>
                </div>
                <div className="bg-[#1D5182] w-full h-20 mt-12 flex justify-center items-center">
                    <label className="text-white text-3xl">สถานะการสมัครที่สมบูรณ์ : 3 / 5</label>
                </div>
            </div>
        </div >
    )
}