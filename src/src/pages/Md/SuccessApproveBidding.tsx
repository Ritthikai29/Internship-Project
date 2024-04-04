import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SuccessProjectSetting() {
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
  }, []);
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-col justify-center w-1/2 h-1/2 rounded-2xl mt-6 pt-4 text-center drop-shadow-md border border-green-200 ">
      <div className="">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="w-20 h-20 mx-auto mb-4 text-green-500"
          />
          <p className="text-lg font-semibold mb-5">สำเร็จ!</p>
        </div>
        <h3 className="text-3xl text-green-400 mb-16">
          การอนุมัติโครงการสำเร็จ
        </h3>
        <p className="text-2xl mt-2">
        หากท่านต้องการทำรายการอื่น โปรดคลิ๊กเพื่อเข้าสู่ระบบ
          <a href={"/STSBidding/frontend"} className="text-blue-600 hover:text-blue-800">
            คลิก
          </a>
        </p>
      </div>
    </div>
  );
}
