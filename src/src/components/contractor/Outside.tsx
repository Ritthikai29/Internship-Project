import React, { useEffect, useRef, useState } from "react";
import {
  CreateVendorOutsideUnList,
  VendorOutsideUnList,
} from "../../models/Contractor/IOutside";
import { SingleValue } from "react-select";
import { RiDeleteBin6Fill } from "react-icons/ri";

import { type DropdownIndicatorProps, components } from "react-select";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import {
  CreateVendorUnList,
  GetProjectContractorByKey,
  ListLocationVendor,
  ListVendorSearching,
  GetRejectProjectByKey
} from "../../services/ContractorService/OutsideService";
import OutsideManager from "./OutsideManager";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

import { createContext, useContext } from "react";
import { ProjectInterface } from "../../models/Project/IProject";
import Select, { OptionsOrGroups } from "react-select";
import { getAffiliation, UnlistWaitInfo } from "../../services/ProjectServices";
import { LuFileEdit } from "react-icons/lu";

//import FormValidation from "reactjs-forms";

let affiliationoption: OptionsOrGroups<any, any> | undefined = [];
interface ProjectContextInterface {
  project: Partial<ProjectInterface>;
  setProject: React.Dispatch<React.SetStateAction<Partial<ProjectInterface>>>;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  deciPrice: number;
  setDeciPrice: React.Dispatch<React.SetStateAction<number>>;
}
const ProjectContext = createContext<ProjectContextInterface>({
  project: {},
  setProject: () => {},
  totalPrice: 0,
  setTotalPrice: () => {},
  deciPrice: 0,
  setDeciPrice: () => {},
});
interface AffitiationInterface {
  SECTION: string;
  SUBSECTION: string;
  department_name: string;
  division_name: string;
}

export function UseProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("UseProjectContext error");
  }
  return context;
}

export default function Outside() {
  const { key } = useParams();

  type OptionType = {
    label: string;
    value: string;
  };

  const [locations, setLocations] = useState<OptionType[]>([]);
  const [affiliated, setAffiliated] = useState<OptionType[]>([]);
  const [contractors, setContractors] = useState<
    Partial<CreateVendorOutsideUnList>
  >({});

  const [isVerify, setIsVerify] = useState<boolean>(false);
  const navigate = useNavigate();

  // useRef for validate the value
  const itemRef = useRef<HTMLInputElement[] | null>(null);

  interface Reject {
    title: string;
    detail: DetailReject;
  }
  
  interface DetailReject {
    reject_topic: string;
    reject_detail: string;
  }
  
  const [reject, setReject] = useState<Reject>();  
  const [isLocationDetailValid, setIsLocationDetailValid] = useState(true);
  const [isManagerNameValid, setIsManagerNameValid] = useState(true);
  const [isManagerRoleValid, setIsManagerRoleValid] = useState(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isAffiliatedValid, setIsAffiliatedValid] = useState(true);
  const [isHadReject, setIsHadReject] = useState(false);

  interface VendorOptionInterface {
    label: string;
    value: string;
    data: VendorOutsideUnList;
  }

  interface Cc {
    id: string;
    approve_vendor_project_id: string;
    cc_id: string
  }

  const handleOnLoadPrevInfo = async (key: string) => {
    const res = await UnlistWaitInfo(key);
    if (res.status !== 200) {
        alert("err");
        return;
    }
    const res2 = await GetProjectContractorByKey(key);
    if (res.va_data.length === 0 && res.un_data.length === 0) {
        return null;
    }

    setIsVerify(true);

    // Add array reason in object 
    handleContractorInput({
        target: { name: "reason", value: res.va_data.reason_to_approve },
    } as React.ChangeEvent<HTMLTextAreaElement>);

    // Initialize an array to store selected options
    const selectedOptions: VendorOutsideUnList[] = [];

    res.un_data.forEach((data: any) => {

        // Push the data into the array
        selectedOptions.push(data as VendorOutsideUnList);
    });

    // Initialize an array to store selected options
    const ccOptions: Cc[] = [];

    res.va_data.cc.forEach((data: any) => {
      ccOptions.push(data as Cc);
    });

    // Set the selected options in the state
    setContractors((prevContractors) => ({
        ...prevContractors,
        unlistVendor: selectedOptions,
        project_id: res2.data.id,
        verifier_id: res.va_data.approver1_id,
        approver_id: res.va_data.approver2_id,
        cc_send_id: ccOptions.map((cc) => cc.cc_id),
    }));

    console.log('Final state of contractors:', contractors);
};  

  const handleContractorInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.name as keyof typeof contractors;
    setContractors({
      ...contractors,
      [name]: e.target.value,
    });
  };

  const handleChangeVendorUnlist = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (contractors.unlistVendor === undefined) {
      return;
    }
    const name = event.target.name as string;
    const value = event.target.value;

    const start = contractors.unlistVendor.slice(0, index);
    const end = contractors.unlistVendor.slice(index + 1);
    const prevUnListVendor = contractors.unlistVendor[index];

    setContractors({
      ...contractors,
      unlistVendor: [
        ...(start as any),
        {
          ...prevUnListVendor,
          [name]: value,
        },
        ...(end as any),
      ],
    });

    switch (name) {
      case "location_detail":
        setIsLocationDetailValid(!!value);
        break;
      case "manager_name":
        setIsManagerNameValid(!!value);
        break;
      case "manager_role":
        setIsManagerRoleValid(!!value);
        break;
      case "phone_number":
        setIsPhoneNumberValid(!!value);
        break;
      case "email":
        setIsEmailValid(!!value);
        break;
      case "affiliated":
        setIsAffiliatedValid(!!value);
        break;
      default:
        break;
    }
  };

  const listLocationVendor = async () => {
    const res = await ListLocationVendor();
    const locationMapping = res.data.map((detail: any) => ({
      value: detail.id,
      label:
        detail.tambons_name_th + " " + detail.amphures_name_th + " " + detail.provinces_name_th + " " + detail.zip_code,
    }));
    // console.log(locationMapping)
    setLocations(locationMapping);
  };

  const loadProject = async () => {
    let res = await GetProjectContractorByKey(key || "");
    setContractors({
      ...contractors,
      project_id: res.data.id,
    });
  };

  const handleOnClick = () => {
    if (contractors?.unlistVendor === undefined) {
      if (!contractors?.reason && !isVerify) {
        // แสดงเตือนให้ผู้ใช้กรอกเหตุผลก่อน
        alert("กรุณากรอกเหตุผลก่อนที่จะเพิ่มข้อมูลรายใหม่");
        return;
      }
      setContractors({
        ...contractors,
        unlistVendor: [{} as VendorOutsideUnList],
      });
      console.log(contractors)
      return;
    //   setContractors((prevContractor) => ({
    //     ...prevContractor,
    //     unlistVendor: [
    //       ...(prevContractor.unlistVendor as VendorOutsideUnList[]),
    //       {} as VendorOutsideUnList,
    //     ],
    //   }));
    }

    setContractors((prevContractor) => ({
      ...prevContractor,
      unlistVendor: [
        ...(prevContractor.unlistVendor as VendorOutsideUnList[]),
        {} as VendorOutsideUnList,
      ],
    }));
  };
  const handleOnChangeLocation = (
    option: SingleValue<OptionType>,
    index: number
  ) => {
    if (contractors.unlistVendor === undefined) {
      return;
    }
    const start = contractors.unlistVendor.slice(0, index);
    const end = contractors.unlistVendor.slice(index + 1);
    const prevUnListVendor = contractors.unlistVendor[index];
    setContractors({
      ...contractors,
      unlistVendor: [
        ...(start as any),
        {
          ...prevUnListVendor,
          location_main_id: parseInt(option?.value || "", 10),
        },
        ...(end as any),
      ],
    });
  };

  const filterOption = (inputFilter: string) => {
    let ins = 0;
    return locations.filter((i) => {
      if (inputFilter === "") {
        return false;
      }
      if (ins > 300) {
        return false;
      }
      let check = i.label.toLowerCase().includes(inputFilter.toLowerCase());
      if (check === true) {
        ins = ins + 1;
      }
      return check;
    });
  };

  const loadOption = (
    input: string,
    callback: (options: OptionType[]) => void
  ) => {
    console.log("start");
    callback(filterOption(input));
  };

  const handleConsoleLog = () => {
    console.log(contractors);
  };

  const filterVendorOption = (vendorList: VendorOutsideUnList[]) => {
    let mapping: VendorOptionInterface[] = vendorList.map((i) => {
      return {
        label: i.company_name + " " + i.vendor_key,
        value: i.vendor_key as string,
        data: i,
      };
    });
    return mapping;
  };

  const loadVendorOption = (input: string) => {
    return new Promise<VendorOptionInterface[]>((resolve) => {
      ListVendorSearching(input).then((res) => {
        if (res.status === 200) resolve(filterVendorOption(res.data));
      });
    });
  };

  const handleSelectVendor = (
    option: SingleValue<VendorOptionInterface>,
    index: number
  ) => {
    if (contractors.unlistVendor === undefined) {
      return;
    }
    console.log(option?.data)
    const start = contractors.unlistVendor.slice(0, index);
    const end = contractors.unlistVendor.slice(index + 1);
    setContractors({
      ...contractors,
      unlistVendor: [...start, option?.data as VendorOutsideUnList, ...end],
    });
    console.log(contractors)
  };

  const handleCreateNewUnListVendor = (inputValue: string, index: number) => {
    if (contractors.unlistVendor === undefined) {
      return;
    }
    const start = contractors.unlistVendor.slice(0, index);
    const end = contractors.unlistVendor.slice(index + 1);
    const prevUnListVendor = contractors.unlistVendor[index];
    console.log(index);
    setContractors({
      ...contractors,
      unlistVendor: [
        ...(start as any),
        {
          ...prevUnListVendor,
          company_name: inputValue,
          vendor_key: "",
        },
        ...(end as any),
      ],
    });
  };

  const handleDeleteVendorUnList = (index: number) => {
    if (!contractors.unlistVendor) {
      return;
    }
    console.log(contractors);
    let start = contractors.unlistVendor.slice(0, index);
    if (index === 0) {
      start = [];
    }
    const end = contractors.unlistVendor.slice(index + 1);
    setContractors({
      ...contractors,
      unlistVendor: [...start, ...end],
    });
  };

  const handleClickVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(contractors)
    e.preventDefault();
    contractors.unlistVendor?.forEach((item) => {
      console.log(item);
    });

    setIsVerify(true);
  };

  const handleClickUnVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsVerify(false);
  };

  const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const mySwal = withReactContent(Swal);
    mySwal
      .fire({
        title: <span className="">ยืนยันการส่งข้อมูลใช่หรือไม่</span>,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>,
        confirmButtonText: (
          <p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>
        ),
        confirmButtonColor: "#EB455F",
        html: (
          <div>
            <p className="text-red-500 text-mediam">
              หากท่านส่งข้อมูลแล้ว <br />
              จะไม่สามารถแก้ไขได้จนกว่าจะมีการอนุมัติ
              <br />
              จากผู้อนุมัติและผู้ตรวจสอบ
            </p>
          </div>
        ),
        preConfirm: async () => {
          let res = await CreateVendorUnList(
            contractors as CreateVendorOutsideUnList
          );
          if (res.status !== 200) {
            mySwal.showValidationMessage(res.err);
          }
          console.log(res);
          return res.data;
        },
      })
      .then((response) => {
        if (response.isConfirmed) {
          mySwal
            .fire({
              title: (
                <h1 className="text-4xl text-[#4BAE4F]">ดำเนินการสำเร็จ!</h1>
              ),
              icon: "success",
              confirmButtonText: (
                <p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>
              ),
              confirmButtonColor: "#2B3467",
            })
            .then(() => {
              navigate("/project/waitingtomanaged");
            });
        }
      });
  };
  const handleTest = () => {
    console.log(itemRef);
  };

  const { project, setProject } = UseProjectContext(); // ใช้ UseProjectContext hook

  const handleChangeOptionAffitiation = (
    option: SingleValue<OptionType>,
    index: number
  ) => {
    if (contractors.unlistVendor === undefined) {
      return;
    }
    const start = contractors.unlistVendor.slice(0, index);
    const end = contractors.unlistVendor.slice(index + 1);
    const prevUnListVendor = contractors.unlistVendor[index];
    setContractors({
      ...contractors,
      unlistVendor: [
        ...(start as any),
        {
          ...prevUnListVendor,
          affiliated: parseInt(option?.value || "", 10),
        },
        ...(end as any),
      ],
    });
  };

  const listAffiliationVendor = async () => {
    const res = await getAffiliation();
    const affiliationMapping = res.data.map((item: AffitiationInterface , index: number) => ({
      value: String(index + 1),
      label: `${item.SECTION} / ${item.department_name} / ${item.SUBSECTION} / ${item.division_name}`,
    }));
    setAffiliated(affiliationMapping);
  };

  const loadAffiliationOption = (
    input: string,
    callback: (options: OptionType[]) => void
  ) => {
    console.log("start");
    callback(filterAffiliationOption(input));
  };

  const filterAffiliationOption = (inputFilter: string) => {
    let ins = 0;
    return affiliated.filter((i) => {
      if (inputFilter === "") {
        return false;
      }
      if (ins > 300) {
        return false;
      }
      const check = i.label.toLowerCase().includes(inputFilter.toLowerCase());
      if (check === true) {
        ins = ins + 1;
      }
      return check;
    });
  };

  const GetRejectUnlistProject = async () => {
    if (key !== undefined) {
      const res = await GetRejectProjectByKey(key);
      if (res.status === 200) {
        setIsHadReject(true);
        setReject(res.data);
      } else if (res.status === 400) {
        setReject(res.err);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadProject();
        listAffiliationVendor();
        listLocationVendor();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (key !== undefined) {
          await handleOnLoadPrevInfo(key);
          GetRejectUnlistProject();
        }
      }
    };
    fetchData();
  }, [key]);
  
  

  return (
    <div>
      {isHadReject && (
        
        
        <div className="px-[2rem] pt-6 pb-6 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full mx-auto my-5 ">
        <div className='py-2 pl-2 bg-[#EB455F] rounded-t-2xl mx-4 mt-4 flex items-center'>
              <LuFileEdit className="text-5xl m-4 text-white" />
              <p className='font-black text-3xl m-4 text-white'> การขออนุมัติผู้เข้าร่วมโครงการนอก List ทะเบียนได้รับการปฏิเสธ จาก {reject?.title} โปรดแก้ไขการทำรายการ</p>
            </div>
            <div className='border rounded-2xl m-4 px-2 md:px-1 lg:px-28 my-4 bg-white'>
              <ul className='flex flex-col gap-4 justify-center items-center mx-auto my-auto'>
              <li className='flex flex-col text-lg md:text-2xl  ml-4 font-bold w-full pl-2'>
                <span className="mb-4 mt-4">เหตุผลการปฏิเสธ</span>
                <span className='text-xl my-0.5 py-2 w-full  p-4 mx-auto rounded-md border-2 border-solid border-gray-300 pb-10 font-normal'>
                {reject?.detail.reject_topic}</span>
            </li>
            <li className='flex flex-col text-lg md:text-2xl mb-4 ml-4 font-bold w-full pl-2'>
                <span className="mb-4 mt-4"> ความคิดเห็นเพิ่มเติม</span>
                <span className='text-xl my-0.5 py-2 w-full  p-4 mx-auto rounded-md border-2 border-solid border-gray-300 pb-10 font-normal'>
                {reject?.detail.reject_detail}</span>
                {/* <span className="text-red-500 md:text-xl  font-bold w-full pl-2 mb-4 mt-4"> *โปรดแก้ไขข้อมูลจากเหตุผลการปฏิเสธข้างต้น เมื่อท่านดำเนินการแก้ไขเสร็จแล้ว สามารถกด "บันทึก" ระบบจะส่งข้อมูลไปยังหน่วยงานจ้างเหมาต่อไป</span> */}
            </li>

              </ul>
            </div>
        </div>
        </div>
        
      )}
      <div className="px-[2rem] pt-6 pb-12 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className=" px-32 py-14 flex flex-col gap-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-2xl font-bold mb-3">
              1) โปรดเหตุผลในการขออนุมัติผู้เข้าร่วมโครงการนอก List ทะเบียน
            </h3>
            
          </div>
            <div className="ml-6">
              <textarea
                className={
                  isVerify
                    ? "input-disable rounded w-full py-2.5 px-3 text-xl focus:shadow-outline mt-2"
                    : "border rounded w-full py-2.5 px-3 text-xl focus:shadow-outline mt-2"
                }
                value={contractors.reason || ""}
                name="reason"
                onChange={handleContractorInput}
                disabled={isVerify}
              />
            </div>
            {!contractors.reason && !isVerify && (
              <div className="border border-red-500 rounded p-2 my-2 bg-red-100">
                <p className="text-red-500">
                  กรุณากรอกเหตุผลก่อนที่จะเพิ่มข้อมูลผู้เข้าร่วมโครงการนอก List
                  ทะเบียนรายใหม่
                </p>
              </div>
            )}
          </div>
        </div>

        {/* second section */}
        <div className="my-7 px-28 py-10 bg-white border drop-shadow-lg rounded-lg ">
          <div className="flex flex-col gap-5">
            <h3 className="text-2xl font-bold">
              2) โปรดกรอกข้อมูลผู้เข้าร่วมโครงการนอก List ทะเบียน
            </h3>

            {contractors.unlistVendor?.map((contractorUnList, index) => (
              <div
                className="flex flex-col gap-y-6"
                key={`${index + 1}-contractor`}
              >
                <hr />
                <div className="flex justify-between">
                  <p className="ml-4 py-2 text-2xl font-bold underline">
                    รายที่ {index + 1}
                  </p>
                  <button
                    onClick={() => {
                      handleDeleteVendorUnList(index);
                    }}
                    className="text-red-500"
                    hidden={isVerify}
                  >
                    <RiDeleteBin6Fill className="text-2xl" />
                  </button>
                </div>
                <div className="flex flex-row w-full">
                  <div className="ml-4 flex flex-col w-1/2">
                    <label className="font-bold text-xl">
                      ชื่อ หจก/บริษัทฯ :
                    </label>
                    <AsyncCreatableSelect
                      styles={{
                        control: (baseStyle, state) => ({
                          ...baseStyle,
                          backgroundColor: state.isDisabled ? "#D4D4D4" : "",
                          color: "#000",
                          border: state.isDisabled ? "1px solid #A6A6A6" : "",
                        }),
                        input: (baseStyle, state) => ({
                          ...baseStyle,
                          color: "#000",
                        }),
                      }}
                      className={`border-black ${
                        isVerify ? "disabled-class" : ""
                      }`}
                      classNames={{
                        control: (state: any) =>
                          "border rounded py-1 px-1 text-red-900 text-xl border-black",
                      }}
                      components={{
                        DropdownIndicator: (props) => {
                          return (
                            <components.DropdownIndicator {...props}>
                              <svg
                                width={20}
                                height={20}
                                className="hover:text-gray-700"
                              >
                                <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                              </svg>
                            </components.DropdownIndicator>
                          );
                        },
                      }}
                      onChange={(option) => {
                        handleSelectVendor(option, index);
                      }}
                      onCreateOption={(input: string) => {
                        handleCreateNewUnListVendor(input, index);
                      }}
                      createOptionPosition="first"
                      value={
                        contractorUnList.company_name !== undefined
                          ? [
                              {
                                label: contractorUnList.company_name,
                                value: contractorUnList.vendor_key,
                                data: contractorUnList,
                              } as VendorOptionInterface,
                            ]
                          : undefined
                      }
                      loadOptions={loadVendorOption}
                      placeholder="ชื่อ หจก/บริษัทฯ :"
                      isDisabled={isVerify}
                    />
                  </div>
                  {contractorUnList.vendor_key && (
                    <div className="ml-4 flex flex-col w-1/2">
                      <label className="font-bold text-xl">
                        ไอดีผู้จ้างเหมา :
                      </label>
                      <input
                        type="text"
                        className="border border-[#CCCCCC] rounded py-2.5 px-2  text-xl focus:shadow-outline"
                        value={contractorUnList.vendor_key}
                        disabled
                      />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex flex-row gap-4">
                  <div className="flex flex-col w-1/2">
                    <label className="font-bold text-xl">
                      ที่อยู่ (เลขที่ หมู่ ถนน)
                    </label>
                    <input
                      ref={(el) =>
                        itemRef.current
                          ? (itemRef.current[index] = el as HTMLInputElement)
                          : null
                      }
                      className={
                        isVerify
                          ? "input-disable rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : isLocationDetailValid
                          ? "border border-[#CCCCCC] rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : "border border-red-500 rounded py-2.5 px-4 text-xl focus:shadow-outline"
                      }
                      name="location_detail"
                      value={contractorUnList.location_detail || ""}
                      onChange={(e) => {
                        handleChangeVendorUnlist(e as any, index);
                      }}
                      disabled={isVerify}
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="font-bold text-xl ">
                      เลือก เขต/ตำบล แขวง/อำเภอ จังหวัด :
                    </label>
                    <AsyncSelect
                      styles={{
                        control: (baseStyle, state) => ({
                          ...baseStyle,
                          backgroundColor: state.isDisabled ? "#D4D4D4" : "",
                          color: "#000",
                          border: state.isDisabled ? "1px solid #A6A6A6" : "",
                        }),
                      }}
                      classNames={{
                        // option: (state) => (
                        //     state.isDisabled ? 'color-black' : 'color-black'
                        // ),
                        control: (state) => {
                          if (state.isDisabled) {
                            return "border rounded py-1 px-2 text-black text-xl focus:shadow-outline";
                          } else {
                            return "border rounded py-1 px-2 text-black text-xl focus:shadow-outline";
                          }
                        },
                      }}
                      value={
                        locations.filter((value) => {
                          if (contractors.unlistVendor)
                            return (
                              value.value ==
                              contractors.unlistVendor[index].location_main_id
                            );
                        })[0]
                      }
                      placeholder="เขต/ตำบล แขวง/อำเภอ จังหวัด"
                      cacheOptions
                      loadOptions={loadOption}
                      defaultOptions
                      onChange={(option) => {
                        handleOnChangeLocation(option, index);
                      }}
                      isDisabled={isVerify}
                    />
                  </div>
                </div>

                {/* section 1 */}
                <div className="ml-4 flex flex-col lg:flex-row gap-6 justify-between">
                  <div className="flex flex-col w-full">
                    <label className="font-bold text-xl">ชื่อ-สกุล :</label>
                    <input
                      type="text"
                      className={
                        isVerify
                          ? "input-disable rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : isManagerNameValid
                          ? "border border-[#CCCCCC] rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : "border border-red-500 rounded py-2.5 px-4 text-xl focus:shadow-outline"
                      }
                      value={contractorUnList.manager_name || ""}
                      name="manager_name"
                      onChange={(e) => {
                        handleChangeVendorUnlist(e, index);
                      }}
                      disabled={isVerify}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="font-bold text-xl">ตำแหน่ง :</label>
                    <input
                      type="text"
                      className={
                        isVerify
                          ? "input-disable rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : isManagerRoleValid
                          ? "border border-[#CCCCCC] rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : "border border-red-500 rounded py-2.5 px-4 text-xl focus:shadow-outline"
                      }
                      value={contractorUnList.manager_role || ""}
                      name="manager_role"
                      onChange={(e) => {
                        handleChangeVendorUnlist(e, index);
                      }}
                      disabled={isVerify}
                    />
                  </div>
                </div>

                {/* section 2 */}
                <div className="ml-4 flex flex-col lg:flex-row gap-6 justify-between">
                  <div className="flex flex-col w-full">
                    <label className="font-bold text-xl">เบอร์โทร :</label>
                    <input
                      type="tel"
                      pattern="[0-9]*"
                      className={
                        isVerify
                          ? "input-disable rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : isPhoneNumberValid
                          ? "border border-[#CCCCCC] rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : "border border-red-500 rounded py-2.5 px-4 text-xl focus:shadow-outline"
                      }
                      value={contractorUnList.phone_number || ""}
                      name="phone_number"
                      onChange={(e) => {
                        handleChangeVendorUnlist(e, index);
                      }}
                      disabled={isVerify}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="font-bold text-xl">อีเมล์ : </label>
                    <input
                      type="email"
                      className={
                        isVerify
                          ? "input-disable rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : isEmailValid
                          ? "border border-[#CCCCCC] rounded py-2.5 px-4 text-xl focus:shadow-outline"
                          : "border border-red-500 rounded py-2.5 px-4 text-xl focus:shadow-outline"
                      }
                      value={contractorUnList.email || ""}
                      name="email"
                      onChange={(e) => {
                        handleChangeVendorUnlist(e, index);
                      }}
                      disabled={isVerify}
                    />
                  </div>
                </div>
                <div className="ml-4 flex flex-col">
                  <label className="font-bold text-xl">สังกัด</label>
                  <AsyncSelect
                    id="division"
                    name="affiliated"
                    className={
                      isVerify
                        ? "input-disable"
                        : isAffiliatedValid
                        ? "border border-[#CCCCCC] rounded"
                        : "border border-red-500 rounded"
                    }
                    value={
                      affiliated.find((value) => {
                        if (contractors.unlistVendor) {
                          return (
                            value.value === contractors.unlistVendor[index].affiliated
                          );
                        }
                        return false;
                      })
                    }
                    classNamePrefix="select"
                    loadOptions={loadAffiliationOption}
                    onChange={(option) => {
                      handleChangeOptionAffitiation(option, index);
                    }}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    isDisabled={isVerify}
                  />
                </div>
                {(!contractorUnList.company_name ||
                  !contractorUnList.location_detail ||
                  !contractorUnList.manager_name ||
                  !contractorUnList.manager_role ||
                  !contractorUnList.phone_number ||
                  !contractorUnList.email) && (
                  <div className="border border-red-500 rounded p-2 my-2 bg-red-100">
                    <p className="text-red-500">
                      กรุณากรอกข้อมูลให้ครบถ้วนก่อนที่จะเพิ่มข้อมูลรายใหม่
                    </p>
                  </div>
                )}
              </div>
            ))}

            <div>
              <button
                className="bg-[#529FD6] hover:bg-[#498fc0] border py-3 px-5 rounded-xl text-xl text-white"
                onClick={() => {
                  handleOnClick();
                }}
                disabled={isVerify}
              >
                + เพิ่มข้อมูลรายใหม่
              </button>
            </div>
          </div>
        </div>

        {/* third section */}
        <OutsideManager
          contractors={contractors}
          setContractors={setContractors}
          isVerify={isVerify}
        />

        {/* button section */}
        <div className="flex gap-20 justify-evenly">
          <button
            className={`flex justify-center items-center px-10 py-4 bg-[#559744] hover:bg-[#4b853c] text-white text-3xl rounded-xl ${
              isVerify && "hidden"
            }`}
            onClick={handleClickVerify}
          >
            สรุปข้อมูล
          </button>
          <button
            className={`flex justify-center items-center px-10 py-4 bg-[#559744] hover:bg-[#4b853c] text-white text-3xl rounded-xl ${
              (!isVerify || reject?.toString() === "ไม่สามารถแก้ไขรายการได้ในขณะนี้") ? "hidden" : ""
            }`}
            onClick={handleOnSubmit}
          >
            ส่งอนุมัติ
          </button>
          <button
            className={`flex justify-center items-center px-10 py-4 bg-[#D9C304] hover:bg-[#c0ad04] text-white text-3xl rounded-xl ${
              (!isVerify || reject?.toString() === "ไม่สามารถแก้ไขรายการได้ในขณะนี้") ? "hidden" : ""
            }`}
            onClick={handleClickUnVerify}
          >
            แก้ไข
          </button>
        </div>
      </div>
    </div>
  );
}
