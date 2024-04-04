import { useEffect, useState } from "react";
import { IVendorBargain } from "../WNOfferNewPrice"

export default function OPNSetDateTimeCloseBidding(
    {
        setVendorBargain,
        vendorBargain
    }: {
        setVendorBargain: React.Dispatch<React.SetStateAction<Partial<IVendorBargain>>>,
        vendorBargain: Partial<IVendorBargain>
    }
) {

    const [date, setDate] = useState<string>();
    const [time, setTime] = useState<string>();

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);  
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value);    
    }

    const handleDatetimeChange = (date: string | undefined, time: string | undefined) => {
        if(date && time){
            const dateTime = new Date(date + " " + time)
            setVendorBargain(
                {
                    ...vendorBargain,
                    end_datetime: dateTime
                }
            )
            console.log(dateTime)
        }
    }

    useEffect(() => {
        handleDatetimeChange(date, time)
    }, [date, time])

    useEffect(() => {
        console.log("test")
    }, [])

    return (
        <div>
            <div className=" pt-8 pb-8 rounded-2xl">
                <p className="text-2xl font-bold text-[#2B3467]">3) กำหนดวัน/เวลา ปิดการเสนอราคาใหม่</p>
                <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
                    <div className="px-32 py-14 flex flex-col gap-5">
                        <div>
                            <p className="basis-1/2 text-2xl text-gray-700 mb-4">1. โปรดเลือกวัน/เวลาที่จะปิดการเสนอราคาใหม่</p>
                            <div className="grid grid-cols-12 items-center">
                                <p className="col-start-1 text-xl text-center text-gray-500">วัน</p>
                                <input
                                    onChange={handleDateChange}
                                    type="date"
                                    name="date"
                                    placeholder="เริ่มต้น"
                                    className="col-start-2 col-end-5 border rounded-full p-2.5 text-xl text-center" />
                                <p className="col-start-5 text-xl text-center text-gray-500 ml-6">เวลา</p>
                                <input
                                    onChange={handleTimeChange}
                                    type="time"
                                    name="time"
                                    pattern="hh:mm"
                                    placeholder="เวลา"
                                    className="col-start-6 col-end-9 border rounded-full p-2.5 text-xl text-center"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}