import { IVendorPrice } from "../WNOfferNewPrice";

export default function ONPPriceList(
    { vendors }: { vendors: IVendorPrice[] }
) {

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
                            {
                                vendors.map((item, index) => (
                                    <tr key={item.id} className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                                        <td className="py-3 pl-10 text-left">{item.company_name}</td>
                                        <td className={`py-3 pl-2 ${item.result == "win" ? "text-[#2FAC10]" : "text-[#FF0000]"}`}>{
                                            item.result == "win" ? "ชนะการประกวด":
                                            item.result == "draw" ? "เห็นควรพิจารณาต่อรอง":
                                            "แพ้การประกวด"
                                        }</td>
                                        <td>{item.price ? item.price : "-"}</td>
                                        <td className="">{item.newPrice ? item.newPrice : "-"}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}