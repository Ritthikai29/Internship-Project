import React, { createContext, useContext, useEffect, useState } from "react";
import ProjectContractor from "../../components/contractor/projectContractor";
import AllProject from "../../components/contractor/AllProject";
import SetUpProject from "../../components/contractor/SetUpProject";
import MoreDetails from "../../components/contractor/MoreDetails";
import AppStatus from "../../components/contractor/ApplicationStatus";
import SetUpDetailAndFile from "../../components/contractor/SetUpDetailAndFile";
import { ProjectContext } from "../../components/contractor/ProjectContext";
import DenialAccessSetting from "../../components/contractor/DenialAccessSetting";

interface ProjectContextInterface {
    lengthVendor: number;
    setlengthVendor: React.Dispatch<React.SetStateAction<number>>;
    job_type: string;
    setjob_type: React.Dispatch<React.SetStateAction<string>>;


}
const lengthlistVendorContext = createContext<ProjectContextInterface>(
    {
        lengthVendor: 0,
        setlengthVendor: () => { },
        job_type: '',
        setjob_type: () => { }
    }
);
export function uselengthlistContext() {
    const context = useContext(lengthlistVendorContext)
    if (context === undefined) {
        throw new Error("ussProjectContext error")
    }
    return context
}

export default function AllProjectParticipants() {
    const [showsetting, setshowsetting] = useState(false);
    const [lengthVendor, setlengthVendor] = useState(0);
    const [job_type, setjob_type] = useState("");

    const CheckVendor = () => {
        console.log();
        if (lengthVendor >= 5) {//ตรวจว่าListVendorAll มากกว่า/เท่ากับ 5 คน  
            setshowsetting(true)
        } else {
            setshowsetting(false)
        }
    };
    useEffect(() => {
        CheckVendor();
    }, [lengthVendor])

    return (
        <lengthlistVendorContext.Provider
            value={{ lengthVendor, setlengthVendor, job_type, setjob_type }}>
            <div className="flex flex-col  w-full bg-[#F5F5F5]"  >
                <div className=" ">
                {/* <div >
                    {showsetting == true && <SetUpProject />}
                    {showsetting == false && <DenialAccessSetting />}
                </div> */}
                    <div>
                        <AllProject />
                    </div>
                </div>

                <div >
                    {showsetting == true && <SetUpProject />}
                    {showsetting == false && <DenialAccessSetting />}
                </div>


            </div>
        </lengthlistVendorContext.Provider>
    )
}