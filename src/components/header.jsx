import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import isSmallScreen from "../utils/isSmallScreen";

import "./header.css";

export default function Header({ active }) {
  const navigate = useNavigate();
  // active suppose to be on of (d,g,a) to show on of the classes active
  const [rentCoModule, setRentCoModule] = useState("Co.");

  const setModuleCall = useCallback(() => {
    switch (active) {
      // case "d":
      //   setRentCoModule("Da.");
      //   break;
      // case "g":
      //   setRentCoModule("Gr.");
      //   break;
      // case "a":
      //   setRentCoModule("An.");
      //   break;
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
          isSmallScreen() ? "headerMainSmallScreen" : "headerMainNotSmallScreen"
        } flex pb-1 bg-white`}
      >
        <div className="w-2/5 h-full flex items-end">
          <div
            className={`rentCoFont mainFont ${
              isSmallScreen() ? "text-4xl ms-2" : "text-6xl ms-3"
            }`}
            onClick={() => {
              navigate("/dashboard", { replace: true });
            }}
          >
            <span className="rentCoRedFont me-1 mb-0">Rent</span>
            <span className="outlined-text-thin text-white">
              {rentCoModule}
            </span>
          </div>
        </div>
        <div
          className={`w-3/5 h-full flex justify-end items-end font-medium ${
            isSmallScreen() ? "text-xs" : "text-base"
          }`}
        >
          <span
            onClick={() => {
              navigate("/dashboard", { replace: true });
            }}
            className={`me-2 me-md-4 pb-1 ${
              active === "d" ? "font-bold rentCoRedFont" : ""
            }`}
          >
            DASHBOARD
          </span>
          <span
            onClick={() => {
              navigate("/groupIndex");
            }}
            className={`me-2 me-md-4 pb-1 ${
              active === "g" ? "font-bold rentCoRedFont" : ""
            }`}
          >
            GROUPS
          </span>
          <span
            onClick={() => {
              navigate("/analyticsIndex");
            }}
            className={`me-2 me-md-4 pb-1 ${
              active === "a" ? "font-bold rentCoRedFont" : ""
            }`}
          >
            ANALYTICS
          </span>
        </div>
      </div>
      {/* placeholderHeader */}
      <div
        className={`
          ${
            isSmallScreen()
              ? "placeholderHeaderSmallScreen"
              : "placeholderHeaderNotSmallScreen"
          }
        `}
      ></div>
    </div>
  );
}