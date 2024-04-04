import { useEffect, useRef, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { CreateApproveOfApprove1, GetLatestBudgetCalculate, ListRejectReason, RejectBudgetByApprove1 , GetUnitOfProject } from '../../../services/BudgetService/ApproveService';
import { BudgetApprove1Interface, RejectReasonInterface, RequestEditInterface, RequestRejectInterface, SubBudgetInterface } from '../../../models/Budget/Approve1/IApprove';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';
import LogComponent from '../LogCalculate/LogComponent';
import { GetUnitPrice } from '../../../services/ProjectService/ProjectService';
import AsyncSelect from "react-select/async";
import { UpdateUnitPriceOfProject } from "../../../services/ProjectService/ProjectService";

export default function CreateApprove1Component({
    projectId
} : {
    projectId: string;
}) {
    const queryParameters = new URLSearchParams(window.location.search);
    const showFileOnClick = (filePath: string) => {
        window.open((import.meta.env.DEV ? import.meta.env.VITE_URL_DEV : import.meta.env.VITE_URL_PRODUCTION) + filePath);
    }
    const mySwal = withReactContent(Swal)
    const [budgetCalculate, setBudgetCalculate] = useState<Partial<BudgetApprove1Interface> | undefined>();
      

    const [lockInput, setLockInput] = useState(false);
    const [lockEditInput, setLockEditInput] = useState(false);

    const [total, setTotal] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [editTotal, setEditTotal] = useState(0);
    const [reasons, setReasons] = useState<RejectReasonInterface[]>([]);

    const [success, setSuccess] = useState<boolean>(false);

    const mainRef = useRef<HTMLDivElement>(null)
    const subPriceRef = useRef<HTMLInputElement[]>([]);

    const [reasonEdits, setReasonEdits] = useState<RequestEditInterface>();

    const [selectedUnit, setSelectedUnit] = useState<any>();

    const getPrevUnitProject = async () => {
        const res = await GetUnitOfProject(queryParameters.get("pj") || "");
        setSelectedUnit(res.data)
    }
    let totalValue = 0;

    const loadUnitPrice = async (inputValue: string) => {
        const res = await GetUnitPrice();
        const unitPrice = res.data || [];
        return unitPrice
          .filter((unitPrice: any) =>
            unitPrice.unit_price_name
              .toLowerCase()
              .includes(inputValue.toLowerCase())
          )
          .map((unitPrice: any) => ({
            label: unitPrice.unit_price_name,
            value: unitPrice.unit_price_name,
          }));
      };
    
      const handleUnitPriceChange = async (selectedOption: any) => {
        setSelectedUnit(selectedOption);
        console.log(selectedOption);
      };
    
      const handleMoreUnitPriceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const object = {
          label: "อื่นๆ",
          value: e.target.value,
        };
      
        setSelectedUnit(object);
        console.log(selectedUnit);
      };

    const getBudgetCalculate = async () => {
        let res = await GetLatestBudgetCalculate(queryParameters.get("pj") || "");
        if (res.status !== 200) {
            console.log("Error Budget Calculate")
            return;
        }
        console.log(res.data)
        setBudgetCalculate(res.data)
        let responseTotal = 0;
        let responseEditTotal = 0;
        res.data.sub_price.forEach((item: any) => {
            responseTotal += parseFloat(item.price)
            if (item.new_price) {
                responseEditTotal += parseFloat(item.new_price)
            }
        })
        if (responseTotal == res.data.price || res.data.sub_price.length == 0) {
            setSuccess(true);
        }

        
        console.log(res.data.new_price)
        
        res.data.sub_price.map((value:any, index:any) => {
            // ทำสิ่งที่คุณต้องการด้วย value และ index ที่ได้จาก map
            console.log(value);
            console.log(value.new_price);
            if(value.new_price > 0 && value.new_price !== null){
                setBudgetCalculate(prevState => {
                    if (prevState) {
                        const updatedSubPrice = (prevState.sub_price || []).map((subItem, subIndex) => {
                            if (subIndex === index) {
                                return {
                                    ...subItem,
                                    price: value.new_price
                                };
                            }
                            return subItem;
                        });
                
                        return {
                            ...prevState,
                            sub_price: updatedSubPrice
                        };
                    }
                    return prevState;
                });
            }
            // if(value)
            // หรือในกรณีที่ต้องการเขียนคำสั่งอื่น ๆ ที่ต้องการให้ทำในลูป map
        });
        if(res.data.new_price !== null && res.data.new_price >= 0){
            
            console.log(res)

            setBudgetCalculate(prevState => ({
                ...prevState,
                price: res.data.new_price,
                

              }));
              setBudgetCalculate(prevState => ({
                ...prevState,
                new_price: ''
              }));
        }
        console.log(budgetCalculate)
            
        // if (budgetCalculate && budgetCalculate.new_price !== undefined) {
            
        //     if(typeof budgetCalculate.new_price === 'number' && budgetCalculate.new_price >= 0){
                
            
        //     }
        // }

        console.log(res.data.new_price)
        setEditTotal(responseEditTotal)
        setTotal(responseTotal)
    }

    const approveSubmit = async () => {
        mySwal.fire(
            {
                title: (<h3 className='text-3xl font-bold text-[#293161]'>ยืนยันการอนุมัติ</h3>),
                html: (
                    <div className='p-2'>
                        <p className='text-[#188493] text-lg'>เมื่อกดปุ่มนี้ ระบบจะส่งข้อมูลไปยังผู้อนุมัติที่ 2 หากราคากลางที่กำหนดเกินกว่า 500,000 บาท <br />ท่านสามารถกลับมาแก้ไขได้กรณีมีการปฏิเสธกลับมาเท่านั้น</p>
                    </div>
                ),
                confirmButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>),
                confirmButtonColor: "#EB455F",
                showCancelButton: true,
                cancelButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>),
                preConfirm: async () => {
                    
                    let data = {
                        projectKey: queryParameters.get("pj") || "",
                        price: budgetCalculate?.new_price || budgetCalculate?.price, // if have a new price will send a new price [but if haven't new price will send a old price]
                        isEdit: budgetCalculate?.new_price ? true : false,
                        subPrices: budgetCalculate?.sub_price ,
                        reasonedit: reasonEdits?.reason_id ? reasonEdits : null
                    }
                    if (!budgetCalculate?.new_price && data.subPrices) {
                        let sub = data.subPrices.map((item: any) => ({
                            ...item,
                            new_price: null
                        })) as SubBudgetInterface[]
                        data = {
                            ...data,
                            subPrices: sub
                        }
                    }

                    budgetCalculate?.price == budgetCalculate?.new_price
                    console.log(data)
                    
                    const res = await CreateApproveOfApprove1(data);
                    console.log("res -->")
                    console.log(res)
                    const res2 = await UpdateUnitPriceOfProject(projectId as string , selectedUnit.value);
                    
                    if (res.status !== 200) {
                        mySwal.showValidationMessage(res.err)
                    } else if (res2.status !== 200){
                        mySwal.showValidationMessage(res2.err)
                    }
                    return res.data

                }
            }
        )
        .then((response) => {
            if (response.isConfirmed) {
                mySwal.fire(
                    {
                        title: (<h1 className="text-4xl text-[#4BAE4F]">บันทึกสำเร็จ!</h1>),
                        icon: "success",
                        confirmButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>),
                        confirmButtonColor: "#2B3467",
                    }
                )
                .then(() => {
                    window.location.href =import.meta.env.BASE_URL
                })
            }
        })
        return;
    }

    const handleChangePrice = (value: string, name: string, values: CurrencyInputOnChangeValues) => {
        console.log(value)
        setBudgetCalculate(
            {
                ...budgetCalculate,
                [name]: value
            }
        )
        console.log(budgetCalculate)
        /**
         * sum of a new price 
         */
        let newTotalPrice = 0;
        console.log(budgetCalculate?.sub_price?.length)
        if(budgetCalculate?.sub_price?.length == 0){
            console.log("อันนี้ไม่มีราคากลางย่อยไม่ต้องทำอะไร")
        }else{
            budgetCalculate?.sub_price?.forEach((item, index) => {
                newTotalPrice += (parseFloat(item.new_price as string) || 0)
            })
            setEditTotal(newTotalPrice)
        }
    }

    const handleChangeSubPrice = (index: number, value: string, name: string, values: CurrencyInputOnChangeValues) => {
        if (budgetCalculate?.sub_price === undefined) return;

        let start = budgetCalculate.sub_price.slice(0, index);
        let end = budgetCalculate.sub_price.slice(index + 1);

        setBudgetCalculate({
            ...budgetCalculate,
            sub_price: [
                ...start as SubBudgetInterface[],
                {
                    ...budgetCalculate.sub_price[index],
                    [name]: value
                },
                ...end as SubBudgetInterface[]
            ]
        })
        let editTotal = 0;
        budgetCalculate.sub_price.forEach((item, indexList) => {
            if (indexList != index) {
                editTotal += parseFloat(item.new_price as string || "0")
            } else {
                editTotal += parseFloat(value || "0")
            }
        })
        setEditTotal(editTotal)
        if (editTotal != budgetCalculate.new_price) {
           // setSuccess(false)
        } else {
          //  setSuccess(true)
        }
    }
    
    const reasonRejectRef = useRef<HTMLSelectElement>(null);
    const commentRejectRef = useRef<HTMLTextAreaElement>(null);

    const editModal = async () => {
        const MySwal = withReactContent(Swal)

        console.log(reasons)
        await MySwal.fire(
            {
                title: (<h1 className='text-4xl font-bold text-[#293161]'>กรุณาระบุเหตุผล</h1>),
                html: (
                    <div className='flex flex-col'>
                        <label className='px-2 py-3 text-2xl'>เหตุผลที่แก้ไข</label>
                        <select
                            className='border rounded w-full py-2 px-3 text-xl focus:shadow-outline'
                            ref={reasonRejectRef}
                        >
                            <option
                                disabled
                                selected
                                value={0}
                                hidden
                            >
                                เลือกเหตุผลที่แก้ไข
                            </option>
                            {
                                reasons.map(
                                    (data) => (
                                        <option
                                            value={data.id}
                                        >
                                            {data.reason_t}
                                        </option>
                                    )
                                )
                            }
                        </select>
                        <label className='px-2 py-3 text-2xl'>ข้อมูลเพิ่มเติม</label>
                        <textarea
                            className='border px-2 py-2'
                            ref={commentRejectRef}
                        />
                    </div>
                ),
                confirmButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>),
                confirmButtonColor: "#EB455F",
                showCancelButton: true,
                cancelButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ยกเลิก</p>),
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    if (
                        reasonRejectRef.current?.value === '0'
                    ) {
                        MySwal.showValidationMessage("กรุณาเลือกเหตุผล")
                        return;
                    }
                    
                    setReasonEdits({
                        reason_id: parseInt(reasonRejectRef.current?.value || "", 10),
                        comment: commentRejectRef.current?.value || null
                    })
                    setLockEditInput(true);
        
                    
                }
               
            }
        )
        
    }

    const rejectModal = async () => {
        const MySwal = withReactContent(Swal)

        console.log(reasons)
        await MySwal.fire(
            {
                title: (<h1 className='text-4xl font-bold text-[#293161]'>กรุณาระบุเหตุผล</h1>),
                html: (
                    <div className='flex flex-col'>
                        <label className='px-2 py-3 text-2xl'>เหตุผลการปฏิเสธ</label>
                        <select
                            className='border rounded w-full py-2 px-3 text-xl focus:shadow-outline'
                            ref={reasonRejectRef}
                        >
                            <option
                                disabled
                                selected
                                value={0}
                                hidden
                            >
                                เลือกเหตุผลการปฏิเสธ
                            </option>
                            {
                                reasons.map(
                                    (data) => (
                                        <option
                                            value={data.id}
                                        >
                                            {data.reason_t}
                                        </option>
                                    )
                                )
                            }
                        </select>
                        <label className='px-2 py-3 text-2xl'>ข้อมูลเพิ่มเติม</label>
                        <textarea
                            className='border px-2 py-2'
                            ref={commentRejectRef}
                        />
                    </div>
                ),
                confirmButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>),
                confirmButtonColor: "#EB455F",
                showCancelButton: true,
                cancelButtonText: (<p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>),
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    if (
                        reasonRejectRef.current?.value === '0'
                    ) {
                        MySwal.showValidationMessage("กรุณาเลือกเหตุผล")
                        return;
                    }
                    let data: RequestRejectInterface = {
                        project_key: queryParameters.get("pj") || "",
                        reason_id: parseInt(reasonRejectRef.current?.value || "", 10),
                        comment: commentRejectRef.current?.value || ""
                    }
                    let res = await RejectBudgetByApprove1(data)
                    return res;
                }
            }
        ).then((response) => {
            if (response.isConfirmed) {
                if (response.value.status === 200) {
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
                            text: `เนื่องจาก: ${response.value.err}`,
                            icon: "error"
                        }
                    )
                }
            }
        })
    }

    const getRejectReasonOfApprove1 = async () => {
        const res = await ListRejectReason();
        setReasons(res.data)
    }

    const handleClearNewInputs = () => {
        setBudgetCalculate({
          price: budgetCalculate?.price,
          new_price: "",
          calculate_file: budgetCalculate?.calculate_file,
          sub_price: budgetCalculate?.sub_price?.map((item: any) => ({
            ...item,
            new_price: null,
          })),
        });
        setReasonEdits({
            reason_id: null,
            comment: null,
        })

      };
      
    const handleEditButton = () => {
        
        if(lockEditInput === false){
            editModal()
        } else {
            setLockEditInput(true);
        }
        
      };
    

    useEffect(() => {
        getBudgetCalculate();
        getRejectReasonOfApprove1()
        getPrevUnitProject();
        
    }, []);

    useEffect(() => {
  // คำนวณค่ารวมของ item.new_price หรือ item.price ทุกรายการใน sub_price
  const calculatedTotalPrice = budgetCalculate?.sub_price?.reduce((total, item) => {
    const newItemPrice = parseFloat(`${item.new_price || item.price || 0}`);
        return total + newItemPrice;
    }, 0);

    // ตั้งค่าค่ารวม
    setTotalPrice(calculatedTotalPrice || 0);
    }, [budgetCalculate?.sub_price]);

    return (
        <>
        <div ref={mainRef} className='w-full'>
            <div className='flex flex-col border px-12 py-12 my-5 rounded-2xl bg-white drop-shadow-lg '>
                <div className='flex flex-row justify-between'>
                    <h1 className='text-4xl font-bold mb-4 text-[#2B3467]'>ข้อเสนอข้อมูลราคากลาง</h1>
                </div>
                <div className='flex flex-col'>
                    <div className='ml-4 mt-3 mb-5 flex flex-col'>
                        <label className="text-2xl mb-4">1. ไฟล์แนบ PDF ที่ผ่านคำนวนมา <span className='text-red-500 text-xl'>(โปรดเก็บเป็นความลับและห้ามพิมพ์ออกมาเด็ดขาด)</span></label>
                        <div className='grid grid-cols-12'>
                            <div className="
                                flex col-start-1 col-end-13 md:col-end-7
                                border rounded-md
                                input-disable ">
                                <div className="p-2.5 md:p-2.5  text-xl">{(budgetCalculate?.calculate_file?.split('/')[budgetCalculate?.calculate_file?.split('/').length-1])}</div>
                            </div>
                            <div className="col-start-7 col-end-9 flex flex-row justify-center">
                                <button
                                    className="border p-2 bg-[#EB455F] text-white text-lg rounded-lg"
                                    onClick={() => {
                                        showFileOnClick(budgetCalculate?.calculate_file || "")
                                    }}
                                >ตรวจสอบไฟล์
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SECTION FOR BUDGET CALCULATE */}
                    <div className='mt-3 mb-5 grid grid-cols-12'>
                    <div className='col-start-1 col-end-12'>
                        <label className="text-2xl mb-4">
                            2. ราคากลางสุทธิ (รวม) 
                        </label>
                    </div>

                        <div className='col-start-1 col-end-12 flex mr-4'>
                        <div className=' flex w-3/4'>
                            <CurrencyInput
                            name='Budget'
                            className='static mt-3 py-2.5  border text-2xl rounded-lg  w-1/2 text-center my-2
                            disabled:bg-[#D4D4D4]'
                            value={parseFloat((budgetCalculate?.price) as string).toFixed(2)}
                            disabled={true}
                            autoComplete="off"
                            />
                            <input
                                placeholder="หน่วยอื่นๆ"
                                className='static mt-3 py-2.5   border text-xl rounded-lg  text-center m-2
                            disabled:bg-[#D4D4D4]'id="unit-price"
                                name="unit-price"
                                type="text"
                                defaultValue={selectedUnit?.label == "อื่นๆ" ? selectedUnit?.value : selectedUnit?.value}
                                // hidden={selectedUnit == undefined || selectedUnit.label !== "อื่นๆ"}
                                disabled
                                ></input>
                        </div>

                        </div>
                        
                    </div>
                    {
                        <div className='col-start-5 col-end-12 w-11/12 text-center'>
                        <div className='w-full text-left flex'>
                            <div className='w-6/12 pr-2'>
                                <label className=' text-[#FF0000] text-2xl text-left' hidden={!lockEditInput}>ราคากลางสุทธิ <span className='text-[#FF0000] text-xl'>(ขอแก้ไข)</span></label>
                                <CurrencyInput
                                    name='new_price'
                                    className='py-2.5  mt-3 border text-2xl rounded-lg w-full text-center col-start-6 col-end-10 shadow-inner border-[#A6A6A6] bg-white disabled:bg-[#D4D4D4] '
                                    onValueChange={(value, name, values) => handleChangePrice(value as string, name as string, values as CurrencyInputOnChangeValues)}
                                    onBlur={(e) => {
                                        if (e.target.value !== "" && e.target.value !== "0") {
                                            setBudgetCalculate({
                                                ...budgetCalculate,
                                                new_price: parseFloat(e.target.value.replace(/[,]/g, "")).toFixed(2)
                                            })
                                        }
                                    }}
                                    value={(budgetCalculate?.new_price == null && budgetCalculate?.price !== 0 && budgetCalculate?.new_price !== undefined || budgetCalculate?.new_price == "") ? budgetCalculate?.price : budgetCalculate?.new_price != null ? budgetCalculate?.new_price : ""}
                                    autoComplete='off'
                                    disabled={lockInput}
                                    onChange={handleEditButton}
                                    hidden={!lockEditInput}
                                />
                            </div> 
                            <div className='w-10/12 flex flex-col-reverse'>
                            {lockEditInput && (
                                <div className="flex">
                                <AsyncSelect
                                     isDisabled={lockInput}
                                    placeholder="หน่วย"
                                    id="unit"
                                    className="w-2/5 text-xl focus:shadow-outline mx-2"
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadUnitPrice}
                                    onChange={handleUnitPriceChange}
                                    value={selectedUnit}
                                    styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        minHeight: "54px",
                                        width: "100%",
                                    }),
                                    }}
                                />
                                <input
                                disabled={lockInput}
                                    placeholder="ระบุ"
                                    className="border rounded w-4/12 px-12 text-gray-700 text-xl focus:shadow-outline ml-2"
                                    id="unit-price"
                                    name="unit-price"
                                    type="text"
                                    onChange={(e) => handleMoreUnitPriceChange(e)}
                                    hidden={selectedUnit == undefined || selectedUnit.label !== "อื่นๆ"}
                                />
                                </div>
                            )}
                            </div>

                        </div>
                    </div>
                        }
                    <div className='ml-4 mb-5 mt-3 flex flex-col'>
                        <label className="text-2xl mb-3">3. ราคากลางย่อยที่ต้องใช้กำหนดเปรียบเทียบในการประกวดราคา</label>
                        <div className='ml-2'>
                            <input
                                id="have-subPrice"
                                name='isHaveSubPrice'
                                className='mr-3 w-4 h-4'
                                type='radio'
                                checked={
                                    budgetCalculate?.sub_price?.length != 0
                                }
                                disabled
                            />
                            <label htmlFor="have-subPrice" className="text-2xl">มีราคากลางย่อย</label>
                            <input
                                id="havent-subPrice"
                                name="isHaventSubPrice"
                                type="radio"
                                className="mx-3 w-4 h-4"
                                checked={
                                    budgetCalculate?.sub_price?.length == 0
                                }
                                disabled
                            />
                            <label htmlFor="havent-subPrice" className="text-2xl">ไม่มีราคากลางย่อย</label>
                        </div>
                    </div>

                    {/* SECTION FOR SUB PRICE  */}

                    <div className={`${budgetCalculate?.sub_price?.length != 0 ? "" : "hidden"}`}>
                        <div className="test">
                        <table className='table-fixed mx-auto w-full '>
                        <thead className='bg-[#2B2A2A] '>
                            <tr  >
                                <th className='py-4 text-2xl text-white text-center rounded-tl-lg w-[100px] '>
                                    ลำดับ
                                </th>
                                <th className='py-4 text-2xl text-white text-center'>
                                    รายละเอียด
                                </th>
                                <th className='py-4 text-2xl  text-white text-center '>
                                    ราคา
                                </th>
                                <th className={` py-4 text-xl  text-[#ff1010] text-center  ${lockEditInput ? "" : "hidden"}`}>
                                    ราคากลางย่อย <span className="text-xl">(ขอแก้ไข)</span>
                                </th>
                                <th className="py-4 text-2xl  text-white text-center rounded-tr-lg " >
                                    หน่วย 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        
                        {
                            Array.isArray(budgetCalculate?.sub_price) &&
                            budgetCalculate?.sub_price.map((item, index) =>  (
                                
                                <tr className='border bg-[#dddddd] ' key={item.id} style={{ verticalAlign: 'top' }}>
                                     
                                <td className='whitespace-no-wrap text-2xl text-center border rounded p-4  focus:outline-none '>
                                    {index + 1}
                                </td>
                                <td className='whitespace-no-wrap text-xl text-left border rounded p-4 focus:outline-none '>
                                    {item.name}
                                </td>
                                <td className='whitespace-no-wrap text-2xl text-center border rounded p-4 focus:outline-none'>
                                {Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2})}
                                </td>
                                
                                <td className={` py-4 text-2xl  text-[#000000] text-center  ${lockEditInput ? "" : "hidden"}`}>
                                {
                                                (
                                                    // budgetCalculate.new_price != undefined &&
                                                    // budgetCalculate.new_price != "" &&
                                                    budgetCalculate.new_price !== 0
                                                ) && <div className=' w-5/6 mx-auto'>
                                                    <CurrencyInput
                                                        style={{
                                                            background: lockInput ? '#fBEDBE' : 'white',
                                                            color: lockInput ? 'black' : 'black',
                                                            cursor: lockInput ? 'not-allowed' : 'auto'
                                                        }}
                                                        ref={(el) => { subPriceRef.current[index] = el as HTMLInputElement }}
                                                        onValueChange={(value, name, values) => {
                                                            handleChangeSubPrice(index, value as string, name as string, values as CurrencyInputOnChangeValues)
                                                        }}
                                                        onBlur={(e) => {
                                                            if (budgetCalculate?.sub_price === undefined) return;

                                                            let start = budgetCalculate.sub_price.slice(0, index);
                                                            let end = budgetCalculate.sub_price.slice(index + 1);

                                                            setBudgetCalculate({
                                                                ...budgetCalculate,
                                                                sub_price: [
                                                                    ...start as SubBudgetInterface[],
                                                                    {
                                                                        ...budgetCalculate.sub_price[index],
                                                                        [e.target.name]: parseFloat(e.target.value.replace(/[,]/g, "") || "0").toFixed(2)
                                                                    },
                                                                    ...end as SubBudgetInterface[]
                                                                ]
                                                            })
                                                        }}
                                                        className={`p-2 border rounded shadow-inner border-[#A6A6A6] drop-shadow-xl text-center w-full ${lockInput ? ' text-black cursor-not-allowed' : 'bg-white'}`}
                                                        value={(item.new_price || item.price).toString()}
                                                        name="new_price"
                                                        disabled={lockInput}
                                                    />
                                                </div>
                                            }
                                </td>
                                <td className='whitespace-no-wrap text-2xl text-center border rounded p-4 focus:outline-none'>
                               {selectedUnit?.value}
                               </td>
                                
                            </tr>                   
                            ))
                        }
                        <tr className='border bg-[#c8c8c8] '  style={{ verticalAlign: 'top' }}>
                                <td className='whitespace-no-wrap text-2xl text-center border  p-4 focus:outline-none '>
                                    
                                </td>
                                <td className='whitespace-no-wrap text-2xl text-center  font-extrabold border  p-4 focus:outline-none'>
                                รวมมูลค่า
                                </td>
                                <td className='whitespace-no-wrap text-2xl text-center font-extrabold border  p-4 focus:outline-none'>
                                
                                    {parseFloat((budgetCalculate?.price) as string).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    })}
                                </td>
                                <td className={` py-4 text-2xl  text-[#000000] text-center  ${lockEditInput ? "" : "hidden"}`}>
                                {
                                        (
                                            budgetCalculate?.new_price != undefined &&
                                            budgetCalculate?.new_price != "" &&
                                            budgetCalculate?.new_price != 0 ||
                                            budgetCalculate?.price != undefined
                                            
                                        ) && <div className={lockInput ? 'confirm-total-price p-2 px-4 -md border rop-shadow-lg text-center w-5/6 mx-auto' : 'bg-white p-2 px-4 rounded-md border border-[#A6A6A6] drop-shadow-lg text-center w-5/6 mx-auto'}
                                        style={{
                                            background: lockInput ? '#fBEDBE' : 'white',
                                            color: lockInput ? 'black' : 'black',
                                            cursor: lockInput ? 'not-allowed' : 'auto'
                                        }}>
                                         {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}  <br /> <span className={`${(budgetCalculate.new_price || budgetCalculate.price) == totalPrice? "text-[#00A023]" : "text-[#D90404]"}`}>{`${(budgetCalculate.new_price || budgetCalculate.price) == totalPrice ? "(ราคาครบตามกำหนดแล้ว)" : "(ราคากลางย่อยไม่ตรงกับราคากลางหลัก)"}`}</span>
                                    </div>
                                    }
                                </td>
                                <td className='whitespace-no-wrap text-2xl text-center font-extrabold border  p-4 focus:outline-none'>
                                {selectedUnit?.value}
                                </td>
                               
                            </tr>    

                        </tbody>
                    </table>
                           
                        </div>
                    </div>
                </div>
                <div className='flex justify-around mt-8 space-x-12'>
                    {
                        !lockInput && !lockEditInput && (
                            <>
                                <button
                                    className={`p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#559744]`}
                                    onClick={() => {
                                        if (!success) {
                                            mySwal.fire({
                                                title: "ราคากลางหลักไม่เท่ากับราคากลางย่อย",
                                            }).then(() => {
                                                if (mainRef.current) {
                                                    mainRef.current.scrollIntoView(
                                                        {
                                                            behavior: "smooth",
                                                            block: 'start'
                                                        }
                                                    );
                                                }
                                            })
                                            return;
                                        }
                                        setLockInput(true)
                                        if (mainRef.current) {
                                            mainRef.current.scrollIntoView(
                                                {
                                                    behavior: "smooth",
                                                    block: 'start'
                                                }
                                            );
                                        }

                                    }}>
                                    ยืนยัน
                                </button>
                                <button
                                className='p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#D9C304]'
                                    onClick={handleEditButton}
                                    hidden={lockEditInput}
                                    >
                                    แก้ไข
                                </button>
                                <button
                                    className='p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#D90404]'
                                    onClick={rejectModal}>
                                    ปฏิเสธ
                                </button>
                            </>
                        )
                    }

                    {
                        lockInput && (
                            <>
                                <button
                                    className='p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#2B3467]'
                                    onClick={approveSubmit}
                                >
                                    อนุมัติ
                                </button>
                                <button
                                    className='p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#D9C304]'
                                    onClick={() => {
                                        setLockInput(false)
                                    }}>
                                    แก้ไข
                                </button></>
                        )
                    }

                    {
                        !lockInput && lockEditInput && (
                            <>
                            
                                <button
                                    className={`p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#559744]`}
                                     hidden={ (totalPrice == 0 && Number(budgetCalculate?.new_price) != null)}
                                    onClick={() => {
                                        if (Number(budgetCalculate?.new_price) != totalPrice) {
                                            mySwal.fire({
                                                title: "ราคากลางหลักไม่เท่ากับราคากลางย่อย",
                                            }).then(() => {
                                                if (mainRef.current) {
                                                    mainRef.current.scrollIntoView(
                                                        {
                                                            behavior: "smooth",
                                                            block: 'start'
                                                        }
                                                    );
                                                }
                                            })
                                            return;
                                        }
                                        
                                        setLockInput(true)
                                        if (mainRef.current) {
                                            mainRef.current.scrollIntoView(
                                                {
                                                    behavior: "smooth",
                                                    block: 'start'
                                                }
                                            );
                                        }

                                    }}>
                                    บันทึก
                                </button>
                                <button
                                    className={'p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#559744]'}
                                    hidden={!(budgetCalculate?.sub_price?.length == 0) && !(budgetCalculate?.sub_price == undefined || budgetCalculate?.sub_price == null || budgetCalculate.sub_price.length === 0)}
                                    onClick={() => {
                                        setLockInput(true)
                                        if (mainRef.current) {
                                            mainRef.current.scrollIntoView(
                                                {
                                                    behavior: "smooth",
                                                    block: 'start'
                                                }
                                            );
                                        }
                                      }}
                                      >
                                    บันทึก
                                </button>
                                <button
                                    className='p-3 w-[300px] text-white text-3xl rounded-lg px-12 bg-[#d9042b]'
                                    onClick={() => {
                                        handleClearNewInputs();
                                        setLockEditInput((prevLockEditInput) => !prevLockEditInput)
                                      }}
                                      >
                                    ยกเลิก
                                </button></>
                        )
                    }
                </div>
            </div>

            <div>
                <LogComponent />
            </div>
        </div >
        </>
    )
}
