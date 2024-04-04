import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DetailProjectInterface } from "../../../models/Project/IListWaitProject";
import { BiSolidLeftArrow } from "react-icons/bi";
import { GetVendorResultPriceCompare } from "../../../services/SecretaryService/ComparisionService";
import { getProjectCurrentStatus } from "../../../services/CommitteeService/OpenJobService";
import {
  CreateCommentProjectDirector,
  GetProjectByOpenIdAndProjectId,
  GetAllTopicCommentDirector,
  UpdateCommentProjectDirector,
  getDetailComment,
  GetAllVendorProjectBidResultByProjectKey,
} from "../../../services/SecretaryService/HttpClientService";
import {
  dateWithTimeFormatter,
  showFileOnClick,
} from "../../../services/utilitity";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";


import {
  ListVendorItemInterface,
  ResultStatusInterface,
} from "../../../models/Secretary/CompareInterface";
import CAPProjectName from "../../Secretary/SpecifiedEnvelop/WaitToOpen/CompareAveragePrices/CAPProjectName";
import {
  IProject,
  IVendorProject,
} from "../../../models/Secretary/IProjectSecretary";
import CAPPriceList from "../../Secretary/SpecifiedEnvelop/WaitToOpen/CompareAveragePrices/CAPPriceList";
import PageLoad from "../../PreLoadAndEtc/PageLoader";

interface ITopicComment {
  id?: string | number;
  topic_comment: string;
  status_comment: string;
}

export default function CommitteeJobDetails() {
  const navigate = useNavigate();
  const mySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(true);

  const [checkresultVendors, setCheckResultVendors] = useState(false);

  const queryParameters = new URLSearchParams(location.search);
  const [openId] = useState<string>(queryParameters.get("open_id") || "");
  const [projectId] = useState<string>(queryParameters.get("project_id") || "");
  const [project, setProject] = useState<IProject>();

  const [detailcomment, setDetailComment] = useState("");
  const [detailProject, setdetailProject] = useState<DetailProjectInterface>();
  const [detailBidding, setdetailBidding] = useState<ListVendorItemInterface>();
  const [resBidding, setresBidding] = useState<IVendorProject[]>([]);
  const [listVendor, setListVendor] = useState<IVendorProject[]>([]);
  
  
  const [statusBidding, setstatusBidding] = useState<ResultStatusInterface>();

  const [listTopic, setListTopic] = useState<ITopicComment[]>([]);

  const [comment, setComment] = useState<any>({
    passcode: localStorage.getItem("passcode"),
    project_id: queryParameters.get("project_id"),
  });

  const [have, setHave] = useState<any>();

  const [statusProject, setstatusProject] = useState<any>();

  const getProjectByOpenIdAndProjectId = async () => {
    let res = await GetProjectByOpenIdAndProjectId(openId, projectId);
    if (res.status !== 200) {
      // alert(res.err);
      setCheckResultVendors(true);
      return;
    }
    console.log(res);

    setProject(res.data);
    setdetailProject(() => res.data);
    setHave(() => res.data.is_have);

    // await getInfoCompare(res.data.key);
    await getAllVendorOfProjectInBidding(res.data.key);
  };

  const getProjectStatus = async () => {
    let res = await getProjectCurrentStatus(openId, projectId);
    console.log(res);
    setstatusProject(res.data);
  };

  const getAllTopicComment = async () => {
    let res = await GetAllTopicCommentDirector();
    setListTopic(res.data);
  };

  const getDetailCommentt = async () => {
    let res = await getDetailComment(projectId);
    console.log(res.data);
    console.log(res.data[0].comment_id);
    setDetailComment(res.data[0].detail_comment);
    // setComment_id(res.data[0].comment_id);
    setComment({
      ...comment,
      topic_id: res.data[0].comment_id,
      comment: res.data[0].detail_comment,
    });
  };

  const getAllVendorOfProjectInBidding = async (key: string) => {
    let res = await GetAllVendorProjectBidResultByProjectKey(key);
    if (res.status !== 200) {
      // alert(res.err)
      setCheckResultVendors(true);
      return;
    }
    setListVendor(res.data);
    setstatusBidding(() => res.res_status);
    setdetailBidding(() => res.data);
    setresBidding(() => res.result);
    console.log(res.data);
    console.log(res.result);
  };

  const handleChangeInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const name = e.target.name;
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
          <div className="flex flex-col text-red-500 text-xl">
            {/* <p>การยืนยันความคิดเห็นนี้เป็นเพียงเบื่องต้นเท่านั้น</p>
            <p>กรุณากรอกความคิดเห็นตามที่ท่านเห็นสมควร</p> */}
          </div>
        ),
        showCancelButton: true,
        confirmButtonText: <p className="text-3xl">ยืนยัน</p>,
        confirmButtonColor: "#EB455F",
        cancelButtonText: <p className="text-3xl">ยกเลิก</p>,
        preConfirm: async () => {
          console.log(have);
          if (have == false) {
            let res = await CreateCommentProjectDirector(comment);
            console.log(res);
            if (res.status !== 200) {
              mySwal.showValidationMessage(res.err);
            }
            return res.data;
          } else {
            let res = await UpdateCommentProjectDirector(comment);
            console.log(res);
            if (res.status !== 200) {
              mySwal.showValidationMessage(res.err);
            }
            return res.data;
          }
        },
      })
      .then((response) => {
        if (response.isConfirmed) {
          mySwal
            .fire({
              title: (
                <h3 className="text-4xl text-green-500">ดำเนินการสำเร็จ</h3>
              ),
              html: (
                <div className="flex flex-col text-red-500 text-xl h-24">
                  <p>เมื่อท่านกดยืนยันแล้ว</p>
                  <p>โปรดรอการสรุปที่หน้าจอของเลขาฯ</p>
                </div>
              ),
              icon: "success",
              confirmButtonText: <p className="text-2xl">ยืนยัน</p>,
            })
            .then(() => {
              setCheckResultVendors(false);
              navigate(
                `/committee/projectwaittoopen/joblists?open_id=${openId}`
              );
            });
        }
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      getProjectStatus();
      getDetailCommentt();
      try{
        await getProjectByOpenIdAndProjectId();
        await getAllTopicComment();
        setLoading(false);
      } catch (error){
        alert(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <PageLoad />
      ) : (
      <div className="bg-[#F5F5F5]">
        {/* container */}
        <div className="px-[2rem] py-12 rounded-2xl">
          <div className="bg-[#1D5182] pt-3 pb-8 text-white rounded-xl">
            <p className="text-lg text-end pr-4">
              เลขที่เอกสาร : {detailProject?.key}
            </p>
            <p className="text-4xl font-bold pl-16 text-center">
              เปรียบเทียบราคากลางตามรายการ
            </p>
          </div>
          <div className="pb-4">{<CAPProjectName project={project as IProject} />}</div>
          
          {<CAPPriceList vendor={listVendor} project={project as IProject} />}

          <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
            <div className="px-10 py-14 flex flex-col">
              <p className="text-2xl text-[#2B3467] font-bold mb-6">
                ผลการพิจารณาการคัดเลือกเบื้องต้น
              </p>
              <p className="text-xl text-[#1F7600]">
                <span
                  className={
                    statusBidding?.text ===
                      "ต่ำกว่าหรือเท่ากับราคากลาง และ มีผู้เสนอราคาต่ำสุดมากกว่า 1 ราย" ||
                    statusBidding?.text ===
                      "ต่ำกว่าหรือเท่ากับราคากลาง และ มีผู้เสนอราคาต่ำสุด 1 ราย"
                      ? "text-green-500 text-2xl"
                      : "text-red-500 text-2xl"
                  }
                >
                  {statusBidding?.text}
                </span>
              </p>
              <p className="text-xl mb-6">โดยมีรายละเอียดดังนี้</p>
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
                      {resBidding.map((item, index) => (
                        <tr key={index} className="text-lg">
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2 text-[#398dba] font-bold">
                            {item.company_name}
                          </td>
                          <td className="border px-4 py-2 text-[#459c36] text-center">
                            {item.newPrice
                              ? item.newPrice.toLocaleString(undefined, {
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
              
              <hr className="mb-6"></hr>
              <div className="grid grid-cols-2 gap-6">
                <div className="block w-full">
                  <p className="text-2xl font-bold text-[#2B3467] mb-3">
                    สรุปผลการประกวดราคาจากคณะกรรมการ
                  </p>
                  <select
                    value={comment.topic_id || 0}
                    name="topic_id"
                    className="border border-gray-400 rounded w-full py-2 px-3 mt-2 text-xl text-center focus:shadow-outline"
                    onChange={handleChangeInput}
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
                  className="px-8 py-3 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 col-end-3 text-center inline-flex items-center"
                  onClick={backPageButton}
                >
                  <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                  ย้อนกลับ
                </button>
                {statusProject == "สามารถคอมเมนต์ได้" ? (
                  <button
                    className="px-8 py-3 rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl  col-start-5 col-end-10 text-center"
                    onClick={() => {
                      handleSubmitComment();
                    }}
                  >
                    ยืนยันความเห็นและลงนามปิดซอง
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
