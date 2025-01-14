import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import isSmallScreen from "../utils/isSmallScreen";
import { logOut } from "../utils/logout";

import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { IoIosTimer } from "react-icons/io";

import { TbLogout2 } from "react-icons/tb";

import "./header.css";

export default function Header({ active }) {
  const navigate = useNavigate();
  const smc = isSmallScreen()
  // active suppose to be on of (d,g,a) to show on of the classes active
  const [rentCoModule, setRentCoModule] = useState("Co.");
  const [activeSection, setActiveSection]= useState(" / ")

  const setModuleCall = useCallback(() => {
    switch (active) {
      case "d":
        setActiveSection(" / Dashboard");
        break;
      case "g":
        setActiveSection(" / Groups");
        break;
      case "a":
        setActiveSection(" / Analytics");
        break;
      case "p":
        setActiveSection(" / Past");
        break;
      default:
        setRentCoModule("Co.");
        break;
    }
  }, [active]);

  const ifAuthenticated = useCallback(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/signIn", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    ifAuthenticated();
    setModuleCall();
  }, [ifAuthenticated, setModuleCall]);

  
  return (
    <div>
      <div
        className={`fixed top-0 ${
          smc ? "headerMainSmallScreen" : "headerMainNotSmallScreen"
        } flex pb-1 bg-white`}
      >
        <div className="w-3/5 h-full flex items-end">
          <div
            className={`rentCoFont mainFont ${
              smc ? "text-4xl ms-2" : "text-6xl ms-3"
            }`}
            onClick={() => navigate("/dashboard", { replace: true })}>
            
            <span className="rentCoRedFont me-1 mb-0">Rent</span>
            <span className="outlined-text-thin text-white">
              {rentCoModule}
            </span>
            <span className={smc ? "text-sm" : "text-xl"}> {activeSection}</span>
          </div>
        </div>
        <div
          className={`w-2/5 pe-2 h-full flex justify-between items-end ${smc ? "text-2xl" : 'text-4xl'}`}
        >
          {!smc && (
            <>
              <span
                onClick={() =>navigate("/dashboard", { replace: true })}
                className={`me-2 me-md-4 pb-1 ${
                  active === "d" ? "font-bold rentCoRedFont" : ""
                }`}
              >
                <MdOutlineDashboardCustomize/>
              </span>
              <span
                onClick={() =>navigate("/groupIndex")}
                className={`me-2 me-md-4 pb-1 ${
                  active === "g" ? "font-bold rentCoRedFont" : ""
                }`}
              >
                <IoPeople/>
              </span>
              <span
                onClick={() =>navigate("/analyticsIndex")}
                className={`me-2 me-md-4 pb-1 ${
                  active === "a" ? "font-bold rentCoRedFont" : ""
                }`}
              >
                <TbBrandGoogleAnalytics/>
              </span>
              <span
                onClick={() =>navigate("/pastTenants")}
                className={`me-2 me-md-4 pb-1 ${
                  active === "p" ? "font-bold rentCoRedFont" : ""
                }`}
              >
                <IoIosTimer/>
              </span>
              <span
                onClick={logOut}
                className={`me-2 me-md-4 pb-1`}>
                <TbLogout2/>
              </span>
            </>
          )}
        </div>
      </div>

      <div
        className={`
          ${
            smc
              ? "placeholderHeaderSmallScreen"
              : "placeholderHeaderNotSmallScreen"
          }
        `}
      ></div>
    </div>
  );
}
