import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./header.css";

export default function Header({ active }) {
  const navigate = useNavigate();
  // active suppose to be on of (d,g,a) to show on of the classes active
  const [rentCoModule, setRentCoModule] = useState("Co.");

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const updateScreenWidth = () => {
      setIsSmallScreen(window.innerWidth <= 576);
    };
    window.addEventListener("resize", updateScreenWidth);
    updateScreenWidth();

    const setModuleCall = () => {
      // setRentCoModule
      switch (active) {
        case "d":
          setRentCoModule("Da.");
          break;
        case "g":
          setRentCoModule("Gr.");
          break;
        case "a":
          setRentCoModule("An.");
          break;
      }
    };
    setModuleCall();

    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  return (
    <div>
      <div
        className={`fixed top-0 ${
          isSmallScreen ? "headerMainSmallScreen" : "headerMainNotSmallScreen"
        } flex pb-1 bg-white`}
      >
        <div className="w-2/5 h-full flex items-end">
          <div
            className={`rentCoFont mainFont ${
              isSmallScreen ? "text-4xl ms-2" : "text-6xl ms-3"
            }`}
            onClick={() => {
              navigate("/dashboard");
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
            isSmallScreen ? "text-xs" : "text-base"
          }`}
        >
          <span
            onClick={() => {
              navigate("/dashboard");
            }}
            className={`me-2 me-md-4 pb-1 ${active === "d" ? "font-bold" : ""}`}
          >
            DASHBOARD
          </span>
          <span
            onClick={() => {
              navigate("/groupIndex");
            }}
            className={`me-2 me-md-4 pb-1 ${active === "g" ? "font-bold" : ""}`}
          >
            GROUPS
          </span>
          <span
            onClick={() => {
              navigate("/analyticsIndex");
            }}
            className={`me-2 me-md-4 pb-1 ${active === "a" ? "font-bold" : ""}`}
          >
            ANALYTICS
          </span>
        </div>
      </div>
      {/* placeholderHeader */}
      <div
        className={`
          ${
            isSmallScreen
              ? "placeholderHeaderSmallScreen"
              : "placeholderHeaderNotSmallScreen"
          }
        `}
      ></div>
    </div>
  );
}
