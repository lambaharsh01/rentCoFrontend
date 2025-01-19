import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { initialUserSchema } from "../../utils/authSchemas.js";
import axiosInterceptor from "../../utils/axiosInterceptor";

export default function SignUp() {
  const navigate = useNavigate();

  const scrollableDivRef = useRef(null);
  function scrollDivToTop() {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: 0,
        behavior: "smooth", // Optional: to add a smooth scrolling effect
      });
    }
  }

  const [screen, setScreen] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");

  const validateUserInfo = () => {
    let initialUserObject = {
      userName,
      userEmail,
      phoneNumber,
      day,
      month,
      year,
      gender,
    };

    initialUserSchema
      .validate(initialUserObject, { abortEarly: false }) // abortEarly: false ensures all validation errors are returned
      .then((validUser) => {
        let applyZero = (value) => value.toString().padStart(2, "0");

        let dateOfBirth = `${applyZero(validUser.year)}-${applyZero(
          validUser.month
        )}-${applyZero(validUser.day)}`;
        delete validUser.day;
        delete validUser.month;
        delete validUser.year;
        const userBaseObject = { ...validUser, dateOfBirth };
        sendVerificationCode(userBaseObject);
      })
      .catch((err) => {
        if (err.errors?.[0] ?? null) {
          toast.error(err.errors?.[0]);
        } else {
          toast.error("Validation failed some unknown error");
        }
      });
  };

  function sendVerificationCode(validatedObject) {
    setDisabled(true);

    axiosInterceptor({
      method: "post",
      url: "/api/authentication/sendVerificationCode",
      data: validatedObject,
    })
      .then((res) => {
        setScreen((prevCount) => prevCount + 1);
        scrollDivToTop();
        setDisabled(false);
        return toast.success(`OTP has been sent to ${userEmail}`);
      })
      .catch((err) => {
        toast.error(err.message);
        setDisabled(false);
        return navigate("/", { replace: true });
      });
  }

  const [otp, setOtp] = useState("");

  const verifyOtp = () => {
    if (!otp.length) return toast.error(`Please enter OTP`);
    if (otp.length < 6) return toast.error(`Incorrect OTP`);

    setDisabled(true);

    axiosInterceptor({
      method: "post",
      url: "/api/authentication/verifyUserEmail",
      data: { userEmail, otp },
    })
      .then((res) => {
        if (!res.success) return toast.error(res.message);
        setScreen((prevCount) => prevCount + 1);
        setOtp(res.data.otp);
        setDisabled(false);
        return toast.success(`OTP verification successful`);
      })
      .catch((err) => {
        toast.error(err.message);
        setDisabled(false);
        return navigate("/", { replace: true });
      });
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passStColor, setPassStColor] = useState({
    text: "Password Strength",
    textColor: "text-slate-200",
    first: "bg-slate-200",
    second: "bg-slate-200",
    third: "bg-slate-200",
  });

  const styles = {
    hrWidth: { width: "31%" },
  };

  useEffect(() => {
    const weakPasswordRegex = /^(.{0,7}|([A-Za-z]+|\d+|[@$!%*?&]+))$/;
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~])[A-Za-z\d@$!%*?&~]{8,}$/;

    let newObject = {
      text: "Password Strength",
      textColor: "bg-text-200",
      first: "bg-slate-200",
      second: "bg-slate-200",
      third: "bg-slate-200",
    };

    if (!password.length) {
      newObject = {
        text: "Password Strength",
        textColor: "bg-text-200",
        first: "bg-slate-200",
        second: "bg-slate-200",
        third: "bg-slate-200",
      };
    } else if (weakPasswordRegex.test(password)) {
      newObject = {
        text: "weak",
        textColor: "text-red-500",
        first: "bg-red-500",
        second: "bg-slate-200",
        third: "bg-slate-200",
      };
    } else if (strongPasswordRegex.test(password)) {
      newObject = {
        text: "strong",
        textColor: "text-green-500",
        first: "bg-green-500",
        second: "bg-green-500",
        third: "bg-green-500",
      };
    } else {
      newObject = {
        text: "moderate",
        textColor: "text-orange-500",
        first: "bg-orange-500",
        second: "bg-orange-500",
        third: "bg-slate-200",
      };
    }

    setPassStColor(newObject);
  }, [password]);

  const createUser = () => {
    if (!password) return toast.error(`Please enter password`);

    if (password !== confirmPassword)
      return toast.error(`Password and confirm password dosen't match`);

    if (passStColor.text !== "strong" && passStColor.text !== "moderate")
      return toast.error(`Your password is weak`);

    axiosInterceptor({
      method: "put",
      url: "/api/authentication/setUserPassword",
      data: { userEmail, otp, password, src: "set" },
    })
      .then((res) => {
        toast.success(`Authentication Successfull `);
        toast.success(`User ${userEmail} created`);
        return navigate("/", { replace: true });
      })
      .catch((err) => {
        toast.error(err.message);
        return navigate("/", { replace: true });
      });
  };

  return (
    <div className="flex justify-center w-full h-screen rentCoRed">
      <div className="w-100">
        <div className="rentCoRed col-lg-8 col-12 offset-0 offset-lg-2 h-1/6 flex items-end">
          <h1 className="rentCoFont mainFont text-7xl ps-2">
            <span className="text-white me-1">Sign</span>
            <span className="outlined-text-medium-thin rentCoRedFont">Up</span>
          </h1>
        </div>
        <div
          className="bg-white col-lg-8 col-12 offset-0 offset-lg-2 h-5/6 rounded-t-xl TeST flex-row overflow-y-auto"
          ref={scrollableDivRef}
        >
          {screen === 0 && (
            <div className="w-75 m-auto py-md-4 pt-4 pb-3">
              <h2 className="mb-4">User Details</h2>
              <input
                type="text"
                className="px-8 py-3 mb-4 rounded-md TeST w-100 bg-slate-100"
                placeholder="Enter Full Name"
                value={userName}
                onChange={(e) => setUserName(e.currentTarget.value)}
              />
              <input
                type="text"
                className="px-8 py-3 mb-4 rounded-md TeST w-100 bg-slate-100"
                placeholder="Enter Email"
                autocapitalize="off"
                autocomplete="off"
                autofill="off"
                value={userEmail}
                onChange={(e) => setUserEmail(e.currentTarget.value)}
              />
              <input
                type="number"
                className="px-8 py-3 mb-4 rounded-md TeST w-100 bg-slate-100"
                placeholder="Enter Phone No."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.currentTarget.value)}
              />
              <div className="w-100 d-flex mb-4">
                <div className="w-25 pe-1">
                  <input
                    type="number"
                    className="ps-2 ps-md-4 py-3 rounded-md TeST w-100 bg-slate-100"
                    placeholder="Day"
                    value={day}
                    onChange={(e) => setDay(e.currentTarget.value)}
                  />
                </div>
                <div className="w-25 px-1">
                  <input
                    type="number"
                    className="ps-2 ps-md-4 py-3 rounded-md TeST w-100 bg-slate-100"
                    placeholder="Month"
                    value={month}
                    onChange={(e) => setMonth(e.currentTarget.value)}
                  />
                </div>
                <div className="w-50 ps-1">
                  <input
                    type="number"
                    className="ps-2 ps-md-4 py-3 rounded-md TeST w-100 bg-slate-100"
                    placeholder="Birth Year"
                    value={year}
                    onChange={(e) => setYear(e.currentTarget.value)}
                  />
                </div>
              </div>
              <div
                className="w-100 flex justify-between mb-4 text-slate-500"
                style={{ fontSize: 17 }}
              >
                <span>Select Gender</span>
                <span>
                  <input
                    type="radio"
                    name="gender"
                    onClick={() => setGender("Male")}
                  />
                  &nbsp; Male
                </span>
                <span>
                  <input
                    type="radio"
                    name="gender"
                    onClick={() => setGender("Female")}
                  />
                  &nbsp; Female
                </span>
                <span>
                  <input
                    type="radio"
                    name="gender"
                    onClick={() => setGender("Other")}
                  />
                  &nbsp; Other
                </span>
              </div>
              <button
                disabled={disabled}
                className="bg-slate-950 rounded-md TeST text-white text-lg px-md-12 px-8 py-3 w-100"
                onClick={validateUserInfo}
              >
              { disabled ? (<div class="spinner-border spinner-border-sm text-white"></div>) : (<span>Send Verification Code</span>)}
              </button>
            </div>
          )}

          {screen === 1 && (
            <div className="w-75 m-auto py-md-4 pt-4 pb-3">
              <h2 className="mb-4">Otp Verification</h2>

              <input
                type="number"
                className="px-8 py-3 mb-4 rounded-md TeST w-100 bg-slate-100"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.currentTarget.value)}
              />

              <button
                disabled={disabled}
                className="bg-slate-950 rounded-md TeST text-white text-lg px-md-12 px-8 py-3 w-100"
                onClick={verifyOtp}
              >
                 { disabled ? (<div class="spinner-border spinner-border-sm text-white"></div>) : (<span>Verify OTP</span>)}
              </button>
            </div>
          )}

          {screen === 2 && (
            <div className="w-75 m-auto py-md-4 pt-4 pb-3">
              <h2 className="mb-4">Create Password</h2>
              <p className="mb-4 text-xs -mt-4">Please make sure you create a strong password with a minimum length of 6 upper and lower cased alphanumeric characters, use of special characters(#$@&) </p>


              <input
                type="password"
                className="px-8 py-3 mb-4 rounded-md TeST w-100 bg-slate-100"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />

              <input
                type="password"
                className="px-8 py-3 mb-4 rounded-md TeST w-100 bg-slate-100"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              />

              <span
                className={`font-thin text-sm ps-2 ${passStColor.textColor}`}
              >
                {passStColor.text}
              </span>
              <div className="w- flex justify-around mt-2 mb-5">
                <span
                  className={`h-1 rounded-md ${passStColor.first}`}
                  style={styles.hrWidth}
                />
                <span
                  className={`h-1 rounded-md ${passStColor.second}`}
                  style={styles.hrWidth}
                />
                <span
                  className={`h-1 rounded-md ${passStColor.third}`}
                  style={styles.hrWidth}
                />
              </div>

              <button
                disabled={disabled}
                className="bg-slate-950 rounded-md TeST text-white text-lg px-md-12 px-8 py-3 w-100"
                onClick={createUser}
              >
                 { disabled ? (<div class="spinner-border spinner-border-sm text-white"></div>) : (<span>Add Password</span>)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
