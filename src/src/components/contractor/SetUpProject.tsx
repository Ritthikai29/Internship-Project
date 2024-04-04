import { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdditionalDetails from './AddDetails';
import { projectsetting } from '../../models/ProjectSetting/IProjectSetting';
import { CreateProjectSetting } from '../../services/ProjectSettingService';
import { ProjectContext } from './ProjectContext';
import { uselengthlistContext } from '../../pages/contractor/AllProjectParticipants';
import CurrencyInput from "react-currency-input-field";
import AsyncSelect from 'react-select/async';
import { apiUrl } from '../../services/utilitity';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

interface EmployeeOption {
    value: string,
    label: string,
    isDisabled?: boolean
}

export default function SetUpProject() {

    const mySwal = withReactContent(Swal);
    const navigate = useNavigate();
    
    // ปุ่มสรุปข้อมูล
    const detailProject = useContext(ProjectContext)
    const { job_type, setjob_type } = uselengthlistContext();

    const [showSummary, setShowSummary] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [projectsetting, setprojectsetting] = useState<Partial<projectsetting>>({
        project_id: detailProject?.id,
        job_type: detailProject?.job_type_name

    });
    const [isInputDisabled, setInputDisabled] = useState(false);

    const handleSummaryClick = () => {
        setInputDisabled(true);
        setShowSummary(false);
    };

    const handleSaveClick = async () => {

        await mySwal.fire(
            {
                title: (<h4 className="text-4xl">ยืนยันการดำเนินการ</h4>),
                html: (
                    <div className=" p-4">
                        <p className="text-2xl text-red-500">หากท่านดำเนินการแล้วจะไม่สามารถแก้ไขได้</p>
                    </div>
                ),
                icon: "question",
                confirmButtonText: (<p className="text-3xl">ยืนยัน</p>),
                confirmButtonColor: "#2B3467",
                showCancelButton: true,
                cancelButtonText: (<p className="text-3xl">ยกเลิก</p>),
                preConfirm: async () => {
                    let res = await CreateProjectSetting(projectsetting as projectsetting);
                    if (res.status !== 200) {
                        mySwal.showValidationMessage(res.err)
                    }
                    console.log(res.data)
                    return res.data
                }
            }
        ).then((response) => {
            if (response.isConfirmed) {
                mySwal.fire(
                    {
                        title: (<h4 className="text-4xl text-green-600">ดำเนินการสำเร็จ</h4>),
                        confirmButtonText: (<p className="text-3xl">ยืนยัน</p>),
                        confirmButtonColor: "#2B3467",
                    }
                )
                navigate("/project/waitingtomanaged", {
                    state: {
                        project_manage: "opening"
                    },
                });
            }
        })
    };

    const handleEditClick = () => {
        setInputDisabled(false);
        setShowSummary(true);
    };

    const handleOnChange = (
        e: React.ChangeEvent<{ name: string; value: any }>
    ) => {
        const name = e.target.name as keyof typeof projectsetting;
        const value =  String((e.target.value).replace(/[,]/g, ''))
        setprojectsetting({
            ...projectsetting,
            [name]: value,
        });     
    };

    const handleOnChangeDepositMoney = (
        e: React.ChangeEvent<{ name: string; value: any }>
    ) => {
        const name = e.target.name as keyof typeof projectsetting;
        const value =  String((e.target.value).replace(/[,]/g, ''))
        if (Number(value)) {
             setprojectsetting({
            ...projectsetting,
            [name]: value,
        });
        }

        if (!(value.length)) {
            setprojectsetting({
                ...projectsetting,
                [name]: '',
            });
        }       
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof typeof projectsetting;

        if (event.target.files) {
            setprojectsetting({
                ...projectsetting,
                [name]: event.target.files,
            });
        }

    };

    const handleCheckButtonClick = () => {
        const selectedFile = projectsetting.addiFile;
    if (selectedFile) {
    const fileToCheck = selectedFile[0];
    const fileUrl = URL.createObjectURL(fileToCheck);
    window.open(fileUrl);
      };
    }

    const handleDropDownChange = (
        option: EmployeeOption | null,
        name: string
    ) => {
        setprojectsetting(
            {
                ...projectsetting,
                [name]: option?.value,
            }
        )
    }

    const loadOption = (inputValue: string) => {
        return new Promise<EmployeeOption[]>((resolve) => {
            getEmployee(inputValue)
                .then((res) => {
                    if (res.status !== 200) {
                        resolve(
                            [
                                {
                                    label: "Not Found",
                                    value: "DEFAULT",
                                    isDisabled: true
                                }
                            ]
                        )
                        return;
                    }
                    let dataMap: EmployeeOption[] = res.data.map((item: any) => (
                        {
                            label: item.firstname_t + " " + item.lastname_t + " / " + item.position + " / " + item.email,
                            value: item.id
                        }
                    ))
                    resolve(dataMap)
                })
        });
    }

    const loadOptionp = (inputValue: string) => {
        return new Promise<EmployeeOption[]>((resolve) => {
            getEmployeep(inputValue)
                .then((res) => {
                    if (res.status !== 200) {
                        resolve(
                            [
                                {
                                    label: "Not Found",
                                    value: "DEFAULT",
                                    isDisabled: true
                                }
                            ]
                        )
                        return;
                    }
                    let dataMap: EmployeeOption[] = res.data.map((item: any) => (
                        {
                            label: item.firstname_t + " " + item.lastname_t + " / " + item.position + " / " + item.email,
                            value: item.id
                        }
                    ))
                    resolve(dataMap)
                })
        });
    }

    const getEmployee = async (input: string) => {
        const res = await fetch(
            `${apiUrl}/Employee/searchEmployee.php?search=${input}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        );
        const resJson = await res.json();
        return resJson
    }

    const getEmployeep = async (input: string) => {
        const res = await fetch(
            `${apiUrl}/Employee/searchEmployeep.php?search=${input}`,
            {
                method: "GET",
                credentials: import.meta.env.DEV ? "include" : "same-origin"
            }
        );
        const resJson = await res.json();
        console.log(resJson);
        return resJson
    }

    useEffect(() => {
        setprojectsetting({
            ...projectsetting,
            job_type: detailProject?.job_type_name,
        });
        console.log(job_type);
        console.log(projectsetting);
        console.log(detailProject)
    }, [job_type])

    useMemo(() => {
        console.log(projectsetting.deposit_money)
    }, [projectsetting.deposit_money])

    const handleTest = () => {
        console.log(projectsetting);
    }

    return (
        <div>
            <div className="bg-white">
                <div className="bg-[#1D5182] w-full h-[120px] flex items-center">
                    <label className="text-3xl text-white px-32">2. ตั้งค่าโครงการ</label>
                </div>

                <div className="px-[8rem] py-12 rounded-2xl">
                    <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                        <div className="bg-white drop-shadow-lg rounded-lg border m-10">
                            <div className="px-32 py-14 flex flex-col gap-4">
                                <label className="basis-1/2 text-2xl text-gray-700 mb-4">1) กำหนดระยะรับสมัคร</label>
                                <div className="grid grid-cols-12 items-center">
                                    <p className="col-start-1 text-xl text-end text-gray-500 mr-3">เริ่มต้น</p>
                                    <input placeholder="เริ่มต้น" className="col-start-2 col-end-5 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                                        id="State-date"
                                        type="date"
                                        pattern="dd-mm-yyyy"
                                        name='datetime_start'
                                        onChange={handleOnChange}
                                        value={projectsetting.datetime_start}
                                        disabled={isInputDisabled}
                                    ></input>
                                    <p className="col-start-5 text-xl text-end text-gray-500 mr-3">สิ้นสุด</p>
                                    <input placeholder="สิ้นสุด" className="col-start-6 col-end-9 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                                        id="end-date"
                                        type="date"
                                        pattern="dd-mm-yyyy"
                                        name='datetime_end'
                                        onChange={handleOnChange}
                                        value={projectsetting.datetime_end}
                                        disabled={isInputDisabled}></input>
                                    <p className="col-start-9 col-end-11 text-xl text-end text-gray-500 mr-3">เวลาปิดรับสมัคร</p>
                                    <input pattern="hh:mm" placeholder="เวลา" className="col-start-11 col-end-13 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                                        id="closing-time"
                                        type="time"
                                        name='time_end'
                                        onChange={handleOnChange}
                                        value={projectsetting.time_end}
                                        disabled={isInputDisabled}></input>
                                </div>
                                <div>
                                    <p className="basis-1/2 text-2xl text-gray-700 mb-4">2) เงินประกันซอง</p>
                                    <div className="grid grid-cols-12 items-center">
                                        <CurrencyInput placeholder="เงินประกันซอง" className="col-start-1 col-end-4 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                                            id="security-money"
                                            type="text"
                                            name="deposit_money"
                                            decimalsLimit={10}
                                            onChange={handleOnChangeDepositMoney}
                                            value={projectsetting.deposit_money}
                                            disabled={isInputDisabled}></CurrencyInput>
                                        <p className="col-start-4 text-2xl text-end text-gray-500 ">บาท</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="basis-1/2 text-2xl text-gray-700 mb-4">3) ผู้อนุมัติหนังสือเชิญ</p>
                                    <div className="grid grid-cols-12">
                                        <AsyncSelect
                                            className='col-start-1 col-end-12 rounded-full border'
                                            classNames={{
                                                control: () => "col-start-1 col-end-1  border border-[#CCCCCC] p-2 pl-6 text-xl"
                                            }}
                                            loadOptions={loadOption}
                                            defaultOptions={
                                                [
                                                    {
                                                        label: "กรุณาพิมพ์อย่างน้อย 1 ตัวอักษร",
                                                        value: "DEFAULT",
                                                        isDisabled: true,
                                                    }
                                                ]
                                            }
                                            isDisabled={isInputDisabled}
                                            onChange={(option) => handleDropDownChange(
                                                option, "approver"
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-[#2B2A2A] w-full h-[120px] flex items-center">
                <label className="text-3xl text-white px-32">3. รายละเอียดเพิ่มเติมและไฟล์แนบในหนังสือเชิญ</label>
            </div>

            <div className="px-[8rem] py-12 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-32 py-14 flex flex-col gap-5">
                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700 mb-4">1) กำหนดวันรับฟังคำชี้แจง</p>
                            <div className="grid grid-cols-12 items-center">
                                <p className="col-start-1 text-xl text-center text-gray-500">วันที่</p>
                                <input placeholder="เริ่มต้น" className="col-start-2 col-end-5 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                                    id="State-date"
                                    type="date"
                                    pattern="dd-mm-yyyy"
                                    name='date_details'
                                    onChange={handleOnChange}
                                    value={projectsetting.date_details}
                                    disabled={isInputDisabled}></input>

                                <p className="col-start-5 text-xl text-center text-gray-500 ml-6">เวลา</p>
                                <input pattern="hh:mm" placeholder="เวลา" className="col-start-6 col-end-9 border border-[#CCCCCC] rounded-full p-2.5 text-xl text-center"
                                    id="closing-time"
                                    type="time"
                                    name='time_details'
                                    onChange={handleOnChange}
                                    value={projectsetting.time_details}
                                    disabled={isInputDisabled}></input>
                            </div>
                        </div>
                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700 mb-4">2) ผู้ประสานงานโครงการ </p>
                            <div className="grid grid-cols-12">
                                <AsyncSelect
                                    className='col-start-1 col-end-12 rounded-full border'
                                    classNames={{
                                        control: () => "col-start-1 col-end-1  border border-[#CCCCCC] p-2 pl-6 text-xl"
                                    }}
                                    loadOptions={loadOptionp}
                                    defaultOptions={
                                        [
                                            {
                                                label: "กรุณาพิมพ์อย่างน้อย 1 ตัวอักษร",
                                                value: "DEFAULT",
                                                isDisabled: true,
                                            }
                                        ]
                                    }
                                    isDisabled={isInputDisabled}
                                    onChange={(option) => handleDropDownChange(
                                        option, "coordinator"
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700 mb-4">3) โปรดแนบเงื่อนไขการประกวดราคา หรือ เอกสารที่เกี่ยวข้องอื่นๆ</p>
                            <input
                                className="border border-[#CCCCCC] rounded w-[600px] py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline"
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                placeholder=""
                                name="addiFile"
                                accept="application/pdf"
                                required
                                disabled={isInputDisabled}
                            />
                            <button className="ml-5 py-2.5 px-5 mt-2 border rounded-xl bg-red-500 text-white text-lg "
                            onClick={handleCheckButtonClick}
                            disabled={isInputDisabled}
                            >ตรวจสอบ</button>
                        </div>
                    </div>
                </div>
            </div>


            {showSummary ? (
                <div className="flex justify-center items-center mb-12">

                    <button
                        className="justify-center rounded-lg px-10 py-4 bg-[#559744] hover:bg-[#4b853c] text-white text-3xl font-bold"
                        onClick={handleSummaryClick}
                    >
                        สรุปข้อมูล
                    </button>
                </div>
            ) : (
                <div className='flex flex-row gap-28 justify-center items-center mb-12'>
                    <button
                        className="justify-center rounded-lg px-10 py-4 bg-[#559744] hover:bg-[#4b853c] text-white text-3xl font-bold"
                        onClick={handleSaveClick}
                    >
                        บันทึก
                    </button>
                    <button
                        className="justify-center rounded-lg px-10 py-4 bg-[#D9C304] hover:bg-[#c3af03] text-white text-3xl font-bold"
                        onClick={handleEditClick}
                    >
                        แก้ไข
                    </button>
                </div>
            )}
            <div>
                {showDetails == true && <AdditionalDetails />}
            </div>
        </div>
    )


}


