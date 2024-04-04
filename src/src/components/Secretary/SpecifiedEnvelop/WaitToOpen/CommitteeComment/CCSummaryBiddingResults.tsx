import { useEffect, useRef, useState } from "react";
import { GetAllTopicCommentDirector } from "../../../../../services/SecretaryService/HttpClientService"
import { useAutoSizeTextArea } from "../../../../../services/utilitity";
import { useSecretarySumContext } from "../WTOCommitteeComment";



export default function CCSummaryBiddingResults() {

    const [topic, setTopic] = useState<any>([]);
    const getAllTopicComment = async () => {
        const res = await GetAllTopicCommentDirector();
        setTopic(res.data);
    }

    const { 
        secretarySum, 
        setSecretarySum ,
        isSuccess,
        setIsSuccess
    } = useSecretarySumContext();

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutoSizeTextArea(textAreaRef.current, secretarySum.comment as string);

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        const name = evt.target.name as keyof typeof secretarySum;
        const value = evt.target.value;

        if(name === "topic_id"){
            const status_comment = topic.filter((item: any) => (item.id == value))[0]["status_comment"];
            console.log(status_comment)
            if(status_comment === "success" || status_comment === "failed"){
                setIsSuccess(true)
            }else{
                setIsSuccess(false)
            }
        }

        setSecretarySum(
            {
                ...secretarySum,
                [name]: value
            }
        );
    };
    useEffect(() => {
        getAllTopicComment();
    }, []);

    return (
        <div>
            <div className="w-full pb-8 rounded-2xl">
                <div className="bg-white drop-shadow-lg rounded-xl border w-full mt-5 mr-5">
                    <div className="px-24 py-14 flex flex-col gap-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="block w-full">
                                <p className="text-2xl font-bold text-[#2B3467] mb-3">สรุปผลการประกวดราคาจากคณะกรรมการ</p>
                                <select
                                    className="border border-gray-400 rounded w-full py-2 px-3 mt-2 text-xl text-center focus:shadow-outline"
                                    onChange={handleChange}
                                    value={secretarySum.topic_id || "DEFAULT"}
                                    name="topic_id"
                                >
                                    <option disabled value={"DEFAULT"} className="text-[#1F7600]">โปรดเลือก</option>
                                    {
                                        topic.map((item: any) => (
                                            <option key={item.id} value={item.id}>{item.topic_comment}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="">
                                <p className="text-2xl font-bold text-[#2B3467] mb-3">ความเห็นเพิ่มเติม</p>
                                <textarea
                                    className="block p-2.5 w-full h-40 text-lg text-gray-900 bg-white rounded-lg border drop-shadow-md border-gray-400 focus:ring-blue-500 focus:border-blue-500 "
                                    value={secretarySum.comment || ""}
                                    name="comment"
                                    ref={textAreaRef}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}