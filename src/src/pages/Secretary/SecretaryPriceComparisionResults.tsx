import { useEffect, useState } from "react";
import { BsDownload } from "react-icons/bs";
import PCRSelectedBidder from "../../components/Secretary/PriceComparisionResults/PCRSelectedBidder";
import PCRPriceList from "../../components/Secretary/PriceComparisionResults/PCRPriceList";
import { GetVendorResultPriceCompare } from "../../services/SecretaryService/ComparisionService";
import {
  SubpriceInterface,
  ProjectInterface,
} from "../../models/Secretary/CompareInterface";
import ProjectSecretary from "../../components/Secretary/projectSecretary";
import { useParams } from "react-router-dom";

export default function SecretaryPriceComparisionResults() {
  const { key } = useParams();
  const [infoBidding, setinfoBidding] = useState<SubpriceInterface>();
  const [infoProject, setProjectInfo] = useState<ProjectInterface>();
  const getInfoCompare = async (key: string) => {
    let res = await GetVendorResultPriceCompare(key);
    console.log(res.data);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setinfoBidding(() => res);
    setProjectInfo(() => res.project);
  };

  useEffect(() => {
    getInfoCompare(key || "");
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
      <div className="px-[8rem] py-12 rounded-2xl">
        <div>
          <ProjectSecretary />
        </div>

        <div className="my-10">
          <p className="text-[#2B3467] text-3xl font-bold text-center mb-8">
            เปรียบเทียบราคากลางตามรายการ
          </p>
          <p className="text-[#2B3467] text-2xl font-bold">จำนวนราคากลาง</p>
          <div className="grid grid-cols-9 items-center mb-12">
            <input
              type="text"
              value={infoBidding?.price}
              placeholder="จำนวนราคากลาง"
              className="px-2 py-2.5 border drop-shadow-lg text-xl rounded-lg col-start-1 col-end-4"
              disabled
            ></input>
            <span className="text-2xl text-[#2B3467] font-bold ml-4">บาท</span>
            <p className="col-start-5 col-end-7 text-2xl text-gray-700 font-bold text-end">
              รายละเอียดราคากลาง :
            </p>
            <div className="col-start-7 col-end-10">
              <button
                className="px-6 py-1.5 ml-4 border rounded-lg bg-white text-[#2B3467] drop-shadow-md font-bold text-xl"
                onClick={() => {
                  showFileOnClick(infoProject?.calculate_uri || "");
                }}
              >
                ดาวโหลด
              </button>

            </div>
          </div>
        </div>
        {<PCRPriceList />}
        {<PCRSelectedBidder />}
        <div className="grid grid-cols-2 gap-6 mt-12">
          <div className="block w-full">
            <p className="text-3xl font-bold text-[#2B3467] mb-3">
              สรุปผลการประกวดราคาจากคณะกรรมการ
            </p>
            <select className="border border-gray-400 rounded w-full py-2 px-3 mt-2 text-xl text-center focus:shadow-outline">
              <option disabled selected className="text-[#1F7600]">
                โปรดเลือก
              </option>
              <option className="text-[#1F7600]">
                เห็นควรให้ผู้เสนอราคาต่ำสุดเป็นผู้ชนะการประกวดราคา
              </option>
              <option className="text-[#1F7600]">
                เห็นควรเจรจาเนื่องจากมีผู้เสนอราคาต่ำสุดมากกว่า 1 ราย
              </option>
              <option className="text-[#1F7600]">
                เห็นควรให้ผู้เสนอราคาต่ำสุดเป็นผู้ชนะการประกวดราคา
              </option>
              <option className="text-[#1F7600]">
                เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง
              </option>
              <option className="text-[#1F7600]">
                เห็นควรล้มการประกวดราคา
              </option>
            </select>
          </div>

          <div className="">
            <p className="text-3xl font-bold text-[#2B3467] mb-3">
              ความเห็นเพิ่มเติม
            </p>
            <textarea className="block p-2.5 w-full h-40 text-lg text-gray-900 bg-white rounded-lg border drop-shadow-md border-gray-400 focus:ring-blue-500 focus:border-blue-500 "></textarea>
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <button className="px-8 py-2.5 rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl col-start-2">
            ยืนยันความเห็นและลงนามเปิดซอง
          </button>
        </div>
      </div>
    </div>
  );
}
