// import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import isSmallScreen from "../utils/isSmallScreen";
import { logOut } from "../utils/logout";

import { MdOutlineDashboardCustomize } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { IoIosTimer } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";

import "./header.css";

export default function Footer({active}) {
  const navigate = useNavigate();
  const smallScreen = isSmallScreen()
  
  if(!smallScreen) return (<></>)

  return (
    <div className="sticky bottom-0 bg-white flex justify-around text-3xl py-2 border-t-2">

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
    </div>
  );
}
