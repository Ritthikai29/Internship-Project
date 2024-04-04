import { useEffect, useState } from "react";
import { CheckAndApply } from "../../services/ApplyServives";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import LoadingComponent from "../../components/Loading";
import LoginForm from "../loginemail/loginemail";
import { LogoutService } from "../../services/LoginService";

export default function Apply() {
  const mySwal = withReactContent(Swal);

  // state changing page (when state is changed will re-run useEffect)
  const [stating, setStating] = useState<string>("start")

  // paging
  const [page, setPage] = useState<string>("waiting");

  const queryParameters = new URLSearchParams(window.location.search);
  const [openId] = useState<string>(queryParameters.get("id") || "");

  // If the "id" parameter is not present in the URL, it initializes openId with an empty string ""
  const navigate = useNavigate();
  let count = 0;

  const checkuserAndApplydirect = async () => {
    const res = await CheckAndApply(openId);
    console.log(res);
    if (res.status === 401) {
      count++;
      LogoutService();
      if (count === 1) {
        mySwal.fire({
          title: <h3>ไม่สามารถดำเดินการได้ เนื่องจากคุณไม่ใช่คณะกรรมการ</h3>,
        });
      }
      setPage("login");
      setStating("login");
      return;
    } else if (res.status === 200) {
      navigate("/Applydirector/Apply/success", { state: { data: res.data } });
    } else {
      navigate("/Applydirector/Apply/error", { state: { data: res.err } });
    }
  };

  useEffect(() => {
    console.log(stating);
    switch (stating) {
      case "start":
        setPage("login");
        break;
      case "login":
        setPage("login");
        break;
      case "apply":
        checkuserAndApplydirect();
        break;
      default:
        break;
    }
  }, [stating]);

  const loginSubmit = async (loginResult: any): Promise<void> => {
    console.log(loginResult);
    if (loginResult.status === 200) {
      setTimeout(() => {
        setPage("waiting");
      }, 200);
      setStating("apply");
      // window.location.replace(window.location.href);
    } else {
      mySwal.fire({
        title: <h3>{loginResult.err}</h3>,
      });
    }
  };

  // Must have return
  return (
    <div>
      {page === "waiting" && <LoadingComponent />}
      {page === "login" && <LoginForm loginSubmit={loginSubmit} />}
    </div>
  );
}
