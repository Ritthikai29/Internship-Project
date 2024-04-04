export default function CommitteeInformationWorkTypes() {
    return (
        <div className="bg-[#F5F5F5]">
            <div className="bg-[#2B3467] w-full h-[120px] flex items-center">
                <label className="text-3xl text-white px-32">1. ข้อมูลประเภทงานและผู้เข้าร่วมประกวดโครงการ</label>
            </div>

            <div className="px-[8rem] pb-12 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-32 py-14 flex flex-col gap-4">
                        <label className="text-2xl font-bold">1) ประเภทงาน</label>
                        <div className="grid grid-cols-12">
                            <input className="col-start-1 col-end-5 border rounded-lg p-2.5 pl-6 ml-6 text-xl"></input>
                        </div>
                    </div>
                </div>

                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-32 py-14 flex flex-col gap-4">
                        <label className="text-2xl font-bold">2) โปรดเลือกผู้รับเหมาที่ขึ้นทะเบียนแล้ว (ใน List)</label>
                        <div className="scroll-x overflow-x-scroll rounded-lg ">
                            <div className="w-[112vw] grid grid-cols-11 justify-items-center text-white text-xl bg-[#2B2A2A] rounded-lg">
                                <p className="py-3 pl-2">ลำดับ</p>
                                <p className="py-3 pl-2">ประเภท</p>
                                <p className="py-3 pl-2">เลขสมาชิก</p>
                                <p className="py-3 pl-2">ชื่อ หจก./บริษัท</p>
                                <p className="py-3 pl-2">ชื่อผู้จัดการ</p>
                                <p className="py-3 pl-2">ตำแหน่งผู้จัดการ</p>
                                <p className="py-3 pl-2">อีเมล์</p>
                                <p className="py-3 pl-2">เบอร์โทร</p>
                                <p className="py-3 pl-2">ที่อยู่</p>
                                <p className="py-3 pl-2">หมายเหตุ</p>
                                <p className="py-3 pl-2">เวลา</p>
                            </div>
                            <div className="w-[112vw] grid grid-cols-11 text-black text-lg bg-[#DEDEDE] rounded-lg drop-shadow-2xl justify-items-center gap-y-2 mt-2 ">
                                {/* row 1 */}
                                <p className="py-5 pl-2">1</p>
                                <p className="py-5 pl-2 text-[#0083FF]">ใน List ทะเบียน</p>
                                <p className="py-5 pl-2">A00001</p>
                                <p className="py-5 pl-2">หจก.ท่งุ สงสุคนธ์การ</p>
                                <p className="py-5 pl-2">นาย ก่อสร้าง คงทน</p>
                                <p className="py-5 pl-2">ผู้จัดการ</p>
                                <p className="py-5 pl-2">abc@gmail.com</p>
                                <p className="py-5 pl-2">099-xxxxxxx</p>
                                <p className="py-5 pl-2">อำเภอทุ่งสง</p>
                                <p className="py-5 pl-2"> - </p>
                                <p className="py-5 pl-2"> 13:55 28/9/2566 </p>
                                {/* row 2 */}
                                <p className="py-5 pl-2">2</p>
                                <p className="py-5 pl-2 text-[#0083FF]">ใน List ทะเบียน</p>
                                <p className="py-5 pl-2">A00001</p>
                                <p className="py-5 pl-2">หจก.ท่งุ สงสุคนธ์การ</p>
                                <p className="py-5 pl-2">นาย ก่อสร้าง คงทน</p>
                                <p className="py-5 pl-2">ผู้จัดการ</p>
                                <p className="py-5 pl-2">abc@gmail.com</p>
                                <p className="py-5 pl-2">099-xxxxxxx</p>
                                <p className="py-5 pl-2">อำเภอทุ่งสง</p>
                                <p className="py-5 pl-2"> - </p>
                                <p className="py-5 pl-2"> 13:55 28/9/2566 </p>
                                {/* row 3 */}
                                <p className="py-5 pl-2">3</p>
                                <p className="py-5 pl-2 text-[#0083FF]">ใน List ทะเบียน</p>
                                <p className="py-5 pl-2">A00001</p>
                                <p className="py-5 pl-2">หจก.ท่งุ สงสุคนธ์การ</p>
                                <p className="py-5 pl-2">นาย ก่อสร้าง คงทน</p>
                                <p className="py-5 pl-2">ผู้จัดการ</p>
                                <p className="py-5 pl-2">abc@gmail.com</p>
                                <p className="py-5 pl-2">099-xxxxxxx</p>
                                <p className="py-5 pl-2">อำเภอทุ่งสง</p>
                                <p className="py-5 pl-2"> - </p>
                                <p className="py-5 pl-2"> 13:55 28/9/2566 </p>
                                {/* row 4 */}
                                <p className="py-5 pl-2">4</p>
                                <p className="py-5 pl-2 text-[#FF0000]">นอก List ทะเบียน</p>
                                <p className="py-5 pl-2">A00001</p>
                                <p className="py-5 pl-2">หจก.ท่งุ สงสุคนธ์การ</p>
                                <p className="py-5 pl-2">นาย ก่อสร้าง คงทน</p>
                                <p className="py-5 pl-2">ผู้จัดการ</p>
                                <p className="py-5 pl-2">abc@gmail.com</p>
                                <p className="py-5 pl-2">099-xxxxxxx</p>
                                <p className="py-5 pl-2">อำเภอทุ่งสง</p>
                                <p className="py-5 pl-2"> - </p>
                                <p className="py-5 pl-2"> 13:55 28/9/2566 </p>
                                {/* row 5 */}
                                <p className="py-5 pl-2">5</p>
                                <p className="py-5 pl-2 text-[#FF0000]">นอก List ทะเบียน</p>
                                <p className="py-5 pl-2">A00001</p>
                                <p className="py-5 pl-2">หจก.ท่งุ สงสุคนธ์การ</p>
                                <p className="py-5 pl-2">นาย ก่อสร้าง คงทน</p>
                                <p className="py-5 pl-2">ผู้จัดการ</p>
                                <p className="py-5 pl-2">abc@gmail.com</p>
                                <p className="py-5 pl-2">099-xxxxxxx</p>
                                <p className="py-5 pl-2">อำเภอทุ่งสง</p>
                                <p className="py-5 pl-2"> - </p>
                                <p className="py-5 pl-2"> 13:55 28/9/2566 </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}