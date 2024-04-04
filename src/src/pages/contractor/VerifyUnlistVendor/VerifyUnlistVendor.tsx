import { useEffect, useState } from 'react'
import LoadingComponent from '../../../components/Loading'
import { VerifyUnlistVendorService, VerifyUserVerifyUnlistVendor } from '../../../services/ContractorService/VerifyUnListService';
import { Link, Navigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import LoginForm from '../../loginemail/loginemail';
import { LogoutService } from '../../../services/LoginService';

export default function VerifyUnlistVendor() {

    const MySwal = withReactContent(Swal);
    const [checkState, setCheckState] = useState<string>("login")
    const [page, setPage] = useState<string>("loading");
    
    const urlParams = new URLSearchParams(window.location.search);
    const [approveId] = useState<string>(urlParams.get("approve_id") || "");
  
    const [check, setCheck] = useState(0);
    const [error, setError] = useState<string>();

    const verifyUnlistVendor = async () => {
        console.log(check)
        console.log(approveId)
        const verifyRes = await VerifyUserVerifyUnlistVendor();
        console.log(verifyRes)
        const res = await VerifyUnlistVendorService(approveId);
        console.log(res)
        if (res.status === 401) {
            LogoutService();
            setPage("login");
            setCheckState("login");
            MySwal.fire(
              {
                title: "ไม่สามารถอนุมัติได้ เนื่องจากคุณไม่มีสิทธิ์ในการอนุมัติ"
              }
            )
            return;
        }
        if (verifyRes.data.role !== "user_staff") {
            LogoutService();
            setPage("login");
            setCheckState("login");
            return;
        }
        if (res.status !== 200) {
            setPage("error");
            setCheckState("login")
            setError(res.err)
            return;
        }
        setCheckState("Successful")
        setPage("Successful")
    }

    const onSubmitLogin = async (loginResult: any): Promise<void> => {
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
                setPage("loading");
              }, 10);
              setPage("loading");
              setCheckState("verify");
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
        console.log(checkState);
        switch (checkState) {
          case "login":
            setPage("login");
            break;
          case "verify":
            if (check === 0) {
                verifyUnlistVendor();
            }
            setCheck((prev) => prev + 1)
            break;
          default:
            break;
        }
      }, [checkState]);

    return (
        <div>
            {
            page === "loading" &&
            (
            <LoadingComponent />
            )
            }

            {
                page == "login" && <LoginForm loginSubmit={onSubmitLogin} />
            }
            {
                page === "Successful" && <Navigate to={"/contractor/verify-unlist-vendor/successful"} />
            }

            {
                page === "error" && <Navigate to={`/contractor/verify-unlist-vendor/error?result=${error}`} />
            }

            {
                page === "loading" && <LoadingComponent />
            }
        </div>
    )
}