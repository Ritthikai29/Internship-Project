import React from "react";
import Manager from "./Manager";
import Budget from "./Budget";
import { AiFillFileAdd, AiFillFilePdf } from "react-icons/ai";
import { useProjectContext } from "../../pages/Project/ProjectCreate";



export default function SecondPage(
    {
        submitType,
        setSubmitType,
        isHaveSubprice,
        setIsHaveSubprice,
        selectedUnit,
        setSelectedUnit
    }: {
        submitType: string,
        setSubmitType: React.Dispatch<React.SetStateAction<string>>,
        isHaveSubprice: boolean | undefined,
        setIsHaveSubprice: React.Dispatch<React.SetStateAction<boolean | undefined>>
        selectedUnit: any,
        setSelectedUnit: React.Dispatch<React.SetStateAction<any>>
    }) {


    const { project, setProject } = useProjectContext();
    const withManagerButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSubmitType("manager");
    };

    const withBudget = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSubmitType("budget");
    };

    const test = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(project)
    }

    return (
        <div className="mt-2 mb-2">
            {/* <button onClick={test}>
               
            </button> */}
            <form
                className="flex-col gap-3">
                <div className="flex justify-center text-gray-700 mb-6 text-2xl font-bold">
                    <p>เลือกวิธีการเพิ่มราคากลาง</p>
                </div>
                <div className="grid grid-cols-2 -ml-6 -mr-6 mt-3 mb-5">

                    <button className={`mx-4 p-3 mr-3 rounded-lg text-white text-xl grid grid-cols-9 items-center ${submitType === "manager"
                        ? "bg-[#BDBDBD]" : "bg-[#2B3467]"}`}
                        onClick={withBudget}>
                        <p className="col-start-1 col-end-9">+ อัพโหลดไฟล์ราคากลางที่อนุมัติแล้ว</p>  <AiFillFileAdd size="3rem" className="col-start-9 items-end" />
                    </button>


                    <button className={`mx-4 p-3 ml-3 rounded-lg text-white text-xl grid grid-cols-9 items-center ${submitType === "manager"
                        ? "bg-[#2B3467]" : "bg-[#BDBDBD]"}`}
                        onClick={withManagerButton}
                    >
                        <AiFillFilePdf size="3rem" className="col-start-1" />
                        <p className="col-start-2 col-end-9">+ แจ้งจัดทำราคากลาง</p>
                    </button>
                </div>
                <div className={`${submitType === "manager" ? "" : "hidden"}`}>
                    {
                        <Manager submitType={submitType} setSubmitType={setSubmitType} />
                    }
                </div>
                <div className={`${submitType !== "manager" ? "" : "hidden"}`}>
                    {
                        <Budget isHaveSubprice={isHaveSubprice} setIsHaveSubprice={setIsHaveSubprice} selectedUnit={selectedUnit} setSelectedUnit={setSelectedUnit}/>
                    }
                </div>
            </form>

        </div>
    );
}