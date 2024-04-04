import { useState, useEffect } from "react";
import ProjectContractor from "../../components/contractor/projectContractor";
import ProjectOnList from "../../components/contractor/ProjectOnList";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import Outside from "../../components/contractor/Outside";
import AllProjectParticipants from "./AllProjectParticipants";
import { ProjectContext } from "../../components/contractor/ProjectContext";
import { DetailProjectInterface } from "../../models/Project/IListWaitProject";
import { DetailProject } from "../../services/ProjectServices";







export default function Contractor() {
    const { key } = useParams();

    const [page, setPage] = useState("all");

    const handleOnClick = (paging: string) => {
        setPage(paging)
    }

    const [detailProject, setdetailProject] = useState<DetailProjectInterface>()
    const getDetailProject = async (key: string) => {
        let res = await DetailProject(key);

        if (res.status !== 200) {
            alert("err")
            return;
        }
        setdetailProject(() => res.data);
    }
    useEffect(() => {
        getDetailProject(key || "");

    }, []);
    //console.log(key);
    return (
        <ProjectContext.Provider value={detailProject}>
            <div className="bg-[#F5F5F5]">
                <div>
                    <ProjectContractor />
                </div>

                <div className="flex">

                    <div className="w-full">
                        <div className="flex flex-col items-start px-10 bg-[#2B3467] text-white p-10">

                            <div className=" pl-5 pb-5   " >
                                <h1 className="text-3xl font-bold">1 . จัดการผู้เข้าร่วมประกวดโครงการ</h1>
                            </div>
                            <div className=" ml-8 flex justify-around w-full">

                                <button
                                    className={`ml-5 rounded-md drop-shadow-lg text-2xl
                                ${page === "inside" ? "bg-[#EB455F] text-white" : "bg-[#ffffff] text-[#2B3467]"} 
                                font-bold px-14 py-8 `}
                                    onClick={() => {
                                        handleOnClick("inside")
                                    }}
                                >
                                    จัดการข้อมูลใน List ทะเบียน
                                </button>
                                <button
                                    className={`ml-5 rounded-md drop-shadow-lg text-2xl
                                ${page === "outside" ? "bg-[#EB455F] text-white" : "bg-[#ffffff] text-[#2B3467]"}
                                font-bold px-14 py-8`}
                                    onClick={() => {
                                        handleOnClick("outside")
                                    }}
                                >
                                    จัดการข้อมูลนอก List ทะเบียน
                                </button>
                                <button className={`ml-5 rounded-md drop-shadow-lg text-2xl
                            ${page === "all" ? "bg-[#EB455F] text-white" : "bg-[#ffffff] text-[#2B3467]"}
                             font-bold px-14 py-8`}
                                    onClick={() => {
                                        handleOnClick("all")
                                    }}
                                >
                                    ผู้เข้าร่วมโครงการทั้งหมด

                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div>
                    {
                        page === "inside" && <ProjectOnList />
                    }
                    {
                        page === "outside" && <Outside />
                    }
                    {
                        page === "all" && <AllProjectParticipants /> 
                    }

                </div>
            </div >
        </ProjectContext.Provider >

    )
}
