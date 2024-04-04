import { useNavigate } from "react-router-dom";

import Pic from "../../assets/Vender/banner_vender_history.png";

import { BsSearch } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";

export default function CommitteeManagementHistory() {
    const navigate = useNavigate();

    return (
        <div>

            <div className="px-4">
                <div style={{
                    backgroundImage: `url(${Pic})`
                }} className="px-full h-96 flex justify-end items-end">

                    <p className="pb-12 pr-12 text-white text-7xl font-bold">ประวัติการเข้าร่วม</p>
                </div>
            </div>
            {/* container */}
            <div className="px-[8rem] py-12 rounded-2xl">

                {/* dropdown */}
                <div className="relative inline-block text-left">
                    <div className="flex gap-4">
                        <select className=" px-6 py-2 rounded-full border-2 text-xl">
                            <option selected disabled className="">ค้นหาสถานะ</option>
                            <option>เสร็จสิ้น</option>
                            <option>ล้มการประกวด</option>
                        </select>
                    </div>
                </div>

                <div className="relative inline-block text-left ml-10">
                    <div className="flex gap-4">
                        <select className=" px-6 py-2 rounded-full border-2 text-xl">
                            <option selected disabled className="">ค้นหาหน่วยงาน</option>
                            <option>Digital Transformation</option>
                            <option>BSE</option>
                        </select>
                    </div>
                </div>




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

            </div>
            <hr></hr>


            {/* second container  */}

            <div className="grid grid-cols-6 mx-36 my-10  bg-white rounded-2xl">
                <div className="col-span-3 border-2 border-gray-300">
                    <div className="grid grid-cols-6 ml-12 pt-8">
                        <div className="col-span-6 ">
                            <td className="text-[#2B3467] text-3xl font-bold">ชื่อโครงการ : งานติดตั้งกล้องวงจรปิด AI</td>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>หน่วยงาน :</b> BSE</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>เลขที่เอกสาร :</b> CAMERA20/11/65</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>วันที่เปิดซอง :</b> 20/11/2565</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 ml-12 pb-10 pt-6">
                        <div className="col-span-1">
                            <button className="text-[#559744] bg-white border-4 rounded-3xl text-xl px-6 py-1 inline-flex items-center mr-2 mb-2"
                                onClick={() => {


                                }}
                            >
                                <BsDownload className="text-xl w-4 h-4 mr-2" />

                                TOR
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button
                                className="text-gray-700 bg-white border-4 rounded-3xl text-xl font-extralight px-6 py-1 text-center inline-flex items-center mr-2 mb-2"
                                onClick={() => navigate("/committee/list-select")}>
                                เสร็จสิ้น
                            </button>

                        </div>
                    </div>
                </div>
                <div className="col-span-3 border-2 border-gray-300">
                    <div className="grid grid-cols-6 ml-12 pt-8">
                        <div className="col-span-6 ">
                            <td className="text-[#2B3467] text-3xl font-bold">ชื่อโครงการ : งานติดตั้งกล้องวงจรปิด AI</td>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>หน่วยงาน :</b> Digital Transformation</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>เลขที่เอกสาร :</b> CAMERA20/11/65</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>วันที่เปิดซอง :</b> 20/11/2565</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 ml-12 pb-10 pt-6">
                        <div className="col-span-1">
                            <button className="text-[#559744] bg-white border-4 rounded-3xl text-xl px-6 py-1 inline-flex items-center mr-2 mb-2"
                                onClick={() => {


                                }}
                            >
                                <BsDownload className="text-xl w-4 h-4 mr-2" />

                                TOR
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button
                                className="text-gray-700 bg-white border-4 rounded-3xl text-xl font-extralight px-6 py-1 text-center inline-flex items-center mr-2 mb-2"
                                onClick={() => navigate("/committee/list-select")}>
                                เสร็จสิ้น
                            </button>

                        </div>
                    </div>
                </div>
                <div className="col-span-3 border-2 border-gray-300">
                    <div className="grid grid-cols-6 ml-12 pt-8">
                        <div className="col-span-6 ">
                            <td className="text-[#2B3467] text-3xl font-bold">ชื่อโครงการ : งานติดตั้งกล้องวงจรปิด AI</td>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>หน่วยงาน :</b> Digital Transformation</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>เลขที่เอกสาร :</b> CAMERA20/11/65</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>วันที่เปิดซอง :</b> 20/11/2565</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 ml-12 pb-10 pt-6">
                        <div className="col-span-1">
                            <button className="text-[#559744] bg-white border-4 rounded-3xl text-xl px-6 py-1 inline-flex items-center mr-2 mb-2"
                                onClick={() => {


                                }}
                            >
                                <BsDownload className="text-xl w-4 h-4 mr-2" />

                                TOR
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button
                                className="text-gray-700 bg-white border-4 rounded-3xl text-xl font-extralight px-6 py-1 text-center inline-flex items-center mr-2 mb-2"
                                onClick={() => navigate("/committee/list-select")}>
                                เสร็จสิ้น
                            </button>

                        </div>
                    </div>
                </div>
                <div className="col-span-3 border-2 border-gray-300">
                    <div className="grid grid-cols-6 ml-12 pt-8">
                        <div className="col-span-6 ">
                            <td className="text-[#2B3467] text-3xl font-bold">ชื่อโครงการ : งานติดตั้งกล้องวงจรปิด AI</td>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>หน่วยงาน :</b> Digital Transformation</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>เลขที่เอกสาร :</b> CAMERA20/11/65</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>วันที่เปิดซอง :</b> 20/11/2565</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 ml-12 pb-10 pt-6">
                        <div className="col-span-1">
                            <button className="text-[#559744] bg-white border-4 rounded-3xl text-xl px-6 py-1 inline-flex items-center mr-2 mb-2"
                                onClick={() => {


                                }}
                            >
                                <BsDownload className="text-xl w-4 h-4 mr-2" />

                                TOR
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button
                                className="text-gray-700 bg-white border-4 rounded-3xl text-xl font-extralight px-6 py-1 text-center inline-flex items-center mr-2 mb-2"
                                onClick={() => navigate("/committee/list-select")}>
                                เสร็จสิ้น
                            </button>

                        </div>
                    </div>
                </div>
                <div className="col-span-3 border-2 border-gray-300">
                    <div className="grid grid-cols-6 ml-12 pt-8">
                        <div className="col-span-6 ">
                            <td className="text-[#2B3467] text-3xl font-bold">ชื่อโครงการ : งานติดตั้งกล้องวงจรปิด AI</td>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>หน่วยงาน :</b> BSE</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>เลขที่เอกสาร :</b> CAMERA20/11/65</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>วันที่เปิดซอง :</b> 20/11/2565</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 ml-12 pb-10 pt-6">
                        <div className="col-span-1">
                            <button className="text-[#559744] bg-white border-4 rounded-3xl text-xl px-6 py-1 inline-flex items-center mr-2 mb-2"
                                onClick={() => {


                                }}
                            >
                                <BsDownload className="text-xl w-4 h-4 mr-2" />

                                TOR
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button
                                className="text-gray-700 bg-white border-4 rounded-3xl text-xl font-extralight px-6 py-1 text-center inline-flex items-center mr-2 mb-2"
                                onClick={() => navigate("/committee/list-select")}>
                                เสร็จสิ้น
                            </button>

                        </div>
                    </div>
                </div>
                <div className="col-span-3 border-2 border-gray-300">
                    <div className="grid grid-cols-6 ml-12 pt-8">
                        <div className="col-span-6 ">
                            <td className="text-[#2B3467] text-3xl font-bold">ชื่อโครงการ : งานติดตั้งกล้องวงจรปิด AI</td>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>หน่วยงาน :</b> BSE</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>เลขที่เอกสาร :</b> CAMERA20/11/65</p>
                        </div>
                        <div className="col-span-6 pt-3">
                            <p className="text-xl"><b>วันที่เปิดซอง :</b> 20/11/2565</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 ml-12 pb-10 pt-6">
                        <div className="col-span-1">
                            <button className="text-[#559744] bg-white border-4 rounded-3xl text-xl px-6 py-1 inline-flex items-center mr-2 mb-2"
                                onClick={() => {


                                }}
                            >
                                <BsDownload className="text-xl w-4 h-4 mr-2" />

                                TOR
                            </button>
                        </div>
                        <div className="col-span-1">
                            <button
                                className="text-gray-700 bg-white border-4 rounded-3xl text-xl font-extralight px-6 py-1 text-center inline-flex items-center mr-2 mb-2"
                                onClick={() => navigate("/committee/list-select")}>
                                เสร็จสิ้น
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <hr></hr>


            {/* third container */}
            <div className="px-[8rem] pb-12 rounded-2xl">
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
            </div>
        </div>
    )
}