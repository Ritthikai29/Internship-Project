import { useEffect, useState } from "react";
import { getVendorProjectforAnouncement } from "../../services/SecretaryService/ComparisionService";
import { ListVendorItemInterface } from "../../models/Secretary/CompareInterface";
import { useNavigate, useParams } from "react-router-dom";
import {
  dateWithTimeFormatter,
  showFileOnClick,
} from "../../services/utilitity";
import { SendBiddingResultService } from "../../services/ContractorService/SendBiddingResultService";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { BsDownload } from "react-icons/bs";
import { LuFileEdit, LuFolders } from "react-icons/lu";
import { DetailProjectInterface } from "../../models/Project/IListWaitProject";
import { DetailProject } from "../../services/ProjectServices";
import { projectSettingsInterface } from "../../models/Project/IProjectSetting";
import { getProjectSetting } from "../../services/VendorProjectService/VenderProjectPrice";

export default function AnnouncementResultComponent() {
  const { key } = useParams();
  const [projectSetting, setProjectSetting] =
    useState<projectSettingsInterface | null>(null);
  const [detailProject, setdetailProject] = useState<DetailProjectInterface>();
  const detailDatetimestart = projectSetting?.startDate
    ? new Date(projectSetting.startDate)
    : null;
  const formattedDatestart = detailDatetimestart
    ? new Date(detailDatetimestart.getTime()).toISOString().split("T")[0].split('-')
    .reverse()
    .join('-')
    : "";
  const detailDatetimeend = projectSetting?.endDate
    ? new Date(projectSetting.endDate)
    : null;
  const formattedDateend = detailDatetimeend
    ? detailDatetimeend.toISOString().split("T")[0].split('-')
    .reverse()
    .join('-')
    : "";
  const [formattedDepositMoney, setFormattedDepositMoney] = useState("");
  const showFullProjectNamePopup = () => {
    Swal.fire({
      title: "ชื่อโครงการ",
      text: detailProject?.name || "",
      confirmButtonText: "ปิด",
      width: "40%",
    });
  };

  const getDetailProject = async (key: string) => {
    let res = await DetailProject(key);
    console.log(res.data);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    console.log(res.data);
    setdetailProject(() => res.data);
  };
  const getDetailProjectSetting = async (key: string) => {
    let res = await getProjectSetting(key);
    console.log(res.data);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setProjectSetting(res.data);
    console.log(res.data);
    setFormattedDepositMoney(
      res.data.depositMoney
        .substring(0, res.data.depositMoney.length - 2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  const [detailBidding, setdetailBidding] = useState<ListVendorItemInterface>();
  const [detailAnnouce, setDetailAnnouce] = useState({
    add_datetime: "",
    company_name: "",
    email: "",
    key: "",
    manager_name: "",
    name: "",
    status_name_th: "",
    vendor_key: "",
    vendor_type: "",
  });
  const getInfoCompare = async (key: string) => {
    console.log(key);
    let res = await getVendorProjectforAnouncement(key);
    console.log(res.data);
    if (res.status !== 200) {
      Swal.showValidationMessage(res.err);
    }
    setdetailBidding(() => res.data);
    console.log(res.data);
    setDetailAnnouce(res.data[0]);
    console.log(res.data);
  };

  const navigate = useNavigate();
  const handleClick = async (key: string) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <h1 className="text-4xl text-[#2B3467]">ยืนยันการดำเนินการ</h1>,
      icon: "warning",
      confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>,
      html: `
        ประกาศผลการประกวด
      `,
      confirmButtonColor: "#EB455F",
      showCancelButton: true,
      cancelButtonText: <p className="text-2xl px-5 py-2 w-[150px]">ยกเลิก</p>,
      cancelButtonColor: "#979797",
      preConfirm: async () => {
        console.log(key);
        const res = await SendBiddingResultService(key);
        if (res.status !== 200) {
          MySwal.showValidationMessage(res.err);
        }
        return res;
      },
    }).then((data) => {
      if (data.isConfirmed) {
        MySwal.fire({
          title: <h1 className="text-4xl text-[#4BAE4F]">ดำเนินการสำเร็จ!</h1>,
          icon: "success",
          confirmButtonText: (
            <p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>
          ),
          confirmButtonColor: "#2B3467",
        }).then(() => {
          navigate("/project/waitingtomanaged", {
            state: {
              project_manage: "announcing",
            },
          });
        });
      }
    });
  };

  useEffect(() => {
    // console.log(key);
    getDetailProjectSetting(key || "");
    getDetailProject(key || "");
    getInfoCompare(String(key));
  }, []);

  return (
    <div className="bg-zinc-200">
      <div className="mt-5 xl:border p-2 mx-[2rem] bg-[#2B3467] rounded-xl  ">
        <div className="flex lg:flex-row flex-col p-2 w-full justify-center  bg-[#2B3467]rounded-xl">
          <div className="bg-[#2B3467] text-white flex justify-center items-center flex-col p-4 rounded-xl xl:rounded-r-none xl:rounded-l-xl w-full lx  lg:w-80">
            <LuFolders className="text-5xl " />
            <p className="text-3xl text-center">
              สรุปผล <br /> การประกวด
            </p>
          </div>
          <div className="border p-4 box-border w-full rounded-r-xl bg-white">
            <form className="flex flex-col gap-3">
              <div className="bg-[#2B3467] pt-4 pb-8 text-white rounded-r-xl">
                <div className="text-[#ffffff] text-xl font-bold basis-1/2 text-right  ">
                  <label className=" font-normal pr-4">
                    เลขที่เอกสาร : {detailProject?.key}
                  </label>
                </div>
                <div>
                  <label
                    className="text-3xl font-bold pl-16"
                    onClick={showFullProjectNamePopup}
                  >
                    <b>โครงการ :</b>{" "}
                    {detailProject && detailProject.name?.length > 50
                      ? `${detailProject.name.substring(0, 50)}...`
                      : detailProject?.name}
                  </label>
                </div>
              </div>
              <div className="flex flex-col box-content md:flex-row gap-2 w-full">
                <div className="px-6 py-6 flex flex-col ">
                  <div className="grid grid-cols-12">
                    <div className="grid col-span-3">
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>ประเภทโครงการ </b>
                      </label>
                    </div>
                    <div>
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>:</b>
                      </label>
                    </div>
                    <div className="grid col-span-8 text-[#2B3467] text-xl font-bold basis-1/2 pb-4 -ml-7">
                      {detailProject?.type_name}
                    </div>
                  </div>
                  <div className="grid grid-cols-12">
                    <div className="grid col-span-3">
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>ประเภทงาน </b>
                      </label>
                    </div>
                    <div>
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>:</b>
                      </label>
                    </div>
                    <div className="grid col-span-8 text-[#2B3467] text-xl font-bold basis-1/2 pb-4 -ml-7">
                      {detailProject?.job_type_name}
                    </div>
                  </div>

                  <div className="grid grid-cols-12">
                    <div className="grid col-span-3">
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>สังกัด </b>
                      </label>
                    </div>
                    <div>
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>:</b>
                      </label>
                    </div>
                    <div className="grid col-span-8 text-[#2B3467] text-xl font-bold basis-1/2 pb-4 -ml-7">
                      {detailProject?.section_name}/
                      {detailProject?.department_name}/
                      {detailProject?.subsection_name}/
                      {detailProject?.division_name}
                    </div>
                  </div>

                  <div className="grid grid-cols-12">
                    <div className="grid col-span-3">
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>วันที่เพิ่มโครงการ </b>
                      </label>
                    </div>
                    <div>
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>:</b>
                      </label>
                    </div>
                    <div className="grid col-span-8 text-[#2B3467] text-xl font-bold basis-1/2 pb-4 -ml-7">
                      {" "}
                      {dateWithTimeFormatter(detailAnnouce.add_datetime)}
                    </div>
                  </div>

                  <div className="grid grid-cols-12">
                    <div className="grid col-span-3">
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>ไฟล์แนบ </b>
                      </label>
                    </div>
                    <div>
                      <label className="text-[#2B3467] text-xl font-bold basis-1/2 pb-4">
                        <b>:</b>
                      </label>
                    </div>
                    <div className="grid col-span-8 text-[#2B3467] text-xl font-bold basis-1/2">
                      <div className="flex flex-col">
                        <div className="flex justify-start gap-2 -ml-7">
                          <div>
                            <button
                              className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-xl text-2xl px-2 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                              onClick={(event) => {
                                event.preventDefault();
                                showFileOnClick(detailProject?.Tor_uri || "");
                              }}
                            >
                              <BsDownload className="text-2xl w-5 h-5 mr-2" />
                              TOR
                            </button>
                            <button
                              className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-xl text-2xl px-6 py-1 w-[183px] text-center inline-flex items-center justify-center mb-2"
                              onClick={(event) => {
                                event.preventDefault();
                                showFileOnClick(
                                  detailProject?.Job_description_uri || ""
                                );
                              }}
                            >
                              <BsDownload className="text-2xl w-5 h-5 mr-2" />
                              ใบแจ้งงาน
                            </button>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-5 mb-5 xl:border p-2 rounded-lg mx-[2rem] bg-zinc-300">
        <div className="py-2 pl-2 bg-[#2B3467] rounded-t-2xl mx-4 mt-4 flex items-center">
          <LuFileEdit className="text-5xl m-4 text-white" />
          <p className="font-black text-3xl m-4 text-white">
            รายละเอียดการตั้งค่าโครงการ
          </p>
        </div>
        <div className="border rounded-2xl m-4  md:px-1 lg:px-28 my-4 bg-white  drop-shadow-2xl">
          <ul className="flex flex-col gap-4 justify-center items-center mx-auto mb-5">
            <li className="grid grid-cols-1 md:grid-cols-2 text-lg md:text-xl font-bold w-full my-2">
              <span className="mt-4 text-[#2B3467]">
                วันเปิดรับสมัครและส่งเอกสาร : {formattedDatestart}
              </span>
              <span className="mt-4 text-[#2B3467]">
                วันปิดรับสมัครและส่งเอกสาร : {formattedDateend}
              </span>
              <span className="mt-4 text-[#2B3467]">
                ผู้จัดการส่วน : คุณ {projectSetting?.firstN}{" "}
                {projectSetting?.lastN}
              </span>
              <span className="mt-4 text-[#2B3467]">
                จำนวนเงินประกันซอง : {formattedDepositMoney} บาท
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className=" pb-8 rounded-2xl mx-[2rem]">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full mt-5 mr-5">
          <div className="px-5 py-10 ">
            <div className="text-3xl font-bold basis-1/2 text-right">
              <div className="flex justify-between pb-4">
                <span>แจ้งผลประกวดราคา</span>
                <span className="text-[#1F7600]">สถานะ : แล้วเสร็จ</span>
              </div>
            </div>

            <div className="scroll-x overflow-x-scroll rounded-lg ">
              <table className="w-[115vw]">
                <thead className="text-[#ffffff] text-lg uppercase bg-[#2B2A2A] h-14">
                  <tr style={{ verticalAlign: "top" }}>
                    <th
                      className="py-3 border justify-self-center rounded-tl-lg"
                      style={{ width: "1%" }}
                    >
                      ลำดับ
                    </th>
                    <th
                      className="py-3 border justify-self-center "
                      style={{ width: "8%" }}
                    >
                      ผลการประกวด
                    </th>
                    <th
                      className="py-3 border justify-self-center "
                      style={{ width: "5%" }}
                    >
                      ราคาที่เสนอ
                    </th>
                    <th
                      className="py-3 border justify-self-center "
                      style={{ width: "8%" }}
                    >
                      ราคาที่เสนอใหม่
                    </th>
                    <th
                      className="py-3 border justify-self-center "
                      style={{ width: "5%" }}
                    >
                      เลขที่สมาชิก
                    </th>
                    <th
                      className="py-3 border justify-self-center"
                      style={{ width: "20%" }}
                    >
                      ชื่อบริษัท/หน่วยงาน
                    </th>

                    <th
                      className="py-3 border justify-self-center"
                      style={{ width: "12%" }}
                    >
                      ชื่อผู้จัดการ
                    </th>

                    <th
                      className="py-3 border justify-self-center"
                      style={{ width: "4%" }}
                    >
                      อีเมล
                    </th>
                    
                  </tr>
                </thead>
                {Array.isArray(detailBidding) && (
                  <tbody className="bg-white border-b-lg rounded-xl h-14 divide-x">
                    {detailBidding
                      .sort((a, b) => {
                        if (
                          a.status_name_th === "ชนะการประกวด" &&
                          b.status_name_th !== "ชนะการประกวด"
                        ) {
                          return -1;
                        }
                        if (
                          a.status_name_th !== "ชนะการประกวด" &&
                          b.status_name_th === "ชนะการประกวด"
                        ) {
                          return 1;
                        }
                        // Handle the case when both have the status "แพ้การประกวด"
                        if (
                          a.status_name_th === "แพ้การประกวด" &&
                          b.status_name_th === "แพ้การประกวด"
                        ) {
                          if (a.compare === null) {
                            return 4;
                          } else if (b.compare === null) {
                            return -4;
                          } else if (a.compare === b.compare) {
                            return 3;
                          } else {
                            return a.compare - b.compare;
                          }
                        }
                        return 0; // Default case, maintain the original order
                      })
                      .map((listBidding, index) => (
                        <tr
                          key={index}
                          className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center "
                          style={{ verticalAlign: "top" }}
                        >
                          <td className="border py-3 pl-2">{index + 1}</td>
                          <td
                            className={
                              listBidding?.status_name_th === "ชนะการประกวด"
                                ? "border py-3 pl-2 text-green-500 text-xl"
                                : listBidding.vendor_status_id === "5"
                                ? "border py-3 pl-2 text-red-500 text-xl"
                                : listBidding.vendor_status_id === null
                                ? "border py-3 pl-2 text-black-500 text-xl"
                                : "border py-3 pl-2 text-red-500 text-xl"
                            }
                          >
                            {listBidding.vendor_status_id === "5"
                              ? "สละสิทธิ์"
                              : listBidding.vendor_status_id === null
                              ? "ไม่มีการเสนอราคา"
                              : listBidding?.status_name_th}
                          </td>
                          <td className="border py-3 pl-5">
                            {listBidding?.price !== "ไม่เปิดเผย"
                              ? listBidding?.price !== null
                                ? listBidding.price.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                  })
                                : " - "
                              : "ไม่เปิดเผย"}
                          </td>
                          <td className="border py-3 text-[#2B3467] text-xl">
                            {listBidding?.newPrice !== "ไม่เปิดเผย"
                              ? listBidding?.newPrice !== null
                                ? listBidding.newPrice.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                    }
                                  )
                                : " - "
                              : "ไม่เปิดเผย"}
                          </td>

                          <td className="border py-3 pl-2">
                            {listBidding?.vendor_key}
                          </td>
                          <td className="border py-3 pl-5 text-left">
                            {listBidding?.company_name}
                          </td>
                          <td className="border py-3 pl-5 text-left">
                            {listBidding?.manager_name}
                          </td>
                          <td className="border py-3 pl-5 text-left">
                            {listBidding?.email}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </table>
            </div>
            <div className="mt-10 flex justify-between">
              <button
                className="px-8 py-2.5 rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1"
                onClick={() =>
                  navigate("/project/waitingtomanaged", {
                    state: {
                      project_manage: "announcing",
                    },
                  })
                }
              >
                ย้อนกลับ
              </button>
              <button
                className="px-8 py-2.5 rounded-lg bg-[#1F7600] drop-shadow-lg text-white text-2xl col-start-1"
                onClick={() => handleClick(String(key))}
              >
                ประกาศผลและปิดโครงการ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
