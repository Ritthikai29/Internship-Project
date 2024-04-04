import { useEffect, useRef, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { ReqRejectApprove2Interface, ResLatestBudgetApprove1, ResLatestBudgetCalculate } from '../../../models/Budget/Approve2/IApprove2';
import { Approve2ApproveByProjectKey, GetLatestApprove1ByProjectKey, GetLatestBudgetCalculate, ListRejectReason, RejectApprove2ByProjectKey , GetUnitOfProject } from '../../../services/BudgetService/ApproveService';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { RejectReasonInterface } from '../../../models/Budget/Approve1/IApprove';

export default function CreateApprove2Component() {


    const MySwal = withReactContent(Swal)
    const queryParameters = new URLSearchParams(window.location.search);
    /**
     * get a latest approve1 budget from approve budget table 
     */
    const [latestApprove1, setLatestApprove1] = useState<ResLatestBudgetApprove1>();
    const [latestBudget, setLatestBudget] = useState<ResLatestBudgetCalculate>();

    const [listRejects, setListRejects] = useState<RejectReasonInterface[]>([]);


    const rejectSelectionRef = useRef<HTMLSelectElement>(null)
    const rejectDetailInputRef = useRef<HTMLTextAreaElement>(null)

    const [selectedUnit, setSelectedUnit] = useState<any>();

    const getUnitProject = async () => {
        const res = await GetUnitOfProject(queryParameters.get("pj") || "");
        setSelectedUnit(res.data)
    }

    const getLatestApproveByProjectKey = async () => {
        let res = await GetLatestApprove1ByProjectKey(queryParameters.get("pj") || "");
        if (res.status !== 200) {
            // Alert popup

            return;
        }
        setLatestApprove1(res.data);
    }
    console.log(latestBudget)
    console.log(latestBudget?.new_price)
    console.log(latestBudget?.sub_price)
    const getRejectReason = async () => {
        let res = await ListRejectReason();
        setListRejects(res.data);
    }
    // เพื่อดึงข้อมูลการคำนวณครั้งล่าสุดของผู้คำนวณ
    const getLatestBudgetCalculate = async () => {
        let res = await GetLatestBudgetCalculate(queryParameters.get("pj") || "");
        if (res.status !== 200) {
            // Alert;
            return;
        }
        console.log(res.data) 
        setLatestBudget(res.data)
        console.log(res.data.new_price)
        let responseTotal = 0;
        let responseEditTotal = 0;
        res.data.sub_price.forEach((item: any) => {
            responseTotal += parseFloat(item.price)
            if (item.price) {
                responseEditTotal += parseFloat(item.price)
            }
        })
        console.log( responseEditTotal)
        console.log(res.data) 
        setLatestBudget(res.data)
        console.log(res.data.new_price)
        if(res.data.new_price !== null && res.data.new_price >= 0 && responseEditTotal != 0){
            
            console.log(res)
            setLatestBudget(prevState => ({
                ...prevState!,
                price: responseEditTotal,
            }));
        }
    }

    useEffect(() => {
        getLatestApproveByProjectKey()
        getLatestBudgetCalculate()
        getRejectReason()
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

    const handleTest = () => {
        console.log(latestApprove1?.sub_prices.length !== 0)
    }
    const showFileOnClick = (filePath: string) => {
        window.open((import.meta.env.DEV ? import.meta.env.VITE_URL_DEV : import.meta.env.VITE_URL_PRODUCTION) + filePath);
    }

    const rejectSubmitButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        MySwal.fire(
            {
                title: <p className='text-4xl font-bold text-[#293161]'>กรุณากรอกข้อมูล <br /> เพื่อยืนยันการปฏิเสธ</p>,
                icon: "question",
                html: (
                    <div className='flex flex-col'>
                        <select
                            className='border rounded w-full py-2.5 px-3 text-xl focus:shadow-outline'
                            ref={rejectSelectionRef}
                        >
                            <option
                                className='text-gray-500 text-xl'
                                selected
                                value={0}
                                disabled
                                hidden
                                >
                                เลือกเหตุผลการปฏิเสธ
                            </option>
                            {
                                listRejects.map((data) => (
                                    <option value={data.id} key={data.id}>
                                        {data.reason_t}
                                    </option>
                                ))
                            }
                        </select>
                        <label className='px-2 py-3 text-2xl text-start'>ข้อมูลเพิ่มเติม</label>
                        <textarea
                            className='border px-2 py-2 text-xl'
                            placeholder='ข้อมูลเพิ่มเติม'
                            ref={rejectDetailInputRef}
                        />
                    </div>
                ),
                confirmButtonText: (<p className='text-3xl px-5 py-2 w-[150px]'>ยืนยัน</p>),
                confirmButtonColor: "#EB455F",
                cancelButtonText: (<p className='text-3xl px-5 py-2 w-[150px]'>ปิด</p>),
                showCancelButton: true,
                preConfirm: async () => {
                    if (
                        rejectSelectionRef.current?.value === '0' ||
                        rejectDetailInputRef.current?.value === ""
                    ) {
                        MySwal.showValidationMessage("Not typing and select")
                        return;
                    }
                    let data: ReqRejectApprove2Interface = {
                        project_key: queryParameters.get("pj") || "",
                        reason_id: Number(rejectSelectionRef.current?.value) || 0,
                        comment: rejectDetailInputRef.current?.value || ""
                    }
                    let res = await RejectApprove2ByProjectKey(data);

                    if (res.status !== 200) {
                        MySwal.showValidationMessage("someting is error" + res.err)
                        return;
                    }

                    return res.data
                }
            }
        ).then((response) => {
            if (response.isConfirmed) {
                MySwal.fire(
                    {
                        title: (<h3 className='text-[#4BAE4F] text-4xl'>ดำเนินการสำเร็จ!</h3>),
                        icon: "success",
                        confirmButtonColor: "#2B3467",
                        confirmButtonText: (<p className='text-3xl px-5 py-2 w-[150px]'>ตกลง</p>)
                    }
                ).then(() => {
                    window.location.href = import.meta.env.BASE_URL
                })
            }
        })
    }

    const submitApproveButton = async () => {
        MySwal.fire(
            {
                title: (<h3 className='text-4xl font-bold text-[#2B3467]'>ยืนยันการอนุมัติ</h3>),
                icon: "question",
                html: (<p className='text-[#188493]'>**เมื่อกดปุ่มนี้ ระบบจะส่งข้อมูลไปยังหน่วยงานจ้างเหมาเพื่อตรวจสอบเอกสารและเปิดโครงการต่อไป</p>),
                confirmButtonText: (<p className='text-3xl px-5 py-2 w-[150px]'>ยืนยัน</p>),
                confirmButtonColor: "#EB455F",
                cancelButtonText: (<p className='text-3xl px-5 py-2 w-[150px]'>ยกเลิก</p>),
                showCancelButton: true,
                preConfirm: async () => {
                    let projectKey = queryParameters.get("pj") || "";
                    let res = await Approve2ApproveByProjectKey(projectKey);
                    if (res.status !== 200) {
                        MySwal.showValidationMessage(res.err)
                    }
                    return res.data
                }
            }
        ).then((response) => {
            if (response.isConfirmed) {
                MySwal.fire(
                    {
                        title: (<h3 className='text-[#4BAE4F] text-2xl'>ดำเนินการสำเร็จ</h3>),
                        icon: "success",
                        confirmButtonColor: "#2B3467",
                        confirmButtonText: (<p className='text-3xl px-5 py-2 w-[150px]'>ตกลง</p>)
                    }
                ).then(() => {
                    window.location.href = import.meta.env.BASE_URL
                })
            }
        })
    }

    return (
        <div>
            {/* Component to show a history and selsct to <br />
            1. approve <br />
            2. edit <br />
            3. reject */}

            <div className='flex flex-col border px-12 py-12 my-5 rounded-2xl bg-white drop-shadow-lg'>
                <h1 className='text-4xl font-bold mb-4 text-[#2B3467]'>สรุปข้อมูลราคากลาง</h1>
                <div className='flex flex-col'>
                    <div className='ml-4 mt-3 mb-5 flex flex-col'>
                        <label className="text-2xl mb-4">1.  ไฟล์แนบ PDF ที่ผ่านคำนวนมา  <span className='text-red-500 text-xl'>(โปรดเก็บเป็นความลับและห้ามพิมพ์ออกมาเด็ดขาด)</span></label>
                        <div className='grid grid-cols-12 '>
                            <div className="
                                flex col-start-1 col-end-13 md:col-end-7
                                border rounded-md
                                input-disable
                                ">
                                <div className="text-xl p-2.5 md:p-2.5">{(latestBudget?.calculate_file?.split('/')[latestBudget?.calculate_file?.split('/').length-1])}</div>
                            </div>
                            <div className="col-start-7 col-end-9 flex flex-row justify-center">
                                <button
                                    className="border p-2 bg-[#EB455F] text-white text-lg rounded-lg"
                                    onClick={() => {
                                        showFileOnClick(latestBudget?.calculate_file || "")
                                    }}
                                >ตรวจสอบไฟล์
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className='ml-4 mt-3 mb-5 grid grid-cols-12'>
                        <div className='col-start-1 col-end-8'>
                            <label className='text-2xl'>2. ราคากลางสุทธิ(รวม)</label>
                            <div className=' flex w-3/4'>
                            <CurrencyInput
                                
                                name='budget'
                                className='
                                    mt-3 py-2.5 px-4 border rounded-lg w-5/6 col-start-1 col-end-7 text-2xl text-center m-2
                                    '
                                value={parseFloat(latestBudget?.price as string).toFixed(2)}
                               
                                
                                disabled={true}
                            />
                             <input
                                placeholder="หน่วยอื่นๆ"
                                className='static mt-3 py-2.5 px-4  border text-xl rounded-lg  text-center m-2 w-5/6
                            disabled:bg-[#D4D4D4]'id="unit-price"
                                name="unit-price"
                                type="text"
                                defaultValue={selectedUnit?.label == "อื่นๆ" ? selectedUnit?.value : selectedUnit?.value}
                                // hidden={selectedUnit == undefined || selectedUnit.label !== "อื่นๆ"}
                                disabled
                                ></input>
                                </div>
                        </div>
                        {
                            latestBudget?.new_price &&
                            <div className='text-center col-start-8 col-end-13 confirm-input'>
                                <h5 className='text-[#FF0000] text-2xl'>
                                    ราคากลางสุทธิ (ผู้อนุมัติ 1 แก้ไข)
                                </h5>
                                <div className='flex'>
                                <CurrencyInput
                                    name='budget'
                                    className='
                                    mt-3 p-2.5 px-4 border rounded-lg w-6/12 text-2xl text-center mr-2
                                    '
                                    value={
                                        parseFloat(latestBudget?.new_price as string).toFixed(2)
                                    }
                                    disabled
                                    style={{ cursor: 'not-allowed', backgroundColor: '#fBEDBE',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                                />
                               <input
                                    name='unit'
                                    className='mt-3 p-2.5 px-4 border rounded-lg w-5/12 text-2xl text-center'
                                    value={selectedUnit && selectedUnit.value !== undefined ? selectedUnit.value : ''}
                                    disabled
                                    style={{ cursor: 'not-allowed', backgroundColor: '#fBEDBE', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                                />
                                </div>
                            </div>}

                    </div>

                    <div className='ml-4 mb-5 mt-3 flex flex-col'>
                        <label className='text-2xl mb-3'>3. ราคากลางย่อยที่ต้องใช้กำหนดเปรียบเทียบในการประกวดราคา </label>

                        <div className={`ml-2 `}> {/** this session show if approve 1 is not edit  */}
                            <input
                                id="have-subPrice"
                                name='isHaveSubPrice'
                                className='mr-3 w-4 h-4'
                                type='radio'
                                checked={latestBudget?.sub_price === undefined ? false : latestBudget.sub_price.length !== 0}
                                disabled
                            />
                            <label htmlFor="have-subPrice" className='text-2xl'>มีราคากลางย่อย</label>
                            <input
                                id="havent-subPrice"
                                name="isHaveSubPrice"
                                type="radio"
                                className="mx-3 w-4 h-4"
                                checked={latestBudget?.sub_price === undefined ? false : latestBudget.sub_price.length === 0}
                                disabled
                            />
                            <label htmlFor="havent-subPrice" className="text-2xl">ไม่มีราคากลางย่อย</label>
                        </div>


                    </div>
                    <div className={`${latestBudget?.sub_price?.length != 0 ? "" : "hidden"}`}>
                    <table className='table-fixed mx-auto w-full '>
                        <thead className='bg-[#2B2A2A] '>
                            <tr style={{ verticalAlign: "top" }} >
                                <th className='py-4 text-2xl text-white text-center rounded-tl-lg w-[100px]'>
                                    ลำดับ
                                </th>
                                <th className='py-4 text-2xl text-white text-center'>
                                    รายละเอียด
                                </th>
                                <th className='py-4 text-2xl  text-white text-center'>
                                    ราคา
                                </th>
                                <th className='py-4 text-xl text-[#FF0000] text-center '>
                                    ราคากลางย่อยที่ผู้อนุมัติ 1 แก้ไข
                                </th>
                                <th className="py-4 text-2xl  text-white text-center rounded-tr-lg " >
                                    หน่วย 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                    latestBudget?.sub_price.map((item, index) => (
                                        <tr className='border bg-[#c8c8c8] '  style={{ verticalAlign: 'top' }}>
                                        <td className='whitespace-no-wrap text-2xl text-center border rounded p-4 focus:outline-none '>
                                        {index + 1}
                                        </td>
                                        <td className='whitespace-no-wrap text-2xl text-left   border rounded p-4 focus:outline-none'>
                                        {item.name}
                                        </td>
                                        <td className='whitespace-no-wrap text-2xl text-center  border rounded p-4 focus:outline-none'>
                                        {(item.price).toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            })}
                                        </td >
                                        <td className=' p-4 text-2xl'>
                                        {latestBudget.new_price ? (
                                            <p className='p-2 border rounded shadow-inner border-[#A6A6A6] drop-shadow-2xl text-center w-5/6 mx-auto'
                                            style={{ cursor: 'not-allowed', backgroundColor: '#fBEDBE' }}>
                                                {item.new_price ? item.new_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                        ) : "ไม่มีการแก้ไข"}
                                        </td>
                                        <td className='whitespace-no-wrap text-2xl text-center  border rounded p-4 focus:outline-none'>
                                        {selectedUnit?.value}
                                        </td>
                            </tr>
                                        
                                    ))
                                    
                                }
                        
                        <tr className='border bg-[#c8c8c8] '  style={{ verticalAlign: 'top' }}>
                                <td className='whitespace-no-wrap text-2xl text-center border rounded p-4 focus:outline-none rounded-bl-lg'>
                                    
                                </td>
                                <td className='whitespace-no-wrap text-2xl text-center  font-extrabold border rounded p-4 focus:outline-none'>
                                รวมมูลค่า
                                </td>
                                <td className='whitespace-no-wrap text-2xl text-center font-extrabold border rounded p-4 focus:outline-none'>
                                {
                                        latestBudget?.sub_price.reduce((prev, curr) => {
                                            return prev + parseFloat(curr.price as string)
                                        }, 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        })
                                    }
                                 
                                </td >
                                <td className=' p-4 text-2xl font-extrabold'>
                                {
                                                latestBudget?.new_price &&
                                                <p className='p-2 border rounded shadow-inner border-[#A6A6A6] drop-shadow-2xl text-center w-5/6 mx-auto'
                                                style={{ cursor: 'not-allowed', backgroundColor: '#fBEDBE' }}>
                                                    {latestBudget?.new_price.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2
                                                })}
                                                </p>
                                            }
                                </td>
                              
                                <td className='whitespace-no-wrap text-2xl text-center font-extrabold border rounded p-4 focus:outline-none'>
                                {selectedUnit?.value}     
                                </td>
                            </tr>    

                        </tbody>
                    </table>
                    </div>

                  
                </div>

                <div className='flex justify-around mt-8'>
                    <button
                        className='p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#2B3467]'
                        onClick={submitApproveButton}
                    >
                        อนุมัติ
                    </button>
                    <button
                        className='p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#D90404]'
                        onClick={rejectSubmitButton}
                    >
                        ปฏิเสธ
                    </button>
                </div>
            </div>
        </div >
    )
}
