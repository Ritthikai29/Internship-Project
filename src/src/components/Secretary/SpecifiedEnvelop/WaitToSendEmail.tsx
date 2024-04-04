import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllProjectWaitSend } from "../../../services/SecretaryService/HttpClientService";
import { ConsultInterface } from "../../../models/Secretary/ConsultInterface";
import { dateWithTimeFormatter } from "../../../services/utilitity";
import LimitStringWithUrl from "../../PreLoadAndEtc/LongLetter";
import TableLoader from "../../PreLoadAndEtc/ComponentLoader";
import BlankData from "../../PreLoadAndEtc/BlankTableData";

export default function WaitToSendEmail() {
  const navigate = useNavigate();
  const [waitSend, setWaitSend] = useState<ConsultInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [blank, setBlank] = useState(false);

  const getAllWaitSend = async () => {
    try {
      const res = await GetAllProjectWaitSend();
      if (res.status !== 200) alert(res.err);
      setWaitSend(res.data);
      if (res.data.length === 0) setBlank(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllWaitSend();
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
              <th className="w-[8rem]">จำนวนกรรมการ</th>
              <th className="w-[8rem]">เปลี่ยนกรรมการ</th>
              <th className="w-[8rem]">เลื่อนวันเปิดซอง</th>
              <th className="w-[8rem] rounded-tr-lg">ส่งอีเมลซ้ำ</th>
            </tr>
          </thead>

          {loading ? (
            <TableLoader column={8} />
          ) : blank ? (
            <BlankData column={8} />
          ) : (
            <tbody className="border-b-lg rounded-xl h-14">
              {Array.isArray(waitSend) &&
                waitSend.map((item, index) => (
                  <tr className="border-b text-lg text-center h-16"
                  style={{ verticalAlign: "top" }}>
                    <td className="pt-3">{index + 1}</td>
                    <td className="pt-3">{dateWithTimeFormatter(item.open_datetime)} น.</td>
                    <td className="pt-3">{item.totalProject}</td>
                    <td className="pt-3">
                      <LimitStringWithUrl
                        string={item.open_place}
                        maxChars={25}
                      />
                    </td>
                    <td className="pt-3">
                      <button
                        className="border text-lg py-1 px-8 rounded-lg text-center"
                        onClick={() =>
                          navigate(
                            `/secretary/specifiedevenelope/wtse/committeedetails?open_id=${item.id}`
                          )
                        }
                      >
                        คลิก
                      </button>
                    </td>
                    <td className="pt-3">
                      <button
                        className="border text-lg py-1 px-8 rounded-lg text-center text-[#005EEA]"
                        onClick={() =>
                          navigate(
                            `/secretary/specifiedevenelope/wtse/changecommitteedetails?open_id=${item.id}`
                          )
                        }
                      >
                        คลิก
                      </button>
                    </td>
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
                    <td className="pt-3">
                      <button
                        className="border text-lg py-1 px-8 rounded-lg text-center text-[#005EEA]"
                        onClick={() =>
                          navigate(
                            `/secretary/specifiedevenelope/wtse/details?open_id=${item.id}`
                          )
                        }
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
