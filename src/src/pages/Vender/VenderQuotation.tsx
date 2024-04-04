import React, { useEffect, useState, useRef } from 'react';
import { BsDownload } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi"
import Swal from "sweetalert2";
import CurrencyInput from "react-currency-input-field";
import { CreateProjectVenderRegister } from '../../services/VendorProjectService/VenderRegisterService';
import { getProjectSetting } from '../../services/VendorProjectService/VenderProjectPrice';
import { getVendorInfo } from '../../services/VendorProjectService/VenderProjectPrice';
import { getsubprice } from '../../services/VendorProjectService/VenderProjectPrice';
import { projectSettingsInterface } from '../../models/Project/IProjectSetting';
import { projectinfoInterface } from '../../models/Project/IProjectinfo';
import { VendorInfoInterface } from '../../models/Project/IVenderinfo';
import { VendorRegisterProjectInterface } from '../../models/Project/IVenderRegister';
import { VenderRegisterprojectinfoInterface } from '../../models/Project/IVenderRegister';
import { showFileOnClick } from '../../services/utilitity';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

export default function VenderQuotation() {
    const queryParams = new URLSearchParams(window.location.search);
    const mySwal = withReactContent(Swal)
    const [isChecked, setIsChecked] = useState([false, false, false, false, false, false, false, false, false]);
    const [projectSetting, setProjectSetting] = useState<projectSettingsInterface>(); // ประกาศ state เพื่อเก็บข้อมูล
    const [projectinfo, setProjectinfo] = useState<projectinfoInterface>(); // ประกาศ state เพื่อเก็บข้อมูล
    const [vendorRegister, setVendorRegister] = useState<Partial<VendorRegisterProjectInterface>>({
        key: queryParams.get("key") || ""
    })
    const navigate = useNavigate();
    const [vendorInfo, setVendorInfo] = useState<VendorInfoInterface>();
    const [lockInput, setLockInput] = useState(false);
    const boq_uri = useRef<HTMLInputElement>(null);
    const receipt_uri = useRef<HTMLInputElement>(null);
    const Explaindetails = useRef<HTMLInputElement>(null);
    const openUploadFileBOQ: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        
        // โค้ดเปิดหน้าใหม่
        const file = vendorRegister.boq_uri;
        if (file !== undefined) {
            const blobData = new Blob([file], { type: file.type });
            const blobUrl = URL.createObjectURL(blobData);
            window.open(blobUrl, '_blank');
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
        }
    };
     const openUploadFilereceipt: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        
        // โค้ดเปิดหน้าใหม่
        const file = vendorRegister.receipt_uri;
        if (file !== undefined) {
            const blobData = new Blob([file], { type: file.type });
            const blobUrl = URL.createObjectURL(blobData);
            window.open(blobUrl, '_blank');
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
        }
    };
    const openUploadFileExplaindetails: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        
        // โค้ดเปิดหน้าใหม่
        const file = vendorRegister.Explaindetails;
        if (file !== undefined) {
            const blobData = new Blob([file], { type: file.type });
            const blobUrl = URL.createObjectURL(blobData);
            window.open(blobUrl, '_blank');
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
        }
    };
    const depositMoney = Number(projectSetting?.depositMoney);
    // const formattedDepositMoney = depositMoney.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const [formattedDepositMoney, setFormattedDepositMoney] = useState('');
    
    // เปลี่ยนวันเวลาจาก String เป็น date data
    // วันเริม

    const detailDatetimestart = projectSetting?.startDate ? new Date(projectSetting.startDate) : null;
    console.log(projectSetting?.startDate)
    // if (detailDatetimestart) {
    //     // บวก 1 เดือน
    //     detailDatetimestart.setMonth(detailDatetimestart.getMonth() + 1);
    // }

    const formattedDatestart = detailDatetimestart ? new Date(detailDatetimestart.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '';

    
    console.log(formattedDatestart)
    const isDisabled = true;


    // วันจบ
    const detailDatetimeend = projectSetting?.endDate ? new Date(projectSetting.endDate) : null;
    // if (detailDatetimeend) {
    //     // บวก 1 เดือน
    //     detailDatetimeend.setMonth(detailDatetimeend.getMonth() + 1);
    // }
    const formattedDateend = detailDatetimeend ? detailDatetimeend.toISOString().split('T')[0] : '';
    // เวลา
    const endtime = projectSetting?.endDate ? new Date(projectSetting.endDate) : null;
    const formattedTime = endtime ? endtime.toLocaleTimeString('en-US', {hour12: false}).substring(0, 5) : '';
    console.log(projectSetting?.endDate)
    console.log(formattedTime)
    


    // แปลง formattedDatestart เป็น Date object
    const startDate = new Date(formattedDatestart);
    const endDate = new Date(formattedDateend);

    // สร้างอาร์เรย์ของชื่อเดือน
    const monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    // สร้างสตริงที่แสดงวันที่ ชื่อเดือน ปี
    const formattedStartDate = `${startDate.getDate()} ${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
    const formattedEndDate = `${endDate.getDate()} ${monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;


    const handleInputChange = (value: string | undefined, index: number) => {

        if (!vendorRegister.subPrice) {
            return
        }

        const start = vendorRegister.subPrice.slice(0, index)
        const end = vendorRegister.subPrice.slice(index + 1)

        const current = vendorRegister.subPrice[index];
        // อัปเดตรายการ prices โดยสร้างรายการใหม่ที่มีค่าใหม่ใน index ที่ถูกกด
        setVendorRegister(
            {
                ...vendorRegister,
                subPrice: [
                    ...start,
                    {
                        ...current,
                        price: value || 0
                    },
                    ...end
                ]
            }
        )

    };


    const handleCheckboxChange = (index: number) => {
        const newIsChecked = [...isChecked];
        newIsChecked[index] = !newIsChecked[index];
        setIsChecked(newIsChecked);
    };

    const handleCheckAll = () => {
        const isAllChecked = isChecked.every((value) => value);
        if (isAllChecked) {
            // All checkboxes are checked, do something
            console.log('All checkboxes are checked');
            if (!vendorRegister.price || vendorRegister.price === "") {
                mySwal.fire({
                    icon: 'error',
                    title: 'กรุณากรอกจำนวนราคาที่เสนอ',
                })
                return;
            }

            if (vendorRegister.boq_uri === undefined) {
                mySwal.fire({
                    icon: 'error',
                    title: 'กรุณาแนบไฟล์รายละเอียดราคาเพิ่มเติม (BOQ)',
                })
                return;
            }

            if (vendorRegister.receipt_uri === undefined) {
                mySwal.fire({
                    icon: 'error',
                    title: 'กรุณาแนบไฟล์หลักฐานสลิปการชำระเงิน',
                })
                return;
            }

            if (vendorRegister.Explaindetails === undefined) {
                mySwal.fire({
                    icon: 'error',
                    title: 'กรุณาแนบไฟล์รับฟังคำชี้แจงรายละเอียดโครงการ',
                })
                return;
            }

            if (
                ( vendorRegister.subPrice && vendorRegister.subPrice.length !== 0) &&
                Number(vendorRegister.price) !== vendorRegister.subPrice?.reduce((prev, item) => {
                    if (!item.price || item.price == "0") {
                        return 0;
                    }
                    return prev + parseFloat(item.price as string || "0")
                }, 0)
            ) {
                mySwal.fire({
                    icon: 'error',
                    title: 'ราคาประมูลไม่ตรงกับราคาย่อย',
                })
                return;
            }

            if (Number(vendorRegister.conf_price) !== Number(vendorRegister.price)) {
                mySwal.fire({
                    icon: 'error',
                    title: 'กรุณายืนยันราคาที่เสนออีกครั้ง',
                })
                return;
            }



            setLockInput(true);

        }
        else {
            mySwal.fire({
                icon: 'error',
                title: 'คุณสมบัติไม่ครบถ้วน กรุณาตรวจสอบอีกครั้ง',
                confirmButtonText: 'ยืนยัน',  // เปลี่ยนข้อความปุ่ม OK เป็น ยืนยัน
                confirmButtonColor: '#EB455F'  // เปลี่ยนสีปุ่ม OK เป็นสีแดง
            })
            setLockInput(false);


        }
    };

    const idString = queryParams.get('key');
    const key = String(idString)

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (vendorRegister !== undefined) {
            if (vendorRegister) {


                mySwal.fire({
                    width: "1000px",
                    title: '<p  style="font-size: 50px;">ยืนยันการส่งราคาเข้าร่วมประมูล?</p>',
                    html: (
                        <div>
                            <p className='m-[30px] text-[30px]'>โปรดตรวจสอบข้อมูลให้ถูกต้องครบถ้วน
                                ทางบริษัทจะไม่รับผิดชอบทุกกรณีหากเกิดจากความผิดพลาดจากทางผู้เข้าร่วมประมูล ท่านจะถูกตัดสิทธิ &nbsp;&nbsp;&nbsp;และบริษัทจะไม่คืนเงินประกันซอง
                            </p>
                        </div>
                    ),
                    customClass: {
                        container: 'your-custom-width-class',
                        confirmButton: 'your-confirm-button-class',
                        cancelButton: 'your-cancel-button-class',
                    },
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#EB455F',
                    cancelButtonColor: '#979797',
                    confirmButtonText: '<div style="margin-left: 30px; margin-right: 30px; font-size: 30px;">ยืนยัน</div>',
                    cancelButtonText: '<div style="margin-left: 30px; margin-right: 30px; font-size: 30px;">ปิด</div>',

                    preConfirm: async () => {
                        let data3 = await CreateProjectVenderRegister(key, vendorRegister as VenderRegisterprojectinfoInterface)
                        if (data3.status !== 200) {
                            mySwal.showValidationMessage(`<div style='font-size: 30px;'>${data3.err}</div>`);
                        }
                    }
                    }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire(
                            {
                                title: 'ส่งสำเร็จ',
                                text: "",
                                icon: 'success',
                                confirmButtonText: 'ยืนยัน',
                            }
                        ).then(() => {
                            navigate("/vender/waittomanage");
                        });
                    }
                });
            }
        }

    };

    const handleOnChangePrice = (
        value: string, name: string
    ) => {

        // อัปเดตค่า state
        setVendorRegister({
            ...vendorRegister,
            [name]: value,
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof typeof vendorRegister;
        if (event.target.files) {

            setVendorRegister({
                ...vendorRegister,
                [name]: event.target.files[0],
            });
        }

    };

    const getDetailProject = async (key: string) => {
        let res = await getProjectSetting(key);
        if (res.status !== 200) {
            alert("err")
            return;
        }
        setProjectSetting(res.data);
        console.log(res.data)
        setProjectinfo(res.data2);
        setFormattedDepositMoney((res.data.depositMoney).substring(0, (res.data.depositMoney).length - 2));
        console.log(res)

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

    const getDataSubprice = async (key: string) => {
        let res = await getsubprice(key);
        if (res.status !== 200) {
            alert("err")
            return;
        }
        if (Array.isArray(res.data)) {
            let subArrayMapped = res.data.map((item: any) => ({
                detail_price: item.detail
            }))
            setVendorRegister(
                {
                    ...vendorRegister,
                    subPrice: subArrayMapped
                }
            )
        }
        console.log(res.data)
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const idString = queryParams.get('key');

        // ตรวจสอบว่า idString ไม่ใช่ null หรือ undefined ก่อนที่จะแปลงเป็น number
        if (idString !== null && idString !== undefined) {
            const projectKey = String(idString);
            getDetailProject(projectKey);
            getDataSubprice(projectKey);
        }
        getDataVendorInfo();

    }, [formattedDepositMoney]);


    return (
        <div>
            {/* container */}
            {/* <a onClick={Clickme } > qewrqwr</a> */}
            <div className="w-11/12 mx-auto py-5 rounded-2xl">
                <div className="bg-white drop-shadow-lg  w-full my-4 rounded-2xl">
                    <div className="bg-[#1D5182] py-6 text-white rounded-t-lg">
                        <p className="text-lg text-end pr-8">เลขที่เอกสาร :  {projectinfo?.key} </p>
                        <label className="text-3xl font-bold pl-10">โครงการ : {projectinfo?.name} </label>
                    </div>
                    <div className="px-10 py-4 flex flex-col gap-5">
                    <div className="grid grid-cols-14">
                        <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-1">
                            <p >สังกัด </p>
                        </label>
                        <label className="text-[#2B3467] text-xl text-center font-bold pb-2 col-span-1 mr-3">
                            <p >:</p>
                        </label>
                        <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-12">
                            <p className="inline">  {projectinfo?.division_name}  / {projectinfo?.department_name} / {projectinfo?.SECTION} / {projectinfo?.SUBSECTION}</p>
                        </label>
                    </div>
                    <div className="grid grid-cols-14">
                        <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-1">
                            <p >ไฟล์แนบ </p>
                        </label>
                        <label className="text-[#2B3467] text-xl text-center font-bold pb-2 col-span-1 mr-3">
                            <p >:</p>
                        </label>
                        <label className="text-[#2B3467] text-xl font-bold pb-2 col-span-12">
                            <p className="inline"> <button
                                className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#2B3467] rounded-lg text-base mb-6 text-center inline-flex items-center justify-center w-[120px]"
                                onClick={() => {
                                    showFileOnClick(projectinfo?.Tor_uri || "")
                                }}
                            >
                                <BsDownload className="text-xl w-4 h-4 mr-2" />
                                TOR
                            </button></p>
                        </label>
                    </div>
                        {/* <div className="flex flex-row">
                            <label className="text-[#2B3467] text-xl font-bold  mb-0 w-[100px]">สังกัด :</label>
                            <p className="text-[#2B3467] text-xl font-bold mb-0  ml-2 short-text">
                                {projectinfo?.department_name} / {projectinfo?.division_name} / {projectinfo?.SECTION} / {projectinfo?.SUBSECTION}
                            </p>
                            <p className="text-[#2B3467] text-xl  font-bold mb-0  w-[120px] ">ไฟล์แนบ : </p>
                            <button
                                className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#2B3467] rounded-lg text-base mb-6 text-center inline-flex items-center justify-center w-[120px]"
                                onClick={() => {
                                    showFileOnClick(projectinfo?.Tor_uri || "")
                                }}
                            >
                                <BsDownload className="text-xl w-4 h-4 mr-2" />
                                TOR
                            </button>
                        </div> */}
                        {/* SECTION 1 - Detail of project and project setting */}
                        <div>
                            <p className="basis-1/2 text-xl text-gray-700 font-extrabold "> วัน/เวลา ยื่นซอง</p>

                            <div className="confirm-input-price grid grid-cols-12">
                                <p className="col-start-1 text-lg flex justify-center items-center text-gray-500 mr-3">เริ่มต้น</p>
                                <input
                                    type="text"
                                    value={formattedStartDate }
                                    onChange={(e) => console.log(e.target.value)}
                                    className="col-start-2 col-end-5 border border-gray-400 rounded-lg m-5 text-lg  p-1 text-center"
                                    disabled
                                >
                                </input>
                                <p className="col-start-5 text-lg flex justify-center items-center text-gray-500 mr-3">สิ้นสุด</p>
                                <input
                                    type="text"
                                    value={formattedEndDate}
                                    onChange={(e) => console.log(e.target.value)}
                                    className="col-start-6 col-end-9 border border-gray-400 rounded-lg m-5 text-lg  p-1 text-center"
                                    disabled
                                >
                                </input>
                                <p className="col-start-9 text-lg flex justify-center items-center text-gray-500 mr-3">เวลา</p>
                                <p className={`col-start-10 col-end-13 border border-gray-400 rounded-lg pt-1.5 m-5 text-xl text-center shadow-inner  text-black ${isDisabled ? '  bg-black bg-opacity-20' : ''}`}
                                >{formattedTime} น.</p>
                            </div>
                        </div>
                        <div>
                            <p className="basis-1/2 text-xl text-gray-700 font-extrabold ">เงินประกันซอง </p>
                            <div className="grid grid-cols-8 ">

                                <CurrencyInput
                                    type="text"
                                    placeholder="เงินประกันซอง"
                                    value={formattedDepositMoney }
                                    className="col-start-1 col-end-3 border border-gray-400 rounded-lg my-5 text-lg  p-1 text-center"
                                    disabled
                                    suffix=" บาท"
                                ></CurrencyInput>
                            </div>
                        </div>
                        <div>
                            <p className="basis-1/2 text-xl text-gray-700  font-extrabold mb-4">ผู้ประสานงานโครงการ</p>
                            <div className="grid grid-cols-12 ">
                            <input
                            disabled
                            type="text"
                            placeholder="ผู้ประสานงานโครงการ"
                            value={` คุณ${projectSetting?.firstN || ""}  ${projectSetting?.lastN || ""} / ${projectSetting?.position || ""}/ 0${projectSetting?.mobile || ""} / ${projectSetting?.email || ""}`}
                            className="col-start-1 col-end-13 border border-gray-400 rounded-lg p-1.5 pl-6 text-base"
                            style={{ overflowWrap: "break-word" }}
                            />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3 - Offer budget */}
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="flex flex-col gap-6 mx-10 my-10">
                        <label className="confirm-input text-[#2B3467] text-2xl font-bold basis-1/2">กรอกเสนอราคา</label>
                        <div className="flex flex-row items-center">
                            <label className="text-xl basis-1/5">1. จำนวนราคาที่เสนอ :</label>
                            <CurrencyInput
                                type="text"
                                name='price'
                                placeholder="จำนวนราคาที่เสนอ"
                                onValueChange={(value, name) => {
                                    handleOnChangePrice(value as string, name as string)
                                }}
                                value={vendorRegister.price}
                                disabled={lockInput}

                                className="border border-gray-400 rounded-md p-2  w-[240px] text-xl text-center"
                            />
                            <p className="text-xl ml-[30px]">{projectinfo?.project_unit_price}</p>
                        </div>
                        <div className="flex flex-row items-center">
                            <label className="text-xl pl-4 basis-1/5 ">ยืนยันราคาที่เสนอ :</label>
                            <CurrencyInput
                                type="text"
                                placeholder="จำนวนราคาที่เสนอ"
                                name='conf_price'
                                onValueChange={(value, name) => {
                                    handleOnChangePrice(value as string, name as string)
                                }}
                                value={vendorRegister.conf_price}
                                className="border border-gray-400 rounded-md p-2 w-[240px] text-xl text-center"
                                disabled={lockInput}
                            />
                            <p className="text-xl ml-[30px]">{projectinfo?.project_unit_price}</p>
                        </div>
                        <div className="flex flex-col items-start mb-3">
                            <label className="text-xl mb-3">2. รายละเอียดราคาเพิ่มเติม (BOQ) :</label>
                            <div className="col-span-1 flex items-center">
                                <input
                                className="border border-gray-400 rounded w-[450px] py-2 px-3 text-lg focus:shadow-outline justify-start"
                                type="file"
                                placeholder="รายละเอียดราคาเพิ่มเติม"
                                onChange={handleFileChange}
                                name='boq_uri'
                                ref={boq_uri}
                                accept="application/pdf"
                                required
                                disabled={lockInput}
                                />
                                <button
                                className="border p-2 bg-[#EB455F] text-white rounded-lg text-lg ml-2"
                                onClick={openUploadFileBOQ}
                                >
                                ตรวจสอบไฟล์
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xl ">3. โปรดระบุรายละเอียดราคาย่อย (กรณีการประกวดราคาดังกล่าว SCG กำหนดให้มีราคาย่อย)</label>
                            <div className="mt-2">
                                <div className="ml-6">
                                    <input
                                        className="mr-2 h-4 w-4"
                                        type="radio"
                                        name="is-have"
                                        id="is-have"
                                        checked={
                                            (Array.isArray(vendorRegister.subPrice) && vendorRegister.subPrice.length !== 0) ? true : false
                                        }
                                        disabled
                                    />
                                    <label htmlFor="is-have" className=" text-xl">มีราคาย่อย</label>
                                    <input
                                        className="ml-9 mr-2 h-4 w-4"
                                        type="radio"
                                        name="is-have"
                                        id="is-haven't"
                                        checked={(Array.isArray(vendorRegister.subPrice) && vendorRegister.subPrice.length !== 0) ? false : true}
                                        disabled
                                    />
                                    <label htmlFor="is-haven't" className=" text-xl">ไม่มีราคาย่อย</label>
                                </div>

                                {/* if is have sub price */}
                                {(Array.isArray(vendorRegister.subPrice) && vendorRegister.subPrice.length !== 0)  && <div id="sub-price-section">
                                    <hr className="my-4"></hr>
                                    <div>
                                        <p className="text-green-700 text-lg p2"><b>คำแนะนำ:</b> 1. กรุณาใส่ชื่อที่ต้องการเลือกลงในช่อง และกดปุ่ม "ADD" เพื่อยืนยัน</p>
                                        <p className="text-green-700 text-lg p2 ml-[70px]">2. สามารถเพิ่มได้หลายรายชื่อในแต่ละช่อง</p>
                                    </div>
                                    <div className="bg-white rounded-lg border mb-3 mt-6">



                                        <table className="w-full rounded-lg overflow-auto">
                                            <thead className="text-white uppercase bg-[#2B2A2A] h-14">
                                                <tr>
                                                    <th className="w-[120px] justify-self-center rounded-tl-lg text-xl">ลำดับ</th>
                                                    <th className="justify-self-center text-xl">รายละเอียด</th>
                                                    <th className="w-[360px] justify-self-center rounded-tr-lg text-xl">ราคา ( {projectinfo?.project_unit_price} )</th>
                                                </tr>
                                            </thead>


                                            <tbody className="bg-white border-b-lg rounded-xl h-14 ">
                                                {Array.isArray(vendorRegister.subPrice) &&
                                                    vendorRegister.subPrice.map((item, index) => (
                                                        <tr key={index} className="confirm-input-price text-gray-700 text-lg text-center h-14 border-b-2 border-black-700"
                                                        style={{ verticalAlign: "top" }}>
                                                            <td className="rounded-bl-lg pt-4">{index + 1}</td>
                                                            <td className='pt-4 text-left'>{item.detail_price}</td>
                                                            <td className='pr-2 '>
                                                                <CurrencyInput
                                                                    className="border border-gray-400 rounded-md w-3/4 py-1 px-2 my-2 text-gray-700 text-lg focus:shadow-outline text-center"
                                                                    placeholder="ราคา"
                                                                    value={vendorRegister.subPrice ? vendorRegister.subPrice[index].price : "" || ""}
                                                                    onValueChange={(value, name) => handleInputChange(value, index)}
                                                                    disabled={lockInput}
                                                                />
                                                            </td>
                                                            
                                                        </tr>
                                                    ))}
                                                <tr className=" bg-[#e6e6e6] text-xl h-14 border-b-2 ">
                                                    <th></th>
                                                    <th>รวมราคาสุทธิ</th>
                                                    <th>
                                                        {
                                                            vendorRegister.subPrice.reduce(
                                                                (prev, item) => (
                                                                    prev + parseFloat(item.price as string || "0")
                                                                )
                                                                , 0
                                                            ).toLocaleString(undefined,
                                                                {
                                                                    minimumFractionDigits: 2
                                                                }
                                                            )
                                                        }
                                                        <span className={
                                                            vendorRegister.subPrice.reduce(
                                                                (prev, item) => (
                                                                    prev + parseFloat(item.price as string || "0")
                                                                )
                                                                , 0
                                                            ) == vendorRegister.price ?
                                                                'text-green-500' : 'text-red-500'
                                                        }>
                                                            {
                                                                vendorRegister.subPrice.reduce(
                                                                    (prev, item) => (
                                                                        prev + parseFloat(item.price as string || "0")
                                                                    )
                                                                    , 0
                                                                ) == vendorRegister.price ?
                                                                    ' (ราคาครบตามกำหนด)'
                                                                    : ' (ราคายังไม่ครบตามกำหนด)'}
                                                        </span>
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>




                {/* SECTION 4 - Warrenty Vendor */}
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="flex flex-col gap-6 mx-16 my-12">
                        <label className="text-[#2B3467] text-2xl font-bold basis-1/2">การประกันซอง</label>
                        <div className="flex flex-row">
                            <label className="text-xl mr-[30px]">ข้าพเจ้า :</label>
                            <p className="text-xl text-gray-400 basis-1/3">{vendorInfo?.manager_name}</p>
                            <label className="text-xl mr-[30px]">ตำแหน่ง :</label>
                            <p className="text-xl text-gray-400">{vendorInfo?.manager_role}</p>
                        </div>
                        <div className="flex flex-row">
                            <label className="text-xl mr-[30px]">ขอเสนอยื่นซองร่วมประกวดงาน :</label>
                            <p className="text-xl text-gray-400">{projectinfo?.name}</p>
                        </div>
                        <div className="flex flex-row">
                            <label className="text-xl mr-[30px]">ในนามบริษัท/ห้างหุ่นส่วน/บุคคลธรรมดา :</label>
                            <p className="text-xl text-gray-400">{vendorInfo?.company_name}</p>
                        </div>
                        <div className="flex flex-row">
                            <label className="text-xl mr-[30px]">สำนักงานตั้งอยู่ที่ :</label>
                            <p className="text-xl text-gray-400">{vendorInfo?.location_detail}</p>
                        </div>
                        <div className="flex flex-row ml-[200px] my-[5px]">
                            <p className="text-xl">โอนเงินเข้าบัญชีเงินฝากกระแสรายวัน<br />
                                บริษัท ปูนซิเมนต์ไทย (ทุ่งสง) จํากัด<br />
                                ธนาคาร กสิกรไทย เลขทีบัญชี 126-1-02539-2 </p>
                        </div>
                        <div className="flex flex-row">
                            <label className="text-xl mr-[30px]">จำนวนเงินค้ำประกันซอง :</label>
                            <p className="text-xl text-gray-400">
                                {Number(depositMoney).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-xl ml-[30px]">บาท</p>
                        </div>
                        <div className="flex flex-row items-center">
                            <label className="text-xl mr-[30px]">หลักฐานสลิปการชำระเงิน :</label>
                            <input
                                className="border border-gray-400 rounded w-[450px] py-2 px-3 mt-2 text-lg focus:shadow-outline"
                                type="file"
                                id='receipt_uri'
                                placeholder="หลักฐานสลิปการชำระงิน"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                name='receipt_uri'
                                ref={receipt_uri}
                                required
                                disabled={lockInput}
                            />
                            <button
                                className="border p-2 bg-[#EB455F] text-white rounded-lg text-lg ml-2"
                                onClick={openUploadFilereceipt}
                                >
                                ตรวจสอบไฟล์
                                </button>
                        </div>
                    </div>
                </div>

                {/* SECTION 2 - Verify Vendor */}
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="flex flex-col gap-6 mx-16 my-12  ">
                        <label className="text-[#2B3467] text-2xl font-bold basis-1/2">ตรวจสอบคุณสมบัติ</label>


                        <div className="flex flex-col py-3">
                            <label className="text-xl pb-3">
                                หลักฐานการได้อ่านเอกสารชี้แจงรายละเอียดโครงการ (TOR)
                            </label>
                            <p className='text-red-600'></p>
                            <div className="col-span-1 flex items-center">
                            <input
                                className="border border-gray-400 rounded w-[450px] py-2 px-3 mt-2 ml-8 text-lg focus:shadow-outline"
                                type="file"
                                id='Explaindetails'
                                onChange={handleFileChange}
                                placeholder="หลักฐานการได้อ่านเอกสารชี้แจงรายละเอียดโครงการ"
                                ref={Explaindetails}
                                name='Explaindetails'
                                accept="application/pdf"
                                required
                                disabled={lockInput}
                            
                            />
                            <button
                                className="border p-2 bg-[#EB455F] text-white rounded-lg text-lg ml-2"
                                onClick={openUploadFileExplaindetails}
                                >
                                ตรวจสอบไฟล์
                                </button>
                                </div>
                        </div>
                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input id='tor-detail' type="checkbox" disabled={lockInput} className="h-7 w-7" checked={isChecked[0]} onChange={() => handleCheckboxChange(0)} />
                            <label htmlFor='tor-detail' className=" text-lg w-[1180px]">ท่านได้เข้ารับฟังคำชี้แจงรายละเอียดโครงการจากเจ้าของงาน สอบถาม เข้าใจ รายละเอียดต่าง ๆ ถูกต้องครบถ้วน</label>
                        </div>

                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input id='is-coop' type="checkbox" disabled={lockInput} className="h-7 w-7" checked={isChecked[1]} onChange={() => handleCheckboxChange(1)} />
                            <label htmlFor='is-coop' className=" text-lg w-[1180px]">ไม่อยู่ระหว่างเลิกกิจการ</label>
                        </div>


                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input id='forget-work' type="checkbox" disabled={lockInput} className="h-7 w-7" checked={isChecked[2]} onChange={() => handleCheckboxChange(2)} />
                            <label htmlFor='forget-work' className="text-lg w-[1180px]">ไม่อยู่ในระหว่างการถูกระงับ ยื่นเสนอราคา จากบริษัทปูนซิเมนต์ไทย (ทุ่งสง)</label>
                        </div>
                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input id='protection' type="checkbox" disabled={lockInput} className="h-7 w-7" checked={isChecked[3]} onChange={() => handleCheckboxChange(3)} />
                            <label htmlFor='protection' className="text-lg w-[1180px]">เป็นนิติบุคคลที่มีอาชีพรับจ้างงานตามประเภทงานที่แจ้งประกวดราคา</label>
                        </div>
                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input id='other-vendor' type="checkbox" disabled={lockInput} className="h-7 w-7" checked={isChecked[4]} onChange={() => handleCheckboxChange(4)} />
                            <label htmlFor='other-vendor' className="text-lg w-[1180px]">ไม่เป็นผู้มีผลประโยชน์ร่วมกับผู้ยื่นเสนอราคารายอื่นที่เข้ายื่นเสนอราคาในครั้งนี้</label>
                        </div>
                        <div className="flex flex-row gap-8 ml-8 items-center">
                            <input id='powerful' type="checkbox" disabled={lockInput} className="h-7 w-7" checked={isChecked[5]} onChange={() => handleCheckboxChange(5)} />
                            <label htmlFor='powerful' className="text-lg w-[1180px]">ไม่เป็นผู้ได้รับเอกสิทธิ์หรือความคุ้มกัน ซึ่งอาจปฏิเสธไม่ยอมขึ้นศาลไทย</label>
                        </div>

                        <div className="flex flex-row gap-8 ml-8">
                            <input id='accept1' type="checkbox" disabled={lockInput} className="h-7 w-7" checked={isChecked[6]} onChange={() => handleCheckboxChange(6)} />
                            <label htmlFor='accept1' className="text-lg w-[1180px]">ข้าพเจ้า กรรมการผู้จัดการ/หุ้นส่วนผู้จัดการ/เจ้าของ หรือผู้แทนที่ได้รับมอบการเสนอราคา ยืนยันว่าข้อมูลข้างต้นทั้งหมดเป็นความจริง</label>
                        </div>
                        <div className="flex flex-row gap-8 ml-8">
                            <input id='accept2' type="checkbox" disabled={lockInput} className="h-7 w-7" checked={isChecked[7]} onChange={() => handleCheckboxChange(7)} />
                            <label htmlFor='accept2' className="text-lg w-[1180px]">ข้าพเจ้า กรรมการผู้จัดการ/หุ้นส่วนผู้จัดการ/เจ้าของ หรือผู้แทนที่ได้รับมอบการเสนอราคา ได้อ่านข้อมูล TOR รับทราบและตกลงจะปฏิบัติตามเงื่อนไขการประกวดราคานี้ทุกประการ</label>
                        </div>
                        <div className="flex flex-row gap-8 ml-8">
                            <input id='accept3' type="checkbox" disabled={lockInput} className="h-7 w-7" checked={isChecked[8]} onChange={() => handleCheckboxChange(8)} />
                            <label htmlFor='accept3' className="text-lg w-[1180px]">กรณีที่ข้าพเจ้าให้ข้อมูลเท็จ การตัดสินของบริษัทให้ถือเป็นข้อสิ้นสุด</label>
                        </div>
                        <p className="text-xl text-red-500 ml-[97px]">ระยะเวลาเปิดรับเอกสารประกวดราคา {formattedStartDate} - {formattedEndDate}</p>



                        <div className="mt-10 grid grid-cols-5">
                            {
                                !lockInput && (
                                    <>
                                        <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
                                            onClick={() => window.history.back()}
                                        >
                                            <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                                            ย้อนกลับ
                                        </button>

                                        <button
                                            className="px-8 py-2.5 w-[180px] rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl grid justify-self-center col-start-3 "
                                            onClick={handleCheckAll}
                                        >

                                            สรุปข้อมูล
                                        </button>
                                    </>
                                )
                            }
                            {
                                lockInput && (
                                    <>
                                        <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#D9C304] drop-shadow-lg text-white text-2xl col-start-1 text-center "
                                            onClick={() => {
                                                setLockInput(false)
                                            }}>
                                            แก้ไข
                                        </button>
                                        <button
                                            className="px-8 py-2.5 w-[180px] rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl grid justify-self-center col-start-3 "
                                            onClick={handleSubmit}
                                        >
                                            ยืนยัน
                                        </button>
                                    </>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div >
        </div >

    )


}