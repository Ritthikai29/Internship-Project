import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import { createContext, useContext, useEffect, useState } from "react";
import { checkValidateUserStaff } from "./services/HomeServices";
import { basename } from "./services/utilitity";
import Test from "./pages/Test";
import ProjectCreate from "./pages/Project/ProjectCreate";
import Project from "./pages/Project";
import Admin_sts from "./pages/admin_sts/admin_sts";
import VenderAfterNegotiating from "./pages/Vender/VenderAfterNegotiating";
import Announcement from "./pages/Announcement/Announcement";
import Apply from "./pages/Applydirector/Apply";
import SuccessApply from "./pages/Applydirector/SuccessApply";
import ErrorApply from "./pages/Applydirector/ErrorApply";
import TestPing from "./pages/Test";
import ProjectRoute from "./Router/ProjectRoute";
import BudgetRoute from "./Router/BudgetRoute";
import CommitteeRoute from "./Router/CommitteeRoute";
import ContractorRoute from "./Router/ContractorRoute";
import SecretaryRoute from "./Router/SecretaryRoute";
import VendorRoute from "./Router/VendorRoute";
import MdRoute from "./Router/MdRoute";
import AnnouncementRoute from "./Router/AnnouncementRoute";
import Logout from "./pages/Login/Logout";
import CookieConsent from "./components/Cookie-consent";
import { LogoutService } from "./services/LoginService";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import JoinOpenBid from "./pages/Committee/CommitteeJoinOpenBid";

interface UserRoleContextInterface {
  roles: string[];
  setRoles: React.Dispatch<React.SetStateAction<string[]>>;
}

const UserRoleContext = createContext<UserRoleContextInterface>({
  roles: [],
  setRoles: () => [],
});

export function UseUserRoleContext() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("UserRoleContext error");
  }
  return context;
}

function App() {
  const [login, setLogin] = useState("Waiting");
  const [roles, setRoles] = useState<string[]>([]);

  const hiddenPath = [
    ///////////////////// Contractor ///////////////////////
    `${basename}/contractor/verify-unlist-vendor/approve`,
    `${basename}/contractor/verify-unlist-vendor/successful`,
    `${basename}/contractor/verify-unlist-vendor/error`,
    `${basename}/contractor/verify-unlist-vendor/reject`,
    // wait for reject
    `${basename}/contractor/approve-unlist-vendor/approve`,
    `${basename}/contractor/approve-unlist-vendor/reject`,
    `${basename}/contractor/approve-unlist-vendor/successful`,
    `${basename}/contractor/approve-unlist-vendor/error`,

    `${basename}/contractor/project-setting`,
    `${basename}/contractor/project-setting/success`,
    `${basename}/contractor/reject-project-setting`,
    `${basename}/contractor/project-setting/error`,

    ///////////////////// MD ///////////////////////
    //approve
    `${basename}/md/approve-bidding/success`,
    `${basename}/md/approve-bidding/error`,
    `${basename}/md/approve-bidding`,
    //reject
    `${basename}/md/reject-bidding/success`,
    `${basename}/md/reject-bidding/error`,
    `${basename}/md/reject-bidding`,
    `${basename}/md/bargain-bidding`,

    `${basename}/Applydirector/Apply`,
    `${basename}/Applydirector/Apply/success`,
    `${basename}/Applydirector/Apply/error`,

    ///////////////////// Budget ///////////////////////
    `${basename}/budget/calculate`,
    `${basename}/budget/verify`,
    `${basename}/budget/verify2`,
    `${basename}/budget/approve1`,
    `${basename}/budget/approve2`,
  ];

  const validateUser = async () => {
    try {
      const res = await checkValidateUserStaff();
      if (res.status === 200) {
        if (res.data.role === "user_staff") {
          if (res.data.user.role_name === "admin") {
            setLogin("Admin");
            setRoles(["Admin"]);
          } else {
            setLogin("User");
            const role = res.data.user.user_roles.map(
              (item: any) => item.role_name
            );
            setRoles(["general", ...role, "user"]);
          }
        } else if (res.data.role === "vendor") {
          setLogin("Vendor");
          setRoles(["vendor"]);
        }
      } else {
        if (res.status === 401) {
          LogoutService();
          alert(res.err);
        }
        setLogin("Guest");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (!hiddenPath.includes(window.location.pathname)) {
      validateUser();
    }
  }, []);

  return (
    <BrowserRouter basename={basename}>
      <UserRoleContext.Provider value={{ roles, setRoles }}>
        {!hiddenPath.includes(window.location.pathname) && <NavBar />}
        <div
          className={`${
            hiddenPath.includes(window.location.pathname)
              ? ""
              : "flex flex-col min-h-screen"
          }`}
        >
          <Routes>
            {login === "Waiting" ? (
              <Route path="/*" element={<></>} />
            ) : login === "User" ? (
              <Route path="/*">
                <Route index element={<Project />} />
                <Route path="test" element={<Test />} />
                <Route path="project/create" element={<ProjectCreate />} />
              </Route>
            ) : login === "Admin" ? (
              <Route path="/*">
                <Route index element={<Admin_sts />} />
              </Route>
            ) : login === "Vendor" ? (
              <Route path="/*">
                <Route index element={<Project />} />
                <Route
                  path="vender/afternegotiating"
                  element={<VenderAfterNegotiating />}
                />
              </Route>
            ) : (
              <Route index element={<Login />} />
            )}

            {/* Check if user or vendor login navigate to Main Page */}
            {login === "User" || login === "Vendor" ? (
              <Route path="login" element={<Navigate to="/" />} />
            ) : login === "Admin" ? (
              <Route path="login" element={<Navigate to="/" />} />
            ) : (
              <Route path="login" element={<Login />} />
            )}

            {/* Common Routes */}
            {ContractorRoute.filter((route) => {
              if (route.roles) {
                return route.roles.some((role) => roles.includes(role));
              }
              return true;
            }).map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}

            {login === "User" &&
              CommitteeRoute.filter((route) => {
                if (route.roles) {
                  return route.roles.some((role) => roles.includes(role));
                }
                return true;
              }).map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}

            {(login === "User" || login === "Vendor") &&
              ProjectRoute.filter((route) => {
                if (route.roles) {
                  return route.roles.some((role) => roles.includes(role));
                }
                return true;
              }).map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}

            {login === "User" &&
              SecretaryRoute.filter((route) => {
                if (route.roles) {
                  return route.roles.some((role) => roles.includes(role));
                }
                return true;
              }).map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}

            {login === "Vendor" &&
              VendorRoute.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}

            {BudgetRoute.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}

            {MdRoute.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}

            {(login === "User" || login === "Vendor") &&
              AnnouncementRoute.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            <Route path="committee/join" element={<JoinOpenBid />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path="resetpassword" element={<ResetPassword />} />
            <Route path="Applydirector/Apply" element={<Apply />} />
            <Route path="Applydirector/Apply/success" element={<SuccessApply />} />
            <Route path="Applydirector/Apply/error" element={<ErrorApply />} />
            <Route path="announcement" element={<Announcement />} />
            <Route path="dev/testing" element={<TestPing />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        {login === "Vendor" &&
          !hiddenPath.includes(window.location.pathname) && <CookieConsent />}
        {!hiddenPath.includes(window.location.pathname) && <Footer />}
      </UserRoleContext.Provider>
    </BrowserRouter>
  );
}

export default App;
