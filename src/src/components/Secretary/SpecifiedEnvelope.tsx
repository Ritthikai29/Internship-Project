import { useState } from "react";
import { useLocation } from "react-router-dom";
import WaitToSendEmail from "./SpecifiedEnvelop/WaitToSendEmail";
import WaitToOpen from "./SpecifiedEnvelop/WaitToOpen";
import WaitNegotiate from "./SpecifiedEnvelop/WaitNegotiate";
import WaitToApprove from "./SpecifiedEnvelop/WaitToApprovalResults";
import WaitToAnnounce from "./SpecifiedEnvelop/WaitToAnnounce";

export default function SpecifiedEnvelope() {
    const location = useLocation();
    const enableComponent = location.state?.open_bid;
    const [paging, setPaging] = useState<string>(enableComponent || "waitsendemail");

    const setWaitSendEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("waitsendemail");
    };

    const setWaitToOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("waittoopen");
    };
    const setWaitNegotiate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("waitnegotiate");
    };
    const setWaitToApprove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("waittoapprove");
    };
    const setWaitToAnnounce = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPaging("waittoannounce");
    };

    return (
        <div>
            <div className="gird grid-cols-12 justify-center items-center">
                <div className="grid grid-cols-5 gap-2  h-16 text-2xl font-bold rounded-bl-lg rounded-br-lg my-4">
                    <button className={`border rounded-lg
                        ${paging === "waitsendemail" ? "bg-[#1D5182] text-white" : "bg-[#4B82A9] text-white"}`}
                        onClick={setWaitSendEmail}>
                        รอส่งอีเมลเปิดซอง</button>
                    <button className={`border rounded-lg
                        ${paging === "waittoopen" ? "bg-[#1D5182] text-white" : "bg-[#4B82A9] text-white"}`}
                        onClick={setWaitToOpen}>
                        รอเปิดซอง</button>
                    <button className={`border rounded-lg
                        ${paging === "waitnegotiate" ? "bg-[#1D5182] text-white" : "bg-[#4B82A9] text-white"}`}
                        onClick={setWaitNegotiate}>
                        รอเจรจาต่อรอง</button>
                    <button className={`border rounded-lg
                        ${paging === "waittoapprove" ? "bg-[#1D5182] text-white" : "bg-[#4B82A9] text-white"}`}
                        onClick={setWaitToApprove}>
                        รออนุมัติผล</button>
                    <button className={`border rounded-lg
                        ${paging === "waittoannounce" ? "bg-[#1D5182] text-white" : "bg-[#4B82A9] text-white"}`}
                        onClick={setWaitToAnnounce}>
                        รอประกาศผล</button>
                </div>
                {
                    paging === "waitsendemail" && <WaitToSendEmail />
                }
                {
                    paging === "waittoopen" && <WaitToOpen />
                }
                {
                    paging === "waitnegotiate" && <WaitNegotiate />
                }
                {
                    paging === "waittoapprove" && <WaitToApprove />
                }
                {
                    paging === "waittoannounce" && <WaitToAnnounce />
                }
            </div>
        </div>
    )
}