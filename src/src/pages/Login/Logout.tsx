import React, { useEffect } from "react";
import { LogoutService } from "../../services/LoginService";
import { useNavigate } from "react-router-dom";

export default function Logout() {

  useEffect(() => {
    const LogoutFunction = async () => {
      try {
        const res = await LogoutService();
        if (res.status === 200) {
          localStorage.clear()
          window.location.href = "/STSBidding/frontend"

        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    LogoutFunction();

    return () => {};
  }, []);

  return <div>{/* Blank Page */}</div>;
}
