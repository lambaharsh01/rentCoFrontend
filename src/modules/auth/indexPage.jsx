import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const rentCoIcon = "/rentCoIcon3.png";
  const navigate = useNavigate();

  return (
    <div className="flex justify-center w-full h-screen">
      <div className="w-100">
        <div className="bg-white rounded-lg h-3/5 flex justify-center">
          <img alt="Icon" src={rentCoIcon} className="loginImgLogo mt-28" />
        </div>
        <div className="col-lg-8 col-12 offset-0 offset-lg-2 rentCoRed h-2/5 rounded-t-3xl flex-row">
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
              className="bg-slate-950 rounded-full text-white text-lg px-md-12 px-8 py-3"
              onClick={() => navigate("/signIn")}
            >
              Sign &nbsp;In
            </button>
            <button
              className="bg-white rounded-full text-dark text-lg px-md-12 px-8 py-3"
              onClick={() => navigate("/signUp")}
            >
              Sign &nbsp;Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
