
export default function MoreDetails() {
    return (

        <div className="   grid grid-cols-12  mt-3 p-3  bg-white  " >


            <div className="  col-start-2 col-end-12  rounded-5  bg-zinc-200   ">
                <div className=" p-8 rounded-lg bg-white items-center drop-shadow-2xl">


                    <div className="  pl-16  pb-8 pt-10 bg-[#FAFAFA] rounded-lg drop-shadow-2xl" >
                        <h1 className="text-xl font-bold">1) วัน/เวลา รับฟังคำชี้แจงจากหน่วยงานต้นสังกัด</h1>



                        <div className="flex flex-row">
                            <div className="flex">
                                <label className="flex-none ml-5 pt-2">วัน</label>
                                <input
                                    className="flex-auto   rounded-lg  ml-2 px-3 mt-2 text-gray-700 bg-[#DEDEDE]  drop-shadow-2xl  "
                                    id="day-detail"
                                    type="date" 
                                    pattern="dd"
                                    placeholder=""
                                    
                                />
                            </div>
                            <div>
                                <label className="flex-none ml-5">เวลา</label>
                                <input
                                    className="flex-auto   rounded-lg  ml-2 px-3 mt-2 text-gray-700 bg-[#DEDEDE] drop-shadow-2xl  "
                                    id="time-detail"
                                    type="time" 
                                    pattern="hh:mm:ss"
                                    placeholder=""
                                    
                                />
                            </div>
                            

                        </div>
                        <h1 className="text-xl font-bold pt-3">2) ผู้ประสานงานโครงการ</h1>
                            <div className="flex flex-row">
                                <div className="flex">
                                <input
                                        className="flex-auto   rounded-lg  ml-2 pr-3 mt-2 text-gray-700 bg-[#DEDEDE] drop-shadow-2xl  "
                                        id="Project-Coordinator"
                                        type="text"
                                        placeholder=""
                                        name="Text"
                                    />
                                    <label className="flex-none ml-5 pt-2"></label>
                                </div>
                            </div>
                        <h1 className="text-xl font-bold pt-3">3) โปรดแนบเงื่อนไขการประกวดราคา หรือ เอกสารที่เกี่ยวข้องอื่นๆ</h1>
                            <div className="flex flex-row">
                                <div className="flex">
                                    {/* <label className="flex-none ml-5 pt-2">Choose File</label> */}
                                    <input
                                        className="flex-auto   rounded-lg  ml-2 pr-3 mt-2 text-gray-700 bg-[#DEDEDE] drop-shadow-2xl  "
                                        id="Tender-Conditions"
                                        type="file"
                                        placeholder="อื่นๆ.pdf"
                                        multiple
                                        accept="application/pdf"
                                        
                                        
                                    />
                                </div>
                            </div>
                    </div>
                </div>

            </div>
        </div>




    )


}