import ProjectContractor from "../../components/contractor/projectContractor";
import AllProject from "../../components/contractor/AllProject";
import SetUpProject from "../../components/contractor/SetUpProject";
import MoreDetails from "../../components/contractor/MoreDetails";

export default function ProjectsWaiting() {
    return (
        <div className="flex flex-col  w-full "  >
            <div className=" bg-white ">
                <div>
                    <ProjectContractor />
                </div>
                <div>
                    <AllProject />
                </div>
            </div>

            <div className="    grid grid-cols-12   p-3  bg-blue-900 w-full ">

                <div className="  col-start-2 col-end-13   ">
                    <div className=" pl-8 pb-8 rounded-lg bg-blue-900 text-white items-center">

                        <div className=" pl-5 pb-5 pt-10   " >
                            <h1 className="text-3xl font-bold">2 . ตั้งค่าโครงการ</h1>
                        </div>
                        <div className=" ml-8 ">
                            <h1 className="text-xl ">
                                (ท่านจะทำรายการนี้ได้ เมื่อดำเนินการข้อ 1 จัดการผู้เข้าร่วมโครงการครบตามระเบียบงานจ้างเหมา)
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div >
                <SetUpProject />
            </div>
            <div>
                <div className="    grid grid-cols-12   p-3  bg-[#2B2A2A] text-white">

                    <div className="  col-start-2 col-end-13   ">
                        <div className=" pl-8 pb-8 rounded-lg bg-[#2B2A2A] text-white items-center">

                            <div className=" pl-5 pb-5 pt-10   " >
                                <h1 className="text-3xl font-bold">3 . รายละเอียดเพิ่มเติมและไฟล์แนบในหนังสือเชิญ</h1>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div>
                <MoreDetails />
            </div>
            <div className="py-10 text-center">
                <button className="rounded-lg bg-[#559744] text-white  py-2 px-6 font-bold">
                ส่งอนุมัติหนังสือ
                </button>

            </div>
        </div>
    )
}