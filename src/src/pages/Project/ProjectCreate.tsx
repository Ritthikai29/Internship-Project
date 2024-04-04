import React, { useEffect, useRef, useState, useContext, createContext, useMemo } from "react";
import SecondPage from "../../components/Project/SecondPage";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Select, { OptionsOrGroups } from 'react-select';
import { GetBossEmployeeById } from "../../services/EmployeeService/EmployeeService";
import {
    CreateProject,
    CreateProjectWithManager,
    CreateProjectWithSubPrice,
    SearchMDByNameOrEmpId,
    getAffiliation,
    getDepartments,
    getDivision,
    getJobType,
    getProjectType,
} from "../../services/ProjectServices";
import { DepartmentInterface } from "../../models/Project/IDepartment";
import { ProjectTypeInterface } from "../../models/Project/IProjectType";
import { DivisionInterface } from "../../models/Project/IDivision";
import { ProjectJobTypeInterface } from "../../models/Project/IProjectJobType";
import { ProjectInterface } from "../../models/Project/IProject";
import { BossEmployeeInterface, EmployeeInterface, ShowEmployeeInterface } from "../../models/Project/IEmployee";


interface ShowEmployeeContextInterface {
    showEmployee: Partial<ShowEmployeeInterface>;
    setShowEmployee: React.Dispatch<React.SetStateAction<Partial<ShowEmployeeInterface>>>;
}
const ShowEmployeeContext = createContext<ShowEmployeeContextInterface>({
    showEmployee: {},
    setShowEmployee: () => { },
})
export function useShowEmployeeContext() {
    const context = useContext(ShowEmployeeContext)
    if (context === undefined) {
        throw new Error("useProjectContext error")
    }
    return context
}

interface ProjectContextInterface {
    project: Partial<ProjectInterface>;
    setProject: React.Dispatch<React.SetStateAction<Partial<ProjectInterface>>>;
    totalPrice: number;
    setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
    deciPrice: number;
    setDeciPrice: React.Dispatch<React.SetStateAction<number>>;
}
const ProjectContext = createContext<ProjectContextInterface>({
    project: {},
    setProject: () => { },
    totalPrice: 0,
    setTotalPrice: () => { },
    deciPrice: 0,
    setDeciPrice: () => { }
})
export function useProjectContext() {
    const context = useContext(ProjectContext)
    if (context === undefined) {
        throw new Error("useProjectContext error")
    }
    return context
}

export interface AffitiationInterface {
    SECTION: string;
    SUBSECTION: string;
    department_name: string;
    division_name: string;
}


interface BossEmployeeContextInterface {
    boss: Partial<BossEmployeeInterface>;
    setBoss: React.Dispatch<React.SetStateAction<Partial<BossEmployeeInterface>>>;
}
const BossEmployeeContext = createContext<BossEmployeeContextInterface>({
    boss: {},
    setBoss: () => { },
})
export function useBossEmployeeContext() {
    const context = useContext(BossEmployeeContext)
    if (context === undefined) {
        throw new Error("useBossEmployeeContext error")
    }
    return context
}
interface Approver2ContextInterface {
    approver2: Partial<EmployeeInterface>;
    setApprover2: React.Dispatch<React.SetStateAction<Partial<EmployeeInterface>>>;
}
const Approver2Context = createContext<Approver2ContextInterface>({
    approver2: {},
    setApprover2: () => { },
})
export function useApprover2Context() {
    const context = useContext(Approver2Context)
    if (context === undefined) {
        throw new Error("useApprover2Context error")
    }
    return context
}


let affiliationoption: OptionsOrGroups<any, any> | undefined = [];
export default function ProjectCreate() {
    const [departments, setDepartments] = useState<DepartmentInterface[]>([]);
    const [projectTypes, setProjectTypes] = useState<ProjectTypeInterface[]>(
        []
    );
    const [divisions, setDivisions] = useState<DivisionInterface[]>([]);
    const [jobTypes, setJobTypes] = useState<ProjectJobTypeInterface[]>([]);

    const [page, setPage] = useState<string>("Home");
    const [submitType, setSubmitType] = useState<string>("manager");
    const [deciPrice, setDeciPrice] = useState<number>(0);
    const [selectedUnit, setSelectedUnit] = useState<any>();
    // const withManagerButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault();
    //     setSubmitType("manager");
    // };

    // const withBudget = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault();
    //     setSubmitType("budget");
    // };
    const navigate = useNavigate();

    // subPrice
    const [isHaveSubprice, setIsHaveSubprice] = useState<boolean>();
    const [project, setProject] = useState<Partial<ProjectInterface>>({ projectName: "" });
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const tor = useRef<HTMLInputElement>(null);

    const [boss, setBoss] = useState<Partial<BossEmployeeInterface>>({});
    const [approver2, setApprover2] = useState<Partial<EmployeeInterface>>({});

    const [showEmployee, setShowEmployee] = useState<Partial<ShowEmployeeInterface>>({});

    const getBoss = async () => {
        let res = await GetBossEmployeeById();
        setShowEmployee({
            ...showEmployee, "verifier_id": res.data,
        })
        setBoss(res.data)
    }
    const openUploadFiletor: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        
        // โค้ดเปิดหน้าใหม่
        const file = project.tor;
        if (file !== undefined) {
            const blobData = new Blob([file], { type: file.type });
            const blobUrl = URL.createObjectURL(blobData);
            window.open(blobUrl, '_blank');
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
        }
    };
    const openUploadFilejobDescription: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        
        // โค้ดเปิดหน้าใหม่
        const file = project.jobDescription;
        if (file !== undefined) {
            const blobData = new Blob([file], { type: file.type });
            const blobUrl = URL.createObjectURL(blobData);
            window.open(blobUrl, '_blank');
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
        }
    };
    
     

    const getApprover2 = async () => {
        let res = await SearchMDByNameOrEmpId("21941");
        setApprover2(res.data[0])
    }

    const getADepartment = async () => {
        let res = await getDepartments();
        setDepartments(res.data);
    };

    const getAProjectType = async () => {
        let res = await getProjectType();
        setProjectTypes(res.data);
    };

    const getADivision = async () => {
        let res = await getDivision();
        setDivisions(res.data);
    };
    const getAJobType = async () => {
        let res = await getJobType();
        setJobTypes(res.data);
    };

    const getAllAffiliation = async () => {
        let res = await getAffiliation();
        console.log(res.data);
        affiliationoption = (res.data).map((item: AffitiationInterface, index: number) => ({
            value: index + 1,
            label: `${item.SECTION} / ${item.department_name} / ${item.SUBSECTION} / ${item.division_name}`
        }));
        console.log(affiliationoption);
    };



    useEffect(() => {
        getADepartment();
        getAllAffiliation();
        getAProjectType();
        getADivision();
        getAJobType();
        getBoss();
        getApprover2();
    }, []);

    const handleOnChange = (
        e: React.ChangeEvent<{ name: string; value: any }>
    ) => {
        const name = e.target.name as keyof typeof project;
        const value = e.target.value;
        // อัปเดตค่า state
        setProject({
            ...project,
            [name]: value,
        });

    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof typeof project;

        if (event.target.files) {
            setProject({
                ...project,
                [name]: event.target.files[0],
            });
        }

    };


    const nextPageButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        //    เช็คค่าใน projectName หาก undefined จะทำ if
        if (project.projectName === undefined || project.projectName === "") {
            Swal.fire({
                icon: 'error',
                title: 'กรุณากรอกชื่อโครงการ',
            })
            return;
        }

        if (project.projectTypeId === undefined || Number(project.projectTypeId) === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกประเภทโครงการ',
            })
            return;
        }

        if (project.projectJobTypeId === undefined || Number(project.projectJobTypeId) === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกประเภทงาน',
            })
            return;
        }

        if (project.affiliationId === undefined || Number(project.affiliationId) === 0) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกสังกัด',
            })
            return;
        }

        if (project.tor === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาแนบไฟล์ TOR',
            })
            return;
        }
        if (project.jobDescription === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาแนบไฟล์ Job Description',
            })
            return;
        }
        setPage("second");

    };

    const backPageButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsHaveSubprice(undefined);
        setPage("Home");

    };

    // submit with a manager ยืนยันแจ้งจัดทำราคากลาง
    const withManagerSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // when user is have a manager to manage a calculator

        console.log(project)

        Swal.fire({
            title: 'ยืนยันการจัดทำราคากลาง?',
            html: `
            <div style="margin-left: 10px; margin-right: 20px; padding: 10px; border: 1px solid #CFCFCF; box-shadow:0px 2px #888888; background-color: #EAE7E7; display: flex; flex-direction: column; font-size: medium;">
      
      <table >
        
        <tr >
            <td style="text-align: left;">&nbsp;&nbsp;&nbsp; ผู้คำนวณราคากลาง </td>
            <td style="text-align: left;"> : </td>
            <td style="text-align: left;">&nbsp;&nbsp; ${showEmployee?.calculator_id?.firstname_t ? showEmployee?.calculator_id?.firstname_t : " -"} 
              ${showEmployee?.calculator_id?.lastname_t ? showEmployee?.calculator_id?.lastname_t : ""}</td>
        </tr>
        <tr>
            <td style="text-align: left;">&nbsp;&nbsp;&nbsp; ผู้รตวจสอบราคากลาง </td>
            <td style="text-align: left;"> : </td>
            <td style="text-align: left;">&nbsp;&nbsp; ${showEmployee?.verifier_id?.firstname_t ? showEmployee?.verifier_id?.firstname_t : " -"} 
              ${showEmployee?.verifier_id?.lastname_t ? showEmployee?.verifier_id?.lastname_t : ""}</td>
        </tr>
        <tr>
            <td style="text-align: left;">&nbsp;&nbsp;&nbsp; ผู้ตรวจสอบราคากลาง 2</td>
            <td style="text-align: left;"> : </td>
            <td style="text-align: left;">&nbsp;&nbsp; ${showEmployee?.verifier2_id?.firstname_t ? showEmployee?.verifier2_id?.firstname_t : " -"} 
              ${showEmployee?.verifier2_id?.lastname_t ? showEmployee?.verifier2_id?.lastname_t : ""}</td>
        </tr>
        <tr>
            <td style="text-align: left;">&nbsp;&nbsp;&nbsp; ผู้อนุมัติลำดับที่ 1 </td>
            <td style="text-align: left;"> : </td>
            <td style="text-align: left;">&nbsp;&nbsp; ${showEmployee?.approver_id?.firstname_t ? showEmployee?.approver_id?.firstname_t : " -"} 
              ${showEmployee?.approver_id?.lastname_t ? showEmployee?.approver_id?.lastname_t : ""}</td>
        </tr>
        <tr>
            <td style="text-align: left;">&nbsp;&nbsp;&nbsp; ผู้อนุมัติลำดับที่ 2</td>
            <td style="text-align: left;"> : </td>
            <td style="text-align: left;">&nbsp;&nbsp; ${showEmployee?.approver2_id?.firstname_t ? showEmployee?.approver2_id?.firstname_t : " -"} 
              ${showEmployee?.approver2_id?.lastname_t ? showEmployee?.approver2_id?.lastname_t : ""}</td>
        </tr>
    </table>
  </div>
          `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EB455F',
            cancelButtonColor: '#979797',
            confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
            cancelButtonText: '<span style="font-size: 25px;">แก้ไข</span>',
            preConfirm: async () => {
                let res = await CreateProjectWithManager(project as ProjectInterface)
                if (res.status !== 200) {
                    Swal.showValidationMessage(res.err)
                }
                return res.data
            }

        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    {
                        title: 'ส่งสำเร็จ!',
                        text: "",
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน',
                    }
                ).then(() => {
                    navigate("/project/ManageProject");
                });
            }
        })

        // if (project == undefined) {
        //     let data = await CreateProjectWithManager(project as ProjectInterface)
        //     console.log(data);

        // }



    };

    // ปุ่มสรุปข้อมูล

    const withBudgetSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();


        if (isHaveSubprice == true) {

            if (totalPrice !== deciPrice) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณาเลือกราคากลางย่อยให้ครบตามกำหนด',
                })
                return;
            }
        }
        if (isHaveSubprice == false) {

            if (totalPrice !== 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณาเลือกราคากลางย่อยให้ครบตามกำหนด',
                })
                return;
            }

        }

        if (project.calculateFile === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกไฟล์ราคากลาง',
            })
            return;
        }




        if (isHaveSubprice === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกว่าควรมีราคากลางย่อยหรือไม่',

            })
            return;
        }

        if (selectedUnit === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'กรุณาเลือกหน่วยราคาของโครงการ',

            })
            return;
        }

        Swal.fire({
            title: 'ยืนยันส่งฟอร์ม?',
            text: "เมื่อกดปุ่มนี้ ท่านไม่สามารถกลับมาแก้ไขได้อีก",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EB455F',
            cancelButtonColor: '#979797',
            confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
            cancelButtonText: '<span style="font-size: 25px;">ปิด</span>',
            preConfirm: async () => {
                if (isHaveSubprice) {
                    let res = await CreateProjectWithSubPrice(project as ProjectInterface, selectedUnit.value);
                    if (res.status !== 200) {
                        Swal.showValidationMessage(res.err)
                    }
                    return res.data
                } else {
                    let res = await CreateProject(project as ProjectInterface, selectedUnit.value);
                    if (res.status !== 200) {
                        Swal.showValidationMessage(res.err)
                    }
                    return res.data
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    {
                        title: 'ส่งสำเร็จ',
                        text: "",
                        icon: 'success',
                        confirmButtonText: 'ยืนยัน',
                    }
                ).then(() => {
                    navigate("/project/ManageProject");
                });
            }
        })



        // if (isHaveSubprice) {
            // if have a subprice
        //     console.log(project)
        //     let res = await CreateProjectWithSubPrice(project as ProjectInterface, selectedUnit.value);
        // } else {
            // if haven't a sub price
        //     console.log(project)
        //     let res = await CreateProject(project as ProjectInterface, selectedUnit.value);
        // }
        // console.log(project)


    };

    const handleChangeOptionAffitiation = (selectedOption: { value: any; label: string }) => {
        setProject({
            ...project,
            affiliationId: (selectedOption.value.toString()),
            affiliationName: (selectedOption.label.toString()),
        });
    };

    useMemo(() => {
        console.log(777777)
        console.log(project)
    }, [project])

    // part of container element
    return (
        <ProjectContext.Provider value={{
            project,
            setProject,
            totalPrice,
            setTotalPrice,
            deciPrice,
            setDeciPrice,
        }}>
            <ShowEmployeeContext.Provider value={{
                showEmployee,
                setShowEmployee,
            }}>
                <div className="grid grid-cols-12 justify-center items-center mb-16">
                    <div id="form" className="col-start-3 col-end-11 mt-20 py-3">
                        {/**
                 * progress session
                 */}
                        <div id="progress">
                            <ul className="flex gap-2">
                                <li
                                    className={`border px-4 py-4 rounded-t-lg ${page === "Home"
                                        ? "bg-[#EB455F]"
                                        : "bg-[#939393]"
                                        }`}
                                >
                                    <p className="text-white">
                                        <span
                                            className={`px-[20px] py-[8px] mr-2 rounded-full bg-white text-xl ${page === "Home"
                                                ? "text-[#EB455F]"
                                                : "text-[#939393]"
                                                }`}
                                        >
                                            1
                                        </span>
                                        <span className="text-xl">ข้อมูลโครงการ</span>
                                    </p>

                                </li>

                                <li
                                    className={`border px-4 py-4 rounded-t-lg ${page === "Home"
                                        ? "bg-[#939393]"
                                        : "bg-[#EB455F]"
                                        }`}
                                >
                                    <p className="text-white">
                                        <span
                                            className={`px-[18px] py-[8px] mr-2 rounded-full bg-white text-xl ${page === "Home"
                                                ? "text-[#939393]"
                                                : "text-[#EB455F]"
                                                }`}
                                        >
                                            2
                                        </span>
                                        <span className="text-xl">ข้อมูลราคากลาง</span>
                                    </p>
                                </li>
                            </ul>
                        </div>




                        {/* first component */}

                        <div className="border bg-zinc-100 p-6 rounded-b-lg rounded-tr-lg">
                            {/* Start Section  */}
                            <form
                                className={`${page == "Home" ? "flex" : "hidden"
                                    } flex-col gap-3`}
                            >
                                <div className="lg:mb-4">
                                    <label className=" text-gray-700 font-bold text-xl">
                                        ชื่อโครงการ
                                    </label>
                                    <input
                                        className="border rounded w-full py-2.5 px-3 text-gray-700 text-xl focus:shadow-outline mt-2"
                                        id="project-id"
                                        name="projectName"
                                        type="text"
                                        placeholder="ชื่อโครงการ"
                                        onChange={handleOnChange}
                                        value={project.projectName}
                                        required
                                    />
                                </div>
                                <div className="lg:mb-4 flex flex-col lg:flex-row gap-3">
                                    <div className="block w-full">
                                        <label className="block text-gray-700 font-bold text-xl">
                                            ประเภทโครงการ
                                        </label>
                                        <select
                                            id="project-type"
                                            className="border rounded w-full py-2 px-3 mt-2 text-xl focus:shadow-outline"
                                            name="projectTypeId"
                                            onChange={handleOnChange}
                                            defaultValue="0"
                                        >
                                            <option
                                                disabled
                                                className="text-gray-400"
                                                value={0}
                                            >
                                                ประเภทโครงการ
                                            </option>
                                            {projectTypes.map(
                                                (item: ProjectTypeInterface) => (
                                                    <option
                                                        value={item.id}
                                                        key={item.id}
                                                    >
                                                        {item.type_name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div className="block w-full">
                                        <label className="block text-gray-700 font-bold text-xl">
                                            ประเภทงาน
                                        </label>
                                        <select
                                            id="project-job-type"
                                            className="border rounded w-full py-2 px-3 mt-2 text-xl focus:shadow-outline"
                                            name="projectJobTypeId"
                                            onChange={handleOnChange}
                                            defaultValue="0"
                                        >
                                            <option
                                                disabled
                                                className="text-gray-400"
                                                value={0}
                                            >
                                                ประเภทงาน
                                            </option>
                                            {jobTypes.map(
                                                (item: ProjectJobTypeInterface) => (
                                                    <option
                                                        value={item.id}
                                                        key={item.id}
                                                    >
                                                        {item.job_type_name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="lg:mb- flex flex-col lg:flex-row gap-3">
                                    <div className="block w-full">
                                        <label className="block text-gray-700 font-bold text-xl">
                                            สังกัด
                                        </label>
                                        <Select
                                            placeholder="เลือกสังกัด"
                                            id="division"
                                            className="w-full py-2 px-3 mt-2 text-xl focus:shadow-outline "
                                            classNamePrefix="select"
                                            options={affiliationoption}
                                            onChange={handleChangeOptionAffitiation}
                                            styles={{
                                                // เพิ่มสไตล์เพื่อปรับขนาดของกล่อง
                                                control: (provided) => ({
                                                    ...provided,
                                                    minHeight: '50px', // ปรับความสูงตามต้องการ
                                                    width: '100%', // เพิ่มความกว้างเต็มรูป
                                                }),
                                            }}
                                        />
                                    </div>
                                </div>

                            <div>
                                <label className=" text-gray-700 font-bold text-xl ">
                                    เอกสาร TOR
                                </label>
                                <span className="text-red-500 text-lg ml-2">(PDF ขนาดไม่เกิน 15 MB)</span>
                            </div>
                            <div>
                               <input
                                    className="border rounded w-1/2 py-2 px-3 text-gray-700 text-lg focus:shadow-outline"
                                    id="project-id"
                                    type="file"
                                    placeholder="ชื่อโครงการ" 
                                    name="tor"
                                    onChange={handleFileChange}
                                    ref={tor}
                                    accept="application/pdf"
                                    required
                                />
                                
                                <button
                                className="border p-2 bg-[#EB455F] text-white rounded-lg text-lg ml-2"
                                  onClick={openUploadFiletor}
                                >ตรวจสอบไฟล์ </button>
                  
                            </div>
                            <div>
                                <label className=" text-gray-700 font-bold text-xl">
                                    ใบแจ้งงาน
                                </label>
                                <span className="text-red-500 text-lg ml-2">(PDF ขนาดไม่เกิน 15 MB)</span>
                               
                            </div>
                            <div className="lg:mb-4">
                                 <input
                                    className="border rounded w-1/2 py-2 px-3 text-gray-700 text-lg focus:shadow-outline"
                                    id="project-id"
                                    type="file"
                                    placeholder="ชื่อโครงการ"
                                    name="jobDescription"
                                    onChange={handleFileChange}
                                    // ล็อคให้เลือก pdf
                                    accept="application/pdf"
                                />
                                 <button
                                className="border p-2 bg-[#EB455F] text-white rounded-lg text-lg ml-2"
                                   onClick={openUploadFilejobDescription}
                                >ตรวจสอบไฟล์ </button>
                            </div>
                        </form>

                            {/**
                     * Section Second home page
                     */}
                            <form
                                className={` flex-col gap-3 mb-3 ${page === "Home" ? "hidden" : "flex"
                                    }`}
                            >
                                {
                                    page === "second" &&
                                    (
                                        <Approver2Context.Provider value={{
                                            approver2,
                                            setApprover2,
                                        }}>
                                            <BossEmployeeContext.Provider value={{
                                                boss,
                                                setBoss,
                                            }}>
                                                <SecondPage
                                                    submitType={submitType}
                                                    setSubmitType={setSubmitType}
                                                    isHaveSubprice={isHaveSubprice}
                                                    setIsHaveSubprice={setIsHaveSubprice}
                                                    selectedUnit={selectedUnit}
                                                    setSelectedUnit={setSelectedUnit}


                                                />
                                            </BossEmployeeContext.Provider>
                                        </Approver2Context.Provider>
                                    )
                                }

                            </form>

                            {/* Button */}
                            <div className="grid grid-cols-2 content-start mt-4">

                                {page === "Home" ? (
                                    <Link className=" mx-10 bg-white text-center hover:bg-gray-100 border py-3 px-full rounded-lg text-2xl"
                                        to={"/project/ManageProject"}
                                    >
                                        ออก
                                    </Link>
                                ) : (
                                    <button
                                        className="mx-10 bg-white hover:bg-gray-100 border py-3 px-full rounded-lg text-2xl"
                                        onClick={backPageButton}
                                    >
                                        กลับ
                                    </button>
                                )}
                                {page === "Home" ? (
                                    <button
                                        className=" mx-10 bg-[#EB455F] hover:bg-[#e72241] border py-3 px-full rounded-lg text-white text-2xl"
                                        onClick={nextPageButton}
                                    >
                                        ถัดไป
                                    </button>
                                ) : submitType === "manager" ? (
                                    <button
                                        className="mx-10 bg-[#EB455F] hover:bg-[#e72241] border py-3 px-full rounded-lg text-white text-2xl"
                                        onClick={withManagerSubmit}
                                    >
                                        ยืนยัน
                                    </button>
                                ) : (
                                    <button
                                        className="mx-10 bg-[#EB455F] hover:bg-[#e72241] border py-3 px-full rounded-lg text-white text-2xl"
                                        onClick={withBudgetSubmit}
                                    >
                                        สรุปข้อมูล
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ShowEmployeeContext.Provider>
        </ ProjectContext.Provider>
    );
}
