import { useState, useEffect, ChangeEvent } from "react";
import { ProjectSettingInterface } from "../../models/Contractor/IRegisInfo";
import {
  GetProjectSetting,
  UpdateProjectSettingByProjectKey
} from "../../services/ContractorService/VendorRegisService";
import { LuFileEdit } from "react-icons/lu";
import { projectSettingsInterface } from "../../models/Project/IProjectSetting";
import { DetailProject, DetailProjectSecretary, ListProjectService, UnlistWaitInfo, detailmanager } from "../../services/ProjectServices";
import { getProjectSetting } from "../../services/VendorProjectService/VenderProjectPrice";

const renderInputField = (
  label: string,
  value: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  isEditing: boolean
) => (
  <h1 className="text-xl text-[#2B3467] font-bold">
    {label}&nbsp;:&nbsp;
    {isEditing ? (
      <input
        type={label.includes("เวลา") ? "time" : label.includes("วัน") ? "date" : "text"}
        value={value}
        onChange={onChange}
      />
    ) : (
      label === "จำนวนเงินประกันซอง" ? `${value} บาท` : value
    )}
  </h1>
);


export default function SetUpProjectRegis() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [key] = useState<string>(queryParameters.get("key") || "");
  const [projectSetting, setProjectSetting] =
    useState<projectSettingsInterface  | null>(null);
    
  const [isEditing, setIsEditing] = useState(false);
  const [formattedDepositMoney, setFormattedDepositMoney] = useState('');
  
  const getDetailProject = async (key: string) => {
    let res = await   getProjectSetting(key);
    console.log(res.data);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setProjectSetting(res.data);
    setFormattedDepositMoney((res.data.depositMoney).substring(0, (res.data.depositMoney).length - 2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    console.log(formattedDepositMoney)
       
  };
  console.log(projectSetting?.startDate)
  
  const detailDatetimestart = projectSetting?.startDate ? new Date(projectSetting.startDate) : null;
  const formattedDatestart = detailDatetimestart ? new Date(detailDatetimestart.getTime() ).toISOString().split('T')[0] : '';
  const detailDatetimeend = projectSetting?.endDate ? new Date(projectSetting.endDate) : null;
  const formattedDateend = detailDatetimeend ? detailDatetimeend.toISOString().split('T')[0] : '';
  
  
    
  
  
  const [editedValues, setEditedValues] = useState({
    endDate: "",
    endTime: "",
    depositMoney: "",
  });

  const [initialValues, setInitialValues] = useState({
    endDate: "",
    endTime: "",
    depositMoney: "",
  });

  const handleInputChange = (field: string, e: ChangeEvent<HTMLInputElement>) => {
    setEditedValues({
      ...editedValues,
      [field]: e.target.value,
    });
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setEditedValues(initialValues);
    } else {
      setInitialValues(editedValues);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEditProjectSetting = async () => {
    const endDateTime = editedValues.endDate + " " + editedValues.endTime;

    const editedProjectSetting = {
      key,
      end_datetime: endDateTime,
      deposit_money: editedValues.depositMoney,
    };

    let updatedProjectSetting = await UpdateProjectSettingByProjectKey(
      editedProjectSetting
    );

    setProjectSetting(updatedProjectSetting.updateData);
    setIsEditing(false);
  };
  
  
  useEffect(() => {
    getDetailProject(key || "");
    const fetchData = async () => {
      let res = await GetProjectSetting(key);
      console.log(res);
      setProjectSetting(res.data);
      

      setEditedValues({
        endDate: res.data.end_date,
        endTime: res.data.end_time,
        depositMoney: res.data.deposit_money,
      });

      setInitialValues({
        endDate: res.data.end_date,
        endTime: res.data.end_time,
        depositMoney: res.data.deposit_money,
      });
    };
      // Only run the effect once when the component mounts
    if (!projectSetting) {
      fetchData();
    }
  }, [formattedDepositMoney] );

  return (
    <div className='mt-5 mb-5 xl:border p-2 w-11/12 rounded-lg mx-auto bg-zinc-300'>
    <div className='py-2 pl-2 bg-[#2B3467] rounded-t-2xl mx-4 mt-4 flex items-center'>
      <LuFileEdit className="text-5xl m-4 text-white" />
      <p className='font-black text-3xl m-4 text-white'>รายละเอียดการตั้งค่าโครงการ</p>
    </div>
    <div className='border rounded-2xl m-4  md:px-1 lg:px-28 my-4 bg-white  drop-shadow-2xl'>
      <ul className='flex flex-col gap-4 justify-center items-center mx-auto mb-5'>
      <li className='grid grid-cols-1 md:grid-cols-2 text-lg md:text-2xl font-bold w-full my-2'>
    <span className="mt-4 text-[#2B3467]">วันเปิดรับสมัครและส่งเอกสาร : {formattedDatestart}</span>
    <span className="mt-4 text-[#2B3467]">วันปิดรับสมัครและส่งเอกสาร : {formattedDateend}</span>
    <span className="mt-4 text-[#2B3467]">ผู้จัดการส่วน : คุณ {projectSetting?.firstN} {projectSetting?.lastN}</span>
    <span className="mt-4 text-[#2B3467]">จำนวนเงินประกันซอง : {formattedDepositMoney} บาท</span>
</li>

      </ul>
    </div>
     {isEditing && (
       <div className='border rounded-2xl m-4  md:px-1 lg:px-28 my-4 bg-white  drop-shadow-2xl'>
  
        <div className='grid grid-cols-1 md:grid-cols-2 text-lg md:text-2xl font-bold w-full my-2'>
            <div className="flex flex-col mt-6  text-[#2B3467]">
                {renderInputField("กำหนดวันส่งเอกสาร", editedValues.endDate, (e) => handleInputChange("endDate", e), isEditing)}
                <div className="mt-4 text-[#2B3467]">
                    <span>ผู้จัดการส่วน : </span>
                </div>
            </div>
            <div className=" mt-6 text-[#2B3467]">
                {renderInputField("กำหนดเวลาส่งเอกสาร", editedValues.endTime, (e) => handleInputChange("endTime", e), isEditing)}
                <div className="my-4 text-[#2B3467] font-bold">
                    <span>
                    {renderInputField("จำนวนเงินประกันซอง", editedValues.depositMoney, (e) => handleInputChange("depositMoney", e), isEditing)}

                    </span>
                </div>
            </div>
        </div>
     </div>   
    )}

<div className='px-8 py-2.5 w-[180px] rounded-lg drop-shadow-lg  justify-items-end'>
    <div className="flex ">
        <button className={` px-8 py-2.5 rounded-lg ${isEditing ? 'bg-[#3BB143]' : 'bg-[#D9C304]'} drop-shadow-lg text-white text-2xl text-center `}
            type="button"
            onClick={isEditing ? handleSaveEditProjectSetting : toggleEditMode}
        >
            {isEditing ? "บันทึก" : "แก้ไข"}
        </button>
        {isEditing && (
            <button
                type="button"
                onClick={toggleEditMode}
                className={`justify-items-center ml-5 flex-shrink-0 px-8 py-2.5 rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl text-center`}
            >
                ยกเลิก
            </button>
        )}
    </div>
</div>



  </div>
    
  );
}