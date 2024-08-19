import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSchema } from "../../utils/authSchemas.js";
import axiosInterceptor from "../../utils/axiosInterceptor";

import { getTenantDetails } from "../../utils/redux/reduxInterceptors.js";

export default function SignIn() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  const authenticateUser = () => {
    loginSchema
      .validate({ userEmail, password }, { abortEarly: false })
      .then((validUser) => {
        axiosInterceptor({
          method: "post",
          url: "/api/authentication/loginAuthentication",
          data: validUser,
        })
          .then((res) => {

            if (!res.data.token) throw new Error("Something went wrong");

            localStorage.setItem("authToken", res.data.token);

            toast.success(`Welcome back ${res.data.userName}!`);

            getTenantDetails(true);

            return navigate("/dashboard", { replace: true });

          })
          .catch((err) => {
            toast.error(err.message);
            setUserEmail("");
            setPassword("");
          });
      })
      .catch((err) => {
        if (err.errors?.[0] ?? null) {
          toast.error(err.errors?.[0]);
        } else {
          toast.error("Validation failed some unknown error");
        }
      });
  };

  return (
    <div className="flex justify-center w-full h-screen rentCoRed">
      <div className="w-100">
        <div className="rentCoRed col-lg-8 col-12 offset-0 offset-lg-2 h-1/6 flex items-end">
          <h1 className="rentCoFont mainFont text-7xl ps-2">
            <span className="text-white me-1">Sign</span>
            <span className="outlined-text-medium-thin rentCoRedFont">In</span>
          </h1>
        </div>
        <div className="bg-white col-lg-8 col-12 offset-0 offset-lg-2 h-5/6 rounded-t-3xl flex-row overflow-y-auto">
          <div className="w-75 m-auto py-md-4 pt-4 pb-3 h-100 flex flex-col justify-between h-full">
            {/* <h2 className="mb-4">Create Password</h2> */}
            <div>
              <input
                type="email"
                className="px-8 py-3 mb-4 mt-5 rounded-full w-100 bg-slate-100"
                placeholder="Enter Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.currentTarget.value)}
              />
              <input
                type="password"
                className="px-8 py-3 mb-4 rounded-full w-100 bg-slate-100"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <div className="mb-14">
              <button
                className="bg-slate-950 rounded-full text-white text-lg px-md-12 px-8 py-3 w-100"
                onClick={authenticateUser}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
