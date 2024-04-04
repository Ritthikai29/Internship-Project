import { useState, useEffect, ChangeEvent } from "react";
import { BsSearch } from "react-icons/bs";
import { BiSolidLeftArrow } from "react-icons/bi";
import ProjectConType from "../../components/contractor/projectConType";
import SetUpProjectRegis from "../../components/contractor/SetUpProjectRegis";
import { dateFormatter, TimeFormatter } from "../../services/utilitity";
import {
  VenderRegisListInterface,
  VenderRegisterStatusInterface,
} from "../../models/Contractor/IRegisInfo";
import {
  ListRegisterVendor,
  InListRegisterVendor,
  UnListRegisterVendor,
  ListRegisterVendorByDocumentStatus,
  SearchListRegisterVendor,
  GetVendorRegisterStatus,
} from "../../services/ContractorService/VendorRegisService";

import { finishCompetition } from "../../services/ContractorService/ProjectSettingService";

import { useNavigate } from "react-router-dom";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import { SendInviteVendorProjectAgain } from "../../services/ContractorService/SendInviteVendor";

import { UpdateVendorEmailById } from "../../services/ContractorService/ProjectSettingService";

import { FaEdit } from "react-icons/fa";
import { MdCheckBox, MdCancelPresentation } from "react-icons/md";

export default function Contractor() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [key] = useState<string>(queryParameters.get("key") || "");
  const navigate = useNavigate();

  const [listRegisterVendor, setListRegisterVendor] = useState<
    VenderRegisListInterface[]
  >([]);

  const [registerStatus, setRegisterStatus] = useState<
    VenderRegisterStatusInterface[]
  >([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDocumentStatus, setSelectedDocumentStatus] = useState("");
  const [editModes, setEditModes] = useState(
    Array(listRegisterVendor.length).fill(false)
  );
  const MySwal = withReactContent(Swal);

  const handleEmailChange = (index: number, newEmail: string) => {
    const updatedList = [...listRegisterVendor];
    updatedList[index] = { ...updatedList[index], email: newEmail };
    setListRegisterVendor(updatedList);
  };

  const handleToggleEdit = (index: number) => {
    const updatedEditModes = [...editModes];
    updatedEditModes[index] = !updatedEditModes[index];
    setEditModes(updatedEditModes);
  };

  const handleSaveEmailChange = async (index: number) => {
    if (listRegisterVendor[index].id === undefined) {
      console.error("ID is undefined for the vendor at index", index);
      return;
    }
    const res = await UpdateVendorEmailById(
      String(listRegisterVendor[index].id),
      listRegisterVendor[index].email
    );
    if (res.status !== 200) {
      const updatedEditModes = [...editModes];
      updatedEditModes[index] = false;
      setEditModes(updatedEditModes);
      return;
    }
    const updatedEditModes = [...editModes];
    updatedEditModes[index] = false;
    setEditModes(updatedEditModes);
  };

  const getRegisterStatus = async () => {
    const res = await GetVendorRegisterStatus();
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setRegisterStatus(() => res.data);
  };

  const handleOnSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const res = await SearchListRegisterVendor(key, selectedValue);
      if (res.status !== 200) {
        setListRegisterVendor([]);
        return;
      }

      setListRegisterVendor(() => res.data);
    } else {
      // If the search bar is empty, set the default value here
      const res = await ListRegisterVendor(key);
      if (res.status === 200) {
        setListRegisterVendor(res.data);
      } else {
        setListRegisterVendor([]);
      }
    }
  };

  const handleDocumentStatusChange = async (
    e: ChangeEvent<HTMLSelectElement>,
    project_key: string
  ) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      const res = await ListRegisterVendorByDocumentStatus(
        project_key,
        selectedValue
      );
      if (res.status !== 200) {
        setListRegisterVendor([]);
        return;
      }
      setSelectedDocumentStatus(selectedValue);
      setListRegisterVendor(() => res.data);
    } else {
      setListRegisterVendor([]);
    }
  };

  // * Change Data in Table When Change Value in Dropdown
  const handleStatusChange = async (
    e: ChangeEvent<HTMLSelectElement>,
    project_key: string
  ) => {
    const selectedValue = e.target.value;
    console.log(selectedValue);
    if (selectedValue) {
      let res;
      if (selectedValue === "list") {
        res = await InListRegisterVendor(project_key);
      } else if (selectedValue === "unlist") {
        res = await UnListRegisterVendor(project_key);
      } else {
        selectedValue === "all";
        res = await ListRegisterVendor(project_key);
      }

      if (res.status === 200) {
        setListRegisterVendor(res.data);
        setSelectedStatus(selectedValue);
        console.log(res.data);
      } else {
        setListRegisterVendor([]);
      }
    } else {
      setListRegisterVendor([]);
    }
  };

  const handleOnClick = () => {
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
        const res = await finishCompetition(String(key));
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
        });
        navigate("/project/waitingtomanaged", {
          state: {
            project_manage: "registering",
          },
        });
      }
    });
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
        const res = await SendInviteVendorProjectAgain(key);
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
        });
      }
    });
  };

  // * Load All data from DB When First Load
  useEffect(() => {
    getRegisterStatus();

    const fetchData = async () => {
      const res = await ListRegisterVendor(key);
      if (res.status === 200) {
        setListRegisterVendor(res.data);
      } else {
        setListRegisterVendor([]);
      }
    };

    fetchData(); // Initial data fetch

    const intervalId = setInterval(async () => {
      // Fetch data every 5 seconds
      fetchData();
    }, 5000);

    // Clear the interval when the component unmounts or when key changes
    return () => clearInterval(intervalId);
  }, [key]);

  const showFileOnClick = (filePath: string) => {
    window.open(
      (import.meta.env.DEV
        ? import.meta.env.VITE_URL_DEV
        : import.meta.env.VITE_URL_PRODUCTION) + filePath
    );
  };

  const handleDownloadClick = (index: number) => {
    MySwal.fire({
      html: (
        <div className="bg-[#ffffff] p-10 rounded-lg">
          <div className="flex justify-center flex-col">
            {" "}
            <div className="mb-5">
              {" "}
              <button
                className="bg-[#2B3467] hover:bg-[#161b37] text-white text-xl font-bold py-3 px-10 rounded"
                onClick={() => {
                  showFileOnClick(listRegisterVendor[index]?.certificate_uri);
                }}
              >
                หนังสือรับรองบริษัท
              </button>
            </div>
            <div className="mb-5">
              {" "}
              <button
                className="bg-[#2B3467] hover:bg-[#161b37] text-white text-xl font-bold py-3 px-9 rounded"
                onClick={() => {
                  showFileOnClick(listRegisterVendor[index]?.vat_uri);
                }}
              >
                ทะเบียนภาษีมูลค่าเพิ่ม
              </button>
            </div>
            <div>
              {" "}
              <button
                className="bg-[#2B3467] hover:bg-[#161b37] text-white text-xl font-bold py-3 px-10 rounded"
                onClick={() => {
                  showFileOnClick(listRegisterVendor[index]?.bookbank_uri);
                }}
              >
                หน้าสมุดบัญชีบริษัท
              </button>
            </div>
          </div>
        </div>
      ),
      showConfirmButton: false, // Hide the default OK button
    });
  };

  return (
    <div className="bg-zinc-200">
      <div className="my-5">
        <ProjectConType />
      </div>

      <div>
        <SetUpProjectRegis />
        <div className="md:mx-auto md:col-span-10 md:p-12 bg-[#1D5182] w-11/12 rounded-lg">
          <div className="flex flex-row items-center justify-between ">
            {/* Dropdown 1 */}
            <div className="relative inline-block text-left ml-24 ">
              <select
                className="w-auto inline-flex gap-x-1.5 rounded-lg bg-[#FFFFFF] px-6 py-2 text-xl font-semibold text-dark shadow-sm ring-1 ring-inset ring-gray-300"
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e, key)}
              >
                <option value="" disabled hidden>
                  สถานะการรับเหมา
                </option>
                <option value="list">รับเหมาใน list</option>
                <option value="unlist">รับเหมานอก list</option>
                <option value="all">รับเหมาทั้งหมด</option>
              </select>
            </div>

            {/* Dropdown 2 */}
            <div className="relative inline-block text-left ml-24 ">
              <select
                className="inline-flex w-auto justify-center gap-x-1.5 rounded-lg bg-[#FFFFFF] px-6 py-2 text-xl font-semibold text-dark shadow-sm ring-1 ring-inset ring-gray-300"
                value={selectedDocumentStatus}
                onChange={(e) => handleDocumentStatusChange(e, key)}
              >
                <option value="" disabled hidden>
                  แสดงตามสถานะเอกสาร
                </option>
                {Array.isArray(registerStatus) &&
                  registerStatus.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.msg_th}
                    </option>
                  ))}
              </select>
            </div>

            {/* Search bar */}
            <div className="relative mr-24 ml-12">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BsSearch /> {/* Use the imported component */}
              </div>
              <input
                type="text"
                className="block w-auto p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-300 rounded-lg bg-white"
                placeholder="ค้นหารายการ"
                onChange={handleOnSearch}
              />
            </div>
          </div>
        </div>
      </div>

      {/* table */}
      <table className="my-[1.5rem] w-3/4 mx-auto rounded-lg table-fixed">
        <thead className="text-white text-xl bg-[#2B2A2A] h-14">
          <tr className="rounded py-[6rem]">
            <th className="rounded-l-lg w-[4rem]">ลำดับ</th>
            <th className="w-[12rem]">ชื่อบริษัท</th>
            <th className="w-[8rem]">วันส่งเอกสาร</th>
            <th className="w-[8rem]">เวลาส่งเอกสาร</th>
            <th className="w-[16rem]">อีเมล</th>
            <th className="w-[2rem]"></th>
            <th className="w-[9rem]">หลักฐานชำระประกันซอง</th>
            <th className="w-[10rem]">รายละเอียดบริษัท</th>
            <th className="w-[9rem] rounded-r-lg">สถานะ</th>
          </tr>
        </thead>

        {Array.isArray(listRegisterVendor) && listRegisterVendor.length > 0 ? (
          listRegisterVendor.map((listVendor, index) => (
            <tbody
              key={listVendor.id}
              className="bg-white border drop-shadow-lg rounded-lg"
            >
              <tr className="rounded-lg border h-20">
                <td className="text-center text-lg rounded-l-lg">
                  {index + 1}
                </td>
                <td className="text-left text-lg">{listVendor.company_name}</td>
                <td className="text-center text-lg">
                  {listVendor.submit_date == "//"
                    ? "ยังไม่ได้สมัคร"
                    : dateFormatter(listVendor.submit_date)}
                </td>
                <td className="text-center text-lg">
                  {listVendor.submit_time == "::"
                    ? "ยังไม่ได้สมัคร"
                    : TimeFormatter(listVendor.submit_time)}
                </td>
                <td className="text-center text-lg">
                  {editModes[index] ? (
                    <input
                      type="text"
                      defaultValue={listVendor.email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="border p-1 rounded"
                    />
                  ) : (
                    <p>{listVendor.email}</p>
                  )}
                </td>
                <td className="text-center">
                  {editModes[index] ? (
                    <div>
                      <button
                        className="text-2xl"
                        onClick={(e) => handleSaveEmailChange(index)}
                      >
                        <MdCheckBox />
                      </button>
                      <button
                        className="text-2xl"
                        onClick={() => handleToggleEdit(index)}
                      >
                        <MdCancelPresentation />
                      </button>
                    </div>
                  ) : (
                    <div className="mx-auto">
                      <button onClick={() => handleToggleEdit(index)}>
                        <FaEdit />
                      </button>
                    </div>
                  )}
                </td>
                <td className="text-center text-lg">
                  <button
                    className={`border-2 border-gray-300 rounded-full p-1 w-[120px] text-red-500 ${
                      listVendor.msg_th == null ||
                      listVendor.msg_th == "รอเสนอราคา" ||
                      listVendor.msg_th == "สละสิทธิ์"
                        ? "bg-gray-300"
                        : ""
                    }`}
                    disabled={
                      listVendor.msg_th == null ||
                      listVendor.msg_th == "รอเสนอราคา" ||
                      listVendor.msg_th == "สละสิทธิ์"
                    }
                    onClick={() => {
                      showFileOnClick(listVendor?.receipt_uri || "");
                    }}
                  >
                    ดาวน์โหลด
                  </button>
                </td>
                <td className="text-center text-lg">
                  <button
                    className={`border-2 border-gray-300 rounded-full p-1 w-[80px] text-red-500 ${
                      listVendor.msg_th == null ||
                      listVendor.msg_th == "รอเสนอราคา" ||
                      listVendor.msg_th == "สละสิทธิ์"
                        ? "bg-gray-300"
                        : ""
                    }`}
                    disabled={
                      listVendor.msg_th == null ||
                      listVendor.msg_th == "รอเสนอราคา" ||
                      listVendor.msg_th == "สละสิทธิ์"
                    }
                    hidden={listVendor.vendor_type == "list"}
                    onClick={() => handleDownloadClick(index)}
                  >
                    คลิก
                  </button>
                </td>
                <td className="text-center text-lg text-gray-700">
                  {listVendor.msg_th == null
                    ? "รอสมัครเข้าร่วม"
                    : listVendor.msg_th}
                </td>
                {/* <td className="text-center text-lg rounded-r-lg">
                  <button
                    className={`border-4 border-gray-300 p-1 rounded-full w-[80px] ${
                      listVendor.msg_th == null ? "bg-gray-300" : ""
                    }`}
                    disabled={listVendor.msg_th == null}
                  >
                    คลิก
                  </button>
                </td> */}
              </tr>
            </tbody>
          ))
        ) : (
          <tbody className="bg-white border drop-shadow-lg rounded-lg">
            <tr className="rounded-lg border h-20">
              <td colSpan={9} className="text-center text-2xl text-gray-500">
                ไม่มีผู้เสนอราคา
              </td>
            </tr>
          </tbody>
        )}
      </table>

      <div className="mt-10 my-6 grid grid-cols-9 mx-auto w-11/12">
        <button
          className="px-8 py-2.5 w-[180px] rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-2 text-center inline-flex items-center"
          onClick={() =>
            navigate("/project/waitingtomanaged", {
              state: {
                project_manage: "registering",
              },
            })
          }
        >
          <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2 " />
          ย้อนกลับ
        </button>
        {/* edit button */}
        <button
          className="px-8 py-2.5 w-[220px] rounded-lg bg-[#2B3467] drop-shadow-lg text-white text-2xl grid justify-self-center col-start-6"
          onClick={() => handleSendOnClick(key || "")}
        >
          ส่งเชิญอีกครั้ง
        </button>
        <button
          className="px-8 py-2.5 w-[180px] rounded-lg bg-[#4BAE4F] drop-shadow-lg text-white text-2xl grid justify-self-center col-start-8"
          onClick={handleOnClick}
        >
          เสร็จสิ้น
        </button>
      </div>
    </div>
  );
}
