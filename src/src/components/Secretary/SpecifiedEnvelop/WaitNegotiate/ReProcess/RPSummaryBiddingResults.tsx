import { useEffect, useState } from "react";
import { GetAllTopicCommentDirector } from "../../../../../services/SecretaryService/HttpClientService";
import { useIWNRprocessContext } from "../WNReprocess";
import { GetSummaryCommmentByProjectId } from "../../../../../services/SecretaryService/HttpClientService";
import { dateWithTimeFormatter } from "../../../../../services/utilitity";
interface topicInterface {
  id: string;
  status_comment: string;
  topic_comment: string;
}

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

export default function RPSummaryBiddingResults() {
  const queryParameters = new URLSearchParams(window.location.search);

  const { summary, setSummary, isSuccess, setIsSuccess } =
    useIWNRprocessContext();
    const [summaryCommment, setSummaryCommment] = useState<ISummaryCommment[]>([]);

  const [topic, setTopic] = useState<topicInterface[]>([]);
  const getAllTopicComment = async () => {
    const res = await GetAllTopicCommentDirector();
    setTopic(res.data);
  };

  const getSummaryCommmentByProjectId = async (id: string) => {
    const res = await GetSummaryCommmentByProjectId(id);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    console.log(666)
    console.log(res.data)
    setSummaryCommment(res.data);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const name = event.target.name as keyof typeof summary;
    if (name == "topic_id") {
      const status = topic.filter((item) => item.id == event.target.value)[0]
        .status_comment;

      if (status !== "unsuccess") {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    }
    setSummary({
      ...summary,
      [name]: event.target.value,
    });
  };

  useEffect(() => {
    getAllTopicComment();
    const id = queryParameters.get("project_id");
    if (id !== null) {
      getSummaryCommmentByProjectId(id);
    }
  }, []);

  return (
    <div>
      <div className="bg-[#2B2A2A] w-full h-[120px] flex items-center justify-center">
                <p className="text-3xl font-bold text-white px-32">ผลสรุปความเห็นครั้งก่อนหน้า</p>
            </div>
  <div className=" pt-6 pb-6 rounded-2xl">
      <table className="w-full drop-shadow-lg rounded-lg table-fixed">
        <thead className="text-white text-2xl uppercase bg-[#6C6C6C] h-14">
          <tr>
          <th className="justify-self-center text-lg">ครั้งที่</th>
          <th className="justify-self-center text-lg">สรุปความคิดเห็น</th>
          <th className="justify-self-center text-lg">ความคิดเห็นเพิ่มเติม</th>
          <th className="justify-self-center text-lg">วันที่/เวลา ( ที่เลขากดสรุป )</th>
          </tr>
        </thead>
      
        <tbody className="bg-white border-b-lg rounded-xl h-14">
          {
            summaryCommment.map((item) => (
              <tr key={item.id} className="text-gray-700 text-xl h-14  border-b-2  border-black-700 text-center" style={{ verticalAlign: 'top' }} >

                        <td className="text-lg py-5  text-center">{Number(item.order)}</td>
                        <td className="text-lg py-5 text-center">{item.topic_comment}</td>
                        <td className="text-lg py-5 pl-2 text-[#2FAC10] text-center">{item.comment}</td>
                        <td className="text-lg py-5 ">{dateWithTimeFormatter(item.submit_datetime as Date)} น.</td>
                      </tr> 
            ))
            }
        </tbody>
      </table>
  </div>

      <div className=" pb-8 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full mt-5 mr-5">
          <div className="px-24 py-14 flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="block w-full">
                <p className="text-2xl font-bold text-[#2B3467] mb-3">
                สรุปการประกวดราคาที่ประมวลผลใหม่
                </p>
                <select
                  name="topic_id"
                  className="border border-gray-400 rounded w-full py-2 px-3 mt-2 text-lg text-center focus:shadow-outline"
                  onChange={handleInputChange}
                  value={summary.topic_id || "DEFAULT"}
                >
                  <option disabled value="DEFAULT" className="text-[#1F7600]">
                    โปรดเลือก
                  </option>
                  {topic.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="text-[#1F7600]"
                    >
                      {item.topic_comment}
                    </option>
                  ))}
                </select>
              </div>

              <div className="">
                <p className="text-2xl font-bold text-[#2B3467] mb-3">
                  ความเห็นเพิ่มเติม
                </p>
                <textarea
                  className="block p-2.5 w-full h-40 text-lg text-gray-900 bg-white rounded-lg border drop-shadow-md border-gray-400 focus:ring-blue-500 focus:border-blue-500 "
                  onChange={handleInputChange}
                  name="comment"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
