import React, { useState, useEffect } from "react";
import {
  GetEmpInfoByEmpNo,
  ResetNewPassword,
  GetVendInfoByVendNo,
  ResetNewPasswordVendor,
} from "../../services/ForgotService";
import { EmployeeInterface } from "../../models/Project/IEmployee";
import { VendorInterface } from "../../models/Secretary/CompareInterface";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";

export default function ResetPassword() {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessageLength, setErrorMessageLength] = useState("");
  const [errorMessageCharacter, setErrorMessageCharacter] = useState("");
  const [errorMessageMatch, setErrorMessageMatch] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonHidden, setButtonHidden] = useState(false);
  const [empInfo, setEmpInfo] = useState<EmployeeInterface>();
  const [vendInfo, setVendInfo] = useState<VendorInterface>();

  const queryParameters = new URLSearchParams(window.location.search);
  const userHash = queryParameters.get("key") || "";
  const userType = queryParameters.get("user") || "";

  const CheckUser = async () => {
    if (userType == "scg") {
      const res = await GetEmpInfoByEmpNo(userHash);
      if (res.status !== 200) {
        alert(res.err);
      }
      setEmpInfo(res.data);
    } else {
      const res = await GetVendInfoByVendNo(userHash);
      if (res.status !== 200) {
        alert(res.err);
      }
      setVendInfo(res.data);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePassword(password, newConfirmPassword);
  };

  const handleConfirmChangePassword = async (
    user_no: string,
    password: string
  ) => {
    setLoading(true);
    try {
      if (userType == "scg") {
        const res = await ResetNewPassword(user_no, password);
        if (res.status !== 200) {
          throw new Error(res.err || "An unexpected error occurred.");
        }
      } else {
        const res = await ResetNewPasswordVendor(user_no, password);
        if (res.status !== 200) {
          throw new Error(res.err || "An unexpected error occurred.");
        }
      }

      await MySwal.fire({
        icon: "success",
        title: "Password Change!",
        confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">OK</p>,
        confirmButtonColor: "#2B3467",
      });

      navigate("/login");
    } catch (error: any) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (
    newPassword: string,
    newConfirmPassword: string
  ) => {
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    let errorMessageLength = "";
    let errorMessageCharacter = "";
    let errorMessageMatch = "";

    if (newPassword.length < minLength) {
      errorMessageLength = "error";
      setButtonHidden(false);
    } else {
      errorMessageLength = "success";
    }

    if (
      !uppercaseRegex.test(newPassword) ||
      !lowercaseRegex.test(newPassword) ||
      !numberRegex.test(newPassword) ||
      !symbolRegex.test(newPassword)
    ) {
      errorMessageCharacter = "error";
      setButtonHidden(false);
    } else {
      errorMessageCharacter = "success";
    }

    if (
      newPassword !== newConfirmPassword ||
      (newPassword == "" && newConfirmPassword == "")
    ) {
      errorMessageMatch = "error";
      setButtonHidden(false);
    } else {
      errorMessageMatch = "success";
    }

    // Reset error messages if there are no errors
    if (!errorMessageLength && !errorMessageCharacter && !errorMessageMatch) {
      errorMessageLength = "";
      errorMessageCharacter = "";
      errorMessageMatch = "";
    }

    if (
      errorMessageLength == "success" &&
      errorMessageCharacter == "success" &&
      errorMessageMatch == "success"
    ) {
      setButtonHidden(true);
    }

    setErrorMessageLength(errorMessageLength);
    setErrorMessageCharacter(errorMessageCharacter);
    setErrorMessageMatch(errorMessageMatch);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCopy = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  

  useEffect(() => {
    CheckUser();
    const fetchData = async () => {
      try {
        await CheckUser();
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-auto p-6 bg-white rounded-lg shadow-lg ">
        <div className="pb-3 mt-10">
          <FaLock className="mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-bold mb-4 text-center">
            เปลี่ยนรหัสผ่าน
          </h1>

          <p className="text-xl mb-2 text-center">
            กรุณาป้อนรหัสผ่านใหม่ของคุณ{" "}
            {userType === "scg"
              ? empInfo?.firstname_e
              : userType === "vendor"
              ? vendInfo?.vendor_key
              : ""}
          </p>
        </div>

        <div className="relative mb-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            name="new_password"
            type={showPassword ? "text" : "password"}
            placeholder="รหัสผ่านใหม่"
            value={password}
            onChange={handlePasswordChange}
            onPaste={handlePaste}
            onCopy={handleCopy}
          />
          <button
            className="absolute top-0 right-0 h-full px-2 flex items-center" // เพิ่ม class flex และ items-center เพื่อจัดวางไอคอนตรงกลาง
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash size={30}/> : <FaEye size={30}/>}
          </button>
        </div>
        <div className="relative mb-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            name="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onPaste={handlePaste}
            onCopy={handleCopy}
          />
          <button
            className="absolute top-0 right-0 h-full px-2 flex items-center" // เพิ่ม class flex และ items-center เพื่อจัดวางไอคอนตรงกลาง
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <FaEyeSlash size={30}/> : <FaEye size={30}/>}
          </button>
        </div>
        <button
          className={`w-full px-4 py-2 rounded-md text-white text-xl ${
            !buttonHidden
              ? "bg-gray-400 hover:bg-gray-500"
              : "bg-red-600 hover:bg-red-700"
          }`}
          disabled={!buttonHidden || loading}
          onClick={() =>
            handleConfirmChangePassword(
              (userType === "scg"
                ? userHash
                : userType === "vendor"
                ? userHash
                : "") ?? "",
              confirmPassword
            )
          }
        >
          {loading ? "กำลังดำเนินการ..." : "เปลี่ยนรหัสผ่าน"}
        </button>

        <div className="mt-2">
          <p
            className={`text-sm flex items-center ${
              errorMessageLength === "error"
                ? "text-red-600"
                : errorMessageLength === "success"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {errorMessageLength === "error" && (
              <FaExclamationCircle className="h-4 w-4 mr-1 text-red-600" />
            )}
            {errorMessageLength === "success" && (
              <FaCheckCircle className="h-4 w-4 mr-1 text-green-600" />
            )}
            รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร
          </p>
          <p
            className={`text-sm flex items-center my-1 ${
              errorMessageCharacter === "error"
                ? "text-red-600"
                : errorMessageCharacter === "success"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {errorMessageCharacter === "error" && (
              <FaExclamationCircle className="h-4 w-4 mr-1 text-red-600" />
            )}
            {errorMessageCharacter === "success" && (
              <FaCheckCircle className="h-4 w-4 mr-1 text-green-600" />
            )}
            รหัสผ่านต้องประกอบด้วยตัวอักษรภาษาอังกฤษพิมพ์ใหญ่ ตัวอักษรพิมพ์เล็ก
            ตัวเลข และสัญลักษณ์
          </p>
          <p
            className={`text-sm flex items-center ${
              errorMessageMatch === "error"
                ? "text-red-600"
                : errorMessageMatch === "success"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {errorMessageMatch === "error" && (
              <FaExclamationCircle className="h-4 w-4 mr-1 text-red-600" />
            )}
            {errorMessageMatch === "success" && (
              <FaCheckCircle className="h-4 w-4 mr-1 text-green-600" />
            )}
            รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ตรงกัน
          </p>
        </div>
      </div>
    </div>
  );
}
