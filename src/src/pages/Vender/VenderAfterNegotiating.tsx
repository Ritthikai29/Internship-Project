import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { BsDownload } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CurrencyInput from "react-currency-input-field";

import {
  CreateNewProjectVenderRegister,
  getPreviousRegister,
} from "../../services/VendorProjectService/VendorNewBidService";
import { getProjectSetting, getsubprice } from "../../services/VendorProjectService/VenderProjectPrice";

import {
  projectinterface,
  projectsettinginterface,
  previousregisinterface,
  vendorinfointerface,
  vendornewregisinterface,
  VendorNewRegisinterface,
} from "../../models/VendorProject/INewVendor";
import { datetimeFormatter, showFileOnClick } from "../../services/utilitity";
import { VendorRegisterProjectInterface } from "../../models/Project/IVenderRegister";
import { projectSettingsInterface } from "../../models/Project/IProjectSetting";

export default function VenderAfterNegotiating() {
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const idString = queryParams.get("key");
  const key = String(idString);

  const mySwal = withReactContent(Swal);

  const [lockInput, setLockInput] = useState(false);

  const [projectinfo, setProjectinfo] = useState<projectinterface>();
  const [projectSetting, setProjectSetting] =
    useState<projectSettingsInterface>();

  const [vendorPreviousInfo, setVendorPreviousInfo] =
    useState<previousregisinterface>();
  const [vendorInfo, setVendorInfo] = useState<vendorinfointerface>();

  const [vendorNewBidding, setVendorNewBidding] = useState<
    Partial<vendornewregisinterface>
  >({
    key: queryParams.get("key") || "",
  });
  //   const [vendorRegister, setVendorRegister] = useState<Partial<VendorRegisterProjectInterface>>({
  //     key: queryParams.get("key") || ""
  // })
  const isDisabled = true;

  const Explaindetails = useRef<HTMLInputElement>(null);
  const boq_uri = useRef<HTMLInputElement>(null);
  const receipt_uri = useRef<HTMLInputElement>(null);

  const depositMoney = Number(projectSetting?.depositMoney);
  const formattedDepositMoney = depositMoney.toFixed(2);

  const [isChecked, setIsChecked] = useState([
    false,
    false,
    false,
    false,
    false,
    false,

    false,
  ]);
  // const [isHaveSubprice, setIsHaveSubprice] = useState<boolean>();

  // !------------- Warning -------------! //
  // วันเริม

  const detailDatetimestart = projectSetting?.startDate
    ? new Date(projectSetting.startDate)
    : null;

  const formattedDatestart = detailDatetimestart
    ? new Date(detailDatetimestart.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : "";

  // วันจบ
  const detailDatetimeend = projectSetting?.endDate
    ? new Date(projectSetting.endDate)
    : null;

  const formattedDateend = detailDatetimeend
    ? detailDatetimeend.toISOString().split("T")[0]
    : "";

  // เวลา
  const timeEnd = projectSetting?.timeEnd
    ? new Date(projectSetting.timeEnd)
    : null;
  const formattedTime = timeEnd ? timeEnd.toTimeString().substring(0, 5) : "";

  // แปลง formattedDatestart เป็น Date object
  const startDate = new Date(formattedDatestart);
  const endDate = new Date(formattedDateend);

  // สร้างอาร์เรย์ของชื่อเดือน
  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // สร้างสตริงที่แสดงวันที่ ชื่อเดือน ปี
  // const formattedStartDate = `${startDate.getDate()} ${
  //   monthNames[startDate.getMonth()]
  // } ${startDate.getFullYear()}`;
  // const formattedEndDate = `${endDate.getDate()} ${
  //   monthNames[endDate.getMonth()]
  // } ${endDate.getFullYear()}`;

  // !----------------------------------------! //
  const formattedStartDate = `${startDate.getDate()} ${
    monthNames[startDate.getMonth()]
  } ${startDate.getFullYear()}`;
  const formattedEndDate = `${endDate.getDate()} ${
    monthNames[endDate.getMonth()]
  } ${endDate.getFullYear()}`;
  console.log(vendorNewBidding.subPrice);
  console.log(vendorNewBidding.subPrice?.length);

  const handleCheckboxChange = (index: number) => {
    const newIsChecked = [...isChecked];
    newIsChecked[index] = !newIsChecked[index];
    setIsChecked(newIsChecked);
  };

  const handleCheckAll = () => {
    const isAllChecked = isChecked.every((value) => value);
    if (isAllChecked) {
      // All checkboxes are checked, do something
      console.log("All checkboxes are checked");
      if (!vendorNewBidding.price || vendorNewBidding.price === "") {
        mySwal.fire({
          icon: "error",
          title: "กรุณากรอกจำนวนราคาที่เสนอ",
        });
        return;
      }

      if (vendorNewBidding.boq_uri === undefined) {
        mySwal.fire({
          icon: "error",
          title: "กรุณาแนบไฟล์รายละเอียดราคาเพิ่มเติม (BOQ)",
        });
        return;
      }

      // if (vendorNewBidding.receipt_uri === undefined) {
      //   mySwal.fire({
      //     icon: "error",
      //     title: "กรุณาแนบไฟล์หลักฐานสลิปการชำระเงิน",
      //   });
      //   return;
      // }

      if (vendorNewBidding.Explaindetails === undefined) {
        mySwal.fire({
          icon: "error",
          title: "กรุณาแนบไฟล์รับฟังคำชี้แจงรายละเอียดโครงการ",
        });
        return;
      }

      if (
        Array.isArray(vendorNewBidding.subPrice) &&
        vendorNewBidding.subPrice.length > 0 &&
        Number(vendorNewBidding.price) !==
          vendorNewBidding.subPrice?.reduce((prev, item) => {
            if (!item.price || item.price == "0") {
              return 0;
            }
            return prev + parseFloat((item.price as string) || "0");
          }, 0)
      ) {
        mySwal.fire({
          icon: "error",
          title: "ราคาประมูลไม่ตรงกับราคาย่อย",
        });
        return;
      }

      if (
        Number(vendorNewBidding.conf_price) !== Number(vendorNewBidding.price)
      ) {
        mySwal.fire({
          icon: "error",
          title: "กรุณายืนยันราคาที่เสนออีกครั้ง",
        });
        return;
      }

      setLockInput(true);
    } else {
      mySwal.fire({
        icon: "error",
        title: "คุณสมบัติไม่ครบถ้วน กรุณาตรวจสอบอีกครั้ง",

        confirmButtonText: "ยืนยัน", // เปลี่ยนข้อความปุ่ม OK เป็น ยืนยัน
        confirmButtonColor: "#EB455F", // เปลี่ยนสีปุ่ม OK เป็นสีแดง
      });
      setLockInput(false);
    }
  };

  const handleInputChange = (value: string | undefined, index: number) => {
    if (!vendorNewBidding.subPrice) {
      return;
    }

    const start = vendorNewBidding.subPrice.slice(0, index);
    const end = vendorNewBidding.subPrice.slice(index + 1);

    const current = vendorNewBidding.subPrice[index];
    // อัปเดตรายการ prices โดยสร้างรายการใหม่ที่มีค่าใหม่ใน index ที่ถูกกด
    setVendorNewBidding({
      ...vendorNewBidding,
      subPrice: [
        ...start,
        {
          ...current,
          price: value || 0,
        },
        ...end,
      ],
    });
  };

  const handleOnChangePrice = (value: string, name: string) => {
    // อัปเดตค่า state
    setVendorNewBidding({
      ...vendorNewBidding,
      [name]: value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof typeof vendorNewBidding;
    if (event.target.files) {
      setVendorNewBidding({
        ...vendorNewBidding,
        [name]: event.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (vendorNewBidding !== undefined) {
      if (vendorNewBidding) {
        mySwal
          .fire({
            width: "1000px",
            title:
              '<p  style="font-size: 50px;">ยืนยันการส่งราคาเข้าร่วมประมูล?</p>',
            html: (
              <div>
                <p className="m-[30px] text-[30px]">
                  โปรดตรวจสอบข้อมูลให้ถูกต้องครบถ้วน
                  ทางบริษัทจะไม่รับผิดชอบทุกกรณีหากเกิดจากความผิดพลาดจากทางผู้เข้าร่วมประมูล
                  ท่านจะถูกตัดสิทธิ์
                  &nbsp;&nbsp;&nbsp;และบริษัทจะไม่คืนเงินประกันซอง
                </p>
                {/* <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    id="checkbox"
                    className="font-bold w-[30px] h-[30px] mr-[20px]"
                  />
                  <label htmlFor="checkbox" className="font-blod text-[30px]">
                    ยอมรับเงื่อนไขการเข้าร่วมประมูล
                  </label>
                </div> */}
              </div>
            ),
            customClass: {
              container: "your-custom-width-class",
              confirmButton: "your-confirm-button-class",
              cancelButton: "your-cancel-button-class",
            },
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EB455F",
            cancelButtonColor: "#979797",
            confirmButtonText:
              '<div style="margin-left: 30px; margin-right: 30px; font-size: 30px;">ยืนยัน</div>',
            cancelButtonText:
              '<div style="margin-left: 30px; margin-right: 30px; font-size: 30px;">ปิด</div>',
            preConfirm: async () => {
              console.log(vendorNewBidding);
              let data3 = await CreateNewProjectVenderRegister(
                key,
                vendorNewBidding as VendorNewRegisinterface
              );
              if (data3.status !== 200) {
                mySwal.showValidationMessage(
                  `<div style='font-size: 30px;'>${data3.err}</div>`
                );
              }
            },
            // preConfirm: async () => {
            //   const checkbox = document.getElementById(
            //     "checkbox"
            //   ) as HTMLInputElement;
            //   if (checkbox) {
            //     if (checkbox.checked) {
            //       let data3 = await CreateNewProjectVenderRegister(
            //         key,
            //         vendorNewBidding as VendorNewRegisinterface
            //       );
            //       console.log(data3)
            //       if (data3.status !== 200) {
            //         mySwal.showValidationMessage(
            //           `<div style='font-size: 30px;'>${data3.err}</div>`
            //         );
            //       }
            //     } else {
            //       mySwal.showValidationMessage(
            //         "<div style='font-size: 30px;'>กรุณายอมรับก่อนยืนยัน</div>"
            //       );
            //     }
            //   } else {
            //     mySwal.fire("ไม่พบ Checkbox");
            //   }
            // },
          })
          .then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "ส่งสำเร็จ",
                text: "",
                icon: "success",
                confirmButtonText: "ยืนยัน",
              }).then(() => {
                navigate("/vender/waittomanage");
              });
            }
          });
      }
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
   

}

  const getAllData = async (key: string) => {
    let res = await getPreviousRegister(key);
    console.log(res);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setProjectinfo(res.project);
    console.log(res.project);
    setVendorPreviousInfo(res.prev_regis);
    console.log(777)
    console.log(res.prev_regis)
    setVendorInfo(res.vendor_info);
  };

  const getDataSubprice = async (key: string) => {
    let res = await getsubprice(key);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    if (Array.isArray(res.data)) {
      let subArrayMapped = res.data.map((item: any) => ({
        detail_price: item.detail,
      }));
      setVendorNewBidding({
        ...vendorNewBidding,
        subPrice: subArrayMapped,
      });
    }
    console.log(res.data);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const idString = queryParams.get("key");

    // ตรวจสอบว่า idString ไม่ใช่ null หรือ undefined ก่อนที่จะแปลงเป็น number
    if (idString !== null && idString !== undefined) {
      const projectKey = String(idString);
      getDetailProject(projectKey);
      getAllData(projectKey);
      getDataSubprice(projectKey);
    }
  }, []);

  return (
    <div>
      {/* container */}
      <div className="w-11/12 mx-auto py-5 rounded-2xl">
        <div className="bg-white drop-shadow-lg  w-full my-5 rounded-2xl">
          <div className="bg-[#1D5182] py-6 text-white rounded-t-lg">
          <p className="text-lg text-end pr-8">เลขที่เอกสาร :  {projectinfo?.key} </p>
          <label className="text-3xl font-bold pl-10">โครงการ : {projectinfo?.name} </label>
                    
          </div>
          <div className="px-10 py-5 flex flex-col gap-5">
          <div className="flex flex-row">
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
                        </div>

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
                                    className="col-start-1 col-end-3 border border-gray-400 rounded-lg m-5 text-lg  p-1 text-center"
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

        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
        <div className="flex flex-col gap-6 mx-10 my-10">
                        <label className="confirm-input text-[#2B3467] text-2xl font-bold basis-1/2">กรอกเสนอราคา</label>
                        
            <div className="flex flex-row">
              <label className="text-xl basis-1/2">
                ราคาเดิม :{" "}
                <span className="ml-3">
                  <CurrencyInput
                    type="text"
                    placeholder="ราคาเดิม"
                    value={Number(vendorPreviousInfo?.regis_price).toFixed(2)}
                    className="col-start-1 col-end-3 border border-gray-400 rounded-lg m-5 text-lg  p-1 text-center"
                    disabled
                    
                  ></CurrencyInput>
                </span>
                {projectinfo?.project_unit_price}
              </label>
            </div>
            <div className="flex flex-row items-center">
              <label className="text-xl basis-1/5">
                1. จำนวนราคาที่เสนอ :
              </label>
              <CurrencyInput
                type="text"
                name="price"
                placeholder="จำนวนราคาที่เสนอ"
                onValueChange={(value, name) => {
                  handleOnChangePrice(value as string, name as string);
                }}
                value={vendorNewBidding?.price}
                disabled={lockInput}
                className="border border-gray-400 rounded-md p-2.5 w-[400px] text-xl"
              ></CurrencyInput>
              <p className="text-xl ml-[30px]">{projectinfo?.project_unit_price}</p>
            </div>
            <div className="flex flex-row items-center">
              <label className="text-xl pl-4 basis-1/5">
                ยืนยันราคาที่เสนอ :
              </label>
              <CurrencyInput
                type="text"
                placeholder="จำนวนราคาที่เสนอ"
                name="conf_price"
                onValueChange={(value, name) => {
                  handleOnChangePrice(value as string, name as string);
                }}
                value={vendorNewBidding?.conf_price}
                className="border border-gray-400 rounded-md p-2.5 w-[400px] text-xl"
                disabled={lockInput}
              />
              <p className="text-xl ml-[30px]">{projectinfo?.project_unit_price}</p>
            </div>
            <div>
              <label className="text-xl ">
                2. รายละเอียดราคาเพิ่มเติม (BOQ) :
              </label>
              <input
                className="border border-gray-400 rounded w-[700px] py-2 px-3 mt-2 ml-[55px] text-lg focus:shadow-outline"
                type="file"
                placeholder="รายละเอียดราคาเพิ่มเติม"
                onChange={handleFileChange}
                name="boq_uri"
                ref={boq_uri}
                accept="application/pdf"
                required
                disabled={lockInput}
              />

              <button
                className="text-white bg-[#F11313] ml-2 rounded-lg text-xl px-6 py-2.5 text-center inline-flex items-center mr-2 mb-2"
                onClick={() => {
                  showFileOnClick(vendorPreviousInfo?.regis_boq_uri || "");
                }}
              >
                <BsDownload className="text-lg w-4 h-4 mr-2" />
                BOQ
              </button>
            </div>
            <div>
              <label className="text-xl ">3. รายละเอียดราคาย่อย</label>
              <div className="mt-2">
                <div className="ml-6">
                  <input
                    className="mr-2 h-4 w-4"
                    type="radio"
                    name="is-have"
                    id="is-have"
                    checked={Array.isArray(vendorNewBidding.subPrice)}
                    disabled
                  />
                  <label htmlFor="is-have" className=" text-xl">
                    มีราคาย่อย
                  </label>
                  <input
                    className="ml-9 mr-2 h-4 w-4"
                    type="radio"
                    name="is-have"
                    id="is-haven't"
                    checked={(Array.isArray(vendorNewBidding.subPrice) && vendorNewBidding.subPrice.length !== 0) ? false : true}
                    disabled
                  />
                  <label htmlFor="is-haven't" className=" text-xl">
                    ไม่มีราคาย่อย
                  </label>
                </div>

                {/* if is have sub price */}
                {Array.isArray(vendorNewBidding.subPrice) &&
                  vendorNewBidding.subPrice.length > 0 && (
                    <div id="sub-price-section">
                      <hr className="my-8"></hr>
                      <div className="bg-white rounded-lg border mb-3 mt-6">
                        <table className="w-full rounded-lg overflow-auto">
                          <thead className="text-white uppercase bg-[#2B2A2A] h-14">
                            <tr>
                              <th className="w-[250px] justify-self-center rounded-tl-lg text-xl">
                                ลำดับ
                              </th>
                              <th className="justify-self-center text-xl">
                                รายละเอียด
                              </th>
                              <th className="w-[400px] justify-self-center rounded-tr-lg text-xl">
                                ราคา {projectinfo?.project_unit_price}
                              </th>
                            </tr>
                          </thead>

                          <tbody className="bg-white border-b-lg rounded-xl h-14 ">
                            {Array.isArray(vendorNewBidding.subPrice) &&
                              vendorNewBidding.subPrice.length > 0 &&
                              vendorNewBidding.subPrice.map((item, index) => (
                                <tr
                                  key={index}
                                  className="confirm-input-price text-gray-700 text-lg text-center h-14 border-b-2 border-black-700"
                                >
                                  <td className="rounded-bl-lg">{index + 1}</td>
                                  <td className="text-left pl-4">{item.detail_price}</td>
                                  <td>
                                    <CurrencyInput
                                      className="border border-gray-400 rounded-md w-full py-2.5 px-3 my-2 text-gray-700 text-lg focus:shadow-outline text-center"
                                      placeholder="ราคา"
                                      value={
                                        vendorNewBidding.subPrice
                                          ? vendorNewBidding.subPrice[index]
                                              .price
                                          : "" || ""
                                      }
                                      onValueChange={(value, name) =>
                                        handleInputChange(value, index)
                                      }
                                      disabled={lockInput}
                                    />
                                  </td>
                                </tr>
                              ))}
                            <tr className=" bg-[#e6e6e6] text-xl h-14 border-b-2 ">
                              <th></th>
                              <th>รวมราคาสุทธิ</th>
                              <th>
                                {vendorNewBidding.subPrice
                                  .reduce(
                                    (prev, item) =>
                                      prev +
                                      parseFloat((item.price as string) || "0"),
                                    0
                                  )
                                  .toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                  })}
                                <span
                                  className={
                                    vendorNewBidding.subPrice.reduce(
                                      (prev, item) =>
                                        prev +
                                        parseFloat(
                                          (item.price as string) || "0"
                                        ),
                                      0
                                    ) == vendorNewBidding.price
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }
                                >
                                  {vendorNewBidding.subPrice.reduce(
                                    (prev, item) =>
                                      prev +
                                      parseFloat((item.price as string) || "0"),
                                    0
                                  ) == vendorNewBidding.price
                                    ? " (ราคาครบตามกำหนด)"
                                    : " (ราคายังไม่ครบตามกำหนด)"}
                                </span>
                              </th>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="flex flex-col gap-6 mx-16 my-12  ">
          <label className="text-[#2B3467] text-2xl font-bold basis-1/2">ตรวจสอบคุณสมบัติ</label>


            <div className="flex flex-col py-3">
            <label className="text-xl pb-3">
                หลักฐานการได้อ่านเอกสารชี้แจงรายละเอียดโครงการ (TOR)
              </label>
              <p className="text-red-600"></p>
              <input
                className="border border-gray-400 rounded w-[600px] py-2 px-3 mt-2 ml-8 text-lg focus:shadow-outline"
                type="file"
                id="Explain-project-details"
                onChange={handleFileChange}
                placeholder="หลักฐานการได้อ่านเอกสารชี้แจงรายละเอียดโครงการ"
                ref={Explaindetails}
                name="Explaindetails"
                accept="application/pdf"
                required
                disabled={lockInput}
                // style={{ display: 'block' }} // เพิ่ม style นี้
              />
            </div>
            <div className="flex flex-row gap-8 ml-8 items-center">
              <input
                id="tor-detail"
                type="checkbox"
                disabled={lockInput}
                className="h-7 w-7"
                checked={isChecked[0]}
                onChange={() => handleCheckboxChange(0)}
              />
              <label htmlFor="tor-detail" className=" text-lg w-[1180px]">
                ท่านได้เข้ารับฟังคำชี้แจงรายละเอียดโครงการจากเจ้าของงาน สอบถาม
                เข้าใจ รายละเอียดต่าง ๆ ถูกต้องครบถ้วน
              </label>
            </div>

            <div className="flex flex-row gap-8 ml-8 items-center">
              <input
                id="is-coop"
                type="checkbox"
                disabled={lockInput}
                className="h-7 w-7"
                checked={isChecked[1]}
                onChange={() => handleCheckboxChange(1)}
              />
              <label htmlFor="is-coop" className=" text-lg w-[1180px]">
                ไม่อยู่ระหว่างเลิกกิจการ
              </label>
            </div>

            <div className="flex flex-row gap-8 ml-8 items-center">
              <input
                id="forget-work"
                type="checkbox"
                disabled={lockInput}
                className="h-7 w-7"
                checked={isChecked[2]}
                onChange={() => handleCheckboxChange(2)}
              />
              <label htmlFor="forget-work" className="text-lg w-[1180px]">
                ไม่อยู่ในระหว่างการถูกระงับ ยื่นเสนอราคา จากบริษัทปูนซิเมนต์ไทย
                (ทุ่งสง)
              </label>
            </div>
            <div className="flex flex-row gap-8 ml-8 items-center">
              <input
                id="protection"
                type="checkbox"
                disabled={lockInput}
                className="h-7 w-7"
                checked={isChecked[3]}
                onChange={() => handleCheckboxChange(3)}
              />
              <label htmlFor="protection" className="text-lg w-[1180px]">
                เป็นนิติบุคคลที่มีอาชีพรับจ้างงานตามประเภทงานที่แจ้งประกวดราคา
              </label>
            </div>
            <div className="flex flex-row gap-8 ml-8 items-center">
              <input
                id="other-vendor"
                type="checkbox"
                disabled={lockInput}
                className="h-7 w-7"
                checked={isChecked[4]}
                onChange={() => handleCheckboxChange(4)}
              />
              <label htmlFor="other-vendor" className="text-lg w-[1180px]">
                ไม่เป็นผู้มีผลประโยชน์ร่วมกับผู้ยื่นเสนอราคารายอื่นที่เข้ายื่นเสนอราคาในครั้งนี้
              </label>
            </div>
            <div className="flex flex-row gap-8 ml-8 items-center">
              <input
                id="other-vendor-2"
                type="checkbox"
                disabled={lockInput}
                className="h-7 w-7"
                checked={isChecked[5]}
                onChange={() => handleCheckboxChange(5)}
              />
              <label htmlFor="other-vendor-2" className="text-lg w-[1180px]">
                ไม่เป็นผู้ได้รับเอกสิทธิ์หรือความคุ้มกัน
                ซึ่งอาจปฏิเสธไม่ยอมขึ้นศาลไทย
              </label>
            </div>

            <div className="flex flex-row gap-8 ml-8">
              <input
                id="accept1"
                type="checkbox"
                disabled={lockInput}
                className="h-7 w-7"
                checked={isChecked[6]}
                onChange={() => handleCheckboxChange(6)}
              />
              <label htmlFor="accept1" className="text-lg w-[1180px]">
                ข้าพเจ้า กรรมการผู้จัดการ/หุ้นส่วนผู้จัดการ/เจ้าของ
                หรือผู้แทนที่ได้รับมอบการเสนอราคา
                ยืนยันว่าข้อมูลข้างต้นทั้งหมดเป็นความจริง
              </label>
            </div>
            <div className="flex flex-row gap-8 ml-8">
              <input
                id="accept2"
                type="checkbox"
                disabled={lockInput}
                className="h-7 w-7"
                checked={isChecked[7]}
                onChange={() => handleCheckboxChange(7)}
              />
              <label htmlFor="accept2" className="text-lg w-[1180px]">
                ข้าพเจ้า กรรมการผู้จัดการ/หุ้นส่วนผู้จัดการ/เจ้าของ
                หรือผู้แทนที่ได้รับมอบการเสนอราคา ได้อ่านข้อมูล TOR
                รับทราบและตกลงจะปฏิบัติตามเงื่อนไขการประกวดราคานี้ทุกประการ
              </label>
            </div>
            <div className="flex flex-row gap-8 ml-8">
              <input
                id="accept3"
                type="checkbox"
                disabled={lockInput}
                className="h-7 w-7"
                checked={isChecked[8]}
                onChange={() => handleCheckboxChange(8)}
              />
              <label htmlFor="accept3" className="text-lg w-[1180px]">
              กรณีที่ข้าพเจ้าให้ข้อมูลเท็จ การตัดสินของบริษัทให้ถือเป็นข้อสิ้นสุด
              </label>
            </div>

            <p className="text-xl text-red-500 ml-[97px]">
              ระยะเวลาเปิดรับเอกสารประกวดราคา {formattedStartDate} -{" "}
              {formattedEndDate}
            </p>

            <div className="mt-10 grid grid-cols-5">
              {!lockInput && (
                <>
                  <button
                    className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
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
              )}
              {lockInput && (
                <>
                  <button
                    className="px-8 py-2.5 w-[180px] rounded-lg bg-[#D9C304] drop-shadow-lg text-white text-2xl col-start-1 text-center "
                    onClick={() => {
                      setLockInput(false);
                    }}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="px-8 py-2.5 w-[180px] rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl grid justify-self-center col-start-3 "
                    onClick={handleSubmit}
                  >
                    ยืนยัน
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
