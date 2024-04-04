import React, { useEffect, useState, useRef } from 'react';
import { ProjectInterface } from '../../models/Project/IProject';
import { BsDownload } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi"
import Swal from "sweetalert2";
import CurrencyInput from "react-currency-input-field";

import { CreateProjectVenderRegister, UpdateProjectVenderRegister, getVendorRegister } from '../../services/VendorProjectService/VenderRegisterService';
import { getProjectSetting } from '../../services/VendorProjectService/VenderProjectPrice';
import { getVendorInfo } from '../../services/VendorProjectService/VenderProjectPrice';
import { getsubprice } from '../../services/VendorProjectService/VenderProjectPrice';
import { projectSettingsInterface } from '../../models/Project/IProjectSetting';
import { projectinfoInterface } from '../../models/Project/IProjectinfo';
import { VendorInfoInterface } from '../../models/Project/IVenderinfo';
import { SucpriceInfoInterface } from '../../models/Project/IVenderinfo';
import { SubPriceInterface } from '../../models/Project/IVenderRegister';
import { VenderRegisterprojectinfoInterface } from '../../models/Project/IVenderRegister';
// import Project from '../Project';




export default function VenderEditQuotation() {



    const [isChecked, setIsChecked] = useState([false, false, false, false, false, false]);
    const [projectSetting, setProjectSetting] = useState<projectSettingsInterface>(); // ประกาศ state เพื่อเก็บข้อมูล
    const [projectinfo, setProjectinfo] = useState<projectinfoInterface>(); // ประกาศ state เพื่อเก็บข้อมูล

    const [vendorInfo, setVendorInfo] = useState<VendorInfoInterface>();
    const [subprice, setSubprice] = useState<SucpriceInfoInterface>();

    const [subpriceNumber, setSubpriceNumber] = useState<SubPriceInterface>();


    const [venderRegister, setVenderRegister] = useState<Partial<VenderRegisterprojectinfoInterface>>({});

    const [priceconf, setPriceconf] = useState('');


    const [isHaveSubprice, setIsHaveSubprice] = useState<boolean>();

    const boq_uri = useRef<HTMLInputElement>(null);
    const receipt_uri = useRef<HTMLInputElement>(null);

    const [inputValue, setInputValue] = useState<number>();
  
    // เปลี่ยนวันเวลาจาก String เป็น date data
    // วันเริม
    const detailDatetimestart = projectSetting?.startDate ? new Date(projectSetting.startDate) : null;
    const formattedDatestart = detailDatetimestart ? detailDatetimestart.toISOString().split('T')[0] : '';
    // วันจบ
    const detailDatetimeend = projectSetting?.endDate ? new Date(projectSetting.endDate) : null;
    const formattedDateend = detailDatetimeend ? detailDatetimeend.toISOString().split('T')[0] : '';

    const timeEnd = projectSetting?.timeEnd ? new Date(projectSetting.timeEnd) : null;
    const formattedTime = timeEnd ? timeEnd.toTimeString().substring(0, 5) : '';


    const handleCheckboxChange = (index: number) => {
        const newIsChecked = [...isChecked];
        newIsChecked[index] = !newIsChecked[index];
        setIsChecked(newIsChecked);
    };

    const queryParams = new URLSearchParams(window.location.search);
    const idString = queryParams.get('key');
    const key = String(idString)

    
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // console.log(venderRegister !== undefined )//ไม่ un
        const isAllChecked = isChecked.every((value) => value);
        if (isAllChecked) {
            // All checkboxes are checked, do something
            console.log('All checkboxes are checked');
            if (venderRegister.price === undefined || venderRegister.price === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณากรอกจำนวนราคาที่เสนอ',
                })



                return;
            }

            if (venderRegister.boq_uri === undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณาแนบไฟล์รายละเอียดราคาเพิ่มเติม (BOQ)',
                })
                return;
            }

            if (venderRegister.receipt_uri === undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณาแนบไฟล์หลักฐานสลิปการชำระเงิน',
                })
                return;
            }

            if (priceconf !== venderRegister.price) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณายืนยันราคาที่เสนออีกครั้ง',
                })
                return;
            }

            if (venderRegister !== undefined) {
                let data3 = await UpdateProjectVenderRegister(key, venderRegister as VenderRegisterprojectinfoInterface)
                console.log(data3);


            }

            // Check if all checkboxes are checked

        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'คุณสมบัติไม่ครบถ้วน กรุณาตรวจสอบอีกครั้ง',

                confirmButtonText: 'ยืนยัน',  // เปลี่ยนข้อความปุ่ม OK เป็น ยืนยัน
                confirmButtonColor: '#EB455F'  // เปลี่ยนสีปุ่ม OK เป็นสีแดง


            })
        }




    };



    const handleOnChangePrice = (
        e: React.ChangeEvent<{ name: string; value: any }>
    ) => {
        const name = e.target.name as keyof typeof venderRegister;
        const value = e.target.value;

        // อัปเดตค่า state
        setVenderRegister({
            ...venderRegister,
            [name]: value,
        });
    };

    const handleOnChangePriceconf = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPriceconf(event.target.value);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof typeof venderRegister;

        if (event.target.files) {
            setVenderRegister({
                ...venderRegister,
                [name]: event.target.files[0],
            });
        }

    };



    const showFileOnClick = (filePath: string) => {
        window.open((import.meta.env.DEV ? import.meta.env.VITE_URL_DEV : import.meta.env.VITE_URL_PRODUCTION) + filePath);
    }
    const getDetailProject = async (key: string) => {
        let res = await getProjectSetting(key);
        if (res.status !== 200) {
            alert("err")
            return;
        }
        setProjectSetting(res.data);
        setProjectinfo(res.data2);
        console.log(res)

    }

    const getRegisterinfo = async (key: string) => {
        let res = await getVendorRegister(key);
        if (res.status !== 200) {
            alert("err")
            return;
        }
        setVenderRegister(res.data);
        console.log(res.data)
    }

    const getDataVendorInfo = async () => {
        let res = await getVendorInfo();
        if (res.status !== 200) {
            alert("err")
            return;
        }
        setVendorInfo(res.data);
        console.log(res.data)

    }
    // รายละเอียดราคากลางย่อย
    const getDataSubprice = async (key: string) => {
        let res = await getsubprice(key);
        if (res.status !== 200) {
            alert("err")
            return;
        }
        setSubprice(res.data);
        console.log(res.data)


    }
    const initialTotal = 0;


    const total = (initialTotal) + (inputValue as number)  ;

    console.log( inputValue )
   



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputValue(inputValue)
        setVenderRegister({
            ...venderRegister,
            subPrice: [
                {
                    price: inputValue as number,

                    detail_price: subprice?.detail || '',

                }

            ]
        })
    };




    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const idString = queryParams.get('key');

        // ตรวจสอบว่า idString ไม่ใช่ null หรือ undefined ก่อนที่จะแปลงเป็น number
        if (idString !== null && idString !== undefined) {
            const projectKey = String(idString);
            getDetailProject(projectKey);
            getDataSubprice(projectKey);
            getRegisterinfo(projectKey);

        }

        getDataVendorInfo();


    }, []);



    return (
        <div>
            {/* container */}
            <a onClick={()=>console.log(venderRegister?.price) } > qewrqwr</a> 
            <div className="px-[8rem] py-12 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="bg-[#1D5182] pt-3 pb-8 text-white rounded-xl">

                        <p className="text-sm text-end pr-4">เลขที่สมาชิก :  {projectinfo?.key}</p>
                        <label className="text-4xl font-bold pl-16">โครงการ : {projectinfo?.name} </label>
                    </div>
                    <div className="px-32 py-14 flex flex-col gap-5">
                        <div className="flex flex-row">
                            <label className="text-[#2B3467] text-3xl font-bold basis-1/2">หน่วยงาน : {projectinfo?.department_name}</label>
                            <p className="text-[#2B3467] text-3xl mr-[30px]">ไฟล์แนบ :</p>
                            <button
                                className="text-white bg-[#559744] rounded-lg border-4 border-[#557F42] text-xl px-6 py-1 text-center inline-flex items-center mr-2 mb-2"
                                onClick={() => {
                                    showFileOnClick(projectinfo?.Tor_uri || "")
                                }}
                            >
                                <BsDownload className="text-xl w-4 h-4 mr-2" />
                                TOR
                            </button>
                        </div>

                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700 font-extrabold mb-4">1) วัน/เวลา รับฟังคำชี้แจงจากหน่วยงานต้นสังกัด</p>

                            <div className="flex flex-row">
                                <div className="flex flex-row items-center basis-1/3">
                                    <p className="text-xl text-gray-500 mr-3">เริ่มต้น</p>

                                    <input
                                        type="date" value={formattedDatestart} onChange={(e) => console.log(e.target.value)}
                                        className="border rounded-full p-2.5 w-[250px] text-xl text-center"
                                    >

                                    </input>
                                </div>
                                <div className="flex flex-row items-center basis-1/3">
                                    <p className="text-xl text-gray-500 mr-3">สิ้นสุด</p>
                                    <input
                                        type="date"
                                        value={formattedDateend}
                                        onChange={(e) => console.log(e.target.value)}
                                        className="border rounded-full p-2.5 w-[250px] text-xl text-center"
                                    >

                                    </input>

                                </div>
                                <div className="flex flex-row items-center basis-1/3">
                                    <p className="text-xl text-gray-500 mr-3">เวลา</p>
                                    <input
                                        type="time"
                                        pattern="hh:mm"
                                        value={formattedTime}
                                        placeholder="เวลา"
                                        className="border rounded-full p-2.5 w-[250px] text-xl text-center"
                                    >

                                    </input>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700 font-extrabold mb-4">2) เงินประกันซอง</p>
                            <div className="flex flex-row items-center">

                                <CurrencyInput
                                    type="text"
                                    placeholder="เงินประกันซอง"
                                    value={projectSetting?.depositMoney}
                                    className="border rounded-full p-2.5 w-[300px] text-xl text-center"
                                ></CurrencyInput>

                                <p className="text-2xl text-gray-500 ml-[30px]">บาท</p>
                            </div>
                        </div>
                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700  font-extrabold mb-4">3) ผู้ประสานงานโครงการ</p>
                            <div className="grid grid-cols-12 ">
                                <input disabled type="text" placeholder="ผู้ประสานงานโครงการ" value={`${projectSetting?.firstN || ""}  ${projectSetting?.lastN || ""} / ${projectSetting?.position || ""}/ 0${projectSetting?.mobile || ""} / ${projectSetting?.email || ""}`} className="col-start-1 col-end-11 border border-gray-400 rounded-full p-2.5 pl-6 text-xl" />
                            </div>
                            </div>
                    </div>
                </div>

                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="flex flex-col gap-6 mx-16 my-12  ">
                        <label className="text-[#2B3467] text-3xl font-bold basis-1/2">ตรวจสอบคุณสมบัติ</label>

                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input type="checkbox" className="h-8 w-8" checked={isChecked[0]} onChange={() => handleCheckboxChange(0)} />
                            <p className=" text-2xl w-[1180px]">เป็นนิติบุคคลผู้มีอาชีพขายพัสดุที่จัดซื้อในครั้งนี้</p>
                        </div>


                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input type="checkbox" className="h-8 w-8" checked={isChecked[1]} onChange={() => handleCheckboxChange(1)} />
                            <p className="text-2xl w-[1180px]">ไม่เป็นผู้ที่ถูกระบุชื่อไว้ในบัญชีผู้ทิ้งงานของทาง บริษัทปูนซีเมนต์ไทย(ทุ่งสง)</p>
                        </div>
                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input type="checkbox" className="h-8 w-8" checked={isChecked[2]} onChange={() => handleCheckboxChange(2)} />
                            <p className="text-2xl w-[1180px]">ไม่เป็นผู้ได้รับเอกสิทธิ์หรือความคุ้มกัน ซึ่งอาจปฏิเสธไม่ยอมขึ้นศาลไทย</p>
                        </div>
                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input type="checkbox" className="h-8 w-8" checked={isChecked[3]} onChange={() => handleCheckboxChange(3)} />
                            <p className="text-2xl w-[1180px]">ไม่เป็นผู้มีประโยชน์ร่วมกันกับผู้เสนอราคารายอื่นที่เข้าเสนอราคาให้แก่ บริษัทปูนซีเมนต์ไทย (ทุ่งสง)</p>
                        </div>

                        {/* {["เป็นนิติบุคคลผู้มีอาชีพขายพัสดุที่จัดซื้อในครั้งนี้", "ไม่เป็นผู้ที่ถูกระบุชื่อไว้ในบัญชีผู้ทิ้งงานของทาง บริษัทปูนซีเมนต์ไทย(ทุ่งสง)",
                            "ไม่เป็นผู้ได้รับเอกสิทธิ์หรือความคุ้มกัน ซึ่งอาจปฏิเสธไม่ยอมขึ้นศาลไทย",
                            "ไม่เป็นผู้มีประโยชน์ร่วมกันกับผู้เสนอราคารายอื่นที่เข้าเสนอราคาให้แก่ บริษัทปูนซีเมนต์ไทย (ทุ่งสง)"].map((item, index) => (
                                <div className="flex flex-row gap-8 ml-8" key={index}>
                                    <input type="checkbox" className="h-8 w-8" checked={isChecked[index]} onChange={() => handleCheckboxChange(index)} />
                                    <p className="text-2xl">{`${index + 1}. ${item}`}</p>
                                </div>
                            ))} */}
                    </div>
                </div>



                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="flex flex-col gap-6 mx-16 my-12">
                        <label className="text-[#2B3467] text-3xl font-bold basis-1/2">กรอกเสนอราคา</label>
                        <div className="flex flex-row items-center">
                            <label className="text-2xl basis-1/5">1.จำนวนราคาที่เสนอ :</label>
                            <input
                                type="text"
                                name='price'
                                placeholder="จำนวนราคาที่เสนอ"
                                onChange={handleOnChangePrice}

                                value={venderRegister?.price}

                                className="border rounded-md p-2.5 w-[400px] text-xl"
                            >

                            </input>
                            <p className="text-2xl ml-[30px]">บาท</p>
                        </div>
                        <div className="flex flex-row items-center">
                            <label className="text-2xl pl-3 basis-1/5">ยืนยันราคาที่เสนอ :</label>
                            <input
                                type="text"
                                placeholder="จำนวนราคาที่เสนอ"
                                name='conf-price'
                                onChange={handleOnChangePriceconf}
                                value={priceconf}
                                className="border rounded-md p-2.5 w-[400px] text-xl"

                            >

                            </input>
                            <p className="text-2xl ml-[30px]">บาท</p>
                        </div>
                        <div>
                            <label className="text-2xl ">2. รายละเอียดราคาเพิ่มเติม (BOQ) :</label>
                            <input
                                className="border border-gray-400 rounded w-[700px] py-2 px-3 mt-2 ml-[55px] text-gray-700 text-lg focus:shadow-outline"
                                type="file"
                                placeholder="รายละเอียดราคาเพิ่มเติม"
                                onChange={handleFileChange}
                                name='boq_uri'
                                ref={boq_uri}

                                accept="application/pdf"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-2xl ">3. ท่านทีมีราคากลางย่อยที่ต้องใช้กำหนดเปรียบเทียบในการประกวดราคาหรือไม่</label>
                            <div className="mt-2">
                                <div className="ml-6">
                                    <input
                                        className="mr-2 h-4 w-4"
                                        type="radio"
                                        name="is-have"
                                        id="is-have"
                                        required
                                        onClick={() => {
                                            setIsHaveSubprice(true);

                                        }}
                                    />
                                    <label htmlFor="is-have" className=" text-2xl">มีราคากลางย่อย</label>


                                    <input
                                        className="ml-9 mr-2 h-4 w-4"
                                        type="radio"
                                        name="is-have"
                                        id="is-haven't"
                                        required
                                        onClick={() => {
                                            setIsHaveSubprice(false);

                                        }}
                                    />
                                    <label htmlFor="is-haven't" className=" text-2xl">ไม่มีราคากลางย่อย</label>
                                </div>

                                {/* if is have sub price */}
                                {isHaveSubprice && <div id="sub-price-section">
                                    <hr className="my-8"></hr>
                                    <div>
                                        <p className="text-green-700 text-2xl p2"><b>คำแนะนำ:</b> 1. กรุณาใส่ชื่อที่ต้องการเลือกลงในช่อง และกดปุ่ม "ADD" เพื่อยืนยัน</p>
                                        <p className="text-green-700 text-2xl p2 ml-[94px]">2. สามารถเพิ่มได้หลายรายชื่อในแต่ละช่อง</p>
                                    </div>
                                    <div className="bg-white rounded-lg border mb-3 mt-6">



                                        <table className="w-full rounded-lg overflow-auto">
                                            <thead className="text-white uppercase bg-[#2B2A2A] h-14">
                                                <tr>
                                                    <th className="w-[200px] justify-self-center rounded-tl-lg text-2xl">ลำดับ</th>
                                                    <th className="justify-self-center text-2xl">รายละเอียด</th>
                                                    <th className="w-[300px] justify-self-center text-2xl">ราคา</th>
                                                    <th className="w-[270px] justify-self-center rounded-tr-lg text-2xl"> </th>
                                                </tr>
                                            </thead>


                                            <tbody className="bg-white border-b-lg rounded-xl h-14">
                                                <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700">
                                                    {Array.isArray(subprice) && subprice.map((item, index) => (
                                                        <tr key={index} className="text-gray-700 text-xl h-14 border-b-2 border-black-700">
                                                            <th className="rounded-bl-lg">{index + 1}</th>
                                                            <th>{item.detail}</th>
                                                            <th>
                                                                {/* <input
                                                                    className="border border-gray-400 rounded-md w-full py-2.5 px-3 mt-2 text-gray-700 text-xl focus:shadow-outline text-center"
                                                                    placeholder="ราคา"
                                                                /> */}

                                                                <input
                                                                    className="border border-gray-400 rounded-md w-full py-2.5 px-3 mt-2 text-gray-700 text-xl focus:shadow-outline text-center"
                                                                    placeholder="ราคา"
                                                                    value={inputValue}
                                                                    onChange={handleInputChange}
                                                                />

                                                            </th>
                                                            <th className="rounded-br-lg">
                                                                <button className="bg-red-500 text-lg text-white hover:bg-red-700 border py-1.5 px-4 rounded-xl ">ลบ</button>
                                                            </th>
                                                        </tr>
                                                    ))}


                                                    {/* <th className="rounded-bl-lg">1</th>
                                                    <th >ระบบไฟฟ้าแรงสูง (งานไฟฟ้า)</th>
                                                    <th>
                                                        <input
                                                            className="border border-gray-400 rounded-md w-full py-2.5 px-3 mt-2
                                                             text-gray-700 text-xl focus:shadow-outline text-center"
                                                            placeholder="ราคา"
                                                        />
                                                    </th>
                                                    <th className="rounded-br-lg">

                                                        <button className="bg-red-500 text-lg text-white hover:bg-red-700 border py-1.5 px-4 rounded-xl ">ลบ</button></th> */}
                                                </tr>

                                                <tr className=" bg-[#e6e6e6] text-xl h-14 border-b-2">
                                                    <th></th>
                                                    <th>รวมราคากลางสุทธิ</th>
                                                    <th>{total}</th>
                                                    <th className=" text-red-600">ราคายังไม่ครบตามกำหนด</th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <table className="min-w-full mt-10">
                                        <tr>
                                            <th className="w-[200px]"></th>
                                            <th className="text-xl">รายละเอียด</th>
                                            <th className="w-[300px] text-xl">ราคากลางย่อย</th>
                                            <th className="w-[270px]"></th>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td className=""><input
                                                className="border border-gray-400 rounded-md w-full py-2.5 px-3 mt-2 text-gray-700 text-xl focus:shadow-outline"
                                                placeholder="รายละเอียด"
                                            /></td>
                                            <td><CurrencyInput
                                                className="border border-gray-400 rounded-md w-full py-2.5 px-3 mt-2 mx-3 text-gray-700 text-xl focus:shadow-outline"
                                                placeholder="ราคากลางย่อย"
                                            /></td>
                                            <td className="text-center">
                                                <button className="py-2 px-5 mt-2 w-[70px] border rounded-lg bg-[#EB455F] text-white disabled:bg-gray-200">เพิ่ม</button>
                                            </td>
                                        </tr>
                                    </table>

                                </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>





                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="flex flex-col gap-6 mx-16 my-12">
                        <label className="text-[#2B3467] text-3xl font-bold basis-1/2">การประกันซอง</label>
                        <div className="flex flex-row">
                            <label className="text-2xl mr-[30px]">ข้าพเจ้า :</label>
                            <p className="text-2xl text-gray-400 basis-1/3">{vendorInfo?.manager_name}</p>
                            <label className="text-2xl mr-[30px]">ตำแหน่ง :</label>
                            <p className="text-2xl text-gray-400">{vendorInfo?.manager_role}</p>
                        </div>
                        <div className="flex flex-row">
                            <label className="text-2xl mr-[30px]">ขอเสนอยื่นซองร่วมประกวดงาน :</label>
                            <p className="text-2xl text-gray-400">{projectinfo?.name}</p>
                        </div>
                        <div className="flex flex-row">
                            <label className="text-2xl mr-[30px]">ในนามบริษัท/ห้างหุ่นส่วน/บุคคลธรรมดา :</label>
                            <p className="text-2xl text-gray-400">{vendorInfo?.company_name}</p>
                        </div>
                        <div className="flex flex-row">
                            <label className="text-2xl mr-[30px]">สำนักงานตั้งอยู่ที่ :</label>
                            <p className="text-2xl text-gray-400">{vendorInfo?.location_detail}</p>
                        </div>
                        <div className="flex flex-row ml-[200px] my-[30px]">
                            <p className="text-2xl">โอนเงินเข้าบัญชีเงินฝากกระแสรายวัน<br />
                                บริษัท ปูนซิเมนต์ไทย (ทุ่งสง) จํากัด<br />
                                ธนาคาร กสิกรไทย เลขทีบัญชี 126-1-02539-2</p>
                        </div>
                        <div className="flex flex-row">
                            <label className="text-2xl mr-[30px]">จำนวนเงินค้ำประกันซอง :</label>
                            <p className="text-2xl text-gray-400">{projectSetting?.depositMoney}</p>
                            <p className="text-2xl ml-[30px]">บาท</p>
                        </div>
                        <div className="flex flex-row items-center">
                            <label className="text-2xl mr-[30px]">หลักฐานสลิปการชำระเงิน :</label>
                            <input
                                className="border border-gray-400 rounded w-[600px] py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline"
                                type="file"
                                id='receipt_uri'
                                placeholder="หลักฐานสลิปการชำระงิน"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                name='receipt_uri'
                                ref={receipt_uri}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="flex flex-col gap-6 mx-16 my-12">
                        <div className="flex flex-row gap-8 ml-8">
                            <input type="checkbox" className="h-8 w-8" checked={isChecked[4]} onChange={() => handleCheckboxChange(4)} />
                            <p className="text-2xl w-[1180px]">ข้าพเจ้า กรรมการผู้จัดการ/หุ้นส่วนผู้จัดการ/เจ้าของ หรือผู้แทนที่ได้รับมอบการเสนอราคา ยืนยันว่าข้อมูลข้างต้นทั้งหมดเป็นความจริง</p>
                        </div>
                        <div className="flex flex-row gap-8 ml-8">
                            <input type="checkbox" className="h-8 w-8" checked={isChecked[5]} onChange={() => handleCheckboxChange(5)} />
                            <p className="text-2xl w-[1180px]">ข้าพเจ้า กรรมการผู้จัดการ/หุ้นส่วนผู้จัดการ/เจ้าของ หรือผู้แทนที่ได้รับมอบการเสนอราคา ได้อ่านข้อมูล TOR รับทราบและตกลงจะปฏิบัติตามเงื่อนไขการประกวดราคานี้ทุกประการ</p>
                        </div>
                        <p className="text-2xl text-red-500 ml-[97px]">ระยะเวลาเปิดรับเอกสารประกวดราคา 1 ธันวาคม 2565 - 10 ธันวาคม 2565</p>

                        <p className="text-2xl text-red-500 ml-[97px]">ระยะเวลาเปิดรับเอกสารประกวดราคา 1 ธันวาคม 2565 - 10 ธันวาคม 2565</p>

                        <div className="mt-10 grid grid-cols-5">
                            <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center">
                                <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                                ย้อนกลับ
                            </button>

                            {/* edit button */}
                            {/* <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#D9C304] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center">
                                <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                                แก้ไข
                            </button> */}
                            <button
                                className="px-8 py-2.5 w-[180px] rounded-lg bg-[#2B3467] drop-shadow-lg 
                            text-white text-2xl grid justify-self-center col-start-3 "
                                onClick={handleSubmit}

                            >
                                สรุปข้อมูล
                            </button>
                        </div>
                    </div>
                </div>


            </div >
        </div >

    )


};
