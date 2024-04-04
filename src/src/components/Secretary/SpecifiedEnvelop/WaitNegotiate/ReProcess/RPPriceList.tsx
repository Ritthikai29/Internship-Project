import { useEffect, useState } from "react";
import {
  IProject,
  IVendorProject,
} from "../../../../../models/Secretary/IProjectSecretary";
import { GetAllVendorProjectBidResultByProjectKey } from "../../../../../services/SecretaryService/HttpClientService";

export default function RPPriceList({ project }: { project: IProject }) {
  const [listVendors, setListVendors] = useState<IVendorProject[]>([]);
  const getAllVendorResultByProjectId = async () => {
    const res = await GetAllVendorProjectBidResultByProjectKey(project.key);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    setListVendors(res.data);
    console.log(res);
  };

  useEffect(() => {
    getAllVendorResultByProjectId();
  }, []);
  return (
    <div>
      <div className="bg-[#F5F5F5]">
        <div className="px-[8rem] py-16 rounded-2xl">
          <table className="w-full drop-shadow-lg rounded-lg table-fixed p-10">
            <thead className="text-white text-2xl uppercase bg-[#6C6C6C] h-14">
              <tr>
                <th className="justify-self-center">ชื่อบริษัท/หน่วยงาน</th>
                <th className="justify-self-center ">สถานะ</th>
                <th className="justify-self-center text-right">ราคาที่เสนอ</th>
                <th className="justify-self-center text-right pr-10">
                  ราคาเสนอใหม่
                </th>
              </tr>
            </thead>
            <tbody className="bg-white border-b-lg rounded-xl h-14 text-2xl">
              {listVendors.map((item, index) => (
                <tr
                  key={item.id}
                  className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center"
                >
                  <td className="text-2xl py-3 pl-2">{item.company_name}</td>
                  <td
                    className={`text-2xl py-3 pl-2 ${
                        item.result === "win"
                        ? "py-3 pl-2 text-green-500 text-2xl"
                        : item.result === "draw"
                        ? "py-3 pl-2 text-orange-500 text-2xl"
                        : ((item.result === "lose") && !(item.price)) && !(item.registers_status_id === "11")
                        ? "py-3 pl-2 text-black-500 text-2xl"
                        :item.registers_status_id === "11"?
                        "py-3 pl-2 text-red-500 text-2xl"
                        : "py-3 pl-2 text-red-500 text-2xl"
                    }`}
                  >
                    {item.result === "win"
                      ? "ชนะการประมูล"
                      : item.result === "draw"
                      ? "จำเป็นต้องประมวลผลต่อ"
                      : item.registers_status_id == "11"
                      ? "สละสิทธิ์"
                      : item?.result === "lose" && !item.price
                      ? "ไม่มีการเสนอราคา"
                      : "แพ้การประมูล"}
                  </td>
                  <td className={`text-2xl text-right`}>
                    {item.price
                      ? item.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })
                      : "ไม่มีราคาเสนอ"}
                  </td>
                  <td className={`text-2xl text-right pr-10`}>
                    {item.newPrice
                      ? item.newPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })
                      : "ไม่มีราคาเสนอ"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
