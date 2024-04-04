import { BsDownload } from "react-icons/bs";
import DWTMInformationWorkTypes from "../../components/Secretary/DataWaitToManage/DWTMInfomationWorkTypes";
import DWTMProjectSettingInformation from "../../components/Secretary/DataWaitToManage/DWTMProjectSettingInformation";
import DWTMAdditionalDetailsAndFiles from "../../components/Secretary/DataWaitToManage/DWTMAdditionalDetailsAndFiles";
import DWTMStatusApplicationToBidding from "../../components/Secretary/DataWaitToManage/DWTMStatusApplicationToBidding";

export default function SelectListDataWaitToManage() {
    return (
        <div className="bg-[#F5F5F5]">
            {/* container */}
            <div className="px-[8rem] py-12 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="bg-[#1D5182] pt-3 pb-8 text-white rounded-xl">
                        <p className="text-lg text-end pr-4">เลขที่เอกสาร : A000123</p>
                        <label className="text-4xl font-bold pl-16">โครงการ : งานติดตั้งกล้องวงจรปิด AI </label>
                    </div>
                    <div className="px-32 py-14 flex flex-col gap-8">
                        <div className="flex flex-row">
                            <label className="text-[#2B3467] text-2xl font-bold basis-1/2">หน่วยงาน : Digital Transformation</label>
                            <label className="text-[#2B3467] text-2xl font-bold basis-1/2">วันที่เพิ่มโครงการ : 1 มิถุนายน</label>
                        </div>
                        <div className="flex flex-row items-center">
                            <label className="text-[#2B3467] text-2xl font-bold">ไฟล์แนบ :</label>
                            <button className=" ml-5 rounded-lg bg-[#2B3467] text-white text-xl p-2 px-5">
                                <BsDownload className="inline-flex pb-0.5" size="1rem" />
                                ใบแจ้งงาน
                            </button>
                            <button className="ml-3 rounded-lg bg-[#559744] text-white text-xl p-2 px-5 ">
                                <BsDownload className="inline-flex pb-0.5 " size="1rem" />
                                TOR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* next  */}
            {
                <DWTMInformationWorkTypes />
            }
            {
                <DWTMProjectSettingInformation />
            }
            {
                <DWTMAdditionalDetailsAndFiles />
            }
            {
                <DWTMStatusApplicationToBidding />
            }

            <div className="flex justify-center items-center my-14">
                <button className="bg-[#559744] rounded-lg text-2xl text-white px-28 py-5 drop-shadow-lg">ตรวจสอบเสร็จสิ้นและปิดรับสมัคร</button>
            </div>

        </div>
    )
}