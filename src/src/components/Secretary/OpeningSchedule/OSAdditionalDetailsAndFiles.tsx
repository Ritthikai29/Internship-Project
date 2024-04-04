export default function OSAdditionalDetailsAndFiles() {
    return (
        <div className="bg-[#F5F5F5]">
            <div className="bg-[#2B2A2A] w-full h-[120px] flex items-center">
                <label className="text-3xl text-white px-32">3. รายละเอียดเพิ่มเติมและไฟล์แนบในหนังสือเชิญ</label>
            </div>

            <div className="px-[8rem] py-12 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-32 py-14 flex flex-col gap-5">
                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700 mb-4">1. โปรดเลือกวัน/เวลาที่จะเปิดซอง</p>
                            <div className="grid grid-cols-12 items-center">
                                <p className="col-start-1 text-xl text-center text-gray-500">วัน</p>
                                <input type="date" placeholder="เริ่มต้น" className="col-start-2 col-end-5 border rounded-full p-2.5 text-xl text-center"></input>
                                <p className="col-start-5 text-xl text-center text-gray-500 ml-6">เวลา</p>
                                <input type="time" pattern="hh:mm" placeholder="เวลา" className="col-start-6 col-end-9 border rounded-full p-2.5 text-xl text-center"></input>
                            </div>
                        </div>
                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700 mb-4">2) ผู้ประสานงานโครงการ </p>
                            <div className="grid grid-cols-12">
                                <input type="text" placeholder="ผู้ประสานงานโครงการ" value="ประภาส แก้วพงศ์พันธ์ / People Management Manager-TS /prapask@scg.com" className="col-start-1 col-end-12 border rounded-full p-2.5 pl-6 text-xl"></input>
                            </div>
                        </div>
                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700 mb-4">3) โปรดแนบเงื่อนไขการประกวดราคา หรือ เอกสารที่เกี่ยวข้องอื่นๆ</p>
                            <input
                                className="border rounded w-[600px] py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline"
                                type="file"
                                placeholder="หลักฐานสลิปการชำระงิน"
                                accept="application/pdf"
                                required
                            />
                            <button className="ml-5 py-2.5 px-5 mt-2 border rounded-xl bg-red-500 text-white text-lg ">ตรวจสอบ</button>

                            <input
                                className="border rounded w-[600px] py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline"
                                type="file"
                                placeholder="หลักฐานสลิปการชำระงิน"
                                accept="application/pdf"
                                required
                            />
                            <button className="ml-5 py-2.5 px-5 mt-2 border rounded-xl bg-red-500 text-white text-lg ">ตรวจสอบ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}