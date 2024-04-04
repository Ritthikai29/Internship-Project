import React, { useEffect, useState } from "react";
import { EmployeeInterface } from "../../models/Project/IEmployee";
import {
  AddUserforadmin,
  GetRoleforadmin,
  GetUserforadmin,
  GetUserforsearch,
} from "../../services/Admin_sts/Admin_sts";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface Role {
  id: number;
  role_name: string;
  role_name_th: string;
}
interface Adduser {
  // other properties
  employeeNO: string[];
}
export default function Adduser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hidden, setHidden] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [user, setUser] = useState<EmployeeInterface[]>([]);
  const [role, setRole] = useState<Role[]>([]);
  const [adduser, setAdduser] = useState<any[]>([]);
  const [arr, setArr] = useState<string[]>([]); //ใช้ในการเก็บ state ของ user ว่าเลือกอะไรไปแล้วบ้าง
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const [selectedUsers, setSelectedUsers] = useState<EmployeeInterface[]>([]);


  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };
  const getEmployee = async (search: any) => {
    console.log(search);
    const res = await GetUserforsearch(search);
    if(res.status !== 200 || res.data.length === 0) {
      setHidden(true);
      setRole([]);
      setSelectedItems([]);
      Swal.fire({
        title: "ไม่พบข้อมูล",
        text: "ไม่พบรหัสพนักงานหรือ ชื่อ-สกุลที่ค้นหา",
        icon: "warning",
        confirmButtonColor: "#EB455F",
        confirmButtonText: "ตกลง",
      });
    }else{
      setUser(res.data);
      console.log(res.data);
      setSelectedItems([]);
      setHidden(false);
      await getRole();
      res.data.filter((value: any,index: any) =>{
        if(arr.includes(value.employeeNO)){
          setSelectedItems((selectedItems) => [...selectedItems, index]);
        }
      })
    }
  };

  const getRole = async () => {
    const res = await GetRoleforadmin();
    setRole(res.data);
  };

  const handleOnChange = (
    e: React.ChangeEvent<{ name: string; value: any }>
  ) => {
    const name = e.target.name as keyof typeof adduser;
    const value = e.target.value;
    // อัปเดตค่า state
    setAdduser({
      ...adduser,
      [name]: value,
    });
  };

  const handleCheckboxChange = async (index: number, employeeNO:string) => {
    const isSelected = selectedItems.includes(index);
    console.log(isSelected);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((item) => item !== index));
      const indexToRemove = arr.indexOf(employeeNO);
      const newArr = [...arr];
      newArr.splice(indexToRemove, 1);
      setArr(newArr);
      setSelectedUsers(selectedUsers.filter(user => user.employeeNO !== employeeNO));
 
    } else {
      setSelectedItems([...selectedItems, index]);
      setArr((prevArr) => [...prevArr, employeeNO]);
      const selectedUser = user.find(user => user.employeeNO === employeeNO);
    if (selectedUser) {
      setSelectedUsers(prevUsers => [...prevUsers, selectedUser]);
    }
    }
    
  };
  

  const setAdduserforCheckbox = async() => {
    const name = "employeeNO";
    if(adduser.length === 0 ){
      setAdduser((prevAdduser: any) => ({
        ...prevAdduser,
        [name]: [],
      }));
    }
    setAdduser((prevAdduser: any) => ({
      ...prevAdduser,
      [name]: [...arr],
    }));
  };

  const OnSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    Swal.fire({
      title: "ยืนยันการเพิ่มผู้ใช้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EB455F",
      cancelButtonColor: "#979797",
      confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
      cancelButtonText: '<span style="font-size: 25px;">แก้ไข</span>',
      preConfirm: async () => {
        console.log(adduser)
        let res = await AddUserforadmin(adduser)
        if (res.status !== 200) {
            Swal.showValidationMessage(res.err)
        }
        return res.data
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "ส่งสำเร็จ!",
          text: "",
          icon: "success",
          confirmButtonText: "ยืนยัน",
        }).then(() => {
          // navigate("/project/ManageProject");
        });
      }
    });
  };

  const deleteUser=(index:number) =>{
      setSelectedItems(selectedItems.filter((item) => item !== index));
      const findvalue  =arr[index];
      const indexToRemove = arr.indexOf(findvalue);
      const newArr = [...arr];
      newArr.splice(indexToRemove, 1);
      setArr(newArr);
      setSelectedUsers(selectedUsers.filter(user => user.employeeNO !== findvalue));
  }
  useEffect(() => {
    console.log("Selected Items:", selectedItems);
    setAdduserforCheckbox();
  }, [user,selectedItems]);
  return (
    <div className="w-11/12 mx-auto ">
      
      <div className="ml-2 text-2xl font-bold text-[#2B3467]">
        1.ค้นหาข้อมูลพนักงาน</div>
      <div className="">
      <div className="flex justify-between items-center w-1/2  px-4 py-4 bg-gray-100 rounded-md shadow-md m-5">
      <div className="text-lg font-bold text-black">
        <p>รหัสพนักงาน (5 หลัก) หรือ ชื่อ-สกุล</p>
      </div>
      <div className="flex-1 ml-6 mx-auto ">
        <input
         className="px-8 py-3 text-black w-11/12 rounded-md shadow-md transition duration-300 ease-in-out hover:bg-white hover:shadow-lg"
      
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ค้นหาด้วยเลขสมาชิก หรือ ชื่อ - สกุล"
        />
      </div>
      <div>
        <button
          className="px-3 py-3 text-white bg-red-500 text-lg rounded-md shadow-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg"
          onClick={() => getEmployee(searchTerm)}
        >
          ค้นหา
        </button>
      </div>
    </div>
      </div>
      <table className="my-[1.5rem] w-full  rounded table-fixed" hidden={hidden}>
        <thead className="text-white text-xl bg-[#000000] h-14">
          <tr className="rounded py-[6rem]">
            <th className="w-[3rem] rounded-tl-lg">เลือก</th>
            <th className="w-[5rem]">เลขสมาชิก</th>
            <th className="">ชื่อ - สกุล</th>
            <th className="">E-mail</th>
            <th className="">ตำแหน่ง</th>
            <th className="rounded-tr-lg">สังกัด</th>
          </tr>
        </thead>
        {Array.isArray(user) &&
          user
          .slice(pagesVisited, pagesVisited + usersPerPage)
          .map((user, index) => {
              return (
                <tbody
                  className="bg-white border-b-lg rounded-xl h-14 divide-x"
                  key={index}
                >
                  <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center flex-auto"  style={{ verticalAlign: "top" }}>
                    <td className="border py-3 pl-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={() => handleCheckboxChange(index, user.employeeNO)}
                      className="h-6 w-6 text-green-500 focus:ring-green-400 border-gray-300 rounded transition duration-300 ease-in-out"
                    />
                    </td>
                    <td className="border py-3 pl-2">{user?.employeeNO}</td>
                    <td className="border py-3 pl-4 text-left">
                      {user?.nametitle_t} {user?.firstname_t} {user?.lastname_t}
                    </td>
                    <td className="border py-3 pl-2">{user?.email}</td>
                    <td className="border py-3 pl-2">{user?.position}</td>
                    <td className="border py-3 pl-2 p-4">
                      {user?.section} / {user?.department} / {user?.subsection}{" "}
                      / {user?.division}
                    </td>
                  </tr>
                </tbody>
              );
          })}
      </table>
    <div className="flex justify-between my-12 w-full">
                    <p className="px-36"></p>
                    <div className="flex justify-end">
                    {!hidden && user.length > 0 && (
                        <ReactPaginate
                            className="flex gap-5 col-start-10 col-end-12 "
                            pageClassName="flex justify-center items-center w-10 h-10 text-[#EB455F] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100 border"
                            activeClassName="w-10 h-10 text-white transition-colors duration-150 bg-[#EB455F] border border-r-0 border-[#EB455F] rounded-full focus:shadow-outline"
                            nextLinkClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                            previousClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                            breakClassName="text-[#EB455F]"
                            onPageChange={changePage}
                            pageCount={Math.ceil(user.length / usersPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={1}
                            nextLabel=">"
                            previousLabel="<"
                            breakLabel={'...'}
                        />
                        )}
                    </div>
                </div>
                <div className="ml-2 text-2xl font-bold text-[#2B3467]">2.กำหนด Role</div>
                <div className="flex justify-between items-center w-1/2  px-4 py-4 bg-gray-100 rounded-md shadow-md m-5">
      <div className="text-lg font-bold text-black">
        <p>กำหนด role ให้รายชื่อที่เลือก</p>
      </div>
      <div className="flex-1 ml-6 mx-auto ">
        <select
      id="project-job-type"
      className="px-8 py-3 text-black w-11/12 rounded-md shadow-md transition duration-300 ease-in-out hover:bg-white hover:shadow-lg text-xl"
      name="projectJobTypeId"
      onChange={handleOnChange}
      defaultValue="0"
    >
      <option disabled className="text-gray-400" value={0}>
        กรุณาเลือก role
      </option>
      {role.map((item: Role) => (
        <option value={item.id} key={item.id}>
          {item.role_name_th}
        </option>
      ))}
    </select>
      </div>
      <div>

        <button
       className="px-3 py-3 text-white bg-red-500 text-lg rounded-md shadow-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg"
      onClick={OnSubmit}
    >
      เพิ่มผู้ใช้
    </button>
      </div>
    </div>
<div className="">
  
  {selectedUsers.length > 0 && (
      
        <table className="my-[1.5rem] w-full  rounded table-fixed" >
        <thead className="text-white text-xl bg-[#000000] h-14">
          <tr className="rounded py-[6rem]">
            <th className="w-[15rem] rounded-tl-lg">เลือกแล้ว</th>
            <th className="">เลขสมาชิก</th>
            <th className="">ชื่อ - สกุล</th>
            <th className="">E-mail</th>
            <th className="">ตำแหน่ง</th>
            <th className="rounded-tr-lg">สังกัด</th>
          </tr>
        </thead>
        {selectedUsers.map((user, index) => {
              return (
                <tbody
                  className="bg-white border-b-lg rounded-xl h-14 divide-x"
                  key={index}
                >
                  <tr className="text-gray-700 text-xl h-14 border-b-2 border-black-700 text-center flex-auto"  style={{ verticalAlign: "top" }}>
                    <td className="border py-3 pl-2">
                    <button
                            className="bg-red-500 px-4 py-1 rounded-md shadow-md shadow-offset-y-2 transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg"
                            onClick={() =>deleteUser(index)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-white"
                            />
                          </button>
                    </td>
                    <td className="border py-3 pl-2">{user?.employeeNO}</td>
                    <td className="border py-3 pl-4 text-left">
                      {user?.nametitle_t} {user?.firstname_t} {user?.lastname_t}
                    </td>
                    <td className="border py-3 pl-2">{user?.email}</td>
                    <td className="border py-3 pl-2">{user?.position}</td>
                    <td className="border py-3 pl-2 p-4">
                      {user?.section} / {user?.department} / {user?.subsection}{" "}
                      / {user?.division}
                    </td>
                  </tr>
                </tbody>
              );
          })}
      </table>
    )}
</div>
    </div>
  );
}
