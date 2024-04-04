import React, { useEffect, useState } from "react";
import { GetPreviousVendorHistory } from "../../../../../services/SecretaryService/HttpClientService";
import { dateWithTimeFormatter } from "../../../../../services/utilitity";
import TableLoader from "../../../../PreLoadAndEtc/ComponentLoader";
import BlankDaTa from "../../../../PreLoadAndEtc/BlankTableData";

interface IHistorySecretary {
  id?: string | number;
  vendor_project_id: string | number;
  action_detail: string;
  order: string | number;
  company_name: string;
  datetime_action: string;
}

interface GroupedHistory {
  [key: string]: IHistorySecretary[];
}

export default function ONPHistoryVendor() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [loading, setLoading] = useState(true);
  const [blank, setBlank] = useState(false);
  const [historySecretary, setHistorySecretary] = useState<IHistorySecretary[]>(
    []
  );

  const getPreviousVendorHistory = async () => {
    try {
      const res = await GetPreviousVendorHistory(
        queryParameters.get("project_id") || ""
      );
      if (res.status == 200) setHistorySecretary(res.data);
      if (res.status !== 200) setBlank(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPreviousVendorHistory();
  }, []);

  // Group historySecretary by 'order'
  const groupedHistory: GroupedHistory = historySecretary.reduce(
    (acc: GroupedHistory, item) => {
      const key = item.order.toString();
      acc[key] = [...(acc[key] || []), item];
      return acc;
    },
    {}
  );

  return (
    <div>
      <div className="px-[8rem] pb-8 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-xl border w-full mt-5 mr-5">
          <div className="px-6 py-14 flex flex-col gap-8">
            <p className="text-3xl text-[#2B3467] font-bold">
              ประวัติการเชิญ Vendor เข้าร่วมเปิดซอง
            </p>
            <table className="w-full mt-6 drop-shadow-lg rounded-lg">
              <thead className="text-white text-2xl uppercase bg-[#2B2A2A] h-14">
                <tr>
                  <th className="rounded-l-lg w-[40px]">ครั้งที่</th>
                  <th className="w-[60px]">ชื่อ หจก / บริษัท</th>
                  <th className="w-[60px]">รายละเอียด</th>
                  <th className="rounded-r-lg w-[100px]">วัน / เวลา ( ที่ส่งเชิญ )</th>
                </tr>
              </thead>
              {loading ? (
                <TableLoader column={4} />
              ) : blank ? (
                <BlankDaTa column={4} />
              ) : (
                <tbody className="bg-white border-b-lg rounded-xl">
                  {Object.values(groupedHistory).map((items, index) => (
                    <React.Fragment key={index}>
                      {items.map((item, i) => (
                        <tr
                          key={item.id}
                          className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center"
                        >
                          {i === 0 && (
                            <td rowSpan={items.length}>{item.order}</td>
                          )}
                          <td className="text-left pr-2">{item.company_name}</td>
                          <td className="text-left">{item.action_detail}</td>
                          <td className="text-center">{dateWithTimeFormatter(item.datetime_action)}</td>
                        </tr>
                      ))}
                      {index !== Object.values(groupedHistory).length - 1 && (
                        <hr />
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
