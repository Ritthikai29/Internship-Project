import ProjectHeader from "../../assets/project/projectHeader.png";
import HookImage from "../../assets/project/hook 1.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IListProject } from "../../models/Project/IProject";
import { ListProjectService } from "../../services/ProjectServices";

export default function Project() {
  const [projects, setProjects] = useState<IListProject[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await ListProjectService();
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const dateFormat = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    const month = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()+543}`;
  };

  const timeFormat = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} น.`;
  };

  return (
    <div className="flex flex-col items-center bg-white">
      <div className="w-full">
        <div style={{ backgroundImage: `url(${ProjectHeader})` }} className="w-full h-96 bg-cover"></div>
      </div>
      <div className="flex flex-col items-center">
        <div className="border-2 mx-2 my-2 flex flex-row rounded-xl bg-white">
          <div className="px-2  m-auto border-r-2 border-black xl:flex hidden">
            <div className="flex flex-col items-center xl:flex">
              <img src={HookImage} className="h-[20rem]" alt="Hook" />
              <h4 className="text-2xl font-bold">ประกาศรายละเอียด</h4>
              <h4 className="text-xl font-bold">โครงการประกวดราคา</h4>
            </div>
          </div>
          <div className="m-4 px-1 py-5 flex flex-col items-center">
            <div className="flex flex-col justify-center">
            <table className="border-collapse   rounded-lg shadow-md bg-white">
              <thead>
                <tr className="table-auto bg-[#2B2A2A] text-white">
                  <th className="text-center text-lg w-[24rem] py-2  rounded-tl-lg">โครงการ</th>
                  <th className="text-center text-lg w-[16rem] py-2  ">ช่วงวันรับสมัคร</th>
                  <th className="text-center text-lg w-[12rem] py-2  ">เวลาปิดรับสมัคร</th>
                  <th className="text-center text-lg w-[15rem] py-2   rounded-tr-lg">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project: IListProject) => (
                  <tr key={project.id} style={{ verticalAlign: "top" }} className="text-base border-b ">
                    <td className="text-left py-3 px-4 border border-gray-100">{project.name}</td>
                    <td className="text-center py-3 border border-gray-100">{project.start_datetime ? dateFormat(project.start_datetime) : "ยังไม่กำหนด"} - {project.end_datetime ? dateFormat(project.end_datetime) : "ยังไม่กำหนด"}</td>
                    <td className="text-center py-3 border border-gray-100">{project.end_datetime ? timeFormat(project.end_datetime) : "ยังไม่กำหนด"}</td>
                    <td className="text-center py-3 border border-gray-100">{project.status_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              <div className="flex justify-center my-4">
                <Link to="/announcement" className="bg-red-500 hover:bg-red-600 hover:text-white  text-white py-2 w-full text-center text-lg font-black rounded-lg">ดูทั้งหมด</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
