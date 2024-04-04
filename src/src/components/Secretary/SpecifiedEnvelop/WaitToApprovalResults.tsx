import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetAllApproveProject } from "../../../services/SecretaryService/HttpClientService";
import TableLoader from "../../PreLoadAndEtc/ComponentLoader";
import BlankData from "../../PreLoadAndEtc/BlankTableData";
import LimitStringWithUrl from "../../PreLoadAndEtc/LongLetter";

export default function WaitToApprovalResults() {
  const [loading, setLoading] = useState(true);
  const [blank, setBlank] = useState(false);
  interface IProject {
    id?: number;
    key: string;
    name: string;
    Tor_uri: string;
    division_name: string;
    department_name: string;
    SECTION: string;
    SUBSECTION: string;
    status_id: string | number;
    status_name: string;
  }
  const [projects, setProjects] = useState<IProject[]>([]);

  const getAllProject = async () => {
    try {
      const res = await GetAllApproveProject();
      if (res.status !== 200) {
        alert(res.err);
      }
      setProjects(res.data);
      if (res.data.length === 0) setBlank(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProject();
  }, []);

  return (
    <div>
      <div className="rounded-lg border mx-2 my-16">
        <table className="w-full rounded-lg table-fixed">
          <thead className="text-white bg-[#2B2A2A] h-14 rounded-lg">
            <tr className="rounded-lg text-base">
              <th className="w-[4rem] rounded-tl-lg">ลำดับ</th>
              <th className="w-[6rem]">เลขที่เอกสาร</th>
              <th className="w-[15rem]">ชื่อโครงการ</th>
              <th className="w-[15rem]">สังกัด</th>
              <th className="w-[12rem]">สถานะ</th>
              <th className="w-[8rem] rounded-tr-lg">สรุปผล</th>
            </tr>
          </thead>
          {loading ? (
            <TableLoader column={6} />
          ) : blank ? (
            <BlankData column={6}/>
          ) : (
            <tbody className="border-b-lg rounded-xl h-14">
              {Array.isArray(projects) &&
                projects.map((item, index) => (
                  <tr className="border-b text-lg text-center h-16"
                  style={{ verticalAlign: "top" }}>
                    <td className="py-4 ">{index + 1}</td>
                    <td className="py-4 ">{item.key}</td>
                    <td className="py-4 text-left">{item.name}</td>
                    <td className="py-4 text-left">
                    <LimitStringWithUrl
                        string={`${item.division_name} / ${item.department_name} / ${item.SECTION} / ${item.SUBSECTION}`}
                        maxChars={30}
                    />
                      </td>
                    <td className="text-[#DD6A29] py-4">{item.status_name}</td>
                    <td className="py-4 ">
                      <Link
                        to={`/secretary/specifiedevenelope/wtar/conlcusion?key=${item.key}`}
                        className="border text-lg py-1 px-8 rounded-lg text-center"
                      >
                        คลิก
                      </Link>
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
