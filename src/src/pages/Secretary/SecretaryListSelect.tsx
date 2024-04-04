import { useNavigate } from "react-router-dom";

import { BsDownload } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi"
import LSInformationWorkTypes from "../../components/Secretary/ListSelect/LSInformationWorkTypes";
import LSProjectSettingInformation from "../../components/Secretary/ListSelect/LSProjectSettingInformation";
import LSAdditionalDetailsAndFiles from "../../components/Secretary/ListSelect/LSAdditionalDetailsAndFiles";
import LSStatusApplicationToBidding from "../../components/Secretary/ListSelect/LSStatusApplicationToBidding";
import LSNotificationBiddingResults from "../../components/Secretary/ListSelect/LSNotificationBiddingResults";

export default function SecretaryListSelect() {
    const navigate = useNavigate();

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
                <LSInformationWorkTypes />
            }
            {
                <LSProjectSettingInformation />
            }
            {
                <LSAdditionalDetailsAndFiles />
            }
            {
                <LSStatusApplicationToBidding />
            }
            {
                <LSNotificationBiddingResults />
            }

            <div className="flex justify-start items-center my-14 mx-20">
                <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
                    onClick={() => navigate("/secretary/managementhistory")}>
                    <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                    ย้อนกลับ
                </button>
            </div>

        </div>
    )
}