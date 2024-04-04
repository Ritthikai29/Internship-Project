import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetAllConsultInDay } from "../../../services/SecretaryService/HttpClientService";
import { ConsultInterface } from "../../../models/Secretary/ConsultInterface";
import { dateWithTimeFormatter } from "../../../services/utilitity";
import { ReSendCommitteePasscode } from "../../../services/SecretaryService/SendInviteSecretary";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import LimitStringWithUrl from "../../PreLoadAndEtc/LongLetter";
import TableLoader from "../../PreLoadAndEtc/ComponentLoader";
import BlankData from "../../PreLoadAndEtc/BlankTableData";

export default function WaitToOpen() {
  const [loading, setLoading] = useState(true);
  const [blank, setBlank] = useState(false);
  const navigate = useNavigate();
  const [consults, setConsults] = useState<ConsultInterface[]>([]);

  const getAllConsultInDay = async () => {
    try {
      const res = await GetAllConsultInDay();
      if (res.status !== 200) {
        alert(res.err);
      }
      setConsults(res.data);
      if (res.data.length === 0) setBlank(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOnClick = (op_id: string) => {
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
        const res = await ReSendCommitteePasscode(op_id);
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

  useEffect(() => {
    getAllConsultInDay();
  }, []);

  return (
    <div>
      <div className="rounded-lg border mx-2 my-16">
        <table className="w-full rounded-lg table-fixed">
          <thead className="text-white bg-[#2B2A2A] h-14 rounded-lg">
            <tr className="rounded-lg text-base">
              <th className="w-[6rem] rounded-tl-lg">ลำดับ</th>
              <th className="w-[12rem]">วัน/เวลาเปิดซอง</th>
              <th className="w-[8rem]">จำนวนโครงการ</th>
              <th className="w-[12rem]">สถานที่</th>
              <th className="w-[8rem]">เปลี่ยนกรรมการ</th>
              <th className="w-[8rem]">เลื่อนวันเปิดซอง</th>
              <th className="w-[8rem]">เปิดซอง</th>
              <th className="w-[8rem] rounded-tr-lg">ส่ง Password ซ้ำ</th>
            </tr>
          </thead>
          {loading ? (
            <TableLoader column={8} />
          ) : blank ? (
            <BlankData column={8} />
          ) : (
            <tbody className="border-b-lg rounded-xl h-14">
              {Array.isArray(consults) &&
                consults.map((item, index) => (
                  <tr className="border-b text-lg text-center h-16" style={{ verticalAlign: "top" }} key={index}>
                    <td className="pt-3">{index + 1}</td>
                    <td className="pt-3">{dateWithTimeFormatter(item.open_datetime)} น.</td>
                    <td className="pt-3">{item.totalProject}</td>
                    <td className="pt-3">
                      <LimitStringWithUrl
                        string={item.open_place}
                        maxChars={25}
                      />
                    </td>
                    <button
                      className="border text-lg py-1 px-8 mt-3 rounded-lg text-center text-[#005EEA]"
                      onClick={() =>
                        navigate(
                          `/secretary/specifiedevenelope/wtse/changecommitteedetails?open_id=${item.id}`
                        )
                      }
                    >
                      คลิก
                    </button>
                    <td className="pt-3">
                      <button
                        className="border text-lg py-1 px-8 rounded-lg text-center text-[#005EEA]"
                        onClick={() =>
                          navigate(
                            `/secretary/openingschedule/openbidsetting?open_id=${item.id}`
                          )
                        }
                      >
                        คลิก
                      </button>
                    </td>
                    <td className="pt-4">
                      <Link
                        to={`/secretary/specifiedevenelope/wto/submitotp?open_id=${item.id}`}
                        className="border text-lg py-1 px-8 rounded-lg text-center"
                      >
                        คลิก
                      </Link>
                    </td>
                    <td className="pt-3">
                      <button
                        className="border text-lg py-1 px-8 rounded-lg text-center text-[#005EEA]"
                        onClick={() => {
                          handleSendOnClick(item.id?.toString() || "");
                        }}
                      >
                        ส่ง
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
