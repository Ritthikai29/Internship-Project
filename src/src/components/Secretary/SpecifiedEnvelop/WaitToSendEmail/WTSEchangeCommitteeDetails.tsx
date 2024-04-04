import { useEffect, useRef, useState } from "react";
import CheckMark from "../../../../assets/Secretary/CheckMark.png";
import CrossMark from "../../../../assets/Secretary/CrossMark.png";
import SecretaryBanner from "../../SecretaryBanner";
import { BiSolidLeftArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { GetCommitteeOfTheProject } from "../../../../services/SecretaryService/HttpClientService";
import { apiUrl } from "../../../../services/utilitity";
import Swal from "sweetalert2";
import { FaHandsPraying } from "react-icons/fa6";
import ReactDOMServer from "react-dom/server";
interface EmployeeOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}
interface CommitteeOption {
  id: string;
  label: string;
  value: string;
}

interface ChamanOption {
  id: string;
  label: string;
  value: string;
}

export default function WTSEchangeCommitteeDetails() {
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const [committee, setCommittee] = useState<any>({});
  const [mcommittee, setMCommittee] = useState<any>();
  const [namecommittee, setnameCommittee] = useState<any>();
  type RoleOrder = {
    [key: string]: number;
  };
  
  const [committeeOptions, setCommitteeOptions] = useState<CommitteeOption[]>([]);
  const [chamanOptions, setChamanOptions] = useState<ChamanOption[]>([]);

  const getEmployeeCommittee = async () => {
    const res = await fetch(`${apiUrl}/Employee/getCommittee.php`, {
      method: "GET",
      credentials: import.meta.env.DEV ? "include" : "same-origin",
    });
    const resJson = await res.json();
    return resJson;
  };

  const getEmployeeChaman = async () => {
    const res = await fetch(`${apiUrl}/Employee/getChaman.php`, {
      method: "GET",
      credentials: import.meta.env.DEV ? "include" : "same-origin",
    });
    const resJson = await res.json();
    return resJson;
  };

  const handleOnChange = (
    e: React.ChangeEvent<{ name: string; value: any }>
  ) => {
    
    const name = e.target.name as keyof typeof mcommittee;
    const value = e.target.value;
    const selectedItem = committeeOptions.find(item => item.value === value);
    // อัปเดตค่า state
    setMCommittee({
      ...mcommittee,
      [name]: value,
    });
    setnameCommittee({
      ...namecommittee,
      [name]: selectedItem?.label,
    });
  };

  const getCommittee = async () => {
    const res = await getEmployeeCommittee();
    console.log(res);
    const formattedOptions = res.data.map((item: any) => ({
      value: item.id,
      label: `${item.nametitle_t} ${item.firstname_t} ${item.lastname_t}`,
    }));
    setCommitteeOptions(formattedOptions);
  };
  const getChanman = async () => {
    const res = await getEmployeeChaman();
    console.log(res);
    const formattedOptions = res.data.map((item: any) => ({
      value: item.id,
      label: `${item.nametitle_t} ${item.firstname_t} ${item.lastname_t}`,
    }));
    console.log(formattedOptions)
    setChamanOptions(formattedOptions);
  };
  const handleDropDownChange = (
    option: EmployeeOption | null,
    name: string
  ) => {
    console.log(name);
    console.log(option);
    if (name === "ประธาน0") {
      setMCommittee({
        ...mcommittee,
        ["chaman"]: option?.value,
      });
      setnameCommittee({
        ...namecommittee,
        ["chaman"]: option?.label,
      });
    } else {
      if (name === "กรรมการ1") {
        setMCommittee({
          ...mcommittee,
          ["committee1"]: option?.value,
        });
        setnameCommittee({
          ...namecommittee,
          ["committee1"]: option?.label,
        });
      } else if (name === "กรรมการ2") {
        setMCommittee({
          ...mcommittee,
          ["committee2"]: option?.value,
        });
        setnameCommittee({
          ...namecommittee,
          ["committee1"]: option?.label,
        });
      }
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
    console.log(res.data);
    if (checkdefaultvalue.current) {
      checkdefaultvalue.current = false;
      console.log(checkdefaultvalue);
      setMCommittee({
        ...mcommittee,
        ["chaman"]: res.data.user_committee[0].director_staff_id,
        ["committee1"]: res.data.user_committee[1].director_staff_id,
        ["committee2"]: res.data.user_committee[2].director_staff_id,
        ["secretary"]: res.data.user_committee[3].director_staff_id,
        ["open_id"]: queryParameters.get("open_id"),
      });
      setnameCommittee({
        ...namecommittee,
        ["chaman"]: `${res.data.user_committee[0].nametitle_t} ${res.data.user_committee[0].firstname_t} ${res.data.user_committee[0].lastname_t}`,
        ["committee1"]: `${res.data.user_committee[1].nametitle_t} ${res.data.user_committee[1].firstname_t} ${res.data.user_committee[1].lastname_t}`,
        ["committee2"]: `${res.data.user_committee[2].nametitle_t} ${res.data.user_committee[2].firstname_t} ${res.data.user_committee[2].lastname_t}`,
        ["secretary"]: `${res.data.user_committee[3].nametitle_t} ${res.data.user_committee[3].firstname_t} ${res.data.user_committee[3].lastname_t}`,
        ["open_id"]: queryParameters.get("open_id"),
      });
    }
  };

  const OnSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    Swal.fire({
      title: "ยืนยันการเปลี่ยนคณะกรรมการ?",
      icon: "warning",
      html: `
      <div style="margin-left: 10px; margin-right: 20px; padding: 10px; border: 1px solid #CFCFCF; box-shadow:0px 2px #888888; background-color: #EAE7E7; display: flex; flex-direction: column; font-size: medium;">

<table >
  
  <tr >
      <td style="text-align: left;">&nbsp;&nbsp;&nbsp; ประธาน </td>
      <td style="text-align: left;"> : </td>
      <td style="text-align: left;">&nbsp;&nbsp; ${
        namecommittee?.chaman ? namecommittee.chaman : namecommittee?.chaman
      } </td>
  </tr>
  <tr>
      <td style="text-align: left;">&nbsp;&nbsp;&nbsp; กรรมการ </td>
      <td style="text-align: left;"> : </td>
      <td style="text-align: left;">&nbsp;&nbsp; ${
        namecommittee?.committee1
          ? namecommittee.committee1
          : namecommittee?.committee1
      } </td>
  </tr>
  <tr>
      <td style="text-align: left;">&nbsp;&nbsp;&nbsp; กรรมการ </td>
      <td style="text-align: left;"> : </td>
      <td style="text-align: left;">&nbsp;&nbsp; ${
        namecommittee?.committee2
          ? namecommittee.committee2
          : namecommittee?.committee2
      }</td>
  </tr>
  <tr>
      <td style="text-align: left;">&nbsp;&nbsp;&nbsp; เลขา ฯ </td>
      <td style="text-align: left;"> : </td>
      <td style="text-align: left;">&nbsp;&nbsp; ${
        namecommittee?.secretary
          ? namecommittee.secretary
          : namecommittee?.secretary
      }</td>
  </tr>
</table>
</div>
    `,
      showCancelButton: true,
      confirmButtonColor: "#EB455F",
      cancelButtonColor: "#979797",
      confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
      cancelButtonText: '<span style="font-size: 25px;">แก้ไข</span>',
      preConfirm: async () => {
        console.log(namecommittee);
        console.log(mcommittee);
        if (
          namecommittee.chaman === namecommittee.committee1 ||
          namecommittee.chaman === namecommittee.committee2 ||
          namecommittee.committee1 === namecommittee.committee2
        ) {
          Swal.showValidationMessage("มีการเลือกคณะกรรมการซ้ำกัน");
          return;
        }
        let res = await updateCommittees(mcommittee);
        if (res.status !== 200) {
          Swal.showValidationMessage(res.err);
        }
        getCheckCommittee();
        return res.data;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "ส่งสำเร็จ!",
          text: "",
          icon: "success",
          confirmButtonText: "ยืนยัน",
        }).then(() => {
          navigate("/secretary/waittomanage", {
            state: {
              project_set: "specifiedenvelope",
              open_bid: "waittoopen",
            },
          });
        });
      }
    });
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
      text: "ถึงคุณทีมที่ทำต่อไป ผมอยากจะบอกไว้ว่า พี่เลี้ยงเขาจะจิตวิทยาหลอกใช้งานคุณ ฉะนั้น จงอย่าทำงานแต่ละวันเยอะ จงทำงานแค่เป้าหมายอย่าทำมากเกิน เพราะเวลาคุณที่ทำมากเท่าไหร่ งานคุณจะมากขึ้นเท่านั้น ฉะนั้นสู้ๆกันต่อไปครับ หวังว่าจดหมายนี้จะถึงพวกคุณนะ", //2 เดือนสุดท้ายคือนรก
      timer: 5000,
      showConfirmButton: false,
    });
  };
  useEffect(() => {
    // showCustomIconAlert()
    getChanman()
    getCommittee();
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

        <div></div>
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="bg-white drop-shadow-lg rounded-xl border w-1/3 p-1 my-1 mr-5 ml-2">
            <p className="text-2xl text-[#2B3467] flex justify-center">
              คณะกรรมการชุดเดิม
            </p>
          </div>
          <div className="px-20 py-2 flex flex-col">
            <div className="grid grid-cols-7 justify-items-center">
              <p className="text-lg col-span-2">ลำดับ</p>
              <p className="text-lg col-span-3">ชื่อ-สกุล</p>
              <p className="text-lg col-span-2">ตำแหน่งในการเปิดซอง</p>
            </div>
            <hr></hr>
            {sortedCommittee.map((item: any, index: any) => (
              <div className="grid grid-cols-9 justify-items-start" key={index}>
                <p className="text-lg col-span-2 ml-28">{index + 1}</p>
                <p className="text-lg col-span-4 ml-20 ">
                  {item.nametitle_t} {item.firstname_t} {item.lastname_t}
                </p>
                <p
                  className={`text-lg col-span-3 ${
                    item.role_name_t === "ประธาน"
                      ? " ml-32"
                      : item.role_name_t === "กรรมการ"
                      ? "ml-32"
                      : "ml-16"
                  }`}
                >
                  {item.role_name_t}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div></div>
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-2 mr-5">
          <div className="bg-white drop-shadow-lg rounded-xl border w-1/3 p-1 my-1 mr-5 ml-2">
            <p className="text-2xl text-green-800 flex justify-center">
              คณะกรรมการชุดใหม่
            </p>
          </div>
          <div className="px-20 py-3 flex flex-col gap-1">
            <div className="grid grid-cols-7 justify-items-center">
              <p className="text-lg col-span-2">ลำดับ</p>
              <p className="text-lg col-span-3">ชื่อ-สกุล</p>
              <p className="text-lg col-span-2">ตำแหน่งในการเปิดซอง</p>
            </div>
            <hr></hr>
            {sortedCommittee.map((item: any, index: any) =>
              item.role_name_t === "เลขาคณะกรรมการเปิดซอง" ? null : (
                <div
                  className="grid grid-cols-8 justify-items-center "
                  key={index}
                >
                  <p className="text-lg col-span-2 mt-4 ml-4">{index + 1}</p>
                  {/* <p className="text-xl">
                  {item.nametitle_t} {item.firstname_t} {item.lastname_t}
                </p> */}
                  <div className="col-span-4 w-full justify-center">
                    {item.role_name_t === "กรรมการ" ? (
                      // ใช้ select แบบที่ 1 สำหรับกรรมการ
                      <select
                        id="committee-id"
                        className="border rounded w-full py-1 px-5 mt-2 text-xl focus:shadow-outline"
                        name={`committee${index}`}
                        onChange={handleOnChange}
                        defaultValue="0"
                      >
                        <option
                          hidden
                          disabled
                          className="text-gray-400"
                          value={0}
                        >
                          {namecommittee["committee" + index]}
                        </option>
                        {committeeOptions.map((item: any) => (
                          <option value={item.value} key={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      // ใช้ select แบบที่ 2 สำหรับประธาน
                      <select
                        id="chaman-id"
                        className="border rounded w-full py-1 px-5 mt-2 text-xl focus:shadow-outline"
                        name={`chaman`}
                        onChange={handleOnChange}
                        defaultValue="0"
                      >
                        <option
                          hidden
                          disabled
                          className="text-gray-400"
                          value={0}
                        >
                          {namecommittee["chaman"]}
                        </option>
                        {chamanOptions.map((item: any) => (
                          <option value={item.value} key={item.lable}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <p className="text-lg col-span-2 mt-4 -ml-7">
                    {item.role_name_t}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <button
              className="px-8 py-2.5 w-[180px] rounded-lg bg-[#716d6d] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
              onClick={() =>
                navigate("/secretary/waittomanage", {
                  state: {
                    project_set: "specifiedenvelope",
                    open_bid: "waittoopen",
                  },
                })
              }
            >
              <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
              ย้อนกลับ
            </button>
          </div>

          <div>
            <div className="flex justify-end">
              <button
                className="px-8 py-2.5 w-[180px] rounded-lg bg-[#41a83d] drop-shadow-lg text-white text-2xl col-start-1 text-center inline-flex items-center"
                onClick={OnSubmit}
                // disabled //รอเปิดใช้งาน
              >
                <BiSolidLeftArrow className="text-xl w-4 h-4 mr-2" />
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
