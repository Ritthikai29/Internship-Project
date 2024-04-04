import { useEffect, useState } from "react";
import SecretaryBanner from "../../SecretaryBanner"

import { Link, useNavigate } from "react-router-dom";
import { GetAllProjectOfConsultId, GetAllProjectWaitFinalCommentByOpenId } from "../../../../services/SecretaryService/HttpClientService";

export default function WTOSelectJobstoOpen() {

    interface ProjectInterface {
        id?: number;
        key: string;
        name: string;
        division_name: string;
        is_have: boolean;
        department_name:string 
        SECTION:string;
        SUBSECTION:string;
    }

    const queryParameters = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    const [openId] = useState<string>(queryParameters.get("open_id") || "")

    const [selectPage, setSelectPage] = useState<string>(queryParameters.get("page") || "comment");

    const [listProject, setListProject] = useState<ProjectInterface[]>([])

    const [listProjectSum, setListProjectSum] = useState<ProjectInterface[]>([]);

    const GetAllProject = async () => {
        let res = await GetAllProjectOfConsultId(openId)
        if (res.status !== 200) {
            alert(res.err);
            return;
        }
        setListProject(res.data)
    }

    const GetAllProjectWaitSummary = async () => {
        let res = await GetAllProjectWaitFinalCommentByOpenId(openId);
        if (res.status !== 200) {
            alert(res.err);
            return
        }
        setListProjectSum(res.data)
    }

    useEffect(() => {
        GetAllProject()
        GetAllProjectWaitSummary();
    }, [])

    return (
        <div>
            {
                <SecretaryBanner />
            }
            <div className="flex flex-row justify-around">
                <button
                    className={`py-8 border w-full text-2xl ${selectPage === "comment" ? "text-white bg-[#188493]" : "text-[#188493] bg-white"}`}
                    onClick={() => {
                        setSelectPage("comment")
                    }}
                >ลงความคิดเห็นเบื้องต้น</button>
                <button
                    className={`py-8 border w-full text-2xl ${selectPage === "summary" ? "text-white bg-[#188493]" : "text-[#188493] bg-white"}`}
                    onClick={() => {
                        setSelectPage("summary")
                    }}
                >สรุปผลความคิดเห็น</button>
            </div>
            <div className="flex flex-col m-3 px-2 py-8 rounded-2xl">
                <div className="px-2 pb-14 flex flex-col gap-5">
                    <p className="text-3xl text-[#2B3467]">1. เลือกงานที่จะเปิดซอง</p>
                    <table className="w-full drop-shadow-lg rounded-t-lg table-fixed">
                        <thead className="text-white text-base uppercase rounded-t-lg bg-[#2B2A2A] h-14">
                            <tr>
                                <th className="rounded-l-lg w-[12rem]">เปิดซอง</th>
                                <th className="w-[10rem]">เลขที่เอกสาร</th>
                                <th className="w-[20rem]">ชื่อโครงการ</th>
                                <th className="rounded-r-lg w-[20rem]">หน่วยงาน</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white border-b-lg rounded-xl h-14">
                            {
                                selectPage === "comment" ? (
                                    listProject.map((item, index) => (
                                        <tr className="text-gray-700 text-lg h-14 border-b-2 border-black-700 text-center " style={{ verticalAlign: "top" }} >
                                            <td className="w-full py-3">
                                                {!item.is_have ?
                                                    <Link
                                                        to={`/secretary/specifiedevenelope/wto/compareaverageprices?open_id=${openId}&project_id=${item.id}`}
                                                        className="border drop-shadow-md bg-[#559744] text-white w-32 h-10 text-lg py-1 rounded-lg items-center inline-block"
                                                    >
                                                        {"เปิด"}
                                                    </Link> :
                                                    <Link
                                                        to={`/secretary/specifiedevenelope/wto/compareaverageprices?open_id=${openId}&project_id=${item.id}`}
                                                        className="border drop-shadow-md bg-[#c7c558] text-white w-32 h-10 text-lg py-1 rounded-lg items-center inline-block"
                                                    >
                                                        {"แก้ไข"}
                                                    </Link>}
                                            </td>
                                            <td className=" py-3">{item.key}</td>
                                            <td className=" py-3 text-left">{item.name}</td>
                                            <td className=" py-3 text-left px-2">{item.division_name} / {item.department_name} / {item.SECTION} / {item.SUBSECTION}</td>
                                        </tr>
                                    ))
                                ) : (
                                    listProjectSum.map((item, index) => (
                                        <tr className="text-gray-700 text-lg h-14 border-b-2 border-black-700 text-center" style={{ verticalAlign: "top" }}>
                                            <td className=" py-3">
                                                <Link to={`/secretary/specifiedevenelope/wto/project-summary?open_id=${openId}&project_id=${item.id}`}
                                                    className="border drop-shadow-md bg-[#559744] text-white w-32 h-10 text-lg py-1 rounded-lg items-center inline-block"
                                                >
                                                    เปิด
                                                </Link>
                                            </td>
                                            <td className=" py-3 ">{item.key}</td>
                                            <td className=" py-3 text-left">{item.name}</td>
                                            <td className="py-3 text-left px-2">{item.division_name} / {item.department_name} / {item.SECTION} / {item.SUBSECTION}</td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}