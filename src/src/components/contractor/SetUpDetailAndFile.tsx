import { useState } from 'react';
//import AdditionalDetails from './AddDetails';
import { projectsetting } from '../../models/ProjectSetting/IProjectSetting';
import AdditionalDetails from './AddDetails';







export default function SetUpDetailAndFile() {
    // ปุ่มสรุปข้อมูล
    const [showSummary, setShowSummary] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const[projectsetting,setprojectsetting] = useState<Partial<projectsetting>>({});


    const handleSummaryClick = () => {
        setShowSummary(false);
    };

    const handleSaveClick = () => {
        // ตรวจสอบหรือบันทึกข้อมูลตามที่คุณต้องการ
        // ตัวอย่าง: saveData();
        // หลังจากบันทึกเสร็จแล้ว, คุณอาจต้องเรียกใช้ Component ต่อไปนี้
        setShowDetails(true);
    };

    const handleEditClick = () => {
        // ตรวจสอบหรือแก้ไขข้อมูลตามที่คุณต้องการ
        // ตัวอย่าง: editData();
        // หลังจากแก้ไขเสร็จแล้ว, คุณอาจต้องเรียกใช้ Component ต่อไปนี้
        setShowDetails(true);
    };

    const handleOnChange = (
        e: React.ChangeEvent<{ name: string; value: any }>
    ) => {
        const name = e.target.name as keyof typeof projectsetting;
        const value = e.target.value;
        // อัปเดตค่า state
        setprojectsetting({
            ...projectsetting,
            [name]: value,
        });
        

    };
   

    return (
        <div className="flex flex-col  w-full "  >
            <div className="    grid grid-cols-12   p-3  bg-blue-900 w-full ">

                <div className="  col-start-2 col-end-13   ">
                    <div className=" pl-8 pb-8 rounded-lg bg-blue-900 text-white items-center">

                        <div className=" pl-5 pb-5 pt-10   " >
                            <h1 className="text-3xl font-bold">3 . รายละเอียดเพิ่มเติมและไฟล์แนบในหนังสือเชิญ</h1>
                        </div>
                        <div className=" ml-8 ">
                            <h1 className="text-xl ">
                                
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        <div className="    grid grid-cols-12  mt-3 p-3 pb-36  bg-white drop-shadow-2xl w-full " >
            

            <div className="  col-start-2 col-end-12  rounded-5  bg-white  drop-shadow-2xl ">
                <div className=" p-8 rounded-lg bg-white items-center ">


                    <div className="  pl-16  pb-20 pt-10 bg-[#FAFAFA] rounded-lg drop-shadow-2xl " >
                        <h1 className="text-xl font-bold">1) วัน/เวลา รับฟังคำชี้แจงจากหน่วยงานต้นสังกัด</h1>



                        <div className="flex flex-row ">
                            <div className="flex">
                                <label className="flex-none ml-5 ">วันที่</label>

                                <input
                                    className="flex-auto   rounded-lg  ml-2 px-3 mt-2 
                                            text-gray-700 bg-[#DEDEDE]  drop-shadow-2xl  "
                                    id="State-date"
                                    type="date"
                                    pattern="dd-mm-yyyy"
                                    name='date_details'
                                    onChange={handleOnChange}
                                    value={projectsetting.date_details}
                                    placeholder=""
                              

                                />
                            </div>                            
                            <div>
                                <label className="flex-none ml-5">เวลา</label>
                                <input
                                    className="flex-auto   rounded-lg  ml-2 px-3 mt-2 text-gray-700 bg-[#DEDEDE] drop-shadow-2xl  "
                                    id="closing-time"
                                    type="time" 
                                    name='time_details'
                                    onChange={handleOnChange}
                                    value={projectsetting.time_details}                                   
                                    placeholder=""

                                />
                            </div>

                        </div>
                        <h1 className="text-xl font-bold pt-8">2) ผู้ประสานงานโครงการ</h1>
                        <div className="flex flex-row">
                            <div className="flex py-3">
                                <input
                                    className="flex-auto   rounded-lg  ml-2 px-3 mt-2 text-gray-700 bg-[#DEDEDE] drop-shadow-2xl  "
                                    id="security-money"
                                    type="text"
                                    name='coordinator'
                                    onChange={handleOnChange}
                                    value={projectsetting.coordinator}
                                    placeholder=""
                                    
                                />
                                
                            </div>
                        </div>
                        <h1 className="text-xl font-bold pt-3">3)  โปรดแนบเงื่อนไขการประกวดราคา หรือ เอกสารที่เกี่ยวข้องอื่นๆ</h1>
                        <div className="flex flex-row">
                            <div className="flex pt-3">
                                {/* <label className="flex-none ml-5 pt-2">เริ่มต้น</label> */}
                                <input
                                    className="border rounded w-full py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline"
                                    id="file"
                                    type="file"
                                    placeholder=""
                                    name=""                                    
                                    accept="application/pdf"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    {showSummary ? (
                        <button
                            className="justify-center rounded-lg bg-[#559744] text-white py-4 px-3 font-bold"
                            onClick={handleSummaryClick}
                        >
                            สรุปข้อมูล
                        </button>
                    ) : (
                        <div className='flex flex-row items-center mt-4 mb-10'>
                            <button
                                className="justify-center px-10 rounded-lg bg-[#559744] text-white py-4 font-bold text-xl"
                                onClick={handleSaveClick}
                            >
                                บันทึก
                            </button>
                            <button
                                className="justify-center px-10 ml-20 rounded-lg bg-[#D9C304] text-white py-4 font-bold text-xl"
                                onClick={handleEditClick}
                            >
                                แก้ไข
                            </button>
                        </div>
                    )}

                    {showDetails == true && <AdditionalDetails />}
                </div>
            </div>
        </div>

        </div>


    )


}