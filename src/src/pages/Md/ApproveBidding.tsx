import React, { useEffect, useState } from 'react'
import { ApproveResultBidding } from '../../services/MdService/Mdservice'
import { Navigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { LogoutService } from '../../services/LoginService';
import LoadingComponent from '../../components/Loading';
import LoginForm from '../loginemail/loginemail';

export default function ApproveBidding() {

    const MySwal = withReactContent(Swal);

  // state changing page (when state is changed will re run useEffect)
    const [stating, setStating] = useState<string>("login");
    const [page, setPage] = useState<string>("waiting");


    const urlParams = new URLSearchParams(window.location.search);
    const [projectKey] = useState<string>(urlParams.get("key") || "");

    let count = 0;
    const approveResultBidding = async () => {
        const res = await ApproveResultBidding(projectKey);
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
        setStating('successful')
        setPage("successful")
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
              setStating("verify");
              // window.location.replace(window.location.href);
            }else{
              MySwal.fire(
                {
                  title: (<h3>{loginResult.err}</h3>),
      
                })
            }
          console.log(555555);
        }
    })
      
    };
    useEffect(() => {
        switch (stating) {
          case "verify":
            approveResultBidding();
            break;
          case "login":
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
            page === "successful" && <Navigate to={"/md/approve-bidding/success"} />
        }
        {
            page === "error" && <Navigate to={"/md/approve-bidding/error"} />
        }
    </div>
  )
}