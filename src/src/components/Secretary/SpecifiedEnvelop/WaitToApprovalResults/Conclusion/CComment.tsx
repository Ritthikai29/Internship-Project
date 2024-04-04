import { useEffect, useState } from "react";
import { GetAllCommentProjectByProjectId } from "../../../../../services/SecretaryService/HttpClientService";

import { DetailProject } from "../../../../../services/ProjectServices";
import { DetailProjectInterface } from "../../../../../models/Project/IListWaitProject";

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

export default function CComment() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [comments, setComments] = useState<ICommentCommittee[]>([]);

  const getDetailProject = async () => {
    let res = await DetailProject(queryParameters.get("key") || "");
    if (res.status !== 200) {
      alert("err");
      return;
    }
    console.log(res);
    await getAllCommentByProjectId(res.data.id);
  };

  const getAllCommentByProjectId = async (id: string) => {
    const res = await GetAllCommentProjectByProjectId(id);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setComments(res.data);
  };

  useEffect(() => {
    getDetailProject();
  }, []);

  return (
    <div>
      <div className="bg-[#2B2A2A]  mx-auto h-[120px] flex items-center justify-center">
        <p className="text-3xl font-bold text-white px-32">
          ความเห็นของคณะกรรมการ
        </p>
      </div>
      <div className="pt-4 pb-4 rounded-2xl">
        <table className="w-full drop-shadow-lg rounded-lg table-fixed">
          <thead className="text-white text-xl uppercase bg-[#6C6C6C] h-14">
            <tr>
              <th className="justify-self-center">ชื่อ-นามสกุล</th>
              <th className="justify-self-center ">บทบาท</th>
              <th className="justify-self-center ">ความคิดเห็น</th>
              <th className="justify-self-center ">อื่นๆ</th>
              <th className="justify-self-center  ">วัน/เวลาลงนาม</th>
            </tr>
          </thead>
          <tbody className="bg-white border-b-lg rounded-xl h-14">
            {comments
              .sort(function (a, b) {
                if (a.role_name_t == "เลขาคณะกรรมการเปิดซอง") {
                  return 1;
                } else if (b.role_name_t == "เลขาคณะกรรมการเปิดซอง") {
                  return -1;
                } else if (a.role_name_t === "ประธาน") {
                  return -1;
                } else if (b.role_name_t === "ประธาน") {
                  return 1;
                } else {
                  return -1;
                }
              })
              .map((item, index) => (
                <tr
                  key={item.id}
                  className="text-gray-700 text-lg h-14 border-b-2 border-black-700 text-center "
                  style={{ verticalAlign: "top" }}
                >
                  <td className="py-5 pl-10 text-left ">
                    {item.nametitle_t} {item.firstname_t} {item.lastname_t}
                  </td>
                  <td className="py-5 pl-2 ">{item.role_name_t}</td>

                  <td className="py-5 pl-2 ">
                    {item.status_comment === "success" ? (
                      <span className="py-3 pl-2 text-[#2FAC10]">
                        {item.topic_comment}
                      </span>
                    ) : item.status_comment === "unsuccess" ? (
                      <span className="py-3 pl-2 text-[#ec7332]">
                        {item.topic_comment}
                      </span>
                    ) : (
                      <span className="py-3 pl-2 text-[#fc2f2f]">
                        {item.topic_comment}
                      </span>
                    )}
                  </td>

                  <td  className=" py-5 pl-10 text-center">{item.detail_comment ? <LimitStringWithUrl string={item.detail_comment} maxChars={100}/> : "-"}</td>

                  <td className=" py-5 ">{dateWithTimeFormatter(item.submit_datetime)} น.</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
