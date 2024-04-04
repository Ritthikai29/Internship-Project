import { useNavigate } from "react-router-dom";
import img from "../../../../assets/Secretary/folder.png";

import { BsDownload } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi";
// import ONPPriceList from "./OfferNewPrice/ONPPriceList";
import ONPComment from "./OfferNewPrice/ONPComment";
import RPSummaryBiddingResults from "./ReProcess/RPSummaryBiddingResults";
import OPNSendEmailVender from "./OfferNewPrice/ONPSendEmailVender";
import OPNSetDateTimeCloseBidding from "./OfferNewPrice/ONPSetDateTimeCloseBidding";
import ONPHistoryVendor from "./OfferNewPrice/ONPHistoryVendor";
import {
  CreateOrUpdateBargain,
  GetAllVendorProjectBidResultByProjectKey,
  GetProjectById,
} from "../../../../services/SecretaryService/HttpClientService";
import { GetProjectPriceProcess } from "../../../../services/ProjectService/ProjectService";
import { useEffect, useState } from "react";
import {
  dateWithTimeFormatter,
  showFileOnClick,
} from "../../../../services/utilitity";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {
  IProject,
  IVendorProject,
} from "../../../../models/Secretary/IProjectSecretary";
import CAPPriceList from "../WaitToOpen/CompareAveragePrices/CAPPriceList";
import PageLoad from "../../../PreLoadAndEtc/PageLoader";
import CAPProjectName from "../WaitToOpen/CompareAveragePrices/CAPProjectName";

export interface IVendorBargain {
  project_id: string;
  vendor_project_id: string | number;
  end_datetime: string | Date;
}

export interface IVendorPrice {
  adder_user_staff_id: string;
  approve: string;
  boq_uri: string;
  company_name: string;
  compare: string | null;
  email: string;
  id: string | number;
  newPrice: number | string;
  price: number | string;
  result: string;
  subprice: any;
  vendor_id: string | number;
  vendor_key: string;
}

export default function WNOfferNewPrice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const queryParameters = new URLSearchParams(window.location.search);
  const projectId = queryParameters.get("project_id") || "";

  const [project, setProject] = useState<IProject>();
  const [listVendor, setListVendor] = useState<IVendorProject[]>([]);

  const [vendorBargain, setVendorBargain] = useState<Partial<IVendorBargain>>({
    project_id: projectId,
  });
  const [showPrice, setShowPrice] = useState<any>();

  const getAllVendorPrice = async (projectKey: string) => {
    const res = await GetAllVendorProjectBidResultByProjectKey(projectKey);
    setListVendor(res.data);
  };
  const getProjectById = async () => {
    const res = await GetProjectById(projectId);
    if (res.status !== 200) {
      alert(res.err);
    }
    setProject(res.data);
    console.log(res.data);

    await getAllVendorPrice(res.data.key);
  };
  const mySwal = withReactContent(Swal);

  const handleSubmitBtn = () => {
    console.log(vendorBargain);
    if (!vendorBargain.vendor_project_id) {
      mySwal.fire({
        title: (
          <h3 className="text-3xl text-red-500">คุณไม่ได้เลือกผู้รับเหมา</h3>
        ),
        confirmButtonText: <div className="text-2xl">ยืนยัน</div>,
        icon: "error",
        confirmButtonColor: "#EB455F",
      });
      return;
    }
    if (!vendorBargain.end_datetime) {
      mySwal.fire({
        title: (
          <h3 className="text-3xl text-red-500">คุณยังกรอกวันที่ปิดไม่ครบ</h3>
        ),
        confirmButtonText: <div className="text-2xl">ยืนยัน</div>,
        icon: "error",
        confirmButtonColor: "#EB455F",
      });
      return;
    }
    mySwal
      .fire({
        title: <h3 className="text-4xl">ยืนยันการดำเนินการ</h3>,
        icon: "question",
        html: (
          <div className="p-4">
            <p className="text-red-500 text-xl">
              หากท่านดำเนินการแล้วจะไม่สามารถแก้ไขได้
            </p>
          </div>
        ),
        confirmButtonText: <div className="text-2xl">ยืนยัน</div>,
        showCancelButton: true,
        cancelButtonText: <div className="text-2xl">ยกเลิก</div>,
        confirmButtonColor: "#EB455F",
        preConfirm: async () => {
          const res = await CreateOrUpdateBargain(
            vendorBargain as IVendorBargain
          );
          if (res.status >= 400) {
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
                <h3 className="text-3xl text-green-400">
                  การดำเนินการเสร็จสิ้น
                </h3>
              ),
              icon: "success",
              confirmButtonText: <div className="text-2xl">ยืนยัน</div>,
            })
            .then(() => {
              navigate("/secretary/waittomanage", {
                state: {
                  project_set: "specifiedenvelope",
                  open_bid: "waitnegotiate",
                },
              });
            });
        }
      });
  };

  const getProjectPriceProcessByProjectId = async () => {
    const res = await GetProjectPriceProcess(projectId);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    console.log(res.data);
    setShowPrice(res);
  };

  const handleDownloadClick = () => {
    mySwal.fire({
      html: (
        <div className="bg-[#ffffff] p-10 rounded-lg">
          <p className="mb-2 text-xl">
            โปรดทราบ ไฟล์แนบรายละเอียดกลางนี้
            เป็นไฟล์แนบเบื้องต้นจากผู้คำนวณเท่านั้น{" "}
          </p>
          <p className="mb-8 text-xl">
            {" "}
            อาจมีการแก้ไขจากผู้อนุมัติ
            โดยราคากลางจากไฟล์แนบอาจไม่ตรงกับราคาที่แสดง
          </p>

          <div className="flex justify-center">
            <button
              className="bg-[#2B3467] hover:bg-[#161b37] text-white text-xl font-bold py-3 px-5 mr-5 rounded"
              onClick={handleConfirm}
            >
              เปิดไฟล์
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-3 px-8 ml-5 rounded"
              onClick={handleCancel}
            >
              ปิด
            </button>
          </div>
        </div>
      ),
      showConfirmButton: false, // Hide the default OK button
    });
  };
  const handleConfirm = () => {
    showFileOnClick(project?.calculate_uri || "");
  };

  const handleCancel = () => {
    mySwal.close();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProjectById();
        getProjectPriceProcessByProjectId();
        setLoading(false);
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <PageLoad />
      ) : (
        <>

        
        <div className="w-11/12 mx-auto">
          {<CAPProjectName project={project as IProject} />}
      </div>
      
      <div className=" py-5 rounded-4xl w-11/12 mx-auto">
      {<CAPPriceList vendor={listVendor} project={project as IProject} />}
      </div>
      <div className=" pb-5 rounded-4xl w-11/12 mx-auto">
       {<ONPComment />} 
      </div>
      <div className=" pb-5 rounded-4xl w-11/12 mx-auto">
      {<RPSummaryBiddingResults />} 
      </div>
      {/* {<ONPHistoryVendor />} */}
      <div className=" pb-5 rounded-4xl w-11/12 mx-auto">
       {
        <OPNSendEmailVender
          vendorBargain={vendorBargain}
          setVendorBargain={setVendorBargain}
        />
      } 
      </div>
      <div className=" pb-5 rounded-4xl w-11/12 mx-auto">
      {
        <OPNSetDateTimeCloseBidding
          vendorBargain={vendorBargain}
          setVendorBargain={setVendorBargain}
        />
      }

      </div>
     

      <div className="py-10 px-24 ">
        <div className="grid grid-cols-11">
          <button
            className="px-8 py-3 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1 col-end-3 text-center inline-flex items-center"
            onClick={() =>
              navigate("/secretary/waittomanage", {
                state: {
                    project_set: "specifiedenvelope",
                    open_bid: "waitnegotiate",
                },
            })
            }
          >
            <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
            ย้อนกลับ
          </button>
          <button
            className="px-8 py-3 rounded-lg bg-[#2B3467] drop-shadow-lg text-white col-start-4 col-end-8 text-2xl text-center"
            onClick={handleSubmitBtn}
          >
            ส่งอีเมลเพื่อให้เสนอราคาใหม่
          </button>
        </div>
      </div>
      </>

      )}
    </div>
  );
}
