import signature from "../../../assets/signature.png"

export default function SCRComment() {
    return (
        <div>
            <div className="bg-[#2B2A2A] w-full h-[120px] flex items-center justify-center">
                <p className="text-3xl font-bold text-white px-32">ความเห็นของคณะกรรมการ</p>
            </div>
            <div className="px-[8rem] pt-16 pb-8 rounded-2xl">
                <table className="w-full drop-shadow-lg rounded-lg table-fixed">
                    <thead className="text-white text-2xl uppercase bg-[#6C6C6C] h-14">
                        <tr>
                            <th className="justify-self-center">ชื่อ-นามสกุล</th>
                            <th className="justify-self-center ">บทบาท</th>
                            <th className="justify-self-center ">ความคิดเห็น</th>
                            <th className="justify-self-center ">อื่นๆ</th>
                            <th className="justify-self-center  ">วัน/เวลาลงนาม</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white border-b-lg rounded-xl h-14">
                        <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                            <td className="py-3 pl-2">นาย กนก ก.ไก่</td>
                            <td>ประธาน</td>
                            <td className="py-3 pl-2 text-[#2FAC10]">เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง</td>
                            <td>-</td>
                            <td className="text-[#ff0000]">กนกววรณ์</td>
                        </tr>
                        <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                            <td className="py-3 pl-2">นาย กนก ก.ไก่</td>
                            <td>กรรมการ</td>
                            <td className="py-3 pl-2 text-[#2FAC10]">เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง</td>
                            <td>-</td>
                            <td><img className="h-[70px] mx-auto" src={signature} /></td>
                        </tr>
                        <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                            <td className="py-3 pl-2">นาย กนก ก.ไก่</td>
                            <td>กรรมการ</td>
                            <td className="py-3 pl-2 text-[#2FAC10]">เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง</td>
                            <td>เห็นชอบ</td>
                            <td className="text-[#ff0000]">สรรพวุณ</td>
                        </tr>
                        <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                            <td className="py-3 pl-2 ">นาย กนก ก.ไก่</td>
                            <td>เลขา</td>
                            <td className="py-3 pl-2 text-[#2FAC10]">เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง</td>
                            <td>-</td>
                            <td><img className="h-[70px] mx-auto" src={signature} /></td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-16 mb-8">
                    <p className="text-2xl my-4">อื่น ๆ เพิ่มเติม</p>
                    <textarea placeholder="อื่น ๆ เพิ่มเติม" className="block p-3 w-full h-40 text-xl text-gray-900 bg-white rounded-lg border drop-shadow-md border-gray-400 focus:ring-blue-500 focus:border-blue-500 "></textarea>
                </div>
            </div>
        </div>
    )
}