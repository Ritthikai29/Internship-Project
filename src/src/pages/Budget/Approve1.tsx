import { useEffect, useRef, useState } from "react"
import { CheckApproveProject, UserPermissionApprove } from "../../services/BudgetService/ApproveService"
import LoadingComponent from "../../components/Loading";
import { LoginService, LogoutService } from "../../services/LoginService";
import { LoginInterface } from "../../models/ILogin";
import Approve1Component from "../../components/Budget/Approver1/Approve1Component";
import LoginForm from "../loginemail/loginemail";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function Approve1() {

  const MySwal = withReactContent(Swal);
  const [checkState, setCheckState] = useState<string>("start")
  const [page, setPage] = useState<string>("loading");

  const queryParameters = new URLSearchParams(window.location.search)

  const [projectKey] = useState<string>(queryParameters.get("pj") || "");
  const [clientRole, setClientRole] = useState<string>("none");
  const [projectId, setProjectId] = useState<string>("");

  const employeeRef = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)


  const checkProject = async () => {
    let res = await CheckApproveProject(projectKey)
    console.log(res)
    if (res.status !== 200) {
      MySwal.fire({
        title: res.test,
      }); 
      setCheckState("start");
      setPage("Login");
      return;
    }

    // check a client role is a approver 1 = can access
    if (res.data.clientRole !== "approver 1") {
      setCheckState("unAccess")
      return; // to end project
    }
    setClientRole(res.data.clientRole)
    setProjectId(() => (res.data.project.id))
    setCheckState("A")
  }


  const userPermission = async () => {
    let res = await UserPermissionApprove(clientRole, projectId);

    if (res.status !== 200) {
      setPage("Login")
      MySwal.fire({
        title: "ไม่สามารถทำรายการได้ เนื่องจากท่านไม่ใช่ผู้อนุมัติ",
      });
      return;
    }
    setCheckState("B"); // open page approve 1
    setPage("approve1");
  }

  /**
   * from this diagrams
   *                          start
   *                            |
   *                            v
   *       ----start---> check && check role is a approve
   *     /                      |
   *    |                       |
   *    |                       |
   *    |                       |
   *  Login                     A
   *    ^                       |
   *    |                       |
   *    |                       |
   *     \                      v
   *       ----login---  user permission  
   *                            |
   *                            v
   *                         approve 1
   * 
   * to code use Effect
   */

  useEffect(() => {
    switch (checkState) {
      case "start":
        setPage("Login");
        break;
      case "o":
          checkProject() // check a project 
          break;
      case "A":
        userPermission() // check user permission
        break;
      case "B":
        // open approve 1
        setPage("approve1") // set page to approve 1
        break
      case "unAccess": 
      MySwal.fire({
        title: "ไม่สามารถทำรายการได้ เนื่องจากท่านได้ทำรายการไปแล้ว",
      });
        break;
      default:
        break;
    }
    console.log(checkState)

  }, [checkState])

  const onSubmitLogin = async (loginResult: any): Promise<void> => {
    console.log(loginResult)
    if (loginResult.status === 200) {
      setTimeout(() => {
        setPage("loading");
      }, 10);
        setCheckState("o");
        // window.location.replace(window.location.href);
      }else{
        MySwal.fire(
          {
            title: (<h3>{loginResult.err}</h3>),

          })
      }
  };
  

  return (
    <div>
      {
        page === "loading" &&
        (
          <LoadingComponent />
        )
      }

      {
        page == "Login" && <LoginForm loginSubmit={onSubmitLogin} />
      }

      {
        page === "approve1" && 
        (
          <Approve1Component 
          projectId={projectId || ""}
          />
        )
      }

      {
        page === "unAccess" &&
        (
          <div>Un Approve</div>
        )
      }
    </div>
  )
}
