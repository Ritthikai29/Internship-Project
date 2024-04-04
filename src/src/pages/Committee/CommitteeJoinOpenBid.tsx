import { useEffect, useState } from "react";
import { CheckCommitteePermission } from "../../services/SecretaryService/HttpClientService";
import { LogoutService } from "../../services/LoginService";
import LoadingComponent from "../../components/Loading";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import LoginForm from "../loginemail/loginemail";

export default function JoinOpenBid() {
  const MySwal = withReactContent(Swal);
  const queryParameters = new URLSearchParams(window.location.search);
  const openId = queryParameters.get("open_id") || "";

  const [status, setStatus] = useState("start");
  const [page, setPage] = useState("waiting");
  const [role, setRole] = useState<string>();

  const checkUserPermission = async () => {
    try {
      let res = await CheckCommitteePermission(openId);
      if (res.status === 200) {
        setRole(res.data);
        setPage("committee");
        setStatus("committee");
      } else if (res.status === 401) {
        handleUnauthorized();
      } else {
        handleOtherErrors();
      }
    } catch (error) {
      handleOtherErrors();
    }
  };

  const handleUnauthorized = () => {
    MySwal.fire({
      title: "ท่านไม่ใช่กรรมการในระบบ",
    });
    LogoutService();
    setPage("login");
    setStatus("login");
  };

  const handleOtherErrors = () => {
    MySwal.fire({
      title: "เกิดข้อผิดพลาด",
    });
    LogoutService();
    setPage("login");
    setStatus("login");
  };

  useEffect(() => {
    switch (status) {
      case "start":
        setPage("login");
        break;
      case "permission":
        checkUserPermission();
        break;
      case "login":
        setPage("login");
        break;
      case "committee":
        if (role === "secretary") {
          window.location.href = `/STSBidding/frontend/secretary/specifiedevenelope/wto/submitotp?open_id=${openId}`;
        } else {
          window.location.href = `/STSBidding/frontend/committee/projectwaittoopen/passcode?open_id=${openId}`;
        }
        break;
      default:
        break;
    }
  }, [status, openId, role]);
  

  const loginSubmit = async (loginResult: any): Promise<void> => {
    if (loginResult.status === 200) {
      setTimeout(() => {
        setPage("waiting");
      }, 10);
      setStatus("permission");
    } else {
      MySwal.fire({
        title: <h3>{loginResult.err}</h3>,
      });
    }
  };

  return (
    <div>
      {page === "waiting" && <LoadingComponent />}
      {page === "login" && <LoginForm loginSubmit={loginSubmit} />}
    </div>
  );
}
