import React, { useContext, useEffect, useState } from "react";
import {
  AllJobType,
  listVendorProjectAll,
} from "../../services/VendorProjectService/ChooseVendorSevices";
import { ProjectContext } from "./ProjectContext";
import {
  jobtypeinterface,
  listvenderinterface,
} from "../../models/VendorProject/Vendor";
import { lengthlistVendorContext } from "./listVendorContext";
import { uselengthlistContext } from "../../pages/contractor/AllProjectParticipants";
import { UpdateVendorEmailById } from "../../services/ContractorService/ProjectSettingService";

import { FaEdit } from "react-icons/fa";
import { MdCheckBox, MdCancelPresentation } from "react-icons/md";

export default function AllProject() {
  const detailProject = useContext(ProjectContext);
  const { lengthVendor, setlengthVendor } = uselengthlistContext();
  const { job_type, setjob_type } = uselengthlistContext();
  const [listVenderProjectAll, setlistVenderProject] = useState<
    listvenderinterface[]
  >([]);
  const [lengthVenderProjectAll, setCountVenderProjectAll] = useState(0);
  const [jobtype, setjobtype] = useState<jobtypeinterface[]>([]);
  const [editModes, setEditModes] = useState(
    Array(listVenderProjectAll.length).fill(false)
  );

  const handleEmailChange = (index: number, newEmail: string) => {
    const updatedList = [...listVenderProjectAll];
    updatedList[index] = { ...updatedList[index], email: newEmail };
    setlistVenderProject(updatedList);
    
  };

  const handleToggleEdit = (index: number) => {
    const updatedEditModes = [...editModes];
    console.log(updatedEditModes)
    updatedEditModes[index] = !updatedEditModes[index];
    setEditModes(updatedEditModes);
  };

  const handleSaveEmailChange = async (index: number) => {
    if (listVenderProjectAll[index].id === undefined) {
      console.error("ID is undefined for the vendor at index", index);
      return;
    }
    const res = await UpdateVendorEmailById(
      String(listVenderProjectAll[index].id),
      listVenderProjectAll[index].email
    );
    if (res.status !== 200) {
      const updatedEditModes = [...editModes];
      updatedEditModes[index] = false;
      setEditModes(updatedEditModes);
      return;
    }
    const updatedEditModes = [...editModes];
    updatedEditModes[index] = false;
    setEditModes(updatedEditModes);
  };

  const getlistVendorProjectAll = async () => {
    let res = await listVendorProjectAll(detailProject?.id);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setlistVenderProject(() => res.data);
    console.log(res.data)
    setlengthVendor(() => res.data.length);
  };

  const updatelistVendorProjectAll = async () => {
    getlistVendorProjectAll;
  };

  const getJobType = async () => {
    let res = await AllJobType();
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setjobtype(() => res.data);
  };

  const Topic = [];

  useEffect(() => {
    getlistVendorProjectAll();
    getJobType();
    updatelistVendorProjectAll();
    // getDetailProject(key || "");
  }, [detailProject]);

  return (
    <div>
      <div className="px-[2rem] pb-12 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className=" px-10 py-14 flex flex-col gap-4">
            <label className="text-2xl font-bold">ประเภทงาน</label>
            <div className="grid grid-cols-12 justify-center items-center">
              <input
                className="col-start-1 col-end-5 border border-[#CCCCCC] rounded-lg p-2.5 pl-6  mr-7 text-xl"
                id="Type-work"
                type="text"
                placeholder="เลือกประเภทงาน"
                name="Text"
                list="job-type"
                defaultValue={detailProject?.job_type_name}
                disabled
                // onChange={handleOnChange}
              />
              <datalist id="job-type">
                {Array.isArray(jobtype) &&
                  jobtype?.map((op) => (
                    <option key={op?.id} value={op?.job_type_name}>
                      {op?.gen_job_type}
                    </option>
                  ))}
              </datalist>
            </div>
          </div>
        </div>

        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className=" px-10 py-14 flex flex-col gap-4">
            <label className="text-2xl font-bold">
              Vendor ที่จะเชิญประกวดราคา
            </label>
            <div className="scroll-x overflow-x-scroll rounded-lg ">
              <div className="w-[155vw] grid grid-cols-12 justify-items-center text-white text-xl bg-[#2B2A2A] rounded-lg">
                <div className="py-3 pl-2 w-[10rem]">
                  <p>ลำดับ</p>
                </div>
                <div className="py-3 pl-2 w-[19rem]">
                  <p>ประเภท</p>
                </div>
                <div className="py-3 pl-2 w-[27rem]">
                  <p>เลขสมาชิก</p>
                </div>
                <div className="py-3 pl-2 w-[20rem]">
                  <p>ชื่อ หจก./บริษัท</p>
                </div>
                <div className="py-3 pl-16">
                  <p>ชื่อผู้จัดการ</p>
                </div>
                <div className="py-3 pl-32 w-[20rem]">
                  <p>ตำแหน่งผู้จัดการ</p>
                </div>
                <div className="py-3 pl-48 w-[18rem]">
                  <p>อีเมล</p>
                </div>
                <div className="py-3 pl-2 ">
                  <p></p>
                </div>
                <div className="py-3 pl-2  ">
                  <p>เบอร์โทร</p>
                </div>
                <div className="py-3 pl-2  ">
                  <p>ที่อยู่</p>
                </div>
                <div className="py-3 pl-2 ">
                  <p>หมายเหตุ</p>
                </div>
                <div className="py-3 pl-2 ">
                  <p>เวลา</p>
                </div>
              </div>
              {Array.isArray(listVenderProjectAll) &&
                listVenderProjectAll.map((listVender, index) => (
                  <div
                    key={index}
                    className="w-[155vw] grid grid-cols-12 text-black text-lg bg-gray-100 rounded-lg drop-shadow-sm justify-items-center items-center gap-y-2 mt-2 "
                    
                  >
                    {/* row1 */}
                    <div className="py-4 pl-2 w-[7rem] ">
                      <p>{index + 1}</p>
                    </div>
                    <div className="py-4 pl-2 text-[#0083FF] w-[22rem]" style={{ verticalAlign: "top" }}>
                      <p>
                        {listVender.vendor_type === "list" ? (
                          <p style={{ color: "blue" }}>ใน List ทะเบียน</p>
                        ) : (
                          <p style={{ color: "red" }}>นอก List ทะเบียน</p>
                        )}
                      </p>
                    </div>
                    <div className="py-4 pl-2 w-[25rem]">
                      <p>{listVender.vendor_key}</p>
                    </div>
                    <div className="py-4 pl-2 w-[35rem]">
                      <p>{listVender.company_name}</p>
                    </div>
                    <div className="py-4 pl-28 w-[25rem]">
                      <p>{listVender.manager_name}</p>
                    </div>
                    <div className="py-4 pl-20 ">
                      <p>{listVender.manager_role}</p>
                    </div>
                    <div className="py-4 pl-7 w-[10rem]">
                      {editModes[index] ? (
                        <input
                          type="text"
                          defaultValue={listVender.email}
                          onChange={(e) =>
                            handleEmailChange(index, e.target.value)
                          }
                          className="border"
                        />
                      ) : (
                        <p>{listVender.email}</p>
                      )}
                    </div>
                    <div className="py-4 pl-32 w-[10rem]">
                      {editModes[index] ? (
                        <div>
                          <button
                            className="text-2xl"
                            onClick={(e) => handleSaveEmailChange(index)}
                          >
                            <MdCheckBox />
                          </button>
                          <button
                            className="text-2xl"
                            onClick={() => handleToggleEdit(index)}
                          >
                            <MdCancelPresentation />
                          </button>
                        </div>
                      ) : (
                        <div className="w-[10rem]">
                          <button onClick={() => handleToggleEdit(index)}>
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="py-4 pl-2 w-[10rem] ">
                      <p>{listVender.phone_number}</p>
                    </div>
                    <div className="py-4 pl-20 text-left w-[20rem]">
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
                    <div className="py-4 pl-2 ">
                      <p> - </p>
                    </div>
                    <div className="py-4 pl-2 ">
                      <p>
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
                        )} น.
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
