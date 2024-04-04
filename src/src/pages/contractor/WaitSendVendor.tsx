import { useState, useEffect } from "react";
import ProjectContractor from "../../components/contractor/projectContractor";
import AllProject from "../../components/contractor/AllProject";
// import SetUpProjectWaitSend from "../../components/contractor/SetUpProjectWaitSend";
import { ProjectContext } from "../../components/contractor/ProjectContext";
import { DetailProject } from "../../services/ProjectServices";
import { DetailProjectInterface } from "../../models/Project/IListWaitProject";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { SendInviteVendorProject } from "../../services/ContractorService/SendInviteVendor";
import { useNavigate } from "react-router-dom";

export default function WaitSendVendor() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [key] = useState<string>(queryParameters.get("key") || "");
  const navigate = useNavigate();

  const [detailProject, setdetailProject] = useState<DetailProjectInterface>();
  const getDetailProject = async (key: string) => {
    const res = await DetailProject(key);

    if (res.status !== 200) {
      alert("err");
      return;
    }
    setdetailProject(() => res.data);
  };

  const handleSendOnClick = (key: string) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <p className="text-[#2B3467] text-4xl">ยืนยันการดำเนินการ</p>,
      confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>,
      icon: "question",
      confirmButtonColor: "#EB455F",
      showCancelButton: true,
      cancelButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>,
      cancelButtonColor: "#979797",
      preConfirm: async () => {
        const res = await SendInviteVendorProject(key);
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
          navigate("/project/waitingtomanaged");
      });
      }
    });
  };

  useEffect(() => {
    getDetailProject(key || "");
  }, [key]);

  return (
    <ProjectContext.Provider value={detailProject}>
      <div className="bg-[#F5F5F5]">
        <div>
          <ProjectContractor />
        </div>

        <div>
          <AllProject />
        </div>

        <div className="grid grid-cols-3">
          <button
            className="mb-6 mx-auto px-8 py-4 w-auto rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-left justify-start"
            onClick={() =>
              navigate("/project/waitingtomanaged", {
                state: {
                  project_manage: "sending"
                },
              })
            }
          >
            ย้อนกลับ
          </button>

          <button
            className="mb-6 mx-auto px-8 py-4 w-auto rounded-lg bg-[#1fb021] drop-shadow-lg text-white text-2xl col-start-2 text-center inline-flex items-right justify-center"
            onClick={() => {
              handleSendOnClick(key);
            }}
          >
            ส่งหนังสือเชิญ
          </button>
        </div>
      </div>
    </ProjectContext.Provider>
  );
}
