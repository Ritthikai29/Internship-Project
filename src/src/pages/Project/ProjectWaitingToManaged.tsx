import Pic from "../../assets/ProjectWaitingToManaged.png";
import { useState , useEffect } from "react";
import { useLocation } from "react-router-dom";
import WaitingToCheck from "../../components/ManageProject/WaitingToCheck";
import OpenProject from "../../components/ManageProject/OpenProject";
import SendInviteLatter from "../../components/ManageProject/SendInviteLetter";
import CheckAdmission from "../../components/ManageProject/CheckAdmission";
import WaitingToOpen from "../../components/ManageProject/WaitingToOpen";
import WaitingToNegotiate from "../../components/ManageProject/WaitingToNegotiate";
import AnnoucementResult from "../../components/ManageProject/AnnouncementResult";
import CheckAllProject from "../../components/ManageProject/CheckAllProject";
import { GetProjectCount } from "../../services/ProjectService/ProjectService";


interface Project {
    verifying: number;
    opening: number;
    sending: number;
    registering: number;
    waiting: number;
    negotiating: number;
    announcing: number;
    all: number;
}

export default function ProjectWaitingToManaged() {
    const location = useLocation();
    const enableComponent = location.state?.project_manage;
    const [paging, setPaging] = useState<string>(enableComponent ||"verifing");
    const [totalProject, setTotalProject] = useState<Project>({
        verifying: 0,
        opening: 0,
        sending: 0,
        registering: 0,
        waiting: 0,
        negotiating: 0,
        announcing: 0,
        all: 0,
    });

    const projectCounts = async () => {
        try {
            const res = await GetProjectCount();
            setTotalProject(res.data as Project);
        } catch (error) {
            console.error("Error fetching project count:", error);
        }
    };
    

    const setVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("verifing");
    };

    const setOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("opening");
    };
    const setSend = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("sending");
    };
    const setRegister = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("registering");
    };
    const setWait = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("waiting");
    };
    const setNegotiate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("negotiating");
    };
    const setAnnounce = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("announcing");
    };
    const setAll = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("all");
    };

    useEffect(() => {
        projectCounts();
        const requestInterval = setInterval(
            projectCounts, 6000
        )
        return () => {
            clearInterval(requestInterval)
        }
    },[]);


    return (
        <div>

            <div className="px-4">
                <div style={{
                    backgroundImage: `url(${Pic})`
                }} className="w-full h-56 flex justify-end items-end">

                    <p className="pb-12 pr-12 text-white text-7xl font-bold">โครงการที่รอจัดการ</p>
                </div>
                <div className="grid-cols-12 justify-center items-center drop-shadow-md">
                    <div className="grid grid-cols-8 border border-separate h-16 text-md font-bold rounded-bl-lg rounded-br-lg">
                        
                    <button className={`relative border rounded-bl-lg
                        ${paging === "verifing" ? "bg-[#1D5182] text-white" : "bg-white text-[#1D5182]"}`}
                        onClick={setVerify}
                    >
                        รอตรวจสอบ
                        <span className={`absolute right-0 top-0 mt-1 mr-2.5 px-3.5 rounded-md text-sm
                            ${paging === "verifing" ? "bg-white text-red-500" : "bg-red-500 text-white"}`}>
                            {totalProject.verifying}
                        </span>
                    </button>
                        
                        <button className={`relative border 
                                ${paging === "opening" ? "bg-[#1D5182] text-white" : "bg-white text-[#1D5182]"}`}
                            onClick={setOpen}
                        >
                            เปิดโครงการ
                            <span className={`absolute right-0 top-0 mt-1 mr-2.5 px-3.5 rounded-md text-sm
                            ${paging === "opening" ? "bg-white text-red-500" : "bg-red-500 text-white"}`}>
                                {totalProject.opening}
                            </span>
                        </button>
                        <button className={`relative border 
                        ${paging === "sending" ? "bg-[#1D5182] text-white" : "bg-white text-[#1D5182]"}`}
                            onClick={setSend}
                        >
                            ส่งหนังสือเชิญ
                            <span className={`absolute right-0 top-0 mt-1 mr-2.5 px-3.5 rounded-md text-sm
                            ${paging === "sending" ? "bg-white text-red-500" : "bg-red-500 text-white"}`}>
                                {totalProject.sending}
                            </span>
                        </button>
                        <button className={`relative border 
                        ${paging === "registering" ? "bg-[#1D5182] text-white" : "bg-white text-[#1D5182]"}`}
                            onClick={setRegister}
                        >
                            ตรวจสอบรับสมัคร
                            <span className={`absolute right-0 top-0 mt-1 mr-2.5 px-3.5 rounded-md text-sm
                            ${paging === "registering" ? "bg-white text-red-500" : "bg-red-500 text-white"}`}>
                                {totalProject.registering}
                            </span>
                        </button>
                        <button className={`relative border 
                        ${paging === "waiting" ? "bg-[#1D5182] text-white" : "bg-white text-[#1D5182]"}`}
                            onClick={setWait}
                        >
                            รอเปิดซอง
                            <span className={`absolute right-0 top-0 mt-1 mr-2.5 px-3.5 rounded-md text-sm
                            ${paging === "waiting" ? "bg-white text-red-500" : "bg-red-500 text-white"}`}>
                                {totalProject.waiting}
                            </span>
                        </button>
                        <button className={`relative border 
                        ${paging === "negotiating" ? "bg-[#1D5182] text-white" : "bg-white text-[#1D5182]"}`}
                            onClick={setNegotiate}
                        >
                            รอเจรจาเพิ่ม
                            <span className={`absolute right-0 top-0 mt-1 mr-2.5 px-3.5 rounded-md text-sm
                            ${paging === "negotiating" ? "bg-white text-red-500" : "bg-red-500 text-white"}`}>
                                {totalProject.negotiating}
                            </span>
                        </button>
                        <button className={`relative border 
                        ${paging === "announcing" ? "bg-[#1D5182] text-white" : "bg-white text-[#1D5182]"}`}
                            onClick={setAnnounce}
                        >
                            ประกาศผล
                            <span className={`absolute right-0 top-0 mt-1 mr-2.5 px-3.5 rounded-md text-sm
                            ${paging === "announcing" ? "bg-white text-red-500" : "bg-red-500 text-white"}`}>
                                {totalProject.announcing}
                            </span>
                        </button>
                        <button className={`relative border rounded-br-lg
                        ${paging === "all" ? "bg-[#1D5182] text-white" : "bg-white text-[#1D5182]"}`}
                            onClick={setAll}
                        >
                            ทั้งหมด
                            <span className={`absolute right-0 top-0 mt-1 mr-2.5 px-3.5 rounded-md text-sm
                            ${paging === "all" ? "bg-white text-red-500" : "bg-red-500 text-white"}`}>
                                {totalProject.all}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {
                paging === "verifing" && <WaitingToCheck />
            }
            {
                paging === "opening" && <OpenProject />
            }
            {
                paging === "sending" && <SendInviteLatter />
            }
            {
                paging === "registering" && <CheckAdmission />
            }
            {
                paging === "waiting" && <WaitingToOpen />
            }
            {
                paging === "negotiating" && <WaitingToNegotiate />
            }
            {
                paging === "announcing" && <AnnoucementResult />
            }
            {
                paging === "all" && <CheckAllProject />
            }
        </div>
    )
}