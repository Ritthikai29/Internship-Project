import { useEffect, useState } from "react";
import { GetAllCommentProjectByProjectId } from "../../../../../services/SecretaryService/HttpClientService";
import { DetailProject } from "../../../../../services/ProjectServices";

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


export default function CSummaryBiddingResults() {
  const [comments, setComments] = useState<string[] | undefined>(undefined);
  const queryParameters = new URLSearchParams(window.location.search);


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
    const mostFrequentObjectInfo = findMostFrequentKey(res.data);
    setComments([mostFrequentObjectInfo.key]);
    

console.log("Most Frequent Object:", mostFrequentObjectInfo.key);
console.log("Count:", mostFrequentObjectInfo.count);
console.log("comment:", comments);
  };


  useEffect(() => {
    getDetailProject();
  }, []);

  return (
    <div>
      <div className="w-full pb-4 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full mt-5 mr-5">
          <div className="px-10 py-8 flex flex-col gap-8">
            <div className="gap-6">
              <div className="block w-full">
                <p className="text-3xl font-bold text-[#2B3467] mb-3">
                  สรุปผลการประกวดราคาจากคณะกรรมการ
                </p>
                <p className="text-2xl text-[#DDB010] ">{comments}</p>

              </div>

              {/* <div className="">
                <p className="text-3xl font-bold text-[#2B3467] mb-3">
                  ความเห็นเพิ่มเติม
                </p>
                <textarea className="block p-2.5 w-full h-40 text-xl text-gray-900 bg-white rounded-lg border drop-shadow-md border-gray-400 focus:ring-blue-500 focus:border-blue-500 "></textarea>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// func ในการตรวจสอบว่าความคิดเห็นกรรมการเป็นไปในทางไหนมากที่สุดเพื่อสรุป
function findMostFrequentKey(objects: ICommentCommittee[]): { key: string; count: number } {
  const keyCount: Record<string, number> = {};

  objects.forEach(obj => {
    const topic_comment = obj.topic_comment
    if (keyCount[topic_comment]) {
      keyCount[topic_comment]++;
    } else {
      keyCount[topic_comment] = 1;
    }
  });

  let mostFrequentKey = "";
  let maxCount = 0;

  for (const [topic_comment, count] of Object.entries(keyCount)) {
    if (count > maxCount) {
      mostFrequentKey = topic_comment;
      maxCount = count;
    }
  }

  return { key: mostFrequentKey, count: maxCount };
}

