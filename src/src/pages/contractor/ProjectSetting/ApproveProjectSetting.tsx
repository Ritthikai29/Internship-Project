import React, {  useEffect, useState } from 'react'
import { ApproveProjectSettingService } from '../../../services/ContractorService/ProjectSettingService';
import { Navigate } from 'react-router-dom';
import { LogoutService } from '../../../services/LoginService';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import LoginForm from '../../loginemail/loginemail';
import LoadingComponent from '../../../components/Loading';

export default function ApproveProjectSetting() {

    const MySwal = withReactContent(Swal);

  // state changing page (when state is changed will re run useEffect)
    const [stating, setStating] = useState<string>("start");
    const [page, setPage] = useState<string>("waiting");
  

    const urlParams = new URLSearchParams(window.location.search);
    const [projectId] = useState<string>(urlParams.get("project_id") || "");
  
    let count = 0;
    const approveProjectSetting = async () => {
        const res = await ApproveProjectSettingService(projectId);
        console.log(res);
        if(res.status === 401){
          count++;
          LogoutService();
          if(count === 1){
            MySwal.fire(
                {
                  title: "ไม่สามารถอนุมัติได้ เนื่องจากคุณไม่มีสิทธิ์ในการอนุมัติ"
                }
              )
          }
            setPage("login")
            setStating("login")
            return;
        }
        if(res.status !== 200){
            setPage("erorr")
            return;
        }
        setPage("successful")
        setStating("successful")
    }


    const loginSubmit = async (loginResult: any): Promise<void> => {
      console.log(loginResult)
      Swal.fire({
        title: `<span style="color: green;">ยืนยันจะทำรายการ</span>`,
        text: "เมื่อกดปุ่มนี้ ท่านไม่สามารถกลับมาแก้ไขได้อีก",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EB455F',
        cancelButtonColor: '#979797',
        confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
        cancelButtonText: '<span style="font-size: 25px;">ปิด</span>',
  
    }).then(async (result) => {
        if (result.isConfirmed) {
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
        }
    })
    };

    useEffect(() => {
        switch (stating) {
          case "start":
            setPage("login");
            break;
          case "verify":
            approveProjectSetting();
            break;
          case "login":
            LogoutService();
            setPage("login");
            break;

          case "successful":
            setPage("successful");
            break;
          default:
            break;
        }
    
      }, [stating]);

  return (
    <div>
      
        {
          page == "waiting" &&
          (<LoadingComponent />)
        }
        {
            page === "login" &&  <LoginForm loginSubmit={loginSubmit} />
        }
        {
            page === "successful" && <Navigate to={"/contractor/project-setting/success"} />
        }
        {
            page === "error" && <Navigate to={"/contractor/project-setting/error"} />
        }
    </div>
  )
}