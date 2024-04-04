import { useEffect, useRef, useState } from "react";
import CheckMark from "../../../../assets/Secretary/CheckMark.png";
import CrossMark from "../../../../assets/Secretary/CrossMark.png";
import AsyncSelect from "react-select/async";
import SecretaryBanner from "../../SecretaryBanner";
import { BiSolidLeftArrow } from "react-icons/bi";

import { useNavigate } from "react-router-dom";
import { GetCommitteeOfTheProject } from "../../../../services/SecretaryService/HttpClientService";
import { apiUrl } from "../../../../services/utilitity";
import { EmployeeInterface } from "../../../../models/Project/IEmployee";
import Swal from "sweetalert2";
import { FaHandsPraying } from "react-icons/fa6";
import ReactDOMServer from 'react-dom/server';
interface EmployeeOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export default function WTSECommitteeDetails() {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const [committee, setCommittee] = useState<any>({});
  const [mcommittee, setMCommittee] = useState<any>();
  const [resetAsyncSelect, setResetAsyncSelect] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isInputDisabled, setInputDisabled] = useState(false);
  type RoleOrder = {
    [key: string]: number;
  };

  const getEmployee = async (input: string) => {
    const res = await fetch(
      `${apiUrl}/Employee/searchEmployee.php?search=${input}`,
      {
        method: "GET",
        credentials: import.meta.env.DEV ? "include" : "same-origin",
      }
    );
    const resJson = await res.json();
    return resJson;
  };

  const handleDropDownChange = (
    option: EmployeeOption | null,
    name: string
  ) => {
    if (name === "ประธาน0") {
      setMCommittee({
        ...mcommittee,
        ["chaman"]: option?.value,
      });
    } else {
      if (name === "กรรมการ1") {
        setMCommittee({
          ...mcommittee,
          ["committee1"]: option?.value,
        });
      } else if (name === "กรรมการ2") {
        setMCommittee({
          ...mcommittee,
          ["committee2"]: option?.value,
        });
      }
    }
  };

  const loadOption = (inputValue: string) => {
    return new Promise<EmployeeOption[]>((resolve) => {
      getEmployee(inputValue).then((res) => {
        if (res.status !== 200) {
          resolve([
            {
              label: "Not Found",
              value: "DEFAULT",
              isDisabled: true,
            },
          ]);
          return;
        }
        let dataMap: EmployeeOption[] = res.data.map((item: any) => ({
          label:
            item.firstname_t +
            " " +
            item.lastname_t +
            " / " +
            item.position +
            " / " +
            item.email,
          value: item.id,
        }));
        resolve(dataMap);
      });
    });
  };

  const setUpdatecommitee = async () => {
    if (hidden === true) {
      setHidden(false);
      checkdefaultvalue.current = false;
      setResetAsyncSelect(false);
    } else {
      setHidden(true);
      checkdefaultvalue.current = true;
      setResetAsyncSelect(true);
    }
  };
  const sortedCommittee = Array.isArray(committee?.user_committee)
    ? committee?.user_committee.sort((a: any, b: any) => {
        const roleOrder: RoleOrder = {
          ประธาน: 1,
          กรรมการ: 2,
          เลขาคณะกรรมการเปิดซอง: 3,
        };

        const orderA = roleOrder[a.role_name_t] || 999;
        const orderB = roleOrder[b.role_name_t] || 999;

        return orderA - orderB;
      })
    : [];

  const checkdefaultvalue = useRef(true); //ใช้ในการเช็คเพื่อเซ็ตค่าเริ่มต้นให้สำหรับการ update กรรมการ
  const getCheckCommittee = async () => {
    const res = await GetCommitteeOfTheProject(
      queryParameters.get("open_id") || ""
    );
    // console.log(res);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    setCommittee(res.data);
  };

  const updateCommittees = async (data: any) => {
    let res = await fetch(
      `${apiUrl}/sendCommitteeInvite/updatecommittees.php`,
      {
        method: "POST",
        credentials: import.meta.env.DEV ? "include" : "same-origin",
        body: JSON.stringify(data),
      }
    );
    const resJson = await res.json();
    console.log(resJson);
    return resJson;
  };

  const showCustomIconAlert = () => {
    const htmlString = ReactDOMServer.renderToStaticMarkup(FaHandsPraying());

    Swal.fire({
      title: `<div style="display: flex; align-items: center;">${htmlString} <span style="margin-left: 10px;">ขอความกรุณา</span></div>`,
      text: 'โปรดตั้งนะโม 3 จบก่อนดำเนินการเปลี่ยนแปลงกรรมการ เพื่อการทำงานที่ถูกต้อง',
      timer: 5000,
      showConfirmButton: false,
    });
  };
  useEffect(() => {
    // showCustomIconAlert()
    
    
    getCheckCommittee();
    const requestInterval = setInterval(getCheckCommittee, 6000);
    return () => {
      clearInterval(requestInterval);
    };
  }, []);

  return (
    <div className="bg-[#F5F5F5]">
      {<SecretaryBanner />}
      <div className="px-[8rem] py-12 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="px-32 py-14 flex flex-col gap-8">
            <p className="text-3xl text-[#2B3467] font-bold text-center">
              รายละเอียดกรรมการที่เข้าร่วมประกวดราคา
            </p>
            <div className="grid grid-cols-3 ">
              <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                <p className="text-xl">ประธาน</p>
                <img
                  src={committee.chairman?.total == 1 ? CheckMark : CrossMark}
                  className="h-[90px]"
                />
                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                <p className="text-xl">{committee.chairman?.total || 0} / 1 </p>
              </div>
              <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                <p className="text-xl">กรรมการ</p>
                <img
                  src={committee.committee?.total == 2 ? CheckMark : CrossMark}
                  className="h-[90px]"
                />
                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                <p className="text-xl">{committee.committee?.total || 0} / 2</p>
              </div>
              <div className="grid grid-flow-row auto-rows-auto justify-items-center gap-4">
                <p className="text-xl">เลขา</p>
                <img
                  src={committee.secretary?.total == 1 ? CheckMark : CrossMark}
                  className="h-[90px]"
                />
                <p className="text-xl">ผู้ที่แจ้งเข้าร่วมแล้ว</p>
                <p className="text-xl">{committee.secretary?.total || 0} / 1</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="px-32 py-14 flex flex-col gap-3">
            <div className="grid grid-cols-3 justify-items-center">
              <p className="text-xl ">ลำดับ</p>
              <p className="text-xl ">ชื่อ-สกุล</p>
              <p className="text-xl ">ตำแหน่งในการเปิดซอง</p>
            </div>
            <hr></hr>
            {sortedCommittee.map((item: any, index: any) => (
              <div
                className="grid grid-cols-3 justify-items-center"
                key={index}
              >
                <p className="text-xl">{index + 1}</p>
                <p className="text-xl">
                  {item.nametitle_t} {item.firstname_t} {item.lastname_t}
                </p>
                <p className="text-xl">{item.role_name_t}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5"
          hidden={hidden}
        >
          <div className="px-32 py-14 flex flex-col gap-3">
            <div className="grid grid-cols-3 justify-items-center">
              <p className="text-xl ">ลำดับ</p>
              <p className="text-xl ">ชื่อ-สกุล</p>
              <p className="text-xl ">ตำแหน่งในการเปิดซอง</p>
            </div>
            <hr></hr>
            {sortedCommittee.map((item: any, index: any) =>
              index === 3 ? null : (
                <div
                  className="grid grid-cols-3 justify-items-center"
                  key={index}
                >
                  <p className="text-xl">{index + 1}</p>
                  {/* <p className="text-xl">
                  {item.nametitle_t} {item.firstname_t} {item.lastname_t}
                </p> */}
                  <div className="grid grid-cols-1 w-full">
                    <AsyncSelect
                    key={resetAsyncSelect ? 'reset' : 'normal'} 
                      className="rounded-full border"
                      classNames={{
                        control: () =>
                          "border border-[#CCCCCC] p-2 pl-6 text-xl",
                      }}
                      loadOptions={loadOption}
                      defaultOptions={[
                        {
                          label: "กรุณาพิมพ์อย่างน้อย 1 ตัวอักษร",
                          value: "DEFAULT",
                          isDisabled: true,
                        },
                      ]}
                      defaultInputValue={`${item.nametitle_t} ${item.firstname_t} ${item.lastname_t}`}
                      isDisabled={isInputDisabled}
                      onChange={(option) =>
                        handleDropDownChange(option, item.role_name_t + index)
                      }
                    />
                  </div>
                  <p className="text-xl">{item.role_name_t}</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <button
              className="px-8 py-2.5 w-[180px] rounded-lg bg-[#716d6d] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
              onClick={() =>
                navigate("/secretary/waittomanage", {
                  state: {
                    project_set: "specifiedenvelope",
                    open_bid: "waitsendemail",
                  },
                })
              }
            >
              <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
