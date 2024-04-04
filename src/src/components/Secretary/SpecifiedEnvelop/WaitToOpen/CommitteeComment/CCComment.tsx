import { useEffect, useState } from "react";
import { GetAllCommentProjectByProjectId } from "../../../../../services/SecretaryService/HttpClientService";
import { IVendorProject } from "../../../../../models/Secretary/IProjectSecretary";
import { dateWithTimeFormatter } from "../../../../../services/utilitity";
import LimitStringWithUrl from "../../../../PreLoadAndEtc/LongLetter";

interface ICommentCommittee {
  id: string | number;
  detail_comment: string;
  comment_id: string;
  status_comment: string;
  topic_comment: string;
  submit_datetime: string | Date;
  employeeNO: string;
  nametitle_t: string;
  firstname_t: string;
  lastname_t: string;
  director_role_id: string;
  role_name: string;
  role_name_t: string;
}

export default function CCComment() {
  const queryParameters = new URLSearchParams(window.location.search);

  const [comments, setComments] = useState<ICommentCommittee[]>([]);

  const getAllCommentByProjectId = async () => {
    const res = await GetAllCommentProjectByProjectId(
      queryParameters.get("project_id") || ""
    );
    setComments(res.data);
  };

  useEffect(() => {
    getAllCommentByProjectId();

    const timeInterval = setInterval(() => {
      getAllCommentByProjectId();
    }, 15000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div>
      <div className="bg-[#2B2A2A] w-full mx-auto h-[120px] flex items-center justify-center">
        <p className="text-3xl font-bold text-white px-32">
          ความเห็นของคณะกรรมการ
        </p>
      </div>
      <div className="w-full pt-16 pb-8 rounded-2xl">
        <table className="w-full drop-shadow-lg rounded-lg table-fixed">
          <thead className="text-white text-xl uppercase bg-[#6C6C6C] h-14">
            <tr>
              <th className="justify-self-center text-lg">ชื่อ-นามสกุล</th>
              <th className="justify-self-center text-lg">บทบาท</th>
              <th className="justify-self-center text-lg">ความคิดเห็น</th>
              <th className="justify-self-center text-lg">
                ความคิดเห็นเพิ่มเติม
              </th>
              <th className="justify-self-center text-lg">วัน/เวลาลงนาม</th>
            </tr>
          </thead>
          <tbody className="bg-white border-b-lg rounded-lg h-14">
            {comments
              .sort(function (a, b) {
                const nametitleComparison = b.nametitle_t.localeCompare(
                  a.nametitle_t
                );

                if (a.role_name_t === "เลขาคณะกรรมการเปิดซอง") {
                  return 1;
                } else if (b.role_name_t === "เลขาคณะกรรมการเปิดซอง") {
                  return -1;
                } else if (a.role_name_t === "ประธาน") {
                  return -1;
                } else if (b.role_name_t === "ประธาน") {
                  return 1;
                } else {
                  // If roles are neither "เลขาคณะกรรมการเปิดซอง" nor "ประธาน", use nametitle comparison
                  if (nametitleComparison !== 0) {
                    return nametitleComparison;
                  } else {
                    // If nametitle is the same, return 0
                    return 0;
                  }
                }
              })
              .map((item, index) => (
                <tr
                  key={item.id}
                  className="text-gray-700 text-lg h-14  border-b-2 border-black-700 text-center"
                  style={{ verticalAlign: "top" }}
                >
                  <td className="text-lg py-5 pl-12 text-left">
                    {item.nametitle_t} {item.firstname_t} {item.lastname_t}
                  </td>
                  <td className="text-lg py-5">{item.role_name_t}</td>
                  <td className={`text-lg py-5 pl-2 ${
                        item.topic_comment === "เห็นควรล้มการประกวดราคา" ? "text-[#FF0000]" :
                        item.topic_comment === "เห็นควรให้ผู้เสนอราคาต่ำสุดเป็นผู้ชนะการประกวดราคา" ? "text-[#2FAC10]" :
                        "text-[#FFA500]"
                    }`} title={item.topic_comment}>
                        {item.topic_comment}
                    </td>
                  <td
                    className="text-lg py-5 pl-10 text-center"
                    style={{ verticalAlign: "top", lineHeight: "1.5" }}
                  >
                    {item.detail_comment ? (
                      <LimitStringWithUrl string={item.detail_comment} maxChars={100}/>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="text-lg py-5 ">
                    {dateWithTimeFormatter(item.submit_datetime)} น.
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
