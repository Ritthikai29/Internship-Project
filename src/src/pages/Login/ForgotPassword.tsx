import React, { useState } from "react";
import { SendEmailResetPassword , SendEmailVendorResetPassword } from "../../services/ForgotService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import {  FaLock, FaUnlock } from "react-icons/fa";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const queryParameters = new URLSearchParams(window.location.search);
  const userType = queryParameters.get("user") || "";

  const handleOnEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Check if the email is empty
    if (!email) {
      MySwal.fire({
        icon: "warning",
        title: "Email is required",
        text: "Please enter your email address.",
      });
      setLoading(false);
      return;
    }

    try {
      if (userType == "scg") {
        const res = await SendEmailResetPassword(email);
        if (res.status !== 200) {
          throw new Error(res.err || "An unexpected error occurred.");
        }
      } else {
        const res = await SendEmailVendorResetPassword(email);
        if (res.status !== 200) {
          throw new Error(res.err || "An unexpected error occurred.");
        }
      }

      await MySwal.fire({
        icon: "success",
        title: "ส่งสำเร็จ",
        text: `Link เปลี่ยนรหัสผ่านได้ถูกส่งไปยัง ${email}`,
        confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>,
        confirmButtonColor: "#2B3467",
      });

      navigate("/login");
    } catch (error: any) {
      MySwal.fire({
        icon: "error",
        title: "ส่งไม่สำเร็จ",
        text: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-auto p-6 bg-white rounded-lg shadow-lg ">
        <form onSubmit={handleFormSubmit}>
        <FaUnlock className="mx-auto mb-4" size={48} />
        <h1 className="text-3xl font-bold mb-4 text-center">Reset รหัสผ่าน</h1>
        <p className="text-xl mb-2 text-center">ลืมรหัสผ่าน? ไม่ต้องกังวล</p>
        
        
            
          <p className="text-lg text-center mb-2">ระบบจะทำการส่ง URL เพื่อเปลี่ยนรหัสผ่านให้คุณ</p>
          <p className="text-lg text-center mb-6">กรุณาใส่อีเมลที่คุณใช้ทำการลงทะเบียน E-bidding</p>
          <div className="mb-6">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              name="email"
              type="email"
              placeholder="กรอก email"
              value={email}
              onChange={handleOnEmailChange}
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 rounded-md text-white text-xl ${!email ? "bg-gray-400" : "bg-red-600"} ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!email || loading}
          >
            {loading ? "กำลังส่ง..." : "ส่ง"}
          </button>
        </form>
      </div>
    </div>
  );
}
