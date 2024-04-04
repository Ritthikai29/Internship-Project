import { useEffect, useRef, useState } from "react";
import { checkValidateUserStaff } from "../../services/HomeServices";
import {
  CheckUserPermission,
  checkCalculateProject,
} from "../../services/BudgetService/CalculateService";
import { LoginInterface } from "../../models/ILogin";
import { LoginService, LogoutService } from "../../services/LoginService";
import CalculateComponent from "../../components/Budget/Calculate/CalculateComponent";
import LoadingComponent from "../../components/Loading";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import LoginForm from "../loginemail/loginemail";

export default function Calculate() {
  const MySwal = withReactContent(Swal);
  const employeeRef = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  // state changing page (when state is changed will re run useEffect)
  const [stating, setStating] = useState<string>("start");

  // user id
  // const [userId, setUserId] = useState<string>("");

  // paging
  const [page, setPage] = useState<string>("waiting");

  // should be check a parameter on url
  const queryParameters = new URLSearchParams(window.location.search);
  const [projectKey] = useState<string>(queryParameters.get("pj") || "");
  const [projectId, setProjectId] = useState<string>();

  const start = () => {
    LogoutService();
    setPage("login");
    setStating("login");
  };

  const checkAProject = async () => {
    let res = await checkCalculateProject(projectKey);
    if (res.status !== 200) {
      setPage("unAccess");
      setStating("unAccess");
    } else {
      setProjectId(res.data.project.id);
      setPage("permission");
      setStating("permission");
    }
    console.log(22222);
  };

  const checkUserPermission = async () => {
    let res = await CheckUserPermission(projectId || "");
    if (res.status === 401) {
      MySwal.fire({
        title: "ท่านไม่ใช่ผู้คำนวณ",
      })
      LogoutService();
      setPage("login");
      setStating("login");
      
    }
    if (res.status !== 200) {
      LogoutService();
      setPage("login");
      setStating("login");
      MySwal.fire({
        title: "ท่านไม่ใช่ผู้คำนวณ",
      })
    } else {
      setPage("calculate");
      setStating("calculate");
      // window.location.replace(window.location.href);
    }
    console.log(333333);
  };

  // check a user is a have to connection?
  useEffect(() => {
    console.log(stating);
    switch (stating) {
      case "start":
        setPage("login")
        break;
      case "verify":
        checkAProject();
        break;
      case "permission":
        checkUserPermission();
        break;
      case "login":
        setPage("login");
        break;

      case "unAccess":
        setPage("unAccess");
        MySwal.fire({
          title: "ไม่สามารถทำรายการได้ เนื่องจากท่านได้ทำรายการไปแล้ว",
        });

        break;

      case "calculate":
        setPage("calculate");
        // load data in page in main display

        break;

      default:
        break;
    }
    // console.log(page);
  }, [stating]);

  const loginSubmit = async (loginResult: any): Promise<void> => {
    console.log(loginResult);
    if (loginResult.status === 200) {
      setTimeout(() => {
        setPage("waiting");
      }, 10);
      setPage("waiting");
      setStating("verify");
      // window.location.replace(window.location.href);
    } else {
      MySwal.fire({
        title: <h3>{loginResult.err}</h3>,
      });
    }
    console.log(555555);
  };

  return (
    <div>
      {/* <a onClick={handleTest}>Test</a> */}
      {page == "waiting" && <LoadingComponent />}

      {page == "login" && <LoginForm loginSubmit={loginSubmit} />}

      {page == "calculate" && (
        <CalculateComponent
          projectKey={projectKey}
          projectId={projectId || ""}
        />
      )}
    </div>
  );
}
