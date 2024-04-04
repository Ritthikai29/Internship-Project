import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import LoadingComponent from '../../../components/Loading';
import { ApproveUnlistVendorService } from '../../../services/ContractorService/ApproveUnListService';
import { VerifyUserVerifyUnlistVendor } from '../../../services/ContractorService/VerifyUnListService';
import LoginForm from '../../loginemail/loginemail';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

export default function ApproveUnlistVendor() {
    const urlParams = new URLSearchParams(window.location.search);
    const MySwal = withReactContent(Swal);
    const [approveId] = useState<string>(urlParams.get("approve_id") || "");
    const [stating, setStating] = useState<string>("start");
    const [page, setPage] = useState<string>("loading");
    const [check, setCheck] = useState(0);
    const [error, setError] = useState<string>();
    
    const approveUnlistVendor = async () => {

        const verifyRes = await VerifyUserVerifyUnlistVendor();
        const res = await ApproveUnlistVendorService(approveId)
        if(res.status === 401){
            setPage("login")
            MySwal.fire(
                {
                  title: "ไม่สามารถอนุมัติได้ เนื่องจากคุณไม่มีสิทธิ์ในการอนุมัติ"
                }
              )
            return;
        }
        if (verifyRes.data.role !== "user_staff") {
            setPage("login");
            return;
        }
        if (res.status !== 200) {
            setPage("error");
            setError(res.err)
            return;
        }
        setPage("Successful")

    }

    useEffect(() => {
        // if (check === 0) {
        //     approveUnlistVendor();
        // }
        // setCheck((prev) => prev + 1)
        switch (stating) {
            case "start":
              setPage("login");
              break;
            case "login":
              setPage("login");
              break;
            case "verify":
                approveUnlistVendor();
                break;
            case "successful":
              setPage("successful");
              break;
            default:
              break;
          }
    }, [stating])

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

    return (
        <div>
            {
                page === "login" &&  <LoginForm loginSubmit={loginSubmit} />
            }
            {
                page === "Successful" && <Navigate to={"/contractor/approve-unlist-vendor/successful"} />
            }

            {
                page === "error" && <Navigate to={`/contractor/approve-unlist-vendor/error?result=${error}`} />
            }

            {
                page === "loading" && <LoadingComponent />
            }
        </div>
    )
}


function Login(){

    return(
        <div>
            กรุณา Login ด้วย Account ของผู้ได้รับสมัคร
        </div>
    )
}
