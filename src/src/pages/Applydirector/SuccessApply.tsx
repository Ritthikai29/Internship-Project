import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
export default function SuccessApply() {
  const location = useLocation();
  const { data } = location.state || {};
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
  }, []);
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-col justify-center w-1/2 h-auto rounded-2xl mt-6 pb-4 text-center drop-shadow-md border border-green-200 ">
        <div className="bg-green-500 p-6 rounded-2xl mb-20 shadow-lg text-white">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="w-20 h-20 mx-auto mb-4 text-white"
          />
          <p className="text-3xl font-semibold">สำเร็จ!</p>
        </div>
        <h3 className="text-3xl text-green-400 mb-16">
          {
            data.trim() === "committee applied as a committee"
              ? "คุณได้ลงทะเบียนเป็น 'กรรมการ' แล้ว"
              : data.trim() === "chairman apply as chairman"
              ? "คุณได้ลงทะเบียนเป็น 'ประธาน' แล้ว"
              : data.trim() === "chairman applied as a committee"
              ? "คุณได้ลงทะเบียนเป็น 'กรรมการ' แล้ว"
              : null
          }
        </h3>
      </div>
    </div>
  );
}
