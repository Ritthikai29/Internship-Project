import { useNavigate } from "react-router-dom";

export default function LSNotificationBiddingResults() {
    const navigate = useNavigate();


    return (
        <div>
            <div className="bg-[#2B2A2A] w-full h-[120px] flex items-center">
                <label className="text-3xl text-white px-32">5. แจ้งผลการประกวดราคา</label>
            </div>

            <div className="px-[8rem] py-12 rounded-2xl">
                <div className="flex flex-row justify-end items-center mb-12">
                    <button className=" mr-10 rounded-lg bg-[#2B3467] text-white text-2xl p-2 px-5"
                        onClick={() => navigate("/secretary/summary-contest-results")}>
                        ไฟล์ผลประกวดราคา</button>
                    <p className="text-3xl"><b>สถานะ :</b> แล้วเสร็จ</p>
                </div>


                <div>
                    <table className="w-full drop-shadow-sm rounded-lg table-fixed">
                        <thead className="text-white text-2xl uppercase rounded-lg bg-[#2B2A2A] h-14">
                            <tr>
                                <th className="rounded-l-lg">ลำดับ</th>
                                <th>ตรวจสอบ</th>
                                <th>ประเภท</th>
                                <th>เลขสมาชิก</th>
                                <th>ชื่อ หจก./บริษัท</th>
                                <th>ชื่อผู้จัดการ</th>
                                <th>อีเมล์</th>
                                <th className="rounded-r-lg">เบอร์โทร</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#DEDEDE] border-b-lg rounded-xl h-14">
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="h-16">1</td>
                                <td className="h-16 text-[#1F7600]">ชนะการประกวด</td>
                                <td className="h-16">ใน List ทะเบียน</td>
                                <td className="h-16">A00001</td>
                                <td className="h-16">หจก.ท่งุ สงสุคนธ์การ</td>
                                <td className="h-16">MRO/BSE/CCOD</td>
                                <td className="h-16">abc@gmail.com</td>
                                <td className="h-16">099-XXXXXXX</td>
                            </tr>
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="h-16">2</td>
                                <td className="h-16 text-[#ff0000]">แพ้การประกวด</td>
                                <td className="h-16">ใน List ทะเบียน</td>
                                <td className="h-16">A00001</td>
                                <td className="h-16">หจก.ท่งุ สงสุคนธ์การ</td>
                                <td className="h-16">MRO/BSE/CCOD</td>
                                <td className="h-16">abc@gmail.com</td>
                                <td className="h-16">099-XXXXXXX</td>
                            </tr>
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="h-16">3</td>
                                <td className="h-16 text-[#ff0000]">แพ้การประกวด</td>
                                <td className="h-16">ใน List ทะเบียน</td>
                                <td className="h-16">A00001</td>
                                <td className="h-16">หจก.ท่งุ สงสุคนธ์การ</td>
                                <td className="h-16">MRO/BSE/CCOD</td>
                                <td className="h-16">abc@gmail.com</td>
                                <td className="h-16">099-XXXXXXX</td>
                            </tr>
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="h-16">4</td>
                                <td className="h-16 text-[#ff0000]">แพ้การประกวด</td>
                                <td className="h-16">นอก List ทะเบียน</td>
                                <td className="h-16">A00001</td>
                                <td className="h-16">หจก.ท่งุ สงสุคนธ์การ</td>
                                <td className="h-16">MRO/BSE/CCOD</td>
                                <td className="h-16">abc@gmail.com</td>
                                <td className="h-16">099-XXXXXXX</td>
                            </tr>
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="h-16">5</td>
                                <td className="h-16 text-[#ff0000]">แพ้การประกวด</td>
                                <td className="h-16">นอก List ทะเบียน</td>
                                <td className="h-16">A00001</td>
                                <td className="h-16">หจก.ท่งุ สงสุคนธ์การ</td>
                                <td className="h-16">MRO/BSE/CCOD</td>
                                <td className="h-16">abc@gmail.com</td>
                                <td className="h-16">099-XXXXXXX</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>




        </div>
    )
}