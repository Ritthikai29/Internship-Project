import SecretaryBanner from "../../components/Secretary/SecretaryBanner";
import { BsSearch } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi"

export default function SecretaryProjectWaitToManage() {
    return (
        <div>
            {
                <SecretaryBanner />
            }
            <div className="flex flex-col m-3 px-10 py-12 rounded-2xl">

                {/* search */}
                <div className="flex justify-end">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <BsSearch />
                        </div>
                        <input
                            type="search"
                            className="block w-[25rem] p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-300 rounded-lg bg-white " placeholder="ค้นหารายการ" />
                    </div>
                </div>

                <div className="rounded-lg border mt-8">
                    <table className="w-full rounded-lg table-fixed">
                        <thead className="text-white bg-[#2B2A2A] h-14 rounded-lg">
                            <tr className="rounded-lg text-2xl">
                                <th className="rounded-tl-lg">เลขที่เอกสาร</th>
                                <th>ชื่อโครงการ</th>
                                <th>ชื่อบริษัทที่ชนะ</th>
                                <th>ราคากลาง</th>
                                <th>ราคาที่เสนอ</th>
                                <th>ราคาหลังต่อรอง</th>
                                <th className="rounded-tr-lg">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="border-b-lg rounded-xl h-14">
                            <tr className="border-b text-xl">
                                <td className="py-5 text-center">CAMERA20/11/65</td>
                                <td className="py-5 text-center">งานติดตั้งกล้องวงจรปิด AI</td>
                                <td className="py-5 text-center">ปลอดภัยดีจำกัดมหาชน</td>
                                <td className="py-5 text-center">200000</td>
                                <td className="py-5 text-center">290000</td>
                                <td className="py-5 text-center">220000</td>
                                <td className="py-5 text-center"><button className="px-10 py-1.5 border-4 border-gray-300 rounded-3xl bg-white text-gray-700 font-base drop-shadow-md text-center">คลิก</button></td>
                            </tr>
                            <tr className="border-b text-xl">
                                <td className="py-5 text-center">CAMERA20/11/65</td>
                                <td className="py-5 text-center">งานติดตั้งกล้องวงจรปิด AI</td>
                                <td className="py-5 text-center">ปลอดภัยดีจำกัดมหาชน</td>
                                <td className="py-5 text-center">400000</td>
                                <td className="py-5 text-center">410000</td>
                                <td className="py-5 text-center">401000</td>
                                <td className="py-5 text-center"><button className="px-10 py-1.5 border-4 border-gray-300 rounded-3xl bg-white text-gray-700 font-base drop-shadow-md text-center">คลิก</button></td>
                            </tr>
                            <tr className="border-b text-xl">
                                <td className="py-5 text-center">CAMERA20/11/65</td>
                                <td className="py-5 text-center">งานติดตั้งกล้องวงจรปิด AI</td>
                                <td className="py-5 text-center">ปลอดภัยดีจำกัดมหาชน</td>
                                <td className="py-5 text-center">400000</td>
                                <td className="py-5 text-center">410000</td>
                                <td className="py-5 text-center">-</td>
                                <td className="py-5 text-center"><button className="px-10 py-1.5 border-4 border-gray-300 rounded-3xl bg-white text-gray-700 font-base drop-shadow-md text-center">คลิก</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="my-12">
                    <p>Showing 1 to 3 of 3 entries</p>
                    <div className="flex justify-end">
                        <ul className="inline-flex space-x-2">
                            <li><button className="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                            </li>
                            <li><button className="w-10 h-10 text-[#EB455F] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100">1</button></li>
                            <li><button className="w-10 h-10 text-[#EB455F] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100">2</button></li>
                            <li><button className="w-10 h-10 text-white transition-colors duration-150 bg-[#EB455F] border border-r-0 border-[#EB455F] rounded-full focus:shadow-outline">3</button></li>
                            <li><button className="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-5">
                    <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center">
                        <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                        ย้อนกลับ
                    </button>
                </div>
            </div>
        </div>
    )
}