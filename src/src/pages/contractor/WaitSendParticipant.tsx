import { useState, useEffect } from "react";
import ProjectContractor from "../../components/contractor/projectContractor";
import AllProject from "../../components/contractor/AllProject";
import SetUpProjectWaitSend from "../../components/contractor/SetUpProjectWaitSend";
import { ProjectContext } from "../../components/contractor/ProjectContext";
import { DetailProject } from "../../services/ProjectServices";
import { DetailProjectInterface } from "../../models/Project/IListWaitProject";

export default function WaitSendParticipant() {
  const queryParameters = new URLSearchParams(window.location.search);
  const [key] = useState<string>(queryParameters.get("key") || "");

  const [detailProject, setdetailProject] = useState<DetailProjectInterface>();
  const getDetailProject = async (key: string) => {
    let res = await DetailProject(key);

    if (res.status !== 200) {
      alert("err");
      return;
    }
    setdetailProject(() => res.data);
  };
  useEffect(() => {
    getDetailProject(key || "");
  }, []);

  return (
    <ProjectContext.Provider value={detailProject}>
      <div className="bg-[#F5F5F5]">
        
        <div>
          <ProjectContractor />
        </div>

        <div>
          <AllProject />
        </div>

        <div>
          <SetUpProjectWaitSend />
        </div>

      </div>
    </ProjectContext.Provider>
  );
}
