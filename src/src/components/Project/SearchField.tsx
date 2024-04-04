import React, { useRef, useState, useEffect, useMemo } from "react";
import { EmployeeInterface, ShowEmployeeInterface} from "../../models/Project/IEmployee";
import {
  SearchEmployeeByNameOrEmpId,
  SearchMDByNameOrEmpId,
} from "../../services/ProjectServices";
import { ProjectInterface } from "../../models/Project/IProject";
import { Timeout } from "react-number-format/types/types";

import {
  useApprover2Context,
  useBossEmployeeContext,
  useShowEmployeeContext
} from "../../pages/Project/ProjectCreate";


export default function SearchField({
  employees,
  setEmployees,
  position,
  project,
  setProject,
}: {
  employees: (EmployeeInterface | undefined)[];
  setEmployees: React.Dispatch<
    React.SetStateAction<(EmployeeInterface | undefined)[]>
  >;
  position: string;
  project: Partial<ProjectInterface>;
  setProject: React.Dispatch<React.SetStateAction<Partial<ProjectInterface>>>;
}) {
  const [defalutShow] = useState<Partial<EmployeeInterface>>({});
  const [show, setShow] = useState<Partial<EmployeeInterface>>({});


  const { boss, setBoss } = useBossEmployeeContext();
  const { approver2, setApprover2 } = useApprover2Context();
  const {showEmployee, setShowEmployee} = useShowEmployeeContext();

  const employeeSelect = (
    e: React.MouseEvent<HTMLButtonElement>,
    position: string,
    value: EmployeeInterface | undefined
  ) => {
    e.preventDefault();
    const name = position as keyof typeof project;
    if (value?.firstname_t === "ไม่พบข้อมูล") {
      return;
    }
    // if (position === "approver_id") {
    //     setProject({
    //         ...project,
    //         [name]: value
    //     });
    // }
    // else{
    //     setProject({
    //         ...project,
    //         [name]: value?.employeeNO,
    //     });
    // }

    setProject({
      ...project,
      [name]: value?.employeeNO,
    });

    setShowEmployee({
      ...showEmployee,
      [name]: value,
    });

    console.log(name);
    setEmployees([]);
    setShow(value!);
   
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const employeeSelect1 = (
    position: string,
    value: EmployeeInterface
  ) => {
    const name = position as keyof typeof project;
    setShowEmployee({
      ...showEmployee,
      [name]: value,
    });
    setShow(value!);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    return " ";
  };

  const removeMember = (
    e: React.MouseEvent<HTMLButtonElement>,
    name: string
  ) => {
    e.preventDefault();
    console.log(e)
    if (e.clientX === 0){
      return;
    }
    setProject({
      ...project,
      [name]: "",
    });
    setShow({
      ...defalutShow,
    });
    setShowEmployee({
      ...showEmployee,
      [name]: "",
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  let setSearch: Timeout;
  const searchEmployee = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    clearTimeout(setSearch);
    
    setSearch = setTimeout(async () => {
      
      if (e.target.value === "" && employees.length < 1) {
        
        setProject({
          ...project,
          [position]: "",
        });
      } else if (
        e.target.value !== "" &&
        position == "approver2_id" &&
        "ผู้อนุมัติลำดับที่ 2"
      ) {
        let res = await SearchMDByNameOrEmpId(e.target.value);
        let data: EmployeeInterface[] = [];
        // if user typeing a wrong user (Not Found)
        if (Array.isArray(res.data) && res.data.length === 0) {
          data = [
            {
              id: 0,
              nametitle_t: "",
              firstname_t: "ไม่พบข้อมูล",
              lastname_t: "",
              nametitle_e: "",
              department: "",
              firstname_e: "",
              lastname_e: "",
              division: "",
              email: "",
              employeeNO: " ",
              role_name_th: " ",
              is_active: " ",
              employee_id: " ",
              subsection:"",
              section:"",
              position:"",
            },
          ];
          setEmployees(data);
        } else {
          setEmployees(res.data);
        }
      } else if (
        e.target.value !== "" &&
        position != "approver2_id" &&
        "ผู้อนุมัติลำดับที่ 2"
      ) {
        let res = await SearchEmployeeByNameOrEmpId(e.target.value);
        let data: EmployeeInterface[] = [];
        // if user typeing a wrong user (Not Found)
        if (Array.isArray(res.data) && res.data.length === 0) {
          data = [
            {
              id: 0,
              nametitle_t: "",
              firstname_t: "ไม่พบข้อมูล",
              lastname_t: "",
              nametitle_e: "",
              department: "",
              firstname_e: "",
              lastname_e: "",
              division: "",
              email: "",
              employeeNO: " ",
              role_name_th: " ",
              is_active: " ",
              employee_id: " ",
              subsection:"",
              section:"",
              position:"",
            },
          ];
          setEmployees(data);
        } else {
          // if correct typing
          setEmployees(res.data);
        }
      } else {
        setEmployees([]);
      }
    }, 500);
  };

  useEffect(() => {
    setProject((Project) => {
      if (position === "verifier_id" && "ผู้ตรวจสอบราคากลาง") {
        employeeSelect1(position, boss as EmployeeInterface);
        return { ...Project, verifier_id: boss?.employeeNO };
      } 
      else if (position === "approver2_id" && "ผู้อนุมัติลำดับที่ 2") {
        employeeSelect1(position, approver2 as EmployeeInterface);
        return { ...Project, approver2_id: approver2?.employeeNO };
      }
      return Project;
    });

    project.calculator_id = "";
    project.approver_id = "";
    showEmployee.calculator_id = undefined;
    showEmployee.approver_id = undefined;
  }, []);

  useMemo(() => {
  }, [showEmployee]);

  return (
    <div className="lg:md-4">
      <label className="text-gray-700 font-bold text-xl">
        {position == "calculator_id" && "ผู้คำนวณราคากลาง"}
        {position == "verifier_id" && "ผู้ตรวจสอบราคากลาง"}
        {position == "verifier2_id" && "ผู้ตรวจสอบราคากลาง 2"}
        {position == "verifier2_id" && (
          <span className="text-red-500 text-lg ml-2">
            ( ถ้ามี )
          </span>
        )}
        {position == "approver_id" && "ผู้อนุมัติลำดับที่ 1"}
        {position == "approver_id" && (
          <span className="text-red-500 text-lg ml-2">
            ( หากราคากลางของโครงการมากกว่า 500,000 จะส่งไปให้ผู้อนุมัติ 2
            อัตโนมัติ )
          </span>
        )}

        {position == "approver2_id" && "ผู้อนุมัติลำดับที่ 2"}
        {position == "approver2_id" && (
          <span className="text-red-500 text-lg ml-2"></span>
        )}
      </label>
      {!(Object.keys(show).length !== 0) && (
  <input
    className="border rounded w-full py-2.5 px-3 mt-2 mb-4 text-xl text-gray-700 focus:shadow-outline"
    name="calculator_id"
    onChange={searchEmployee}
    ref={inputRef}
    placeholder="ค้นหาด้วยรหัสพนักงาน หรือ ชื่อ-สกุล"
  />
)}
  {Array.isArray(employees) && employees.length !== 0 && (
        <div className="relative">
          <ul className="list-none absolute bg-white p-2.5 w-full text-xl max-h-[40rem] overflow-y-auto">
            {employees.map((employees) => {
              if (
                employees?.employeeNO !== project?.calculator_id &&
                employees?.employeeNO !== project?.approver2_id &&
                employees?.employeeNO !== project?.approver_id &&
                employees?.employeeNO !== project?.verifier_id &&
                employees?.employeeNO !== project?.verifier2_id
              ) {
                return (
                  <li className="py-1 " key={employees?.id}>
                    <button
                    className="text-start w-full hover:bg-[#2B3467] hover:text-white pl-2 py-2 px-4 rounded-md"
                    onClick={(e) => employeeSelect(e, position, employees)}
                  >
                    <div className="grid grid-cols-12">
                    <label className="text-xl font-bold col-span-1 ">
                      <p>{employees?.employeeNO} </p>
                    </label>
                    <label className="text-xl   col-span-2 ">
                      <p>คุณ {employees?.firstname_t} </p>
                    </label>
                    <label className="text-xl col-span-2 ">
                      <p className="inline"> 
                     {employees?.lastname_t} 
                      </p>
                    </label>
                  </div>
                     
                  </button>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}
      {show.id && (
       <div className="my-2 p-4 border rounded-lg shadow-md grid grid-cols-8 items-center bg-gradient-to-br from-white to-gray-100">
       <p className="col-start-1 col-end-2 text-xl font-semibold">
         {show.employeeNO} 
       </p>
       <p className="col-start-2 col-end-6 text-xl">
         คุณ &nbsp; {show.firstname_t} &nbsp; {show.lastname_t}
       </p>
       <button
         onClick={(e) => {
           removeMember(e, position);
         }}
         className="bg-red-500 text-white text-lg py-2 px-4 rounded-lg col-start-8 col-end-8 hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
         style={{ cursor: 'pointer' }}
       >
         ลบ
       </button>
     </div>
      )}
    </div>
  );
}
