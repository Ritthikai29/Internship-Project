import { useEffect, useState } from "react";
import { GetAllTopicCommentDirector, GetFinalCommentByProjectId } from "../../../../../services/SecretaryService/HttpClientService"

interface ITopic {
    id?: number | string;
    topic_comment: string;
    status_comment: string;
}

interface ICommentSecretary {
    id?: string | number;
    topic_id: string | number;
    topic_comment: string;
    status_comment: string;
    comment: string;
}

export default function ONPSummaryBiddingResults() {

    const queryParameters = new URLSearchParams(window.location.search);
    const [topic, setTopic] = useState<ITopic[]>([]);
    const [commentSecretary, setCommentSecretary] = useState<ICommentSecretary>()

    const getAllOption = async () => {
        const res = await GetAllTopicCommentDirector();
        setTopic(res.data)
    }

    const getCommentSecretary = async () => {
        const res = await GetFinalCommentByProjectId(
            queryParameters.get("project_id") || ""
        )
        setCommentSecretary(res.data)
    }


    useEffect(() => {
        getAllOption()
        getCommentSecretary()
    }, [])

    return (
        <div>
            <div className=" pb-8 rounded-2xl">
            <p className="text-2xl text-[#2B3467] font-bold">1) ผลสรุปจากการพิจารณาของคณะกรรมการ</p>
                <div className="bg-white drop-shadow-lg rounded-xl border w-full mt-5 mr-5">
                    <div className="px-24 py-14 flex flex-col gap-8">
                        
                        <div className="grid grid-cols-2 gap-6">
                        <div className="block w-full">
                            <p className="text-2xl font-bold text-[#2B3467] mb-3">สรุปผลการประกวดราคาจากคณะกรรมการ</p>
                                <div className="border border-gray-400 rounded w-full py-2 px-3 mt-2 text-xl text-center focus:shadow-outline">
                                    {commentSecretary ? commentSecretary.topic_comment : "โปรดเลือก"}
                                </div>
                            </div>
                            <div className="">
                                <p className="text-2xl font-bold text-[#2B3467] mb-3">ความเห็นเพิ่มเติม</p>
                                <textarea
                                    className="block p-2.5 w-full h-40 text-lg text-gray-900 bg-white rounded-lg border drop-shadow-md border-gray-400 focus:ring-blue-500 focus:border-blue-500 "
                                    value={commentSecretary?.comment}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}