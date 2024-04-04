import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ErrorApply() {
  const location = useLocation();
  const { data } = location.state || {};
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
  }, []);
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-col justify-center w-1/2 h-auto rounded-2xl mt-6 py-32 text-center drop-shadow-md border border-green-200 ">
        <h3 className="text-3xl text-red-400 mb-16">
          ลงทะเบียนไม่สำเร็จ
          <h4 className="text-2xl text-pink-500 mt-2">
            {" "}
            {data.trim() === "already applied"
              ? "คุณได้ลงทะเบียนไปแล้ว"
              : data.trim() === "As chairman committee full"
              ? "ขออภัย การลงทะเบียนเต็มแล้ว"
              : data.trim() === "committee is full"
              ? "ขออภัย กรรมการลงทะเบียนเต็มแล้ว"
              : data.trim() === "Openbidding is full"
              ? "ขออภัย การลงทะเบียนเต็มแล้ว"
              : null
            }
            {" "}
          </h4>
        </h3>
        <p className="text-2xl mt-10">
        หากท่านต้องการทำรายการอื่น โปรดคลิ๊กเพื่อเข้าสู่ระบบ
          <a href={"/STSBidding/frontend"} className="text-blue-600 hover:text-blue-800">
            คลิก
          </a>
        </p>
      </div>
    </div>
  );
}
