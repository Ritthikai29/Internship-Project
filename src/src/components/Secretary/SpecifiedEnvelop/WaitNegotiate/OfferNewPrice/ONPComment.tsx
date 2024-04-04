import { useEffect, useState } from "react";
import { GetAllCommentProjectByProjectId } from "../../../../../services/SecretaryService/HttpClientService";
import { dateWithTimeFormatter } from "../../../../../services/utilitity";
import LimitStringWithUrl from "../../../../PreLoadAndEtc/LongLetter";


interface ICommitteeComment {
    comment_id: string;
    detail_comment: string;
    director_id: string;
    director_role_id: string;
    employeeNO: string;
    firstname_t: string;
    id: string;
    lastname_t: string;
    nametitle_t: string;
    project_id: string;
    role_name: string;
    role_name_t: string;
    status_comment: string;
    submit_datetime: string;
    topic_comment: string;
}

export default function CCComment() {

    const queryParameters = new URLSearchParams(window.location.search);

    const [comments, setComments] = useState<ICommitteeComment[]>([])

    const getCommitteeComment = async () => {
        const res = await GetAllCommentProjectByProjectId(
            queryParameters.get("project_id") || ""
        )
        setComments(res.data)
    }


    useEffect(() => {
        getCommitteeComment()
    }, [])

    return (
        <div>
            <div className="bg-[#2B2A2A] w-full h-[120px] flex items-center justify-center">
                <p className="text-3xl font-bold text-white px-32">ความเห็นของคณะกรรมการ</p>
            </div>
            <div className=" pt-6 pb-6 rounded-2xl">
                <table className="w-full drop-shadow-lg rounded-lg table-fixed">
                    <thead className="text-white text-lg uppercase bg-[#6C6C6C] h-14">
                        <tr>
                            <th className="justify-self-center ">ชื่อ-นามสกุล</th>
                            <th className="justify-self-center ">บทบาท</th>
                            <th className="justify-self-center ">ความคิดเห็น</th>
                            <th className="justify-self-center ">ความคิดเห็นเพิ่มเติม</th>
                            <th className="justify-self-center ">วัน/เวลาลงนาม</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white border-b-lg rounded-xl h-14">
                        {
                            comments.sort(
                                function(a,b){
                                    if(a.role_name_t == "เลขาคณะกรรมการเปิดซอง"){
                                        return 1
                                    } else if(b.role_name_t ==  "เลขาคณะกรรมการเปิดซอง"){
                                        return -1
                                    }else if(a.role_name_t === "ประธาน"){
                                        return -1
                                    }else if(b.role_name_t === "ประธาน"){
                                        return 1
                                    } else{
                                        return -1
                                    }
                                }
                            ).map((item) => (
                                <tr key={item.id} className="text-gray-700 text-xl h-14  border-b-2 border-black-700 text-center" style={{ verticalAlign: 'top' }}>
                                    <td className="text-lg py-5 pl-10 text-left">{item.nametitle_t} {item.firstname_t} {item.lastname_t}</td>
                                    <td className="text-lg py-5">{item.role_name_t}</td>
                                    <td className={`text-lg py-5 pl-2 ${item.status_comment.toLowerCase() == "success" ? "text-[#2FAC10]" : "text-[#FF0000]"}`}>เห็นควรเจรจาเพื่อต่อรองราคาเพื่อให้ต่ำกว่าราคากลาง</td>
                                    <td className="text-lg py-5 pl-5 text-center">
                                    {item.detail_comment ? <LimitStringWithUrl string={item.detail_comment} maxChars={100}/> : "-"}
                                        </td>
                                    <td className="text-lg py-5 ">{dateWithTimeFormatter(item.submit_datetime)} น.</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}