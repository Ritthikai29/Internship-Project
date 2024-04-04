// LoginForm.tsx
import React, { useRef, FormEvent } from "react";
import { LoginInterface } from "../../models/ILogin";
import { LoginService } from "../../services/LoginService";
import Background from "../../assets/kim6.jpg";
import validator from "validator";
import { useNavigate } from "react-router-dom";
interface LoginFormProps {
  loginSubmit: (loginResult: any) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ loginSubmit }) => {
  const employeeRef = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (employeeRef.current && password.current) {
      const loginForm: LoginInterface = {
        empNO: validator.trim(employeeRef.current.value),
        password: validator.trim(password.current.value),
      };
      setTimeout(() => {}, 200);

      const res = await LoginService(loginForm);
      console.log(res);
      window.localStorage.setItem("name", JSON.stringify(res.data));

      // Call the parent component's loginSubmit function with the login result
      await loginSubmit(res);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-lg w-full space-y-6 bg-red-500 bg-transparent border p-7 bord-3xl backdrop-blur rounded-3xl">
        <div className=" flex justify-center text-[#bb4ba3]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.0}
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
        </div>
        <div className="flex justify-center text-4xl">
          <h1 className="bg-gradient-to-r from-[#b35dc2] via-[#e73db6] to-[#9d1978] inline-block text-transparent bg-clip-text">
            ลงชื่อเข้าใช้
          </h1>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
          <input type="hidden" name="remember" value="true" />
          <div className="grid justify-items-center rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                username
              </label>
              <input
                ref={employeeRef}
                id="employeeNo"
                name="employeeNo"
                type="text"
                required
                className="appearance-none rounded relative block w-64 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="รหัสพนักงาน 5 หลัก"
              />
            </div>
            <div className="py-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                ref={password}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded relative block w-64 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="รหัสผ่าน"
              />
            </div>
            <div className="grid justify-items-center pl-48 pr-6">
              <a
                className="font-bold text-base text-white hover:text-blue-800"
                onClick={() => navigate("/forgotpassword?user=scg")}
              >
                ลืมรหัสผ่าน?
              </a>
            </div>
          </div>

          <div className="grid justify-items-center">
            <button
              type="submit"
              className="group relative w-64 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#b668ad] from-10% via-30% to-[#8e33b2] to-100% hover:from-[#578fd8] hover:to-[#ac98d6] hover:scale-105 transition-all duration-300 ... hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
