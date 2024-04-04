import { faBath, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ErrorProjectSetting() {
  const urlParams = new URLSearchParams(window.location.search);
  const [error] = useState<string>(urlParams.get("result") || "");

  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
  }, []);

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-col justify-center w-1/2 h-1/2 rounded-2xl mt-6 pt-4 text-center drop-shadow-md border border-red-200 ">
      <div className="">
          <FontAwesomeIcon
            icon={faTimes}
            className="rounded-full border-2 bg-red-500 border-gray-250 p-2 w-20 h-20 mx-auto mb-4 text-white"
          />
        <h3 className="text-3xl text-red-400 mb-10">
          การอนุมัติโครงการไม่สำเร็จเนื่องจาก
          <h4 className="text-2xl text-pink-500">" {error} "</h4>
        </h3>
        </div>
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
