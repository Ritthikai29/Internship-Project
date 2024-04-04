import { useEffect, useState } from "react";
import CheckMark from "../../../../assets/Secretary/CheckMark.png";
import CrossMark from "../../../../assets/Secretary/CrossMark.png";

import SecretaryBanner from "../../SecretaryBanner"
import { BiSolidLeftArrow } from "react-icons/bi"

import { useNavigate } from "react-router-dom";
import { GetCommitteeOfTheProject, SecretaryStartProject } from "../../../../services/SecretaryService/HttpClientService";

export default function WTODetailsPasscord() {
    const navigate = useNavigate();

    const queryParameters = new URLSearchParams(window.location.search)

    const [committee, setCommittee] = useState<any>({});
    const getCheckCommitteeIsJoin = async () => {
        let res = await GetCommitteeOfTheProject(queryParameters.get("open_id") || "");
        if (res.status !== 200) {
            alert(res.err)
            return;
        }
        if (res.data.is_start) {
            navigate(`/secretary/specifiedevenelope/wto/selectjobstoopen?open_id=${queryParameters.get("open_id")}`)
        }
        setCommittee(res.data)
    }

    const handleStartConsult = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const res = await SecretaryStartProject(queryParameters.get("open_id") || "");
        if (res.status !== 200) {
            alert("ไม่สามารถเริ่มเปิดซองได้");
            return;
        }
        navigate(`/secretary/specifiedevenelope/wto/selectjobstoopen?open_id=${queryParameters.get("open_id")}`)
    }
    useEffect(() => {
        getCheckCommitteeIsJoin();

        const requestInterval = setInterval(
            getCheckCommitteeIsJoin, 6000
        )
        return () => {
            clearInterval(requestInterval)
        }
    }, [])

    return (
        <div className="bg-[#F5F5F5]">
            {
                <SecretaryBanner />
            }
            <div className="px-[8rem] pt-4 pb-12 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-32 py-14 flex flex-col gap-8">
                        <p className="text-4xl text-[#2B3467] font-bold text-center">ระบบจะนำท่านเข้าสู่การเปิดซองเมื่อกรอก Passcode ครบทุกท่านเท่านั้น</p>
                        <div className="grid grid-cols-3 ">
                            <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                                <p className="text-xl">ประธาน</p>
                                <img src={committee.chairman?.is_active == 1 ? CheckMark : CrossMark} className="h-[90px]" />
                                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                                <p className="text-xl">{committee.chairman?.is_active || 0} / 1 </p>
                            </div>
                            <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                                <p className="text-xl">กรรมการ</p>
                                <img src={committee.committee?.is_active == 2 ? CheckMark : CrossMark} className="h-[90px]" />
                                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                                <p className="text-xl">{committee.committee?.is_active || 0} / 2</p>
                            </div>
                            <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                                <p className="text-xl">เลขา</p>
                                <img src={committee.secretary?.is_active == 1 ? CheckMark : CrossMark} className="h-[90px]" />
                                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                                <p className="text-xl">{committee.secretary?.is_active || 0} / 1</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-32 py-14 flex flex-col gap-3">
                        <p className="text-3xl font-bold mb-6">รายชื่อกรรมการที่ใส่ Passcode แล้ว</p>
                        <div className="grid grid-cols-3 justify-items-center">
                            <p className="text-2xl ">ลำดับ</p>
                            <p className="text-2xl ">ชื่อ-สกุล</p>
                            <p className="text-2xl ">ตำแหน่งในการเปิดซอง</p>
                        </div>
                        <hr></hr>
                        {
                            Array.isArray(committee?.user_committee) &&
                            committee?.user_committee.filter((item: any) => (item.is_join === "1")).sort((a: any, b: any) => {
                                // เรียงลำดับตามตำแหน่ง: ประธาน, กรรมการ, เลขา
                                 const positionsOrder: { [key: string]: number } = {
                                    'ประธาน': 1,
                                    'กรรมการ': 2,
                                    'เลขาคณะกรรมการเปิดซอง': 3,
                                };
                                return positionsOrder[a.role_name_t] - positionsOrder[b.role_name_t];
                            }).
                                map((item: any, index: any) => (
                                    <div className="grid grid-cols-3 justify-items-center" key={index}>
                                        <p className="text-xl">{index + 1}</p>
                                        <p className="text-xl">{item.nametitle_t} {item.firstname_t} {item.lastname_t} </p>
                                        <p className="text-xl">{item.role_name_t}</p>
                                    </div>
                                ))
                        }
                    </div>
                </div>
                <div className="grid grid-cols-3 ">

                    <button className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
                        onClick={() => navigate(`/secretary/specifiedevenelope/wto/submitotp?open_id=${queryParameters.get("open_id")}`)}>
                        <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                        ย้อนกลับ
                    </button>

                    <div className="flex justify-center">
                        {
                            (
                                committee.chairman?.is_active == 1 &&
                                committee.committee?.is_active == 2 &&
                                committee.secretary?.is_active == 1
                            )
                            &&
                            <button className="px-8 py-2.5 w-[330px] rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl col-start-2 text-center"
                                onClick={handleStartConsult}>
                                กดเริ่มต้นการประกวดราคา
                            </button>
                        }
                    </div>
                </div>
            </div >
        </div >
    )
}