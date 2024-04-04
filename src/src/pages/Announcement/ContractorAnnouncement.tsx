import { BsSearch } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import { GiMegaphone } from "react-icons/gi";
import { BiSolidLeftArrow } from "react-icons/bi"
import Swal from "sweetalert2";



export default function ContractorAnnouncement() {

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #2B3467">โปรดใส่ Passcode ที่ท่านได้รับจากหนังสือเชิญ</span> <p style="color: #BA9821">ตัวอย่าง : D3X25T</p>',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ปิด',
            confirmButtonColor: '#EB455F', // สีแดง
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                return fetch(`//api.github.com/users/${login}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText)
                        }
                        return response.json()
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `${result.value.login}'s avatar`,
                    imageUrl: result.value.avatar_url
                })
            }
        });


    };




    return (
        <div>

            {/* banner */}
            <div className="bg-[#1D5182] w-full h-[20rem] flex justify-center items-center">
                <label className="text-white text-7xl font-bold border-[6px] border-white  px-[8rem] py-[4rem] flex flex-row">
                    <GiMegaphone className=" -rotate-45 mx-3" />
                    <p>ประกาศงานประมูล / ประกาศเชิญชวนทั่วไป</p></label>
            </div>




            {/* container */}
            <div className="px-[8rem] py-12 rounded-2xl">


                {/* dropdown+search */}
                <div className="flex justify-between mb-12">
                    <div>
                        <button type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-[#2B2A2A] px-6 py-2 text-xl font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300" id="menu-button" aria-expanded="true" aria-haspopup="true">
                            สถานะโครงการ
                            <svg className="-mr-1 h-8 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <BsSearch />
                        </div>
                        <input
                            type="search"
                            className="block w-[25rem] p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-300 rounded-lg bg-white " placeholder="ค้นหารายการ" />
                    </div>
                </div>

                {/* </div> */}

                <div>
                    <table className="my-[1.5rem] w-full  rounded-lg table-fixed">
                        <thead className="text-white text-3xl bg-[#2B2A2A] h-14">
                            <tr className="rounded py-[6rem]">
                                <th className="w-[15rem] rounded-tl-lg">ลำดับ</th>
                                <th className="rounded-tr-lg">โครงการ</th>
                            </tr>
                        </thead>
                        {/* <tbody>
                            <tr>

                            </tr>
                        </tbody> */}

                    </table>
                </div>






                <div className="flex flex-col gap-5">



                    {/* first component */}
                    <div className="flex flex-row bg-white drop-shadow-lg rounded-lg border">
                        <div className="px-[7rem] py-[8rem]">
                            <label className="text-3xl ">1</label>
                        </div>
                        <div className="bg-white drop-shadow-lg rounded-lg border w-full my-4 mr-5">
                            <p className="mx-16 my-4 text-[#2B3467] text-3xl font-bold"><b>ชื่อโครงการ:</b> งานติดตั้งกล้องวงจรปิด AI</p>
                            <hr></hr>
                            <div className="flex flex-col gap-7 justify-center mx-16 my-4">
                                <div className="flex flex-row-2 gap-6">
                                    <p className="text-2xl basis-1/2"><b>ระยะเวลารับสมัคร :</b> เริ่ม 1 กพ. 2566 - 10 กพ. 2566</p>
                                    <p className="text-2xl basis-1/2"><b>เวลาปิดรับสมัคร :</b> 16:30 น.</p>
                                </div>
                                <div className="flex flex-row gap-6">
                                    <p className="text-2xl basis-1/2"><b>เงินประกันซองที่ต้องชำระ :</b> 5000 บาท</p>
                                    <p className="text-[#E80000B2] text-2xl basis-1/2"><b>สถานะโครงการ :</b> เสร็จสิ้น</p>
                                </div>
                                <div className="flex flex-row gap-6 items-center">
                                    <p className="text-2xl text-[#4B82A9]">ดูรายละเอียดเพิ่มเติม</p>
                                    <button className="p-1.5 pl-3.5 w-[11rem] border-4 border-gray-300 col-start-1 col-end-5 rounded-3xl bg-white text-xl drop-shadow-md grid grid-cols-4 justify-self-center"
                                    // onClick={() => {
                                    //     showFileOnClick(listProject?.Tor_uri || "")
                                    // }}
                                    >
                                        <BsDownload className="col-start-1 text-xl self-center" />
                                        <p className="col-start-2 col-end-4 items-center text-xl text-[#4B82A9]">TOR</p></button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* second component */}
                    <div className="flex flex-row bg-white drop-shadow-lg rounded-lg border">
                        <div className="px-[7rem] py-[8rem]">
                            <label className="text-3xl ">2</label>
                        </div>
                        <div className="bg-white drop-shadow-lg rounded-lg border w-full my-4 mr-5">
                            <p className="mx-16 my-4 text-[#2B3467] text-3xl font-bold"><b>ชื่อโครงการ:</b> งานติดตั้งกล้องวงจรปิด AI</p>
                            <hr></hr>
                            <div className="flex flex-col gap-7 justify-center mx-16 my-4">
                                <div className="flex flex-row-2 gap-6">
                                    <p className="text-2xl basis-1/2"><b>ระยะเวลารับสมัคร :</b> เริ่ม 1 กพ. 2566 - 10 กพ. 2566</p>
                                    <p className="text-2xl basis-1/2"><b>เวลาปิดรับสมัคร :</b> 16:30 น.</p>
                                </div>
                                <div className="flex flex-row gap-6">
                                    <p className="text-2xl basis-1/2"><b>เงินประกันซองที่ต้องชำระ :</b> 5000 บาท</p>
                                    <p className="text-[#559744] text-2xl basis-1/2"><b>สถานะโครงการ :</b> เปิดรับสมัคร</p>
                                </div>
                                <div className="flex flex-row items-center">
                                    <div className="flex flex-row gap-6 items-center basis-1/2">
                                        <p className="text-2xl text-[#4B82A9]">ดูรายละเอียดเพิ่มเติม</p>
                                        <button className="p-1.5 pl-3.5 w-[11rem] border-4 border-gray-300 col-start-1 col-end-5 rounded-3xl bg-white text-xl drop-shadow-md grid grid-cols-4 justify-self-center"
                                        // onClick={() => {
                                        //     showFileOnClick(listProject?.Tor_uri || "")
                                        // }}
                                        >
                                            <BsDownload className="col-start-1 text-xl self-center" />
                                            <p className="col-start-2 col-end-4 items-center text-xl text-[#4B82A9]">TOR</p></button>
                                    </div>
                                    {/* สมัครประมูล */}
                                    <button className="ml-[1rem] p-2 pl-3.5 w-[8rem] border rounded-lg bg-[#559744] text-white text-xl"
                                        onClick={handleClick}
                                    >
                                        สมัคร
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-row bg-white drop-shadow-lg rounded-lg border">
                        <div className="px-[7rem] pt-[8rem]">
                            <label className="text-3xl ">3</label>
                        </div>
                        <div className="bg-white drop-shadow-lg rounded-lg border w-full my-4 mr-5">
                            <p className="mx-16 my-4 text-[#2B3467] text-3xl font-bold"><b>ชื่อโครงการ:</b> งานติดตั้งกล้องวงจรปิด AI</p>
                            <hr></hr>
                            <div className="flex flex-col gap-7 justify-center mx-16 my-4">
                                <div className="flex flex-row-2 gap-6">
                                    <p className="text-2xl basis-1/2"><b>ระยะเวลารับสมัคร :</b> เริ่ม 1 กพ. 2566 - 10 กพ. 2566</p>
                                    <p className="text-2xl basis-1/2"><b>เวลาปิดรับสมัคร :</b> 16:30 น.</p>
                                </div>
                                <div className="flex flex-row gap-6">
                                    <p className="text-2xl basis-1/2"><b>เงินประกันซองที่ต้องชำระ :</b> 5000 บาท</p>
                                    <p className="text-[#FFC048] text-2xl basis-1/2"><b>สถานะโครงการ :</b> กำลังประกวดราคา</p>
                                </div>
                                <div className="flex flex-row gap-6 items-center">
                                    <p className="text-2xl text-[#4B82A9]">ดูรายละเอียดเพิ่มเติม</p>
                                    <button className="p-1.5 pl-3.5 w-[11rem] border-4 border-gray-300 col-start-1 col-end-5 rounded-3xl bg-white text-xl drop-shadow-md grid grid-cols-4 justify-self-center"
                                    // onClick={() => {
                                    //     showFileOnClick(listProject?.Tor_uri || "")
                                    // }}
                                    >
                                        <BsDownload className="col-start-1 text-xl self-center" />
                                        <p className="col-start-2 col-end-4 items-center text-xl text-[#4B82A9]">TOR</p></button>
                                </div>
                            </div>
                        </div>
                    </div>

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



                <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center">
                    <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                    ย้อนกลับ
                </button>


            </div>






        </div>
    )
}