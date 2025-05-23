import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { toast } from "react-toastify";

export default function IndexPage() {
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("authToken");

    if (token) {
      navigate("/dashboard", { replace: true });
      return
    }

    axiosInterceptor({
      url: '/api/authentication/handshake',
      method:'get'
    }).then((res) => {
      toast.success("Server connection successful");
    }).catch((err) => {
      toast.error("Server connection could not be established");
    });
  }, [navigate])

  return (
    <div className="flex justify-center w-full h-screen">
      <div className="w-100">
        <div className="bg-white rounded-lg h-3/5 flex justify-center">
          {/* <img alt="Icon" src={rentCoIcon} className="loginImgLogo mt-28" /> */}
          <h1 className="rentCoFont mainFont text-8xl mt-28">
            <span className="rentCoRedFont me-1">Rent</span>
            <span className="outlined-text-thick text-white">Co.</span>
          </h1>
        </div>
        <div className="col-lg-8 col-12 offset-0 offset-lg-2 rentCoRed h-2/5 rounded-t-xl TeST flex-row">
          <div className="w-75 m-auto py-md-4 py-3">
            <h2>Welcome</h2>
            <p>
              Streamline your rent collection process with our advanced features
              and intuitive interface, you can save time and focus on what
              matters most.
            </p>
          </div>

          <div className="flex justify-around">
            <button
              className="bg-slate-950 rounded-md TeST text-white text-lg px-md-12 px-8 py-3"
              onClick={() => navigate("/signIn")}
            >
              Sign In
            </button>
            <button
              className="bg-white rounded-md TeST text-dark text-lg px-md-12 px-8 py-3"
              onClick={() => navigate("/signUp")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
