import { useEffect, useState } from "react";
import { GetVendorResultPriceCompare } from "../../../services/SecretaryService/ComparisionService";
import { ListVendorItemInterface , SubpriceInterface , VendorInterface , ListVendorPriceInterface} from "../../../models/Secretary/CompareInterface";
import { useParams } from "react-router-dom";

export default function PCRPriceList() {
    const {key} = useParams();
    const [detailBidding,setdetailBidding]=useState<ListVendorItemInterface>()
    const getVendorResultPriceCompare = async(key :string)=>{
        let res = await GetVendorResultPriceCompare(key);
        console.log(res.data)
        if(res.status !== 200){
            alert("err")
            return;
        }
        setdetailBidding(() => res.data);
    }
    
    useEffect(() => {        
        getVendorResultPriceCompare(key || "");
    }, []);

    const showFileOnClick = (filePath: string) => {
        window.open(
          (import.meta.env.DEV
            ? import.meta.env.VITE_URL_DEV
            : import.meta.env.VITE_URL_PRODUCTION) + filePath
        );
      };
    
    return (
        <div>
            <table className="w-full rounded-lg table-fixed mb-12">
                <thead className="border-b-2 h-14">
                    <tr className="text-2xl text-gray-700">
                        <th>ลำดับ</th>
                        <th>รายการ</th>
                        <th>ราคาประมูล</th>
                        <th>ราคาใหม่</th>
                        <th>BOQ</th>
                    </tr>
                </thead>

                {Array.isArray(detailBidding) &&
          detailBidding.map((listBidding, index) => (
                <tbody>
                    <tr className="text-xl text-center border-2 rounded-lg">
                        <td className="py-3.5">{index + 1}</td>
                        <td className="py-3.5">{listBidding?.vendor?.company_name}</td>
                        <td className="py-3.5">{listBidding.price}</td>
                        <td className="py-3.5">{listBidding.newPrice}</td>
                        <td className="py-3.5"><button className="text-[#2B3467]  border drop-shadow-md px-4 py-1.5 rounded-md"
                        onClick={() => {
                            showFileOnClick(listBidding.boq || "");
                          }}
                        >
                            ดาวโหลด</button></td>
                    </tr>
                </tbody>
          ))}
            </table>
        </div>
    )
}