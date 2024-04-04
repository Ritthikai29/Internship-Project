import React, { useEffect, useMemo, useState } from 'react'
import { VendorListForAdminInterface } from '../../../models/Project/IVenderinfo';
import Swal from 'sweetalert2';
import { AddVenderList, ListAllExpertise} from '../../../services/Admin_sts/Admin_sts';
import { ListLocationVendor } from '../../../services/ContractorService/OutsideService';
import Select from 'react-select';
import AsyncSelect from "react-select/async";

type OptionLocationType = {
  label: string;
  value: string;
};

const optionsJobtype = [
  { value: 'ชั่วคราว', label: 'ชั่วคราว' },
  { value: 'ประจำ', label: 'ประจำ' },
];

export default function AddVstarterList() {

  const [show,setShow] = useState(false);
  const [key,setKey] = useState('');
  const [venderList, setvenderList] = useState<VendorListForAdminInterface>({
    vendor_key: '' ,
		add_datetime: '' ,
		company_name: '' ,
		affiliated: '' ,
    jobtype: '' ,
    location_main: '' ,
		location: '' ,
		manager_name: '' ,
		manager_role: '' ,
		phone_number: '' ,
		email: '' ,
		expertise: '' ,
		note: '' ,
		vendor_level: ''
  });

  const handleOnChange = async (e: React.ChangeEvent<{ name: string; value: any }>
    ) => {
      const name = e.target.name as keyof typeof venderList;
      const value = e.target.value;
      // อัปเดตค่า state
      setvenderList({
        ...venderList,
        [name]: value,
      });
  };

  const submitAddVenderList = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    Swal.fire({
      title: "ยืนยันการเพิ่ม Vender เข้าใน List ทะเบียน?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EB455F",
      cancelButtonColor: "#979797",
      confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
      cancelButtonText: '<span style="font-size: 25px;">แก้ไข</span>',
      preConfirm: async () => {
        let res = await AddVenderList(venderList)
        if (res.status !== 200) {
            Swal.showValidationMessage(res.err)
        }
        setKey(res.data.vendor_key);
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
            setShow(true)
          // navigate("/project/ManageProject");
        });
      }
    });
  }



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

  const loadOption = (
    input: string,
    callback: (options: OptionLocationType[]) => void
  ) => {
    callback(filterOption(input));
  };

  const filterOption = (inputFilter: string) => {
    let ins = 0;
    return locations.filter((i) => {
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

  //check state value someting
  useMemo(() => console.log(key), [key])

  useEffect(() => {
    listLocationVendor();
    listAllExpertise();
  }, [])

  return (
    <>
      <div className='grid gap-4'>
        <div className=' bg-[#ffffff] border rounded-bl-lg shadow-xl p-2 mb-5 text-center'>
              <div className=' text-[#1D5182] text-start text-2xl font-bold p-4' > กรอกข้อมูลผู้รับเหมา</div>
              <div className='grid grid-cols-8 gap-y-8 px-5'>
                <div className='text-[#0a0a0a] text-right text-base p-1' > ชื่อ หจก/บริษัทฯ : </div>
                <input placeholder={'กรอกชื่อบริษัท'} onChange={handleOnChange} name='company_name' className='col-span-7 text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline  rounded pl-2 focus:border-[#1d1f4b] focus:border-2  bg-[#ffffff]'></input>

                <div className='text-[#0a0a0a] text-right text-base p-1' > สังกัด  : </div>
                <input placeholder={'กรอกชื่อสังกัดของบริษัท'} onChange={handleOnChange} name='affiliated' className='col-span-3 text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline  rounded pl-2 focus:border-[#1d1f4b] focus:border-2  bg-[#ffffff]'></input>

                <div className='text-[#0a0a0a] text-end text-base p-1' > ประเภทงาน : </div>
                <Select 
                  placeholder={'เลือกประเภทงาน'}
                  
                  //เซ็ทค่าประเภทงานตรงนี้
                  onChange={(e:any) => {
                    setvenderList({
                      ...venderList,
                      ['jobtype']: e.value,
                    });
                  }}  

                  options={optionsJobtype}  
                  name='jobtype' 
                  className='col-span-3 text-base bg-[#ffffff]  h-5'></Select>

                <div className='text-[#0a0a0a] text-right text-base p-1' > รายละเอียด : </div>
                <input placeholder='กรอกรายละเอียดที่อยู่ เช่น บ้านเลขที่ ถนน อื่นๆ' onChange={handleOnChange} name='location' className='col-span-3 text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline  rounded pl-2 focus:border-[#1d1f4b] focus:border-2  bg-[#ffffff]'></input>

                <div className='text-[#0a0a0a] text-end text-base p-1' > ที่ตั้งสำนักงาน : </div>
                <AsyncSelect 
                  placeholder={'ค้นหา เขต/ตำบล แขวง/อำเภอ จังหวัด'}

                  //เซ็ทค่าที่ตั้งสำนักงานตรงนี้เลย
                  onChange={(e:any) => {
                    setvenderList({
                      ...venderList,
                      ['location_main']: e.value,
                    });
                  }}

                  cacheOptions
                  defaultOptions
                  loadOptions={loadOption} 
                  name='location_main' 
                  className='col-span-3 text-base bg-[#ffffff] h-5'></AsyncSelect>

                <div className='text-[#0a0a0a] text-right text-base p-1' > ชื่อ-สกุล : </div>
                <input placeholder={'กรอกชื่อ-สกุล'} onChange={handleOnChange} name='manager_name' className='col-span-3 text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline  rounded pl-2 focus:border-[#1d1f4b] focus:border-2  bg-[#ffffff]'></input>

                <div className='text-[#0a0a0a] text-end text-base p-1 ' > ตำแหน่ง : </div>
                <input placeholder={'กรอกตำแหน่งที่ทำงานอยู่ในบริษัท'} onChange={handleOnChange} name='manager_role' className='col-span-3 text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline  rounded pl-2 focus:border-[#1d1f4b] focus:border-2  bg-[#ffffff]'></input>

                <div className='text-[#0a0a0a] text-right text-base p-1' > เบอร์โทร : </div>
                <input placeholder={'กรอกเบอร์โทร'} onChange={handleOnChange} name='phone_number' className='col-span-3 text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline  rounded pl-2 focus:border-[#1d1f4b] focus:border-2  bg-[#ffffff]'></input>

                <div className='text-[#0a0a0a] text-end text-base p-1' > อีเมล : </div>
                <input placeholder={'กรอกอีเมล'} onChange={handleOnChange} name='email' className='col-span-3 text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline  rounded pl-2 focus:border-[#1d1f4b] focus:border-2  bg-[#ffffff]'></input>

                <div className='text-[#0a0a0a] text-right text-base p-1' > ความเชี่ยวชาญ : </div>
                <Select 
                  placeholder={'เลือกความเชี่ยวชาญ'}

                  //เซ็ทค่าประเภทงานตรงนี้
                  onChange={(e:any) => {
                    setvenderList({
                      ...venderList,
                      ['expertise']: e.value,
                    });
                  }}
                  options={expertises}  
                  name='expertise' 
                  className='col-span-3 text-base bg-[#ffffff] h-5'></Select>


                <div className='text-[#0a0a0a] text-end text-base p-1' > หมายเหตุ : </div>
                <input placeholder={'ระบุหมายเหตุ (ถ้ามี)'} onChange={handleOnChange} name='note' className='col-span-3 text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline  rounded pl-2 focus:border-[#1d1f4b] focus:border-2  bg-[#ffffff]'></input>

                <div className='text-[#0a0a0a] text-right text-base p-1' > รหัสทะเบียน : </div>
                <input placeholder={'กรอกรหัสทะเบียน'} onChange={handleOnChange} name='vendor_level' className='col-span-7 text-base border-1 shadow-inner shadow-[#969595] focus:outline-none focus:shadow-outline  rounded pl-2 focus:border-[#1d1f4b] focus:border-2  bg-[#ffffff]'></input>
            </div>   
            <button onClick={submitAddVenderList} className='m-5 h-14 w-40 bg-[#559744] text-white font-bold rounded shadow-sm shadow-[#000000] drop-shadow-xl hover:bg-[#c5e9bd] hover:text-[#559744]'>เพิ่มข้อมูล</button>   
        </div>
      </div>
      { show && <div className='relative bg-[#ffffff] border rounded-lg shadow-xl  mb-5 px-96 pt-16 pb-6 font-bold text-center'>
                  <div className='absolute text-[#1D5182] text-3xl font-bold top-8 left-8'>ข้อมูลเลขสมาชิก</div>
                  <div className='border rounded-xl shadow-xl bg-[#4B82A9] mb-4'>
                    <div className='text-2xl p-5 text-white'>เลขสมาชิก</div>
                    <div className='text-3xl mb-6 p-5 bg-[#D9D9D9] mx-36'>{key}</div>
                  </div>
                  <div className='text-[#FF0000] text-xl '>รหัส Vender ครั้งแรก คือ 12345678 (โปรดเปลี่ยนรหัสผ่าน)</div>
                </div>}
    </>
    
  )
}


export  function ShowVenderKey({
  key
}:{
  key:any
}) {
  return (
    <div className='relative bg-[#ffffff] border rounded-lg shadow-xl  mb-5 px-96 pt-16 pb-6 font-bold text-center'>
      <div className='absolute text-[#1D5182] text-3xl font-bold top-8 left-8'>ข้อมูลเลขสมาชิก</div>
      <div className='border rounded-xl shadow-xl bg-[#4B82A9] mb-4'>
        <div className='text-2xl p-5 text-white'>เลขสมาชิก</div>
        <div className='text-3xl mb-6 p-5 bg-[#D9D9D9] mx-36'>{key}</div>
      </div>
      <div className='text-[#FF0000] text-xl '>รหัส Vender ครั้งแรก คือ 12345678 (โปรดเปลี่ยนรหัสผ่าน)</div>
    </div>
  )
}


