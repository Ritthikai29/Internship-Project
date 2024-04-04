import { useEffect, useState } from "react";
import { GetSummaryCommmentByProjectId } from "../../../../../services/SecretaryService/HttpClientService";
import { DetailProject } from "../../../../../services/ProjectServices";
import { dateWithTimeFormatter } from "../../../../../services/utilitity";

interface ISummaryCommment {
  id: string | number;
  topic_comment: string;
  comment: string;
  project_id: string | number;
  secretary_id: string | number;
  is_success: string | number | null;
  is_approve: string | number | null;
  approver_id: string | number;
  order: string | number | null;
  submit_datetime: string | Date | null;
}

export default function CASummaryBiddingResults() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [summaryCommment, setSummaryCommment] = useState<ISummaryCommment[]>(
    []
  );

  const getDetailProject = async () => {
    let res = await DetailProject(queryParameters.get("key") || "");
    if (res.status !== 200) {
      alert("err");
      return;
    }
    console.log(res);
    await getSummaryCommmentByProjectId(res.data.id);
  };

  const getSummaryCommmentByProjectId = async (id: string) => {
    const res = await GetSummaryCommmentByProjectId(id);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setSummaryCommment(res.data);
  };
  useEffect(() => {
    getDetailProject();
    const id = queryParameters.get("pid");
    if (id !== null) {
      getSummaryCommmentByProjectId(id);
    }
  }, []);
  return (
    <div>
      <div className="bg-[#2B2A2A] w-full h-[120px] flex items-center justify-center">
        <p className="text-3xl font-bold text-white px-32">
          ผลสรุปความเห็นครั้งก่อนหน้า
        </p>
      </div>
      <div className=" pt-6 pb-6 rounded-2xl">
        <table className="w-full drop-shadow-lg rounded-lg table-fixed">
          <thead className="text-white text-2xl uppercase bg-[#6C6C6C] h-14">
            <tr>
              <th className="justify-self-center text-lg">ครั้งที่</th>
              <th className="justify-self-center text-lg">สรุปความคิดเห็น</th>
              <th className="justify-self-center text-lg">
                ความคิดเห็นเพิ่มเติม
              </th>
              <th className="justify-self-center text-lg">
                วันที่/เวลา ( ที่เลขากดสรุป )
              </th>
            </tr>
          </thead>

          <tbody className="bg-white border-b-lg rounded-xl h-14">
            {summaryCommment.map((item) => (
              <tr
                key={item.id}
                className="text-gray-700 text-xl h-14  border-b-2  border-black-700 text-center"
                style={{ verticalAlign: "top" }}
              >
                <td className="text-lg py-5  text-center">
                  {Number(item.order)}
                </td>
                <td className="text-lg py-5 text-center">
                  {item.topic_comment}
                </td>
                <td className="text-lg py-5 pl-2 text-[#2FAC10] text-center">
                  {item.comment}
                </td>
                <td className="text-lg py-5 ">
                  {dateWithTimeFormatter(item.submit_datetime as Date)} น.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
