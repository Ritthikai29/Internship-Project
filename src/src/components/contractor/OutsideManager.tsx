import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import {
  CreateVendorOutsideUnList,
  UserStaffForVendorOutsideInterface,
} from "../../models/Contractor/IOutside";
import { ListUserStaff } from "../../services/ContractorService/OutsideService";
import { SingleValue } from "react-select";
import Select, { OptionsOrGroups } from "react-select";
interface propOutsideManagerInterface {
  contractors: Partial<CreateVendorOutsideUnList>;
  setContractors: React.Dispatch<
    React.SetStateAction<Partial<CreateVendorOutsideUnList>>
  >;
  isVerify: boolean;
}

export default function OutsideManager({
  contractors,
  setContractors,
  isVerify,
}: propOutsideManagerInterface) {
  interface UserOptionInterface {
    label: string;
    value: number;
    data: Partial<UserStaffForVendorOutsideInterface>;
    role: string;
  }

  const [userStaffs, setUserStaffs] = useState<UserOptionInterface[]>([]);
  const [approver, setApporver] = useState<UserOptionInterface[]>([]);
  const [verify, setVerify] = useState<UserOptionInterface[]>([]);

  // function
  const getAllUserStaff = async () => {
    const res = await ListUserStaff();
    console.log(res);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }

    const userMapping = res.data.map((detail: any) => ({
      value: detail.id,
      label: `${detail.employeeNO} ${detail.firstname_t} ${
        detail.lastname_t
      } / ${detail.position || "ไม่ระบุตำแหน่ง"} / ${detail.email}`,
      data: detail,
      role: detail.user_staff_role,
    }));
    setApporver((prevApprovers) => []);
    setVerify((prevVerifys) => []);
    const filteredUserMapping = userMapping.filter((user: any) => {
      if (
        user.data.user_staff_role === "9" ||
        user.data.user_staff_role === "10"
      ) {
        setApporver((prevApprovers) => [
          ...prevApprovers,
          {
            value: user.data.id,
            label: `${user.data.employeeNO} ${user.data.firstname_t} ${
              user.data.lastname_t
            } / ${user.data.position || "ไม่ระบุตำแหน่ง"} / ${user.data.email}`,
            data: user.data,
            role: user.data.user_staff_role,
          },
        ]);
      } else if (user.data.user_staff_role === "2" || user.data.user_staff_role === "6") {
        setVerify((prevVerifys) => [
          ...prevVerifys,
          {
            value: user.data.id,
            label: `${user.data.employeeNO} ${user.data.firstname_t} ${
              user.data.lastname_t
            } / ${user.data.position || "ไม่ระบุตำแหน่ง"} / ${user.data.email}`,
            data: user.data,
            role: user.data.user_staff_role,
          },
        ]);
      }
    });
    setUserStaffs(userMapping);
    console.log(filteredUserMapping);
  };

  // dropdown load option
  const loadOption = (
    input: string,
    callback: (options: UserOptionInterface[]) => void
  ) => {
    console.log(callback);
    callback(filterUserOption(input));
  };

  const filterUserOption = (inputValue: string) => {
    let ins = 0;
    console.log("checkings");
    let check = userStaffs.filter((i) => {
      if (ins > 3) {
        return false;
      }
      let check =
        i.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        i.value != contractors.approver_id &&
        i.value != contractors.verifier_id 
      if (check === true) {
        ins++;
      }
      return check;
    });
    return check;
  };

  const handleOnChangeSingleSelect = (
    options: SingleValue<UserOptionInterface>,
    name: string
  ) => {
    setContractors({
      ...contractors,
      [name]: options?.value,
    });
  };

  const handleOnChangeMultiSelect = (
    options: ReadonlyArray<UserOptionInterface>,
    name: string
  ) => {
    // Check if options is an array
    if (Array.isArray(options)) {
      // Handle the case where options is an array (multi-select)
      const selectedValues = options.map((opt) => opt.value);
      setContractors((prevSelected) => ({
        ...prevSelected,
        [name]: selectedValues,
      }));
    }
  };

  useEffect(() => {
    getAllUserStaff();
  }, []);

  return (
    <div className="my-7 px-28 py-10 bg-white border drop-shadow-lg rounded-lg ">
      <h3 className="mb-6 text-2xl font-bold">3) เลือกผู้ตรวจสอบและอนุมัติ</h3>
      <div className="flex flex-col gap-5 ml-6 w-full">
        <div className="flex flex-col w-full">
          <label className="text-xl">
            3.1 ) เลือกผู้ตรวจ : ผู้จัดการบริการงานจ้างเหมา
          </label>
          <div className="mt-4 flex flex-row w-full">
            <AsyncSelect
              placeholder="Select..."
              className="w-full py-2 px-3 mt-2 text-xl focus:shadow-outline"
              classNamePrefix="select"
              loadOptions={(inputValue, callback) => {
                const filteredOptions = verify.filter((value) => 
                  value.label.toLowerCase().includes(inputValue.toLowerCase())
                );
                callback(filteredOptions);
              }}
              value={verify.find((value) => value.value === contractors.verifier_id)}
              onChange={(option) => {
                handleOnChangeSingleSelect(option, "verifier_id");
              }}
              defaultOptions={verify.filter((value) => {
                return (
                  value.value === contractors.verifier_id ||
                  value.value !== contractors.approver_id
                );
              })}
              isDisabled={isVerify}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: "50px",
                  width: "100%",
                }),
              }}
            />
          </div>
        </div>
        <div className="">
          <label className="text-xl">
            3.2 ) เลือกผู้อนุมัติ : ผู้อำนวยการโรงงาน หรือ กรรมการผู้จัดการ หรือ
            เทียบเท่า
          </label>
          <div className="mt-4 flex flex-row">
           <AsyncSelect
              placeholder="Select..."
              className="w-full py-2 px-3 mt-2 text-xl focus:shadow-outline"
              classNamePrefix="select"
              loadOptions={(inputValue, callback) => {
                const filteredOptions = approver.filter((value) => 
                  value.label.toLowerCase().includes(inputValue.toLowerCase())
                );
                callback(filteredOptions);
              }}
              value={approver.find((value) => value.value === contractors.approver_id)}
              onChange={(option) => {
                handleOnChangeSingleSelect(option, "approver_id");
              }}
              defaultOptions={approver.filter((value) => {
                return (
                  value.value === contractors.approver_id ||
                  value.value !== contractors.verifier_id
                );
              })}
              isDisabled={isVerify}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: "50px",
                  width: "100%",
                }),
              }}
            />
          </div>
        </div>
        <div className="">
          <label className="text-xl">3.3 ) เลือกผู้ที่ต้องการสำเนาอีเมล (ถ้ามี)</label>
          <div className="mt-4 flex flex-row">
          <AsyncSelect
              isMulti
              placeholder="Select..."
              className="w-full py-2 px-3 mt-2 text-xl focus:shadow-outline"
              classNamePrefix="select"
              loadOptions={(inputValue, callback) => {
                const filteredOptions = userStaffs.filter((value) => 
                  value.label.toLowerCase().includes(inputValue.toLowerCase())
                );
                callback(filteredOptions);
              }}
              value={
                contractors.cc_send_id
                  ? userStaffs.filter((value) => {
                      const ccSendId = contractors.cc_send_id as string | number | (string | number)[];
                      return Array.isArray(ccSendId)
                        ? ccSendId.includes(value.value)
                        : value.value === ccSendId;
                    })
                  : []
              }                                                    
              onChange={(option) => {
                handleOnChangeMultiSelect(option, "cc_send_id");
              }}
              defaultOptions={userStaffs}
              isDisabled={isVerify}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: "50px",
                  width: "100%",
                }),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
