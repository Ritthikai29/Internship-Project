export default function CommitteeProjectSettingInformation() {
    return (
        <div className="bg-white">
            <div className="bg-[#1D5182] w-full h-[120px] flex items-center">
                <label className="text-3xl text-white px-32">2. ข้อมูลการตั้งค่าโครงการ</label>
            </div>

            <div className="px-[8rem] py-12 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="bg-white drop-shadow-lg rounded-lg border m-10">
                        <div className="px-32 py-14 flex flex-col gap-4">
                            <label className="text-2xl font-bold">1) กำหนดระยะรับสมัคร</label>
                            <div className="grid grid-cols-12 items-center">
                                <p className="col-start-1 text-xl text-end text-gray-500 mr-3">เริ่มต้น</p>
                                <input type="date" placeholder="เริ่มต้น" className="col-start-2 col-end-5 border rounded-full p-2.5 text-xl text-center"></input>
                                <p className="col-start-5 text-xl text-end text-gray-500 mr-3">สิ้นสุด</p>
                                <input type="date" pattern="dd:mm:yyyy" placeholder="สิ้นสุด" className="col-start-6 col-end-9 border rounded-full p-2.5 text-xl text-center"></input>
                                <p className="col-start-9 text-xl text-end text-gray-500 mr-3">เวลา</p>
                                <input type="time" pattern="hh:mm" placeholder="เวลา" className="col-start-10 col-end-13 border rounded-full p-2.5 text-xl text-center"></input>
                            </div>
                            <div>
                                <p className="basis-1/2 text-2xl text-gray-700 mb-4">2) เงินประกันซอง</p>
                                <div className="grid grid-cols-12 items-center">
                                    <input type="text" placeholder="เงินประกันซอง" value="10,000" className="col-start-1 col-end-4 border rounded-full p-2.5 text-xl text-center"></input>
                                    <p className="col-start-4 text-2xl text-end text-gray-500 ">บาท</p>
                                </div>
                            </div>
                            <div>
                                <p className="basis-1/2 text-2xl text-gray-700 mb-4">3) ผู้ประสานงานโครงการ</p>
                                <div className="grid grid-cols-12">
                                    <input type="text" placeholder="ผู้ประสานงานโครงการ" value="ประภาส แก้วพงศ์พันธ์ / People Management Manager-TS /prapask@scg.com" className="col-start-1 col-end-12 border rounded-full p-2.5 pl-6 text-xl"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}