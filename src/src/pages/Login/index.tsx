import React, { useRef, useState, useEffect } from "react";
import { LoginInterface } from "../../models/ILogin";
import { LoginService, LoginServiceVend } from "../../services/LoginService";
import Background from "../../assets/Login/DSC_00161.png";
import VendorLogo from "../../assets/Login/vendor.png";
import StaffLogo from "../../assets/Login/staff.png";
import Swal from "sweetalert2";
import validator from "validator";
import { useNavigate } from "react-router-dom";

type LoginType = "vender" | "scg" | "";

interface ResponseType {
  data?: string;
  status: number;
}

export default function TestLogin() {
  const employeeNO = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const vendor_key = useRef<HTMLInputElement>(null);

  const [activeButton, setActiveButton] = useState<LoginType>("");
  const [showFormVender, setShowFormVender] = useState(false);
  const [showFormSCG, setShowFormSCG] = useState(false);

  const navigate = useNavigate();

  const handleButtonClick = (type: LoginType) => {
    setShowFormVender(type === "vender");
    setShowFormSCG(type === "scg");
    setActiveButton(type);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const performLogin = async (
    loginForm: LoginInterface,
    service: (form: LoginInterface) => Promise<ResponseType>
  ) => {
    const res = await service(loginForm);
    if (res.data) {
      console.log(res.data);
      window.localStorage.setItem("name", JSON.stringify(res.data));
      window.location.reload();
    } else if (res.status !== 200) {
      Swal.fire({
        icon: "error",
        title: "กรุณาเช็ค ID หรือ รหัสผ่านอีกครั้ง",
        footer: '<a href="">ลืมรหัสผ่าน?</a>',
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: "#EB455F",
      });
    }
  };

  const handleClick = async () => {
    if (activeButton === "vender" || activeButton === "scg") {
      const loginForm: LoginInterface =
        activeButton === "vender"
          ? {
              vend_key: validator.trim(vendor_key.current?.value ?? ""),
              password: validator.trim(password.current?.value ?? ""),
            }
          : {
              empNO: validator.trim(employeeNO.current?.value ?? ""),
              password: validator.trim(password.current?.value ?? ""),
            };

      const service =
        activeButton === "vender" ? LoginServiceVend : LoginService;
      performLogin(loginForm, service);
    }
  };

  useEffect(() => {
    // if(localStorage.getItem('name') !== null){
    //   window.location.href = "/STSBidding/frontend"
    // }
  }, []);

  return (
    <div className="flex flex-row">
      <div className="">
        <div
          style={{
            width: "100vw",
            height: "120vh",
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className="flex flex-row-reverse"
        >
          <div className=" basis-5/12">
            <div className="bg-white h-full shadow-md rounded p-10 bg-opacity-70">
              <div className="mb-4">
                <p className="text-5xl text-center font-bold pt-5">
                  เลือกประเภทผู้ใช้
                </p>
              </div>
              <div className="flex flex-row pt-5">
                <div className="flex flex-auto mb-4">
                  <button
                    className={`px-15 py-4 ${
                      activeButton === "vender"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-[#1D5182] "
                    } basis-2/4 rounded-2xl drop-shadow-2xl text-lg font-bold`}
                    onClick={() => handleButtonClick("vender")}
                  >
                    <img
                      src={VendorLogo}
                      className="inline-flex h-14 w-14 mr-2"
                      alt="Vendor Logo"
                    />
                    Vendor Login
                  </button>

                  <button
                    className={`ml-10 px-15 py-4 ${
                      activeButton === "scg"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-[#1D5182] "
                    } basis-2/4 rounded-2xl drop-shadow-2xl text-xl font-bold`}
                    onClick={() => handleButtonClick("scg")}
                  >
                    SCG Login
                    <img
                      src={StaffLogo}
                      className="inline-flex h-14 w-14 ml-2.5"
                      alt="Staff Logo"
                    />
                  </button>
                </div>
              </div>
              {(showFormVender || showFormSCG) && (
                <form onSubmit={handleFormSubmit}>
                  <label>
                    <p className="text-[#2B3467] font-bold text-4xl mb-4">
                      {showFormVender ? "Vendor" : "SCG Staff"}
                    </p>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                      leading-tight focus:outline-none focus:shadow-outline mb-4 text-2xl"
                      id={showFormVender ? "vender-key" : "username"}
                      type="text"
                      name={showFormVender ? "vender-key" : "Username"}
                      ref={showFormVender ? vendor_key : employeeNO}
                      placeholder={
                        showFormVender ? "Vender ID" : "รหัสพนักงาน 5 หลัก"
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleClick();
                        }
                      }}
                    />
                  </label>

                  <label>
                    <input
                      ref={password}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 
                       leading-tight focus:outline-none focus:shadow-outline text-2xl"
                      id="password"
                      type="password"
                      placeholder="Password"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleClick();
                        }
                      }}
                    />
                  </label>

                  <div className="flex items-center justify-between">
                    {showFormVender && (
                      <button className="mt-3">
                        ยังไม่มีบัญชี?{" "}
                        <span className="font-bold text-base text-blue-500 hover:text-blue-800 cursor-pointer hover:cursor-pointer">
                          สร้างบัญชี
                        </span>
                      </button>
                    )}
                   {showFormSCG && (
                      <a
                      className="mt-3 font-bold text-base text-blue-500 hover:text-blue-800"
                      onClick={() => navigate("/forgotpassword?user=scg")}
                    >
                      ลืมรหัสผ่าน?
                    </a>
                    )}
                    {showFormVender && (
                      <a
                      className="mt-3 font-bold text-base text-blue-500 hover:text-blue-800"
                      onClick={() => navigate("/forgotpassword?user=vendor")}
                    >
                      ลืมรหัสผ่าน?
                    </a>
                    )}
                  </div>
                  <div className="flex justify-center items-center">
                    <button
                      onClick={handleClick}
                      className="bg-[#2B3467] hover:bg-blue-700 text-white font-bold 
                                    py-2 px-44 mt-5 rounded-xl focus:outline-none focus:shadow-outline"
                      type="button"
                    >
                      <p className="text-3xl">Login</p>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="ml-96"></div>
      </div>
    </div>
  );
}
