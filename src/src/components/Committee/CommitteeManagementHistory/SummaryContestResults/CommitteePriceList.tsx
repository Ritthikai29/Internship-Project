import { useEffect, useState } from "react";
import { GetVendorResultPriceCompare } from "../../../../services/SecretaryService/ComparisionService";
import { ListVendorItemInterface } from "../../../../models/Secretary/CompareInterface";

export default function CommitteePriceList() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [key] = useState<string>(queryParameters.get("key") || "");

  const [detailBidding, setdetailBidding] = useState<ListVendorItemInterface>();

  const getInfoCompare = async (key: string) => {
    let res = await GetVendorResultPriceCompare(key);
    console.log(res.result);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setdetailBidding(() => res.data);
  };

  useEffect(() => {
    getInfoCompare(key);
  }, []);

  return (
    <div>
      <div className="bg-[#F5F5F5]">
        <div className="px-[8rem] py-16 rounded-2xl">
          <table className="w-full drop-shadow-lg rounded-lg table-fixed">
            <thead className="text-white text-2xl uppercase bg-[#6C6C6C] h-14">
              <tr>
                <th className="justify-self-center">ชื่อบริษัท/หน่วยงาน</th>
                <th className="justify-self-center ">สถานะ</th>
                <th className="justify-self-center ">ราคาที่เสนอ</th>
                <th className="justify-self-center">ราคาเสนอใหม่</th>
              </tr>
            </thead>

            {Array.isArray(detailBidding) &&
              detailBidding.map((listBidding, index) => (
                <tbody className="bg-white border-b-lg rounded-xl h-14">
                  <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                    <td className="py-3 pl-2">{listBidding?.company_name}</td>
                    <td
                      className={
                        listBidding?.result === "win"
                          ? "py-3 pl-2 text-green-500 text-xl"
                          : "py-3 pl-2 text-red-500 text-xl"
                      }
                    >
                      {listBidding?.result === "win"
                        ? "ชนะการประกวด"
                        : "แพ้การประกวด"}
                    </td>
                    <td>
                      {listBidding?.result === "win"
                        ? listBidding?.price
                        : "ไม่เปิดเผย"}
                    </td>
                    <td className="">
                      {listBidding?.result === "win"
                        ? listBidding?.newPrice
                        : "ไม่เปิดเผย"}
                    </td>
                  </tr>
                </tbody>
              ))}
          </table>
        </div>
      </div>
    </div>
  );
}
