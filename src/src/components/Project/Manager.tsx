import React, { createContext, useContext, useState } from "react";
import { ProjectInterface } from "../../models/Project/IProject";
import { EmployeeInterface} from "../../models/Project/IEmployee";
import SearchField from "./SearchField";
import { useProjectContext} from "../../pages/Project/ProjectCreate";

export default function Manager({submitType, setSubmitType} : {
    submitType : string,
    setSubmitType: React.Dispatch<React.SetStateAction<string>>
}){

    const {project, setProject} = useProjectContext();

    const [calculator, setCalculator] = useState<Partial<EmployeeInterface[]>>(
        []
    );
    const [verifier, setVerifier] = useState<Partial<EmployeeInterface[]>>([]);
    const [verifier2, setVerifier2] = useState<Partial<EmployeeInterface[]>>([]);
    const [approver, setApprover] = useState<Partial<EmployeeInterface[]>>([]);
    const [approver2, setApprover2] = useState<Partial<EmployeeInterface[]>>(
        []
    );
 
return(
    <div>
        <div className="ml-3 mb-3">
            <p className="text-green-700 text-xl p2"><b>คำแนะนำ:</b> 1. กรุณาใส่ชื่อที่ต้องการเลือกลงในช่อง และ "เลือก" เพื่อยืนยัน</p>
            <p className="text-green-700 text-xl p2 ml-20">2. สามารถเพิ่มได้หนึ่งรายชื่อในแต่ละช่อง</p>
        </div>
        <form
            className="flex-col gap-3">
                
                <div className={`${submitType === "manager" ? "" : "hidden"}`}>
                   
                    <SearchField
                        employees={calculator}
                        setEmployees={setCalculator}
                        position="calculator_id"
                        project={project}
                        setProject={setProject}
                    />
                    <SearchField
                        employees={verifier}
                        setEmployees={setVerifier}
                        position="verifier_id"
                        project={project}
                        setProject={setProject}
                    />
                    <SearchField
                        employees={verifier2}
                        setEmployees={setVerifier2}
                        position="verifier2_id"
                        project={project}
                        setProject={setProject}
                    />
                    <SearchField
                        employees={approver}
                        setEmployees={setApprover}
                        position="approver_id"
                        project={project}
                        setProject={setProject}
                    />
                    <SearchField
                        employees={approver2}
                        setEmployees={setApprover2}
                        position="approver2_id"
                        project={project}
                        setProject={setProject}
                    />
                    
                </div>
        </form>
    </div>
    
);
}