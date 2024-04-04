import { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import LoadingComponent from '../../components/Loading';
import LoginForm from '../loginemail/loginemail';
import { CheckVerifyProject, CheckVerifyPermission, GetBudgetCalculate } from '../../services/BudgetService/VerifyService';
import { BudgetInterface } from '../../models/Budget/Verify/IVerify';
import Verify2Component from '../../components/Budget/Verify2/Verify2Component';

export default  function Verify2() {

    const MySwal = withReactContent(Swal);
    const [stating, setStating] = useState<string>("First")
    const [page, setPage] = useState<string>("Loading")

    const [projectKey, setProjectKey] = useState<string>("");
    const [projectId, setProjectId] = useState<string>("");
    const [budget, setBudget] = useState<BudgetInterface>();


    const onSubmitLogin = async (loginResult: any): Promise<void> => {
        console.log(loginResult)
        if (loginResult.status === 200) {
            setTimeout(() => {
                setPage("Loading");
            }, 200);
            setStating("C");
            // window.location.replace(window.location.href);
        }else{
            MySwal.fire({ title: (<h3>{loginResult.err}</h3>), })
        }
    };

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
            // next step to Permission
            setProjectId(res.data.project.id)
            setStating("D")
        }
    }

    const checkPermission = async () => {
        setPage("Loading")
        let res = await CheckVerifyPermission(projectId|| "");
        if(res.status !== 200){          
          // Next step to Login because you is not a user in this case
          MySwal.fire({
            title: res.err,
          });
          setStating("E")
        }else{
          // Next step to get a budget calculates
          setStating("F")
        }
    }

    const getBudgetCalculate = async () => {
        const queryParameters = new URLSearchParams(window.location.search)
        let res = await GetBudgetCalculate(queryParameters.get("pj") || "",true);
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
            //getProject()
            setPage("verify")    
            break;
          case "unAccess":
            MySwal.fire({
              title: "ไม่สามารถทำรายการได้ เนื่องจากท่านได้ทำรายการไปแล้ว",
            });
            break;
          default:
            break;
        }
    }, [stating])
  return (
    <div>

        {
            page === "Loading" && <LoadingComponent />
        }

        {
            page === "Login" && <LoginForm loginSubmit={onSubmitLogin} />
        }

        {
        page === "verify" &&
        (
          <Verify2Component budgetCalculate={budget!} projectKey={projectKey}/>
        )
       }
        
    </div>
  )
}

