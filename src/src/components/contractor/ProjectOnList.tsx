import React, { useState, useContext, useEffect } from "react";
import {
  deleteVendorProject,
  AllJobType,
  createVendorlistProject,
  getVendorByJobOrName,
  listVendorProject,
  listBlacklistVendorProject,
} from "../../services/VendorProjectService/ChooseVendorSevices";
import { listvenderinterface } from "../../models/VendorProject/Vendor";

import { ProjectContext } from "./ProjectContext";

import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";

export default function ProjectContractor() {
  const detailProject = useContext(ProjectContext);
  const [selectedJobType, setSelectedJobType] = useState<any>();
  const [blacklistnull, setBlacklistnull] = useState<any>();
  const [blacklistretreat, setBlacklistretreat] = useState<any>();
  const [selectedVendors, setSelectedVendors] = useState<listvenderinterface[]>(
    []
  );
  const [listVenderInList, setlistVenderInList] = useState<
    listvenderinterface[]
  >([]);
  const [lestselectedValue, setlestselectedValue] = useState<
    string | undefined
  >();
  const [prevSelectedValue, setPrevSelectedValue] = useState<
    string | undefined
  >();
  const [listVenderProject, setlistVenderProject] = useState<
    listvenderinterface[]
  >([]);

  const getlistVendorProject = async () => {
    const res = await listVendorProject(detailProject?.id, "list");
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setlistVenderProject(() => res.data);
    console.log(listVenderProject);
  };

  const getblacklistVendorProject = async () => {
    const res = await listBlacklistVendorProject();
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setBlacklistnull(() => res.data2);
    setBlacklistretreat(() => res.data1);
    console.log(res);
  };

  const allJobTypesOption = {
    label: "ทั้งหมด",
    value: [
      "ซ่อมกล",
      "ไฟฟ้า",
      "เหมือง",
      "คอนกรีต",
      "โครงสร้างเหล็ก",
      "สร้างถนน, สะพานฯ",
      "โยธาทั่วไป",
      "งานขนส่ง เครื่องจักรกลหนัก",
      "งานยกถุงปูน",
      "งานช่วยงานการผลิต",
      "งานแปรรูปวัสดุ งานกลึง",
      "รปภ.",
      "บริการเฉพาะด้านอื่นๆ",
      "งานทำสวน",
      "งานสำนักงาน ธุรการ",
      "ทำความสะอาดสำนักงาน",
      "งานรถบริการ",
    ],
  };

  const updatelistVendor = async (selectedValue: any) => {
    if (selectedValue) {
      const res = await getVendorByJobOrName(selectedValue, detailProject?.id);
      if (res.status !== 200) {
        setlistVenderInList([]);
        return;
      }

      setlistVenderInList(() => res.data);
      console.log(res.data);
      getlistVendorProject();
    } else {
      setlistVenderInList([]);
    }
  };

  const handleCreateVendor = async (project_id: any, vendor_id: any) => {
    const res = await createVendorlistProject(project_id, vendor_id);
    if (res.status !== 200) {
      alert("err");
    } else {
      // เพิ่มผู้รับเหมาที่เลือกไว้ใน state selectedVendors
      setSelectedVendors((prevSelectedVendors) => [
        ...prevSelectedVendors,
        res.data,
      ]);
      // อัปเดตลิสต์ของผู้รับเหมา
      updatelistVendor(lestselectedValue);
      getlistVendorProject();
      console.log("createVendorProject");
    }
  };

  const handleremoveVendor = async (vendor_project_id: any) => {
    const res = await deleteVendorProject(vendor_project_id);
    if (res.status !== 200) {
      alert("err");
    } else {
      // ลบผู้รับเหมาที่เลือกออกจาก state selectedVendors
      setSelectedVendors((prevSelectedVendors) =>
        prevSelectedVendors.filter(
          (vendor) => vendor.vendor_project_id !== vendor_project_id
        )
      );
      // อัปเดตลิสต์ของผู้รับเหมา
      updatelistVendor(lestselectedValue);
      getlistVendorProject();
      console.log("removeVendorProject");
    }
  };

  const loadJobTypes = async (inputValue: string) => {
    const res = await AllJobType();
    const jobTypes = res.data || [];

    const allJobTypesOption = {
      label: "ประเภทงานทั้งหมด",
      value: "",
    };
    return [
      allJobTypesOption,
      ...jobTypes
        .filter((jobType: any) =>
          jobType.job_type_name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((jobType: any) => ({
          label: jobType.gen_job_type,
          value: jobType.job_type_name,
        })),
    ];
  };

  const handleJobTypeChange = async (selectedOption: any) => {
    if (selectedOption && selectedOption.value === "") {
      // ถ้าผู้ใช้เลือกตัวเลือกทั้งหมด
      // ดำเนินการตามที่คุณต้องการทำ เช่น ล้างค่าหรือดึงข้อมูลทั้งหมด
      console.log("ประเภทงานทั้งหมด");
      const allJobsData = await Promise.all(
        allJobTypesOption.value.map(async (value: string) => {
          return await getVendorByJobOrName(value, detailProject?.id);
        })
      );

      // Combine the data for all selected job types
      const combinedData = allJobsData.reduce(
        (accumulator, currentData) => accumulator.concat(currentData.data),
        []
      );

      setPrevSelectedValue(""); // Reset the previous selected value
      setSelectedJobType(selectedOption);
      console.log(selectedOption);
      setlistVenderInList(() => combinedData);
      console.log(combinedData);
      setlestselectedValue(() => "");
      getlistVendorProject();
    } else {
      // ถ้าผู้ใช้เลือกตัวเลือกอื่น
      setSelectedJobType(selectedOption);
      const res = await getVendorByJobOrName(
        selectedOption?.value,
        detailProject?.id
      );
      setPrevSelectedValue(selectedOption?.value);
      console.log(selectedOption?.value);
      setlistVenderInList(() => res.data);
      console.log(res.data);
      setlestselectedValue(() => selectedOption?.value);
      console.log(selectedOption?.value);
    }
  };

  const handleOnSearch = async (e: any) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      const res = await getVendorByJobOrName(selectedValue, detailProject?.id);
      if (res.status !== 200) {
        setlistVenderInList([]);
        return;
      }

      setlistVenderInList(() => res.data);
      console.log(res.data);
      setlestselectedValue(() => selectedValue);
    } else {
      if (prevSelectedValue) {
        const res = await getVendorByJobOrName(
          prevSelectedValue,
          detailProject?.id
        );
        if (res.status !== 200) {
          setlistVenderInList([]);
          return;
        }

        setlistVenderInList(() => res.data);
        console.log(res.data);
        setlestselectedValue(() => prevSelectedValue);
      } else {
        setlistVenderInList([]);
      }
    }
  };

  const withManagerSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    vendor_id: number
  ) => {
    e.preventDefault();
    // when user is have a manager to manage a calculator

    console.log(blacklistnull);
    console.log(blacklistretreat);
    console.log(listVenderInList);
    const namecompany = listVenderInList.find((item) => item.id === vendor_id);
    console.log(namecompany?.company_name);
    Swal.fire({
      title: `ประวัติของ ${namecompany?.company_name}`,
      html: `
        <div style="margin-left: 10px; margin-right: 20px; padding: 10px; border: 1px solid #CFCFCF; box-shadow:0px 2px #888888; background-color: #EAE7E7; display: flex; flex-direction: column; font-size: medium;">
  
  <table >
    
    <tr >
        <td style="text-align: left;">&nbsp;&nbsp;&nbsp; จำนวนครั้งที่สละสิทธิ์ </td>
        <td style="text-align: left;"> : </td>
        <td style="text-align: left;">&nbsp;&nbsp; ${
          blacklistnull[vendor_id] ? blacklistnull[vendor_id] : "-"
        }</td>
        <td style="text-align: left;">ครั้ง</td>
    </tr>
    <tr>
        <td style="text-align: left;">&nbsp;&nbsp;&nbsp; จำนวนครั้งที่ไม่ดำเนินการใดๆ </td>
        <td style="text-align: left;"> : </td>
        <td style="text-align: left;">&nbsp;&nbsp; ${
          blacklistretreat[vendor_id] ? blacklistretreat[vendor_id] : "-"
        }</td>
        <td style="text-align: left;">ครั้ง</td>
    </tr>
</table>
</div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#559744",
      cancelButtonColor: "#979797",
      confirmButtonText: '<span style="font-size: 25px;">เลือก</span>',
      cancelButtonText: '<span style="font-size: 25px;">ปิด</span>',
    }).then((result) => {
      if (result.isConfirmed) {
        handleCreateVendor(detailProject?.id, vendor_id);
      }
    });
  };
  useEffect(() => {
    getlistVendorProject();
    getblacklistVendorProject();
  }, []);

  return (
    <div className="bg-[#F5F5F5]">
      <div className="px-[2rem] pt-6 pb-12 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className=" px-10 py-14 flex flex-col gap-4">
            <label className="text-2xl font-bold">
              1) โปรดเลือกประเภทงาน หรือ ค้นชื่อ หจก.
            </label>
            <div className="grid grid-cols-12 justify-center items-center">
              <p className="col-start-1 col-end-3 text-xl">ประเภทงาน</p>
              <AsyncSelect
                className="col-start-3 col-end-7 text-xl"
                cacheOptions
                defaultOptions
                loadOptions={loadJobTypes}
                onChange={handleJobTypeChange}
                value={selectedJobType}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                isClearable={true}
                placeholder="เลือกประเภทงาน"
              />

              <p className="col-start-7 col-end-10 text-xl text-end mr-7">
                หรือ ค้นชื่อ หจก.
              </p>
              <input
                className="col-start-10 col-end-13 border rounded-lg p-2.5 pl-6 text-xl"
                id="partnership"
                type="text"
                placeholder=""
                name="Text"
                onChange={handleOnSearch}
              />
            </div>
          </div>
        </div>

        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className=" px-10 py-14 flex flex-col gap-4">
            <label className="text-2xl font-extrabold">
              2) โปรดเลือกผู้รับเหมาที่ขึ้นทะเบียนแล้ว (ใน List)
            </label>

            <label className="text-xl mt-5">รายละเอียดผู้รับเหมาที่เลือก</label>
            <div className="scroll-x overflow-x-scroll rounded-lg ">
              <div className="w-[160vw] grid grid-cols-10 justify-items-center text-white text-xl bg-[#4B82A9] rounded-lg">
                <div className="py-3 pl-2 ">
                  <p></p>
                </div>
                <div className="w-[15rem] py-3 pl-2 ">
                  <p>ประเภท</p>
                </div>
                <div className="w-[25rem] py-3 pl-2 ">
                  <p>เลขสมาชิก</p>
                </div>
                <div className="w-[20rem] py-3 pl-2 ">
                  <p>ชื่อ หจก./บริษัท</p>
                </div>
                <div className="w-[9rem] py-3 pl-2">
                  <p>ชื่อผู้จัดการ</p>
                </div>
                <div className="w-[9rem] py-3 pl-2 ">
                  <p>ตำแหน่ง</p>
                </div>
                <div className="w-[9rem] py-3 pl-2 ">
                  <p>อีเมล</p>
                </div>

                <div className="w-[11rem] py-3 pl-2 ">
                  <p>เบอร์โทร</p>
                </div>
                <div className="w-[8rem] py-3 pl-2 ">
                  <p>ที่อยู่</p>
                </div>
                {/* <div className=" py-3 pl-2 ">
                  <p>หมายเหตุ</p>
                </div> */}
                <div className="w-[5rem] py-3 pl-2 ">
                  <p>เวลา</p>
                </div>
              </div>
              {Array.isArray(listVenderProject) &&
                listVenderProject.map((listVender) => (
                  <div className="w-[160vw] grid grid-cols-10 text-black text-md bg-gray-100 rounded-lg drop-shadow-sm justify-items-center items-center gap-y-2 mt-2 ">
                    {/* row1 */}
                    <div className=" w-[9rem] py-4 pl-2">
                      <button
                        className=" bg-[#bd3c3c] text-white py-2 px-5 rounded-xl"
                        onClick={() => {
                          handleremoveVendor(listVender.vendor_project_id);
                        }}
                      >
                        ลบ
                      </button>
                    </div>
                    <div className="w-[18rem] py-4 pl-2 text-[#0083FF]">
                      <p>ใน List ทะเบียน</p>
                    </div>
                    <div className="w-[23rem] py-4 pl-2 ">
                      <p>{listVender.vendor_key}</p>
                    </div>
                    <div className="w-[35rem] py-4 pl-2">
                      <p>{listVender.company_name}</p>
                    </div>
                    <div className="w-[15rem] py-4 pl-2 ">
                      <p>{listVender.manager_name}</p>
                    </div>
                    <div className="w-[8rem] py-4 pl-2 ">
                      <p>{listVender.manager_role}</p>
                    </div>
                    <div className="w-[18rem] py-4 pl-2 ">
                      <p>{listVender.email}</p>
                    </div>
                    <div className="w-[12rem] py-4 pl-2 ">
                      <p>{listVender.phone_number}</p>
                    </div>
                    <div className="w-[20rem] py-4 pl-2 ">
                    <p
                            className="inline"
                            title={
                                `${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}`.length > 30 ? 
                                `${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}` : undefined
                            }
                        >
                            {`${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}`.length> 30
                                ?`${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}`.slice(0, 30) + "..."
                                : `${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}`}
                        </p>
                    </div>
                    {/* <div className="  py-4 pl-2 ">
                      <p> - </p>
                    </div> */}
                    <div className="w-[10rem] py-4 pl-2 ">
                    <p>
                      {" "}
                      {new Date(listVender.add_datetime).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: false,
                        }
                      )} น. {" "}
                    </p>
                    </div>
                    
                  </div>
                ))}
            </div>

            <label className="mt-5 text-2xl">
              รายละเอียดผู้รับเหมาที่รอเลือก
            </label>
            <div className="scroll-x overflow-x-scroll rounded-lg">
              <div className="w-[180vw] grid grid-cols-11 justify-items-center text-white text-xl bg-[#2B2A2A] rounded-lg">
                <div className="w-[1rem] mt-3 ">
                  <p></p>
                </div>
                <div className=" w-[15rem] mt-3 ">
                  <p>ประวัติ</p>
                </div>
                <div className="w-[20rem] mt-3">
                  <p>ประเภท</p>
                </div>
                <div className="w-[25rem] mt-3">
                  <p>เลขสมาชิก</p>
                </div>
                <div className="w-[20rem]  py-3 pl-2 ">
                  <p>ชื่อ หจก./บริษัท</p>
                </div>
                <div className="  py-3 pl-2 ">
                  <p>ชื่อผู้จัดการ</p>
                </div>
                <div className="  py-3 pl-2 ">
                  <p>ตำแหน่งผู้จัดการ</p>
                </div>
                <div className="   py-3 pl-2 ">
                  <p>อีเมล์</p>
                </div>

                <div className="   py-3 pl-2 ">
                  <p>เบอร์โทร</p>
                </div>
                <div className="w-[10rem] py-3 pl-2 ">
                  <p>ที่อยู่</p>
                </div>
                {/* <div className=" py-3 pl-2 ">
                  <p>หมายเหตุ</p>
                </div> */}
                <div className=" py-3 pl-2 ">
                  <p>เวลา</p>
                </div>
              </div>
              {Array.isArray(listVenderInList) &&
                listVenderInList.map((listVender) => (
                  <div className="w-[180vw] grid grid-cols-11 text-black text-lg bg-gray-100 rounded-lg drop-shadow-sm justify-items-center items-center gap-y-2 mt-2 ">
                    {/* row1 */}
                    <div className=" -ml-10">
                      <button
                        className=" bg-[#559744] text-white py-2 px-5 rounded-xl"
                        onClick={() => {
                          handleCreateVendor(detailProject?.id, listVender.id);
                        }}
                      >
                        เลือก
                      </button>
                    </div>
                    <div className="w-[15rem] -ml-10">
                      {/* <p>{blacklistnull[listVender.id]}</p> */}
                      <button
                        className=" bg-[#9a999e] text-white py-2 px-4 border-spacing-2 rounded-3xl shadow-md shadow-slate-500"
                        onClick={(e) => {
                          withManagerSubmit(e, listVender.id);
                        }}
                      >
                        ดูประวัติ
                      </button>
                    </div>
                    <div className="  w-[20rem] mt-1 -ml-10 text-[#0083FF]">
                      <p>ใน List ทะเบียน</p>
                    </div>
                    <div className="w-[25rem] mt-1 ">
                      <p>{listVender.vendor_key}</p>
                    </div>
                    <div className=" w-[35rem] mt-1 ">
                      <p>{listVender.company_name}</p>
                    </div>
                    <div className="w-[12rem]  mt-1 py-4 pl-2 ">
                      <p>{listVender.manager_name}</p>
                    </div>
                    <div className="  py-4 pl-2 ">
                      <p>{listVender.manager_role}</p>
                    </div>
                    <div className="w-[15rem] py-4 pl-2 ">
                      <p>{listVender.email}</p>
                    </div>
                    <div className="  py-4 pl-2 ">
                      <p>{listVender.phone_number}</p>
                    </div>
                    <div className="w-[15rem] mt-1 py-4 pl-2 ">
                    <p
                            className="inline"
                            title={
                                `${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}`.length > 30 ? 
                                `${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}` : undefined
                            }
                        >
                            {`${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}`.length> 30
                                ?`${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}`.slice(0, 30) + "..."
                                : `${listVender.location_detail} ${listVender.tambons_name_th} ${listVender.amphures_name_th} ${listVender.provinces_name_th} ${listVender.zip_code}`}
                        </p>
                    </div>
                    {/* <div className="  py-4 pl-2 ">
                      <p> - </p>
                    </div> */}
                    <div className="  py-4 pl-2 ">
                      <p>
                        {" "}
                        {new Date(listVender.add_datetime).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false,
                          }
                        )} น. {" "}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
