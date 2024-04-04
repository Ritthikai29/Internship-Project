import { useNavigate } from "react-router-dom";

import CAPProjectName from "./CompareAveragePrices/CAPProjectName";
import CAPPriceList from "./CompareAveragePrices/CAPPriceList";

import { BiSolidLeftArrow } from "react-icons/bi";
import { useEffect, useState } from "react";
import {
  CreateCommentProjectDirector,
  GetAllTopicCommentDirector,
  GetAllVendorProjectBidResultByProjectKey,
  GetProjectByOpenIdAndProjectId,
  getDetailComment,
} from "../../../../services/SecretaryService/HttpClientService";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  IProject,
  IVendorProject,
} from "../../../../models/Secretary/IProjectSecretary";
import PageLoad from "../../../PreLoadAndEtc/PageLoader";

interface ITopicComment {
  id?: string | number;
  topic_comment: string;
  status_comment: string;
}

export default function WTOCompareAveragePrices() {
  const navigate = useNavigate();

  const mySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(true);

  const queryParameters = new URLSearchParams(window.location.search);
  const [openId] = useState<string>(queryParameters.get("open_id") || "");
  const [projectId] = useState<string>(queryParameters.get("project_id") || "");
  const [project, setProject] = useState<IProject>();

  const [listVendor, setListVendor] = useState<IVendorProject[]>([]);
  const [resultVendors, setResultVendors] = useState<IVendorProject[]>([]);

  const [checkresultVendors, setCheckResultVendors] = useState(false);

  const [listTopic, setListTopic] = useState<ITopicComment[]>([]);
  const [result, setResult] = useState<any>({});
  const [comment_id, setComment_id] = useState<any>({});
  const [detailcomment, setDetailComment] = useState("");

  const [page, setPage] = useState<string>("Home");

  const [comment, setComment] = useState<any>({
    passcode: localStorage.getItem("passcode"),
    project_id: queryParameters.get("project_id"),
  });

  const getProjectByOpenIdAndProjectId = async () => {
    let res = await GetProjectByOpenIdAndProjectId(openId, projectId);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    setProject(res.data);

    await getAllVendorOfProjectInBidding(res.data.key);
    // console.log(res.data.id);
    // await getDetailComment(res.data.key)
  };

  const getAllVendorOfProjectInBidding = async (key: string) => {
    let res = await GetAllVendorProjectBidResultByProjectKey(key);
    if (res.status !== 200) {
      // alert(res.err)
      setCheckResultVendors(true);
      return;
    }
    setListVendor(res.data);
    setResultVendors(res.result);
    setResult(res.res_status);
    console.log(5555)
    console.log(res.result)
  };

  const getAllTopicComment = async () => {
    let res = await GetAllTopicCommentDirector();
    setListTopic(res.data);
  };

  const getDetailCommentt = async () => {
    let res = await getDetailComment(projectId);
    setDetailComment(res.data[0].detail_comment);
    setComment_id(res.data[0].comment_id);
    setComment({
      ...comment,
      topic_id: res.data[0].comment_id,
      comment: res.data[0].detail_comment,
    });
  };

  const handleChangeInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const name = e.target.name;
    console.log(name);
    console.log(e.target.value);
    setComment({
      ...comment,
      [name]: e.target.value,
    });
  };

  const backPageButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCheckResultVendors(false);
    window.history.back();
  };

  const handleSubmitComment = async () => {
    mySwal
      .fire({
        title: (
          <h3 className="text-[#2B3467] text-4xl">ยืนยันการลงความคิดเห็น</h3>
        ),
        html: (
          <div className="h-20 flex flex-col text-red-500 text-xl">
            <p>การยืนยันความคิดเห็นนี้เป็นเพียงเบื้องต้นเท่านั้น</p>
            <p>กรุณากรอกความคิดเห็นตามที่ท่านเห็นสมควร</p>
          </div>
        ),
        showCancelButton: true,
        confirmButtonText: <p className="text-3xl">ยืนยัน</p>,
        confirmButtonColor: "#EB455F",
        cancelButtonText: <p className="text-3xl">ยกเลิก</p>,
        preConfirm: async () => {
          console.log(comment);
          let res = await CreateCommentProjectDirector(comment);
          if (res.status !== 200) {
            mySwal.showValidationMessage(res.err);
          }
          return res.data;
        },
      })
      .then((response) => {
        if (response.isConfirmed) {
          mySwal
            .fire({
              title: (
                <h3 className="text-4xl text-green-500">ดำเนินการสำเร็จ</h3>
              ),
              icon: "success",
              confirmButtonText: <p className="text-2xl">ยืนยัน</p>,
            })
            .then(() => {
              setCheckResultVendors(false);
              navigate(
                `/secretary/specifiedevenelope/wto/selectjobstoopen?open_id=${openId}&page=summary`
              );
            });
        }
      });
  };
  useEffect(() => {
    const fetchData = async () => {
        getDetailCommentt();
      try {
        await getProjectByOpenIdAndProjectId();
        await getAllTopicComment();
        setLoading(false);
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#F5F5F5]">
      {loading ? (
        <PageLoad />
      ) : (
        <div className="px-[2rem] py-12 rounded-2xl">
          <div className="bg-[#1D5182] py-4 text-white rounded-lg">
            {/* <p className="text-xl text-end pr-4">
              เลขที่เอกสาร : {project?.key}
            </p> */}
            <p className="text-4xl font-bold pl-16 text-center">
              เปรียบเทียบราคากลางตามรายการ
            </p>
          </div>
          <div className="pb-4">
            {<CAPProjectName project={project as IProject} />}
          </div>
          
          {<CAPPriceList vendor={listVendor} project={project as IProject} />}
          <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
            <div className="px-10 py-14 flex flex-col">
              <p className="text-3xl text-[#2B3467] font-bold mb-6">
                ผลการพิจารณาการคัดเลือกเบื้องต้น
              </p>
              <p
                className={`text-2xl ${
                  result?.status == "success"
                    ? "text-[#1F7600]"
                    : "text-[#ff4640]"
                }`}
              >
                {result?.text}
              </p>
              <p className="text-xl">โดยมีรายละเอียดดังนี้</p>
              <hr className="mb-2 mt-2"></hr>
              <div className="border border-black rounded p-4 ">
              {checkresultVendors === true ? (
                <p className="text-lg text-[#EB455F]">ไม่มีผู้เสนอราคา</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="text-xl"> 
                        <th className="px-4 py-2"></th>
                        <th className="px-4 py-2">Vendor ที่ได้รับคัดเลือก</th>
                        <th className="px-4 py-2 w-[18rem]">ราคาที่เสนอ</th>
                        
                        <th className="px-4 py-2 w-[22rem]">ข้อเสนอแนะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultVendors.map((item, index) => (
                        <tr key={index} className="text-lg">
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2 text-[#398dba] font-bold">
                            {item.company_name}
                          </td>
                          <td className="border px-4 py-2 text-[#459c36] text-center">
                            {item.newPrice !== "-" && item.newPrice !== undefined
                              ? item.newPrice?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })
                              : item.price?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                }) || "N/A"} {project?.project_unit_price}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {item.result === "win"
                              ? "ซึ่งมีราคาต่ำที่สุด"
                              : "ซึ่งเห็นควรพิจารณาเสนอเจรจาต่อรอง"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </div>

              <hr className="mb-12 mt-6"></hr>
              <div className="grid grid-cols-2 gap-6">
                <div className="block w-full">
                  <p className="text-2xl font-bold text-[#2B3467] mb-3">
                    สรุปผลการประกวดราคาจากคณะกรรมการ
                  </p>
                  <select
                    value={
                      comment.topic_id !== null ? comment.topic_id : comment_id
                    }
                    name="topic_id"
                    className="border border-gray-400 rounded w-full py-2 px-3 mt-2 text-xl text-center focus:shadow-outline"
                    onChange={handleChangeInput || comment_id}
                  >
                    <option
                      value={0}
                      disabled
                      selected
                      className="text-[#1F7600]"
                    >
                      โปรดเลือก
                    </option>
                    {listTopic.map((item) => (
                      <option value={item.id} className="text-[#1F7600]">
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
                    onChange={handleChangeInput}
                    defaultValue={detailcomment} // กำหนดค่า value เพื่อแสดงค่าเดิม
                    name="comment"
                  ></textarea>
                </div>
              </div>
              <div className="grid grid-cols-12 mt-20">
                <button
                  className="px-8 py-3 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-xl col-start-1 col-end-3 text-center inline-flex items-center"
                  onClick={backPageButton}
                >
                  <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                  ย้อนกลับ
                </button>

                <button
                  className="px-8 py-3 rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-xl  col-start-5 col-end-10 text-center"
                  onClick={() => {
                    handleSubmitComment();
                  }}
                >
                  ยืนยันความเห็นและลงนามปิดซอง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
