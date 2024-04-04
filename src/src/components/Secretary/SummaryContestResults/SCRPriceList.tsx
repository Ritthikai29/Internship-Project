export default function SCRPriceList() {
    return (
        <div>
            <div className="bg-[#F5F5F5]">
                <div className="px-[8rem] py-16 rounded-2xl">
                    <table className="w-full drop-shadow-lg rounded-lg table-fixed">
                        <thead className="text-white text-2xl uppercase bg-[#6C6C6C] h-14">
                            <tr>
                                <th className="justify-self-center">ชื่อบริษัท/หน่วยงาน</th>
                                <th className="justify-self-center ">สถานะ</th>
                                <th className="justify-self-center ">ราคาที่เสนอ</th>
                                <th className="justify-self-center">ราคาเสนอใหม่</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white border-b-lg rounded-xl h-14">
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="py-3 pl-2">บริษัท ปลอดภัยจำกัด</td>
                                <td className="py-3 pl-2 text-[#2FAC10]">ชนะการประกวด</td>
                                <td>1,100,000</td>
                                <td className="">-</td>
                            </tr>
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="py-3 pl-2">บริษัท ปลอดภัยจำกัด</td>
                                <td className="py-3 pl-2 text-[#FF0000]">แพ้การประกวด</td>
                                <td>1,200,000</td>
                                <td>-</td>
                            </tr>
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="py-3 pl-2">บริษัท ปลอดภัยจำกัด</td>
                                <td className="py-3 pl-2 text-[#FF0000]">แพ้การประกวด</td>
                                <td>ไม่เปิดเผย</td>
                                <td>-</td>
                            </tr>
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="py-3 pl-2">บริษัท ปลอดภัยจำกัด</td>
                                <td className="py-3 pl-2 text-[#FF0000]">แพ้การประกวด</td>
                                <td>ไม่เปิดเผย</td>
                                <td>-</td>
                            </tr>
                            <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                <td className="py-3 pl-2">บริษัท ปลอดภัยจำกัด</td>
                                <td className="py-3 pl-2 text-[#FF0000]">แพ้การประกวด</td>
                                <td>ไม่เปิดเผย</td>
                                <td>-</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}