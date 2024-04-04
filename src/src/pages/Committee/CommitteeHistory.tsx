import { useNavigate } from "react-router-dom"

export default function CommitteeHistory() {
    const navigate = useNavigate()
    return (
        <div>
            <div className="rounded-lg border mx-20 my-16">
                <table className="w-full rounded-lg table-fixed">
                    <thead className="text-white bg-[#2B2A2A] h-14 rounded-lg">
                        <tr className="rounded-lg text-xl">
                            <th className="w-[6rem] rounded-tl-lg">ลำดับ</th>
                            <th className="w-[]">วัน/เวลาเปิดซอง</th>
                            <th className="w-[]">จำนวนโครงการ</th>
                            <th className="w-[]">สถานที่</th>
                            <th className="w-[]">เปิดซอง</th>
                            <th className="w-[] rounded-tr-lg">ส่งอีเมล์ซ้ำ</th>
                        </tr>
                    </thead>
                    <tbody className="border-b-lg rounded-xl h-14">
                        <tr className="border-b text-xl text-center h-16">
                            <td>1</td>
                            <td>20/06/2023</td>
                            <td>3</td>
                            <td>หจก.ท่งุ สงสุคนธ์การ</td>
                            <td><button className="border text-lg py-1 px-8 rounded-lg text-center"
                                onClick={() => navigate("/secretary/specifiedevenelope/wto/submitotp")}>
                                คลิก</button></td>
                            <td><button className="border text-lg py-1 px-8 rounded-lg text-center text-[#005EEA]">ส่ง</button></td>
                        </tr>
                        <tr className="border-b text-xl text-center h-16">
                            <td>2</td>
                            <td>20/06/2023</td>
                            <td>2</td>
                            <td>หจก.ท่งุ สงสุคนธ์การ</td>
                            <td><button className="border text-lg py-1 px-8 rounded-lg text-center"
                                onClick={() => navigate("/secretary/specifiedevenelope/wto/submitotp")}>
                                คลิก</button></td>
                            <td><button className="border text-lg py-1 px-8 rounded-lg text-center text-[#005EEA]">ส่ง</button></td>
                        </tr>
                        <tr className="border-b text-xl text-center h-16">
                            <td>3</td>
                            <td>20/06/2023</td>
                            <td>4</td>
                            <td>หจก.ท่งุ สงสุคนธ์การ</td>
                            <td><button className="border text-lg py-1 px-8 rounded-lg text-center"
                                onClick={() => navigate("/secretary/specifiedevenelope/wto/submitotp")}>
                                คลิก</button></td>
                            <td><button className="border text-lg py-1 px-8 rounded-lg text-center text-[#005EEA]">ส่ง</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}