import React, { useEffect, useState } from "react";
import {
  GetUserforadmin,
  deleteUserforadmin,
} from "../../services/Admin_sts/Admin_sts";
import { EmployeeInterface } from "../../models/Project/IEmployee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import Swal from "sweetalert2";
import PageLoad from "../PreLoadAndEtc/PageLoader";
import ReactPaginate from "react-paginate";
import { BsSearch } from "react-icons/bs";

export default function Presentuser() {
  const [user, setUser] = useState<EmployeeInterface[]>([]);
  const [roleuser, setRoleUser] = useState<EmployeeInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProject, setTotalProject] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [originalforsearchConsults, setOriginalforsearchConsults] = useState<
  EmployeeInterface[]
  >([]);
  const [originalConsults, setOriginalConsults] = useState<EmployeeInterface[]>(
    []
  );
  let count = [0, 0, 0, 0, 0];

  const getUser = async (pageNumber: any) => {
    const res = await GetUserforadmin();
    setLoading(false);
    setUser(res.data);
    console.log(res);
    const consult = res.data
      .filter((item: any) => item.role_name_th === "ผู้ใช้ทั่วไป")
      .map((item: any, index: number) => {
        return item;
      });

    console.log("Final allroleuser:", consult);

    const itemsPerPage = 5;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentConsults = consult.slice(startIndex, endIndex);
    let totalPage = Math.ceil(consult.length / 5);
    console.log(currentConsults);
    setTotalPages(totalPage);
    setRoleUser(currentConsults);
    setOriginalConsults(res.data);
    setOriginalforsearchConsults(currentConsults);
    setTotalProject(consult.length);
  };

  const InputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    console.log(searchTerm);
    setSearchTerm(searchTerm);
    if (searchTerm === "") {
      setRoleUser(originalforsearchConsults);
    } else {
      const filteredConsults = originalConsults.filter((item) => {
        console.log(item);
        return item.employeeNO.toLowerCase().includes(searchTerm) || item.firstname_t.toLowerCase().includes(searchTerm) || item.lastname_t.toLowerCase().includes(searchTerm);
      });

      setRoleUser(filteredConsults);
    }
  };

  const deleteUser = async (employee_id: any) => {
    Swal.fire({
      title: `<span style="color: red;">ยืนยันที่จะลบผู้ใช้ ${employee_id.employeeNO}</span>`,
      text: "เมื่อกดปุ่มนี้ ท่านไม่สามารถกลับมาแก้ไขได้อีก",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EB455F",
      cancelButtonColor: "#979797",
      confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
      cancelButtonText: '<span style="font-size: 25px;">ปิด</span>',
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          const res = await deleteUserforadmin(employee_id);
          Swal.fire({
            title: "ดำเนินการเสร็จสิ้น",
            text: "",
            icon: "success",
            confirmButtonText: "ยืนยัน",
          });
        }
      })
      .then(async () => {
        getUser(currentPage);
      });
  };

  const handlePaginationClick = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1);
    console.log(e.selected);
  };

  useEffect(() => {
    getUser(currentPage);
  }, [currentPage]);

  return (
    <div>
      {loading ? (
        <PageLoad />
      ) : (
        <div>
          <div className="w-11/12 mx-auto ">
            <div className="ml-2 text-2xl font-bold text-[#2B3467]  mx-auto">
              1.หน่วยงานจ้างเหมา
            </div>
            <table className="my-[1.5rem] w-full  rounded table-fixed">
              <thead className="text-white text-xl bg-[#000000] h-14">
                <tr className="rounded py-[6rem]">
                  <th className="w-[4rem] rounded-tl-lg">ลำดับ</th>
                  <th className="w-[5rem]">เลขสมาชิก</th>
                  <th className="w-[20rem]">ชื่อ - สกุล</th>
                  <th className="w-80">E-mail</th>
                  <th className="w-[11rem]">Role</th>
                  <th className="rounded-tr-lg">ลบ</th>
                </tr>
              </thead>
              {Array.isArray(user) &&
                user.map((user, index) => {
                  if (
                    user.is_active === "1" &&
                    user.role_name_th === "หน่วยงานจ้างเหมา"
                  ) {
                    count[0]++;
                    return (
                      <tbody
                        className="bg-white border-b-lg rounded-xl h-14 divide-x"
                        key={index}
                      >
                        <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center flex-auto">
                          <td className="border py-3 pl-2">{count[0]}</td>
                          <td className="border py-3 pl-2">
                            {user?.employeeNO}
                          </td>
                          <td className="border py-3 pl-5 text-left ">
                            {user?.nametitle_t} {user?.firstname_t}{" "}
                            {user?.lastname_t}
                          </td>
                          <td className="border py-3 pl-5 text-left ">
                            {user?.email}
                          </td>
                          <td className="border py-3 pl-2">
                            {user?.role_name_th}
                          </td>
                          <td className="border py-2 pl-2">
                            <button
                              className="bg-red-500 px-4 py-1 rounded-md shadow-md shadow-offset-y-2 transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg"
                              onClick={() => deleteUser(user)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-white"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  }
                })}
            </table>

            <div className="ml-2 text-2xl font-bold text-[#2B3467]">
              2.เลขานุการ
            </div>
            <table className="my-[1.5rem] w-full  rounded table-fixed">
              <thead className="text-white text-xl bg-[#000000] h-14">
                <tr className="rounded py-[6rem]">
                  <th className="w-[4rem] rounded-tl-lg">ลำดับ</th>
                  <th className="w-[5rem]">เลขสมาชิก</th>
                  <th className="w-[20rem]">ชื่อ - สกุล</th>
                  <th className="w-80">E-mail</th>
                  <th className="w-[11rem]">Role</th> 
                  <th className="rounded-tr-lg">ลบ</th>
                </tr>
              </thead>
              {Array.isArray(user) &&
                user.map((user, index) => {
                  if (user.is_active === "1" && user.role_name_th === "เลขา") {
                    count[1]++;
                    return (
                      <tbody
                        className="bg-white border-b-lg rounded-xl h-14 divide-x"
                        key={index}
                      >
                        <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center flex-auto">
                          <td className="border py-3 pl-2">{count[1]}</td>
                          <td className="border py-3 pl-2">
                            {user?.employeeNO}
                          </td>
                          <td className="border py-3  pl-5 text-left">
                            {user?.nametitle_t} {user?.firstname_t}{" "}
                            {user?.lastname_t}
                          </td>
                          <td className="border py-3  pl-5 text-left">
                            {user?.email}
                          </td>
                          <td className="border py-3 pl-2">
                            {user?.role_name_th}
                          </td>
                          <td className="border py-2 pl-2">
                            <button
                              className="bg-red-500 px-4 py-1 rounded-md shadow-md shadow-offset-y-2 transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg"
                              onClick={() => deleteUser(user)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-white"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  }
                })}
            </table>

            <div className="ml-2 text-2xl font-bold text-[#2B3467]">
              3.คณะกรรมการ
            </div>
            <table className="my-[1.5rem] w-full  rounded table-fixed">
              <thead className="text-white text-xl bg-[#000000] h-14">
                <tr className="rounded py-[6rem]">
                  <th className="w-[4rem] rounded-tl-lg">ลำดับ</th>
                  <th className="w-[5rem]">เลขสมาชิก</th>
                  <th className="w-[20rem]">ชื่อ - สกุล</th>
                  <th className="w-80">E-mail</th>
                  <th className="w-[11rem]">Role</th>
                  <th className="rounded-tr-lg">ลบ</th>
                </tr>
              </thead>
              {Array.isArray(user) &&
                user.map((user, index) => {
                  if (
                    user.is_active === "1" &&
                    (user.role_name_th === "ประธาน/กรรมการ" ||
                      user.role_name_th === "กรรมการ")
                  ) {
                    count[2]++;
                    return (
                      <tbody
                        className="bg-white border-b-lg rounded-xl h-14 divide-x"
                        key={index}
                      >
                        <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center flex-auto">
                          <td className="border py-3 pl-2">{count[2]}</td>
                          <td className="border py-3 pl-2">
                            {user?.employeeNO}
                          </td>
                          <td className="border py-3 pl-5 text-left">
                            {user?.nametitle_t} {user?.firstname_t}{" "}
                            {user?.lastname_t}
                          </td>
                          <td className="border py-3 pl-5 text-left">
                            {user?.email}
                          </td>
                          <td className="border py-3 pl-2">
                            {user?.role_name_th}
                          </td>
                          <td className="border py-2 pl-2">
                            <button
                              className="bg-red-500 px-4 py-1 rounded-md shadow-md shadow-offset-y-2 transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg"
                              onClick={() => deleteUser(user)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-white"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  }
                })}
            </table>

            <div className="ml-2 text-2xl font-bold text-[#2B3467]">
              4.ผู้อำนวยการโรงงาน
            </div>
            <table className="my-[1.5rem] w-full  rounded table-fixed">
              <thead className="text-white text-xl bg-[#000000] h-14">
                <tr className="rounded py-[6rem]">
                  <th className="w-[4rem] rounded-tl-lg">ลำดับ</th>
                  <th className="w-[5rem]">เลขสมาชิก</th>
                  <th className="w-[20rem]">ชื่อ - สกุล</th>
                  <th className="w-80">E-mail</th>
                  <th className="w-[11rem]">Role</th>
                  <th className="rounded-tr-lg">ลบ</th>
                </tr>
              </thead>
              {Array.isArray(user) &&
                user.map((user, index) => {
                  if (
                    user.is_active === "1" &&
                    (user.role_name_th === "MD" ||
                      user.role_name_th === "ผู้จัดการโรงงาน")
                  ) {
                    count[3]++;
                    return (
                      <tbody
                        className="bg-white border-b-lg rounded-xl h-14 divide-x w-[115vw]"
                        key={index}
                      >
                        <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center">
                          <td className="border " style={{ width: "1%" }}>{count[3]}</td>
                          <td className="border py-3 pl-2">
                            {user?.employeeNO}
                          </td>
                          <td className="border py-3 pl-5 text-left" style={{ width: "1%" }}>
                            {user?.nametitle_t} {user?.firstname_t}{" "}
                            {user?.lastname_t}
                          </td>
                          <td className="border py-3 pl-5 text-left">
                            {user?.email}
                          </td>
                          <td className="border py-3 pl-2">
                            {user?.role_name_th}
                          </td>
                          <td className="border py-2 pl-2">
                            <button
                              className="bg-red-500 px-4 py-1 rounded-md shadow-md shadow-offset-y-2 transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg"
                              onClick={() => deleteUser(user)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-white"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  }
                })}
            </table>

            <div className="ml-2 text-2xl font-bold text-[#2B3467]">
              5.ผู้ใช้งานทั่วไป
            </div>
            <div className="flex justify-end mx-20">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BsSearch />
                </div>
                <input
                  type="search"
                  className="block w-[25rem] p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-400 rounded-lg bg-white "
                  placeholder="ค้นหารายการ"
                  value={searchTerm}
                  onChange={InputChange}
                />
              </div>
            </div>
            <table className="my-[1.5rem] w-full  rounded table-fixed">
              <thead className="text-white text-xl bg-[#000000] h-14">
                <tr className="rounded py-[6rem]">
                  <th className="w-[4rem] rounded-tl-lg">ลำดับ</th>
                  <th className="w-[5rem]">เลขสมาชิก</th>
                  <th className="w-[20rem]">ชื่อ - สกุล</th>
                  <th className="w-80">E-mail</th>
                  <th className="w-[11rem]">Role</th>
                  <th className="rounded-tr-lg">ลบ</th>
                </tr>
              </thead>
              {Array.isArray(roleuser) &&
                roleuser.map((user, index) => {
                  if (
                    user.is_active === "1" &&
                    user.role_name_th === "ผู้ใช้ทั่วไป"
                  ) {
                    count[4]++;
                    return (
                      <tbody
                        className="bg-white border-b-lg rounded-xl h-14 divide-x"
                        key={index}
                      >
                        <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center flex-auto">
                          <td className="border py-3 pl-2">{count[4]+(((currentPage-1)*5))}</td>
                          <td className="border py-3 pl-2">
                            {user?.employeeNO}
                          </td>
                          <td className="border py-3 pl-5 text-left">
                            {user?.nametitle_t} {user?.firstname_t}{" "}
                            {user?.lastname_t}
                          </td>
                          <td className="border py-3  pl-5 text-left">
                            {user?.email}
                          </td>
                          <td className="border py-3 pl-2">
                            {user?.role_name_th}
                          </td>
                          <td className="border py-2 pl-2">
                            <button
                              className="bg-red-500 px-4 py-1 rounded-md shadow-md shadow-offset-y-2 transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg"
                              onClick={() => deleteUser(user)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-white"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  }
                })}
            </table>
            <div className="grid grid-cols-2">
            <div className="">
              <p>
                Showing {currentPage} to {totalPages} of {totalProject} entries
              </p>
            </div>
            <div className="flex justify-end mb-3">
              <ReactPaginate
                className="flex gap-5 col-start-10 col-end-12 "
                pageClassName="flex justify-center items-center w-10 h-10 text-[#EB455F] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100 border"
                activeClassName="w-10 h-10 text-white transition-colors duration-150 bg-[#EB455F] border border-r-0 border-[#EB455F] rounded-full focus:shadow-outline"
                nextLinkClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                previousClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                breakClassName="text-[#EB455F]"
                onPageChange={handlePaginationClick}
                pageCount={totalPages}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                nextLabel=">"
                previousLabel="<"
              />
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
