import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LoadingComponent from "../../../components/Loading";
import {
  TopicRejectApproveVendorProject,
  RejectApproveVendorProjectinterface,
} from "../../../models/Contractor/IVerify";
import { ListRejectTopicApproveVendorProject } from "../../../services/ContractorService/VerifyUnListService";
import {
  CreateRejectApproveVnedorProject,
  VerifyUserIsAApprover,
} from "../../../services/ContractorService/ApproveUnListService";
import LoginForm from "../../loginemail/loginemail";

export default function RejectApproveUnlistVendor() {
  const urlParams = new URLSearchParams(window.location.search);
  const [approveId] = useState<string>(urlParams.get("approve_id") || "");
  const [rejectTopic, setRejectTopic] = useState<
    TopicRejectApproveVendorProject[]
  >([]);

  const [rejectApprove, setRejectApprove] = useState<
    Partial<RejectApproveVendorProjectinterface>
  >({});

  const navigate = useNavigate();
  const [stating, setStating] = useState<string>("start");
  const [page, setPage] = useState<string>("loading");
  const [error, setError] = useState<string>("");

  const mySwal = withReactContent(Swal);

  const handleSubmitButton = () => {
    const mySwal = withReactContent(Swal);
    mySwal
      .fire({
        title: (
          <p className="text-3xl">
            ยืนยันการเสนอปฏิเสธ
            <br />
            กลุ่มผู้รับเหมานอกทะเบียน
          </p>
        ),
        html: (
          <span className="text-red-500">
            หากท่านกดยืนยันแล้ว จะไม่สามารถแก้ไขได้อีก
            ท่านยืนยันที่จะปฏิเสธกลุ่มผู้รับเหมานอกทะเบียนเหล่านี้จริงหรือไม่
          </span>
        ),
        showCancelButton: true,
        cancelButtonText: <p className="text-xl">ยกเลิก</p>,
        confirmButtonText: <p className="text-xl">ยืนยัน</p>,
        confirmButtonColor: "#EB455F",
        preConfirm: async () => {
          let res = await CreateRejectApproveVnedorProject(
            rejectApprove as RejectApproveVendorProjectinterface
          );
          if (res.status !== 200) mySwal.showValidationMessage(res.err);
          return res.data;
        },
      })
      .then((response) => {
        if (response.isConfirmed) {
          mySwal
            .fire({
              title: (
                <h3 className="text-3xl text-green-500">
                  การปฏิเสธผู้เข้าร่วมโครงการสำเร็จ
                </h3>
              ),
              icon: "success",
              confirmButtonText: <p className="text-xl">ตกลง</p>,
            })
            .then(() => {
              navigate("/");
            });
        }
      });
  };

  const verifyApproveVendorProject = async () => {
    let res = await VerifyUserIsAApprover(approveId);
    if (res.status === 401) {
      mySwal
        .fire({
          title:
            "คุณไม่ใช่ผู้อนุมัติโครงการนี้ หากคุณเป็นผู้อนุมัติกรุณาเข้าสู่ระบบด้วยไอดีของผุ้อนุมัติ",
          icon: "error",
          confirmButtonText: "ยืนยัน",
          confirmButtonColor: "#ff0000",
        })
        .then(() => {
          setStating("login");
        });
      return;
    }
    if (res.status !== 200) {
      setPage("error");
      setError(res.err);
      return;
    }
    setPage("verify");
  };

  const loadTopicApproveVendorProject = async () => {
    const res = await ListRejectTopicApproveVendorProject();
    setRejectTopic(res.data);
  };

  const handleChangeInputText = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name as keyof typeof rejectApprove;
    setRejectApprove({
      ...rejectApprove,
      [name]: e.target.value,
    });
  };

  useEffect(() => {
    setRejectApprove({
      avp_id: approveId,
    });
    // verifyApproveVendorProject();
    loadTopicApproveVendorProject();
    switch (stating) {
        case "start":
          setPage("login");
          break;
        case "login":
          setPage("login");
          break;
        case "verify":
            verifyApproveVendorProject();
            break;
        case "successful":
          setPage("successful");
          break;
        default:
          break;
      }
  }, [stating]);

  const loginSubmit = async (loginResult: any): Promise<void> => {
    console.log(loginResult)
    Swal.fire({
      title: `<span style="color: red;">ยืนยันการพิจารณา</span>`,
      text: "เมื่อกดปุ่มนี้ ท่านไม่สามารถกลับมาแก้ไขได้อีก",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EB455F',
      cancelButtonColor: '#979797',
      confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
      cancelButtonText: '<span style="font-size: 25px;">ปิด</span>',

  }).then(async (result) => {
      if (result.isConfirmed) {
        if (loginResult.status === 200) {
          setTimeout(() => {
            setPage("waiting");
          }, 10);
          setPage("waiting");
          setStating("verify");
          // window.location.replace(window.location.href);
        } else {
          mySwal.fire({
            title: <h3>{loginResult.err}</h3>,
          });
        }
        console.log(555555);
      }
  })
  };
  
  return (
    <div>
      {page === "loading" && <LoadingComponent />}
      {
                page === "login" &&  <LoginForm loginSubmit={loginSubmit} />
      }

      {page === "verify" && (
        <div className="fixed flex justify-center items-center top-0 left-0 h-screen w-screen bg-white">
          <div
            className="
                            bg-white flex flex-col justify-center items-center px-10 w-7/12 h-1/2 border gap-4 drop-shadow-lg rounded-lg z-30"
          >
            <p className=" mb-6 text-3xl text-red-500">
              กรุณาระบุเหตุผลการปฏิเสธ
            </p>
            <div className="grid grid-cols-12 gap-4 w-full  items-center">
              <label className="text-xl col-start-1 col-end-4">
                กรุณาเลือกเหตุผลการปฏิเสธ:
              </label>
              <select
                value={rejectApprove.reject_topic_id || 0}
                name="reject_topic_id"
                className="border border-black w-full py-2 px-2 col-start-5 col-end-13 text-xl"
                onChange={handleChangeInputText}
              >
                <option disabled className="text-gray-50" value={0}>
                  เหตุผลการปฏิเสธ Vendor
                </option>
                {rejectTopic.map((item) => (
                  <option value={item.id}>{item.reject_topic}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-12 gap-4 w-full">
              <label className="text-xl col-start-1 col-end-4">
                รายละเอียดเพิ่มเติม:
              </label>
              <textarea
                name="reject_detail"
                onChange={handleChangeInputText}
                value={rejectApprove.reject_detail || ""}
                className="border h-40 border-black w-full py-2 px-2 col-start-5 col-end-13 text-xl"
                placeholder="ข้อมูลเพิ่มเติมในการปฏิเสธ vendor นอกทะเบียน"
              />
            </div>

            <button
              className="px-6 py-4 text-white text-xl bg-[#2B3467] rounded-xl"
              onClick={handleSubmitButton}
            >
              ยืนยันการปฏิเสธ
            </button>
          </div>
        </div>
      )}
      {page === "error" && (
        <div className="flex flex-col items-center h-screen">
          <div className="flex flex-col justify-center w-1/2 h-1/2 rounded-2xl mt-6 pt-4 text-center drop-shadow-md border border-green-200 ">
            <h3 className="text-3xl text-red-400 mb-16">
              การอนุมัติโครงการไม่สำเร็จเนื่องจาก
              <h4 className="text-2xl text-pink-500 mt-2">[ {error} ]</h4>
            </h3>
            <p className="text-2xl text-red-800">โปรดรอสักครู่</p>
            <p className="text-2xl text-red-800">
              ระบบจะนำคุณเข้าสู่หน้าหลักในอีกไม่ช้า ...
            </p>
            <p className="text-2xl mt-10">
              หากระบบไม่นำคุณเข้าสู่หน้าหลัก กรุณา
              <a href={"/"} className="text-blue-600 hover:text-blue-800">
                คลิก
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
