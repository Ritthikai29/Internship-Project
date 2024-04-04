import { useEffect, useRef, useState } from "react"
import { CheckVerifyPermission, CheckVerifyProject, GetBudgetCalculate } from "../../services/BudgetService/VerifyService"
import LoadingComponent from "../../components/Loading";
import { LoginInterface } from "../../models/ILogin";
import { LoginService, LogoutService } from "../../services/LoginService";
import { BudgetInterface } from "../../models/Budget/Verify/IVerify";
import VerifyComponent from "../../components/Budget/Verify/VerifyComponent";
import LoginForm from "../loginemail/loginemail";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function Verifiy() {

  const MySwal = withReactContent(Swal);
  const [stating, setStating] = useState<string>("First")
  const [page, setPage] = useState<string>("Loading")

  const [projectKey, setProjectKey] = useState<string>("");
  const [projectId, setProjectId] = useState<string>();

  const [budget, setBudget] = useState<BudgetInterface>();

  const checkingProject = async () => {
    const queryParameters = new URLSearchParams(window.location.search)
    setProjectKey(queryParameters.get("pj") || "")
    let res = await CheckVerifyProject(queryParameters.get("pj") || "");
    if(res.status !== 200){
      // project is can't be access
      MySwal.fire({
        title: res.err +"โปรดรอแจ้งเตือนทาง email",
      }); 
      setStating("First");
      setPage("Login");
    }else{
      setProjectId(res.data.project.id)
      // next step to Permission
      setStating("D")
    }
  }

  const checkPermission = async () => {
    setPage("Loading")
    let res = await CheckVerifyPermission(projectId || "");
    console.log(res);
    if(res.status !== 200){
      // Next step to Login because you is not a user in this case
      setStating("E")
      MySwal.fire({
        title: "ไม่สามารถทำรายการได้ เนื่องจากท่านไม่ใช่ผู้ตรวจสอบ",
      });
    }else{
      // Next step to get a budget calculates
      setStating("F")
    }
  }

  const onSubmitLogin = async (loginResult: any): Promise<void> => {
    console.log(loginResult)
    if (loginResult.status === 200) {
      setTimeout(() => {
        setPage("Loading");
      }, 200);
        setStating("C");
        // window.location.replace(window.location.href);
      }else{
        MySwal.fire(
          {
            title: (<h3>{loginResult.err}</h3>),

          })
      }
  };
  

  const getBudgetCalculate = async () => {
    const queryParameters = new URLSearchParams(window.location.search)
    let res = await GetBudgetCalculate(queryParameters.get("pj") || "", false);
    if(res.status !== 200){
      // Next step to can't access
      setStating("E")
    }else{
      // set Data to state
      setBudget(res.data)
      // Next step to get project
      setStating("G")
    }
  }

  const getProject = async () => {
    setPage("verify")
  }

  useEffect(() => {
    console.log(stating)
    switch (stating) {
      case "First":
        setPage("Login");
        break;
      case "C":
        // to checking a project
        checkingProject();
        break;
      case "D":
        // to checking a permission
        checkPermission();
        break;
      case "E":
        // to login page
        setPage("Login")
        break;
      case "F":
        // get budget calculate
        getBudgetCalculate();
        break;
      case "G":
        // get project
        getProject()
        break;
      case "unAccess":
        MySwal.fire({
          title: "ไม่สามารถทำรายการได้ เนื่องจากท่านได้ทำรายการไปแล้ว",
        });
        break;
      default:
        break;
    }

    console.log(budget)

  }, [stating])

  return (
    <div>
      {
        page === "Loading" &&
        <LoadingComponent />
      }

      {
        page === "Login" && <LoginForm loginSubmit={onSubmitLogin} />
      }

      {
        page === "verify" &&
        (
          <VerifyComponent budgetCalculate={budget!} projectKey={projectKey}/>
        )
      }
    </div>
  )
}
