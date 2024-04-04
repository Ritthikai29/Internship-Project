import { useEffect, useRef, useState } from "react"
import { BudgetInterface, VerifyReason } from "../../../models/Budget/Verify/IVerify"
import { ResProjectInterface } from "../../../models/Project/IProject"
import { GetVerifyProject, GetVerifyReason, Verify2Submit, VerifySubmit , GetUnitOfProject } from "../../../services/BudgetService/VerifyService";
import CurrencyInput from "react-currency-input-field";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { BsDownload } from "react-icons/bs";
import LogComponent from "../LogCalculate/LogComponent";
import { showFileOnClick , datetimeFormatter } from "../../../services/utilitity";
import AsyncSelect from "react-select/async";

export default function Verify2Component(
    { budgetCalculate, projectKey }: { budgetCalculate: BudgetInterface, projectKey: string }
) {

    const MySwal = withReactContent(Swal);



    const [project, setProject] = useState<ResProjectInterface>();
    const [isHaveSubPrice, setIsHaveSubPrice] = useState<boolean>();

    const reasonRef = useRef<HTMLSelectElement>(null)
    const commentRef = useRef<HTMLTextAreaElement>(null)

    // reason of the project
    const [listReason, setListReason] = useState<VerifyReason[]>([])

    const [selectedUnit, setSelectedUnit] = useState<any>();

    const getUnitProject = async () => {
        const res = await GetUnitOfProject(projectKey);
        setSelectedUnit(res.data)
    }

    const getVerifyProject = async () => {
        let res = await GetVerifyProject(projectKey, true);
        setProject(res.data)
    }

    const getReason = async () => {
        let res = await GetVerifyReason();
        setListReason(res.data)
    }

    const CheckIsHaveSubBudget = () => {
        if (
            budgetCalculate.sub_budgets !== undefined ||
            budgetCalculate.sub_budgets
        ) {
            setIsHaveSubPrice(true);
        }
    }

    const handleOnApproveSubmit = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();
        await MySwal.fire(
            {
                title: "ดำเนินการอนุมัติ",
                html: (
                    <div className="p-2">
                        <p className="text-2xl">หากทำการอนุมัติแล้ว จะไม่สามารถแก้ไขได้</p>
                    </div>
                ),
                icon: "question",
                showConfirmButton: true,
                confirmButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>),
                confirmButtonColor: "#EB455F",
                cancelButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>),
                showCancelButton: true,
                preConfirm: async () => {
                    let res = await Verify2Submit(
                        {
                            is_verify_2: true,
                            project_key: projectKey
                        }
                    )
                    console.log(res)
                    return res
                },
            }
        ).then(async (data) => {
            if (data.isConfirmed) {
                if (data.value.status === 200) {
                    await MySwal.fire({
                        title: (<h1 className="text-4xl text-[#4BAE4F]">ดำเนินการสำเร็จ!</h1>),
                        icon: "success",
                        confirmButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>),
                        confirmButtonColor: "#2B3467",
                    }).then(
                        () => {
                            window.location.href = import.meta.env.BASE_URL
                        }
                    )
                } else {
                    await MySwal.fire({
                        icon: "error",
                        title: "ดำเนินการไม่สำเร็จ"
                    })
                }
            }
        })
    }

    const handleOnRejectSubmit = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        // console.log(listReason)
        await MySwal.fire(
            {
                title: "ดำเนินการปฏิเสธ",
                html: (
                    <div>
                       <select
                            className="border rounded w-full py-2 px-3 text-2xl focus:shadow-outline"
                            name="reason_id"
                            ref={reasonRef}
                        >
                            <option
                                // key={0}
                                value={0}
                                disabled
                                selected
                                hidden
                                className="text-gray-700 text-xl"

                            >
                                เหตุผลการปฏิเสธ
                            </option>
                            {
                                listReason.map(data => (
                                    <option
                                        
                                        key={data.id}
                                        value={data.id}
                                        className="text-xl"
                                    >
                                        {data.reason_t}
                                    </option>
                                ))
                            }
                        </select>
                        <textarea
                            name="comment"
                            ref={commentRef}
                            className="border rounded w-full py-2 px-3 text-gray-700 text-2xl focus:shadow-outline mt-2"
                            placeholder="เนื้อหาเพิ่มเติม"
                        />
                    </div>
                ),
                icon: "warning",
                showConfirmButton: true,
                confirmButtonColor: "#EB455F",
                confirmButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>),
                showCancelButton: true,
                cancelButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>),
                preConfirm: async () => {
                    let prepare = {
                        reason_2_id: Number(reasonRef.current?.value),
                        comment_2: commentRef.current?.value,
                        is_verify_2: false,
                        project_key: projectKey
                    }
                   
                    let res = await Verify2Submit(prepare);
                    console.log(res)

                    return res
                }
            }
        ).then(
            (event) => {
                if (event.isConfirmed) {
                    if (event.value.status === 200) {
                        MySwal.fire(
                            {
                                title: (<h1 className="text-4xl text-[#4BAE4F]">ดำเนินการสำเร็จ!</h1>),
                                icon: "success",
                                confirmButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>),
                                confirmButtonColor: "#2B3467",
                            }
                        ).then(
                            () => {
                               window.location.href = import.meta.env.BASE_URL
                            }
                        )
                    } else {
                        MySwal.fire(
                            {
                                title: "ดำเนินการไม่สำเร็จ",
                                text: ` ${event.value.err}`,
                                icon: "error"
                            }
                        )
                    }
                }
            }
        )
    }

    useEffect(() => {
        getVerifyProject()
        CheckIsHaveSubBudget()
        getReason()
        getUnitProject()
        MySwal.fire({
            title: 'กำลังดาวน์โหลด',
            html: '<p>โปรดรอสักครู่ ...</p>',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: () => {
              MySwal.showLoading(); // Show the loading spinner
            },
            willClose: () => {
              MySwal.hideLoading(); // Hide the loading spinner
            },
          });

        setTimeout(() => {
            MySwal.close()
        }, 3000)
    }, []);
    return (
        <div className="bg-[#FAFAFA] my-12">
            <div className="flex flex-col justify-center  my-[6rem]  mx-auto w-5/6"> {/* container */}
                <div className="bg-white drop-shadow-lg rounded-xl border w-full mb-5 mt-24 mr-5">
                    <div className="px-12 py-12">
                        <h1 className="text-5xl text-[#2B3467] font-bold mb-4">{project?.name}</h1>
                        <hr className="" />
                        <div className=" md:grid-cols-2 mb-6 ml-6">
                        <div className="mt-3 grid grid-cols-11">
                    <label className="text-2xl font-bold col-span-2">
                      <p>เลขที่เอกสาร</p>
                    </label>
                    <label className="text-2xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-2xl col-span-7 pr-5">
                      <p className="inline"> 
                      {project?.key}
                      </p>
                    </label>
                  </div>
                  <div className="mt-3 grid grid-cols-11">
                    <label className="text-2xl font-bold col-span-2">
                      <p>สถานะ</p>
                    </label>
                    <label className="text-2xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-2xl col-span-7 pr-5">
                      <p className="inline"> 
                      {project?.status.status_name}
                      </p>
                    </label>
                  </div>
                  <div className="mt-3 grid grid-cols-11">
                    <label className="text-2xl font-bold col-span-2">
                      <p>วันที่เพิ่ม</p>
                    </label>
                    <label className="text-2xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-2xl col-span-7 pr-5">
                      <p className="inline"> 
                      {datetimeFormatter(project?.add_datetime || "")}
                      </p>
                    </label>
                  </div>
                        </div>

                        <div className="flex flex-col ml-6">
                            <h3 className="text-3xl text-[#575757] font-bold">ดาวน์โหลดเอกสาร</h3>
                            <div className="flex justify-start gap-5 mt-5">
                                <div>
                                    <button
                                        className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-3xl text-2xl px-2 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                                        onClick={() => {
                                            showFileOnClick(project?.Tor_uri || "")
                                        }}>
                                        <BsDownload className="text-2xl w-5 h-5 mr-2" />
                                        TOR
                                    </button>
                                    <button
                                        className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-3xl text-2xl px-6 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                                        onClick={() => {
                                            showFileOnClick(project?.Job_description_uri || "")
                                        }}>
                                        <BsDownload className="text-2xl w-5 h-5 mr-2" />
                                        ใบแจ้งงาน
                                    </button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-12 py-12">
                        <h1 className="text-3xl font-bold mb-4 text-[#2B3467]">สรุปราคากลาง</h1>
                        <div className="flex flex-col">
                            <div className="ml-4 mt-3 mb-5 flex flex-col">
                                <label className="text-2xl mb-4 ">1. ไฟล์แนบ PDF ที่ผ่านคำนวนมา <span className="text-xl text-[#FF0000]" >(โปรดเก็บเป็นความลับและห้ามพิมพ์ออกมาเด็ดขาด)</span></label> {/* to show a tag of input */}
                                <div className="grid grid-cols-12">
                                    <div className="
                                ml-2 flex col-start-1 col-end-7 
                                border rounded-md
                                bg-neutral-100 input-disable">
                                        {/* <div className="bg-neutral-300 p-2.5 px-6 text-lg">เลือกไฟล์</div> */}
                                        <div className="p-3 text-xl">{(budgetCalculate.calculate_file.split('/'))[(budgetCalculate.calculate_file.split('/')).length-1]}</div>
                                    </div>
                                    <div className="col-start-7 col-end-9 flex flex-row justify-center">
                                        <button
                                            className="border p-2 bg-[#EB455F] text-white text-lg rounded-lg"
                                            onClick={() => {
                                                showFileOnClick(budgetCalculate.calculate_file)
                                            }}
                                        >ตรวจสอบไฟล์</button>
                                    </div>
                                </div>

                            </div>
                            <div className="ml-4 mt-3 mb-5 flex flex-col">
                                <label className="text-2xl mb-4">2.ราคากลางสุทธิ(รวม)</label>
                                <div className="flex w-3/5 text-center">
                                <CurrencyInput
                                    name="budget"
                                    type="text"
                                    className="ml-2 p-2.5 px-4 border text-2xl text-center rounded-lg w-3/4 md:w-1/2"
                                    value={parseFloat(budgetCalculate.Budget).toFixed(2)}
                                    disabled
                                />
                                <input
                                placeholder="หน่วยอื่นๆ"
                                className="border rounded w-1/3 h-15 mx-4 px-4 text-black text-2xl focus:shadow-outline text-center"
                                id="unit-price"
                                name="unit-price"
                                type="text"
                                defaultValue={selectedUnit?.label == "อื่นๆ" ? selectedUnit?.value : selectedUnit?.value}
                                // hidden={selectedUnit == undefined || selectedUnit.label !== "อื่นๆ"}
                                disabled
                                ></input>
                                </div>
                            </div>
                            <div className="ml-2 mt-3 flex flex-col">
                                <label className="text-2xl mb-3">3.ราคากลางย่อยที่ต้องใช้กำหนดเปรียบเทียบในการประกวดราคา</label>
                                <div className="ml-2">
                                    <input
                                        id="have-subPrice"
                                        name="isHaveSubPrice"
                                        className="inline-block w-4 h-4"
                                        type="radio"
                                        onClick={() => {
                                            setIsHaveSubPrice(true)
                                        }}
                                        checked={budgetCalculate.sub_budgets !== undefined ? true : false}
                                        disabled />
                                    <label htmlFor="have-subPrice" className="pl-2 text-2xl">มีราคากลางย่อย</label>
                                    <input
                                        id="havent-subPrice"
                                        name="isHaveSubPrice"
                                        type="radio"
                                        className="ml-3 w-4 h-4"
                                        onClick={() => {
                                            setIsHaveSubPrice(false)
                                        }}
                                        checked={budgetCalculate.sub_budgets !== undefined ? false : true}
                                        disabled />
                                    <label htmlFor="havent-subPrice" className="pl-2 text-2xl">ไม่มีราคากลางย่อย</label>
                                </div>

                                {/* add a sub Price location */}
                                <div className={`${isHaveSubPrice ? "" : "hidden"} `}>
                                    <div className="border mt-10">
                                        <table className="min-w-full rounded-lg overflow-auto">
                                            <thead className="text-white bg-[#2B2A2A] rounded-lg h-14">
                                                <tr className="text-2xl">
                                                <th scope="col" className="rounded-tl-lg px-6 py-3 text-center leading-4 uppercase tracking-wider w-[100px] ">
                                                        ลำดับ
                                                    </th>
                                                    <th scope="col" className=" px-6 py-3 text-center leading-4 uppercase tracking-wider w-3/5">
                                                        รายละเอียด
                                                    </th>
                                                    <th scope="col" className=" px-3 py-3 text-center leading-4 uppercase tracking-wider w-1/5">
                                                        ราคา
                                                    </th>
                                                    <th scope="col" className="  py-3 text-center mx-auto rounded-tr-lg w-1/5">
                                                        หน่วย
                                                    </th>
                                                   

                                                </tr>
                                            </thead>

                                            {/* Body */}
                                            <tbody>

                                                {
                                                    budgetCalculate.sub_budgets !== undefined && (
                                                        budgetCalculate.sub_budgets.map((sub, index: number) => (
                                                            <tr key={index} className="rounded-lg border-b pt-5"
                                                            style={{ verticalAlign: "top" }}>
                                                                <td className="px-6 py-4 whitespace-no-wrap text-center text-xl ">{index + 1}</td>
                                                                <td className="pl-6 py-4 pr-3  whitespace-no-wrap text-center">
                                                                <textarea
                                                                    value={sub.name}
                                                                    name="detail_price"
                                                                    className="border px-6 p-2.5 w-full rounded-lg text-xl text-left resize-none"
                                                                    disabled
                                                                />
                                                                </td>
                                                                <td className="p-3 py-4 whitespace-no-wrap text-center">
                                                                    <CurrencyInput
                                                                        value={Number(sub.price).toFixed(2)}
                                                                        className="border  p-2 text-xl rounded-lg text-center"
                                                                        name="price"
                                                                        disabled
                                                                    />
                                                                </td>
                                                                
                                                                <td className="text-xl text-center py-2">
                                                                <input
                                                                    placeholder="หน่วยอื่นๆ"
                                                                    className="border  p-2 text-xl rounded-lg text-center m-2"
                                                                    id="unit-price"
                                                                    name="unit-price"
                                                                    type="text"
                                                                    defaultValue={selectedUnit?.label == "อื่นๆ" ? selectedUnit?.value : selectedUnit?.value}
                                                                    // hidden={selectedUnit == undefined || selectedUnit.label !== "อื่นๆ"}
                                                                    disabled
                                                                    ></input>
                                                                
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )
                                                }
                                                 <tr className="bg-[#f5f5f5]  text-black  ">
                                                    <th className="rounded-bl-lg "></th>
                                                    <th className="text-2xl">รวมราคากลางสุทธิ</th>
                                                    <th>
                                                    <CurrencyInput
                                                                name="budget"
                                                                type="text"
                                                                className="border  p-2 text-xl rounded-lg text-center"
                                                                value={parseFloat(budgetCalculate.Budget).toFixed(2)}
                                                                disabled
                                                            />
                                                    </th>
                                                        <th className="text-lg text-center w-[150px] py-4">
                                                        <input
                                                            placeholder="หน่วยอื่นๆ"
                                                            className="border  p-2 text-xl rounded-lg text-center m-2"
                                                            id="unit-price"
                                                            name="unit-price"
                                                            type="text"
                                                            defaultValue={selectedUnit?.label == "อื่นๆ" ? selectedUnit?.value : selectedUnit?.value}
                                                            // hidden={selectedUnit == undefined || selectedUnit.label !== "อื่นๆ"}
                                                            disabled
                                                            ></input>
                                                        </th>
                                                    </tr>
                                            </tbody>
                                        </table>


                                    </div>

                                </div>

                                {/* Submit Button */}

                                <div className="flex justify-around mt-10 mx-40">
                                    {
                                        (
                                            <>
                                                <button
                                                    className="p-3 bg-[#559744] text-white text-3xl rounded-lg px-12"
                                                    onClick={handleOnApproveSubmit}
                                                >เสนออนุมัติ</button>
                                                <button
                                                    className="p-3 bg-[#D9C304] text-white text-3xl border rounded-lg px-12"
                                                    onClick={handleOnRejectSubmit}
                                                >แจ้งแก้ไข</button>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <LogComponent />
            </div>
        </div>
    )
}
