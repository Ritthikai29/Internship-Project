import { useEffect, useState } from "react";
import { GetVendorResultPriceCompare } from "../../../services/SecretaryService/ComparisionService";
import {
  ResultStatusInterface,
  ListVendorPriceInterface
} from "../../../models/Secretary/CompareInterface";
import { useParams } from "react-router-dom";

export default function PCRSelectedBidder() {
  const { key } = useParams();
  const [resBidding, setresBidding] = useState<ListVendorPriceInterface>();
  const [statusBidding, setstatusBidding] = useState<ResultStatusInterface>();
  const getVendorResultCompare = async (key: string) => {
    let res = await GetVendorResultPriceCompare(key);
    console.log(res);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setstatusBidding(() => res.res_status);
    setresBidding(() => res.result);
  };

  useEffect(() => {
    getVendorResultCompare(key || "");
  }, []);

  return (
    <div>
      <p className="text-[#2B3467] text-3xl font-bold">
        ผู้เสนอราคาที่ได้รับการคัดเลือก
      </p>
      <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
        <div className="px-32 py-8 flex flex-col ">
          <div className="mb-6">
            <span
              className={
                statusBidding?.text ===
                  "ต่ำกว่าหรือเท่ากับราคากลาง และ มีผู้เสนอราคาต่ำสุดมากกว่า 1 ราย" ||
                statusBidding?.text ===
                  "ต่ำกว่าหรือเท่ากับราคากลาง และ มีผู้เสนอราคาต่ำสุด 1 ราย"
                  ? "text-green-500 text-2xl"
                  : "text-red-500 text-2xl"
              }
            >
              {statusBidding?.text}
            </span>
            <br />
            <p className="text-2xl mb-6">โดยมีรายละเอียดดังนี้</p>
          </div>
          {Array.isArray(resBidding) &&
            resBidding.map((resBidding) => (
              <div className="flex flex-row gap-8 justify-center mb-3">
                <p className="text-2xl">
                  บริษัท {resBidding?.vendor.company_name}
                </p>
                <p className="text-2xl">ได้เสนอราคาที่ต่ำที่สุดเป็นจำนวน</p>
                <p className="text-2xl">{resBidding?.compare}</p>
                <p className="text-2xl">บาท</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
