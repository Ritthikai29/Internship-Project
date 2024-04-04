import { useEffect, useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/scg-logo.png";
import { UseUserRoleContext } from "../App";

import { FaUserTie } from "react-icons/fa6";
import "./Navbar.css";


export default function NavBar() {
  const { roles } = UseUserRoleContext();
  const [user, setUser] = useState<any>();

  

  const navItems = {
    general: [
      {
        label: "หน้าหลัก",
        to: "/",
      },
    ],
    unuser: [
      {
        label: "เข้าสู่ระบบ",
        to: "/login",
      },
    ],
    contractor: [
      {
        label: "การจัดการโครงการ",
        to: "/project/waitingtomanaged",
      },
    ],
    secretary: [
      {
        label: "โครงการที่รอจัดการ",
        to: "/secretary/waittomanage",
      },
    ],
    committee: [
      {
        label: "โครงการที่รอเปิดซอง",
        to: "/committee/projectwaittoopen",
      },
    ],
    user: [
      {
        label: "ประวัติโครงการ",
        to: "/project",
      },
      {
        label: "เพิ่ม / แก้ไขโครงการ",
        to: "/project/ManageProject",
      },
      {
        label: "ออกจากระบบ",
        to: "/logout",
      },
    ],
    vendor: [
      {
        label: "หน้าหลัก",
        to: "/",
      },
      {
        label: "ประวัติโครงการ",
        to: "/vender/history",
      },
      {
        label: "ยื่นซอง/แก้ไขโครงการ",
        to: "/vender/waittomanage",
      },
      {
        label: "ออกจากระบบ",
        to: "/logout",
      },
    ],
    admin: [
      {
        label: "ออกจากระบบ",
        to: "/logout",
      },
    ],
  };

  useEffect(() => {     
      setUser(JSON.parse(localStorage.getItem("name")!))
      console.log(roles)
   
  }, []);

  return (
    <header className="bg-transparent w-full z-50">
      <nav className="navbar bg-[#2B2A2A] ">
        <div className="mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Home Button */}
            <NavLink to="/" className="-ml-4">
              <img src={logo} className="h-11" alt="Logo"></img>
            </NavLink>

            {/* Menu */}
            <ul className="text-gray-50 flex">
              {Array.isArray(roles) &&
                roles.map((role) => {
                  role = role.toLowerCase();
                  return (
                    Array.isArray(navItems[role as keyof typeof navItems]) &&
                    navItems[role as keyof typeof navItems].map(
                      (item, index) => (
                        <li
                          key={index}
                          className="sm:px-4 md:px-6 text-sm md:text-base lg:text-base xl:text-xl font-extrabold pt-2"
                        >
                           <ul>
                          <Link to={item.to} className=" hover:text-rose-500 focus:text-rose-500">{item.label}</Link>
                          </ul>
                        </li>
                      )
                    )
                    
                  )
                })}
                <li className="text-sm md:text-base lg:text-base xl:text-xl font-extrabold flex gap-3 items-center">
                {
                  roles.length > 0 && (<div className="text-xs text-center border-2 border-[#2B2A2A] border-l-rose-500 pl-2">
                                        <div className={`${user.name && user.name.length > 18 ? 'text-xs' : 'text-base'}`}> {user.name?user.name:" "} </div>
                                        <div> {user.role_name_th === "เลขา"?"เลขา ฯ":user.role_name_th?user.role_name_th:""} </div>
                                      </div>
                )}
                                      

                { 
                  roles.length > 0 && <div className="pt-2.5 test-1 ">
                                        <ul>
                                        <NavItem icon={<FaUserTie/>} >
                                          {/* <DropdownMenu/> */}
                                        </NavItem>
                                        </ul>
                                      </div>
                                     
                }

                </li>

            </ul>
            
          </div>
        </div>
      </nav>
    </header>
    
    
  );
}

function NavItem(props : any) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <li>
      <ul>
      <Link to="#" className="icon-button hover:text-rose-500" onClick={() => setOpen(!open)}> {props.icon}</Link>
      </ul>
      {open && props.children}
    </li>
  )
}
