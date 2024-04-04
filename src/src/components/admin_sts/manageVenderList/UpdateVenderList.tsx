import React, { useEffect, useMemo, useState, useRef, MutableRefObject } from 'react'
import { UpdateVendorList, getVenderListForSearch, ListAllExpertise } from '../../../services/Admin_sts/Admin_sts'
import { VendorListForAdminInterface, VendorListForSearchInterface , VendorListInterface } from '../../../models/Project/IVenderinfo'
import PageLoad from '../../PreLoadAndEtc/PageLoader';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { ListLocationVendor } from '../../../services/ContractorService/OutsideService';
import AsyncSelect from "react-select/async";
import Select from 'react-select';
import Swal from 'sweetalert2';

type OptionLocationType = {
    label: string;
    value: string;
};

const optionsJobtype = [
    { value: 'ชั่วคราว', label: 'ชั่วคราว' },
    { value: 'ประจำ', label: 'ประจำ' },
];

export default function UpdateVenderList() {

    const [searchVendorList, setSearchVendorList] = useState<Partial<VendorListForSearchInterface>>({
        data_serach: ' ' ,
        expertise: ' '
    });
    const [vendorList, setvendorList] = useState<VendorListInterface[]>([]);  
    const[show, setShow] = useState<boolean>(false);
    const[show2, setShow2] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof typeof searchVendorList;
        if(e.target.value.length === 0){
            setSearchVendorList({
                ...searchVendorList,
                [name]: ' ',
              })
        }else{
            setSearchVendorList({
                ...searchVendorList,
                [name]: e.target.value,
              })
        };      
    };

    const submitSearch = async () => { 
        setShow2(false)
        setLoading(true)
        const res = await getVenderListForSearch(searchVendorList as VendorListForSearchInterface)
        if(res.status === 200 && res.data.length > 0){
            setvendorList(res.data)
            setShow(true) 
            setLoading(false)

        }else{
            setLoading(false)
            setvendorList(res.data)
            setShow(true)
            setShow2(true)
        }
        
    };

    //------------------------------------ สำหรับ AsyncSelect --------------------------------------------------------------------------
    const [locations, setLocations] = useState<OptionLocationType[]>([]);
    const listLocationVendor = async () => {
        const res = await ListLocationVendor();
        const locationMapping = res.data.map((detail: any) => ({
        value: detail.id,
        label:
            detail.tambons_name_th + " " + detail.amphures_name_th + " " + detail.provinces_name_th + " " + detail.zip_code,
        }));
        setLocations(locationMapping);
    };
    //------------------------------------ สำหรับ AsyncSelect --------------------------------------------------------------------------------



    const [expertises, setExpertises] = useState<OptionLocationType[]>([]);
    const listAllExpertise = async () => {
        const res = await ListAllExpertise();
        const locationMapping = res.data.map((data: any) => ({
        value: data.id,
        label: data.job_type_name + ' ( '+data.job_type_general_name+' ) '
        }));
        setExpertises(locationMapping);
    };


    useEffect(()=>{
        listLocationVendor()
        listAllExpertise()
    },[])
    

    return (
        <div className='grid gap-4'>
            <div className='flex bg-[#ffffff] border rounded-bl-lg shadow-xl p-2'>
                <div className=' w-96 text-[#1D5182] text-center text-3xl font-bold p-3' >  ค้นหา </div>
                <div className='grid gap-y-1 w-full'>
                    <div className='flex  m-3 gap-4 h-10'><p className='w-32 pl-1.5 pt-2 text-lg text-right'>ความเชี่ยวชาญ :</p> <input name="expertise" onChange={handleInputChange} className='border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-2/4 rounded pl-2 focus:border-[#1d1f4b] focus:border-2'></input></div>
                    <div className='flex  m-3 gap-4 h-10'><p className='w-32 pl-1.5 pt-2 text-lg text-right'>คำค้น :</p> <input name="data_serach" onChange={handleInputChange} className='border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-2/4 rounded pl-2 focus:border-[#1d1f4b] focus:border-2'></input></div>
                    <div className='flex m-3 gap-4 h-10'><p className='w-32'></p><button onClick={() => { submitSearch() }} className='w-40 bg-[#EB455F] text-white font-bold rounded shadow-sm shadow-[#000000] drop-shadow-xl hover:bg-[#ffc0c0] hover:text-[#EB455F]'>ค้นหา</button></div>
                </div>
           </div>
           <div hidden={!show} className=' bg-[#1D5182] border rounded-lg shadow-xl p-2 w-full'>
                <div className=' text-[#f9f9f9] text-center text-2xl font-bold p-3' > แสดงข้อมูลเลขสมาชิก </div>    
            </div>
            <div hidden={!show2} className=' bg-[rgb(254,254,255)] border rounded-lg shadow-lg p-2 mb-4 w-full h-36'>
                <p className='text-4xl text-center mt-10'>ไม่พบข้อมูล</p>
            </div>
            <div>
                {loading ? ( <PageLoad/> ) : ( <div>
                                                    { vendorList.length >0 && vendorList.map((value, index) => { 
                                                            return (<ShowVenderList
                                                                vendorList={value}  
                                                                index={index}
                                                                location={locations}
                                                                expertiseList={expertises}

                                                                /> );                            
                                                    })}
                                                </div>
                                            )}
            </div>
        </div>
    )
}



export function ShowVenderList( {
    vendorList,
    index,
    location,
    expertiseList

}:{
    vendorList:Partial<VendorListInterface>;
    index:number;
    location:OptionLocationType[];
    expertiseList:OptionLocationType[];
}
) {
    const[disable, setDisable] = useState<boolean>(true);
    const[hidden, setHidden] = useState<boolean>(true);
    const[editVendorList, setEditVendorList] = useState<Partial<VendorListForAdminInterface>>(vendorList);
    const[dataVendorList, setDataVendorList] = useState<Partial<VendorListInterface>>(vendorList);

    const dateRef = useRef<HTMLInputElement>(null);
    const companyRef = useRef<HTMLInputElement>(null);
    const affiliatRef = useRef<HTMLInputElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const roleRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const noteRef = useRef<HTMLInputElement>(null);
    const levelRef = useRef<HTMLInputElement>(null);



    const handleOnChange = async (e: React.ChangeEvent<{ name: string; value: any }>) => {
        const name = e.target.name as keyof typeof editVendorList;
        const value = e.target.value;
        setDataVendorList({
            ...dataVendorList,
            [name]: value
        });
    };
    let date = new Date(vendorList.add_datetime as string);
    
    
    let dateFormat = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " เวลา " + date.getHours() + ":" + date.getMinutes() + " น.";
    

    const loadOption = (
        input: string,
        callback: (options: OptionLocationType[]) => void
      ) => {
        callback(filterOption(input));
      };
    
    const filterOption = (inputFilter: string) => {
        let ins = 0;
        return location.filter((i) => {
          if (inputFilter === "") {
            return false;
          }
          if (ins > 300) {
            return false;
          }
          let check = i.label.toLowerCase().includes(inputFilter.toLowerCase());
          if (check === true) {
            ins = ins + 1;
          }
          return check;
        });
      };



      const submitUpdateVendorList = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        Swal.fire({
          title: "ยืนยันการแก้ไข Vender ใน List ทะเบียน?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#EB455F",
          cancelButtonColor: "#979797",
          confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
          cancelButtonText: '<span style="font-size: 25px;">ยกเลิก</span>',
          preConfirm: async () => {
            let res = await UpdateVendorList(dataVendorList as VendorListInterface)
            if (res.status !== 200) {
                Swal.showValidationMessage(res.err)
            }
            
            return res.data
          },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "เพิ่มข้อมูลสำเร็จ!",
              text: "",
              icon: "success",
              confirmButtonText: "ยืนยัน",
            }).then(() => {
                setHidden(true) 
                setDisable(true)
                
              // navigate("/project/ManageProject");
            });
          }
        });
      }
    
    useEffect(()=>{   

    },[])
    return (
        <div className=' bg-[rgb(254,254,255)] border rounded-lg shadow-lg p-2 mb-4'>
            
            <div className='flex  gap-x-10 mx-auto w-full' > 
                    

                    <div className='mb-3 '>
                    <div className='flex flex-between'>
                        <div className='text-[#0a0a0a] text-start text-xl font-bold p-3 mx-5'>
                            รายที่ {index+1} :
                        </div>
                        <div className='text-2xl flex justify-end items-center gap-5 ml-auto mx-5'>
                            <div className='text-red-600' onClick={() => {}}>
                                <button><RiDeleteBin6Fill /></button>
                            </div>
                            <div className='text-lime-600' onClick={(e) => {
                                setDisable(false)
                                setHidden(false)
                            }}>
                                <button><MdModeEdit /></button>
                            </div>
                        </div>
                    </div>
                        
                            <div className=' grid grid-cols-8 gap-3'>

                                <div    
                                    className='text-[#0a0a0a] text-end text-base  p-1' > 
                                    เลขสมาชิก : 
                                </div>
                                <input
                                    name='vendor_key' 
                                    disabled 
                                    defaultValue={vendorList.vendor_key} 
                                    onChange={handleOnChange} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#dfdfdf]'>
                                
                                </input>
                               

                                <div    
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    วันขึ้นทะเบียน : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base  border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#dfdfdf] p-1.5'>
                                    {dateFormat}
                                </div>
                                <input  
                                    name='add_datetime' 
                                    hidden={disable} 
                                    ref={dateRef} 
                                    defaultValue={dateFormat}
                                    onChange={handleOnChange}  
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#ffffff] p-1.5'>
                                
                                </input>
                                

                                <div    
                                    className='text-[#0a0a0a] text-left text-base p-1' > 
                                    ชื่อ หจก/บริษัทฯ : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.company_name}
                                </div>
                                <input  
                                    name='company_name' 
                                    hidden={disable}  
                                    ref={companyRef} 
                                    defaultValue={vendorList.company_name}
                                    onChange={handleOnChange}  
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#ffffff]'>

                                </input>

                                <div className='text-[#0a0a0a] text-end text-base p-1' > ประเภทงาน : </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.jobtype}
                                </div>
                                {!disable && (<Select 
                                    placeholder={vendorList.jobtype}
                                    onChange={(e:any) => {
                                        setDataVendorList({
                                        ...dataVendorList,
                                        ['jobtype']: e.value,
                                        });
                                    }}  

                                    options={optionsJobtype}  
                                    name='jobtype' 
                                    className='col-span-3 text-base bg-[#ffffff] '/>

                                )}

                                    
                                <div 
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    สังกัด : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-7 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.affiliated}
                                </div>
                                <input
                                    name='affiliated'  
                                    hidden={disable} 
                                    ref={affiliatRef} 
                                    defaultValue={vendorList.affiliated}
                                    onChange={handleOnChange}  
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-7 bg-[#ffffff]'>

                                </input>
                                
                                <div 
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    {!disable?"รายละเอียด :" :"ที่ตั้งสำนักงาน :"  }
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-7 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.location}
                                </div>
                                <input 
                                    name='location_detail' 
                                    hidden={disable} 
                                    ref={locationRef} 
                                    defaultValue={vendorList.location_detail} 
                                    onChange={handleOnChange} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#ffffff]'>

                                </input>

                                {!disable &&    <div 
                                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                                    ที่ตั้งสำนักงาน :
                                                </div>}
                                                {!disable && (<AsyncSelect 
                                                name='location_main' 
                                                placeholder={vendorList.location_main}
                                                onChange={(e:any) => {
                                                    setDataVendorList({
                                                    ...dataVendorList,
                                                    ['location_main_id']: e.value,
                                                    });
                                                    
                                                }}
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={loadOption} 
                                                className='col-span-3 text-base text-center bg-[#ffffff]'/>

                                            )}


                                
                                <div 
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    ชื่อ-สกุล : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.manager_name}
                                </div>
                                <input
                                    name='manager_name'  
                                    hidden={disable} 
                                    ref={nameRef} 
                                    defaultValue={vendorList.manager_name} 
                                    onChange={handleOnChange} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#ffffff]'>

                                </input>
                                
                                <div 
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    ตำแหน่ง : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.manager_role}
                                </div>
                                <input
                                    name='manager_role'  
                                    hidden={disable} 
                                    ref={roleRef} 
                                    defaultValue={vendorList.manager_role} 
                                    onChange={handleOnChange} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#ffffff]'>

                                </input>
                                    
                                <div 
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    เบอร์โทร : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.phone_number}
                                </div>
                                <input 
                                    name='phone_number' 
                                    hidden={disable} 
                                    ref={phoneRef} 
                                    defaultValue={vendorList.phone_number} 
                                    onChange={handleOnChange} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#ffffff]'>
                                
                                </input>
                                
                                <div 
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    อีเมล : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.email}
                                </div>
                                <input 
                                    name='email' 
                                    hidden={disable} 
                                    ref={emailRef}
                                    defaultValue={vendorList.email} 
                                    onChange={handleOnChange} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-3 bg-[#ffffff]'>

                                </input>
                                
                                <div 
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    ความเชี่ยวชาญ : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-7 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.expertise}
                                </div>
                                {!disable && (
                                <Select
                                    placeholder={vendorList.jobtype || ''}
                                    onChange={(e) => {
                                    setDataVendorList({
                                        ...dataVendorList,
                                        ['expertise_value']: e,
                                    });
                                    }}
                                    isMulti
                                    defaultValue={vendorList.expertise_value as OptionLocationType[]}
                                    options={expertiseList}
                                    className='col-span-7 text-base bg-[#ffffff]'
                                />
                                )}

                                
                                <div 
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    หมายเหตุ : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-7 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.note}
                                </div>
                                <input 
                                    name='note' 
                                    hidden={disable} 
                                    ref={noteRef} 
                                    defaultValue={vendorList.note} 
                                    onChange={handleOnChange} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-7 bg-[#ffffff]'>

                                </input>
                                
                                <div 
                                    className='text-[#0a0a0a] text-end text-base p-1' > 
                                    รหัสทะเบียน : 
                                </div>
                                <div    
                                    hidden={!disable} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-7 bg-[#dfdfdf] pt-1.5'>
                                    {vendorList.vendor_level}
                                </div>
                                <input 
                                    name='vendor_level' 
                                    hidden={disable} 
                                    ref={levelRef} 
                                    defaultValue={vendorList.vendor_level} 
                                    onChange={handleOnChange} 
                                    className='text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline w-full rounded pl-2 focus:border-[#1d1f4b] focus:border-2 col-span-7 bg-[#ffffff]'>

                                </input>
                            </div>    
                    </div>  
                    {/* <div className='flex text-4xl gap-7 ml-10 mt-3 w-56'>
                        <div className=' text-lime-600' onClick={(e)=>{
                            setDisable(false)
                            setHidden(false)                       
                        }}>
                            <button><MdModeEdit /></button>
                        </div>
                        <div className=' text-red-600' onClick={()=>{}}>
                            <button><RiDeleteBin6Fill /></button>
                        </div>
                        
                        
                    </div> */}
            </div>
            <div className='flex justify-center gap-9 mt-3 mb-3 text-2xl'>
                <div hidden={hidden}>
                <button onClick={submitUpdateVendorList} 
                         className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                    บันทึก
                </button>
                </div>

                <div hidden={hidden}>
                <button onClick={()=>{ 

                            setHidden(true) 
                            setDisable(true)
                            setEditVendorList(vendorList)
                            setDataVendorList(vendorList)
                            dateRef.current!.value = dateFormat as string
                            companyRef.current!.value = vendorList.company_name as string
                            affiliatRef.current!.value = vendorList.affiliated as string
                            locationRef.current!.value = vendorList.location_detail as string
                            nameRef.current!.value = vendorList.manager_name as string
                            roleRef.current!.value = vendorList.manager_role as string
                            phoneRef.current!.value = vendorList.phone_number as string
                            emailRef.current!.value = vendorList.email as string
                            noteRef.current!.value = vendorList.note as string
                            levelRef.current!.value = vendorList.vendor_level as string
      
                        }} className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">
                    ยกเลิก
                </button>
                </div>
            </div>
            


      </div> 
    )
}
