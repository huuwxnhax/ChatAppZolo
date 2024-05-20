import React, { useState } from "react";
import "./Auth.css";
import Logo from "../../img/logo.png";
import { logIn, signUp } from "../../actions/AuthActions.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../api/AuthRequests.js";
// import Toaster from '../../components/Following/Toaster.js';

const Auth = () => {
  const initialState = {
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmpass: "",
    otp: "",
  };
  
  // const loading = useSelector((state) => state.authReducer.loading);
  const errors = useSelector((state) => state.authReducer.error);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);

  const [data, setData] = useState(initialState);

  const [confirmPass, setConfirmPass] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  // Reset Form
  const resetForm = () => {
    setData(initialState);
    setConfirmPass(confirmPass);
  };

  // handle Change in input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    console.log("data email", data.username)
    sendOtp(data.username);
    console.log("data", data)
}
  
  const handleSubmit = (e) => {
    setConfirmPass(true);
    e.preventDefault();
      if (isSignUp) {
        if (data.password === data.confirmpass) {
          dispatch(signUp(data, navigate));
        } else {
          setConfirmPass(false);
        }
      } else {
        dispatch(logIn(data, navigate));
        if (errors) {
          setErrorMessage("Invalid email or password");
        }
      }
  };
  

  return (
    <div className="Auth">
      {/* left side */}

      <div className="a-left">
        {/* <img src={Logo} alt="" /> */}
        <div className="Webname">
          <p className="logo">
            <img src={Logo} alt="" />
          </p>
          <h1>App Chat Realtime</h1>
        </div>
      </div>

      {/* right form side */}

      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmit}>
          <h3>{isSignUp ? "Register" : "Login"}</h3>
          
          {isSignUp && (
            <>
              <div>
                <input
                  required
                  type="text"
                  placeholder="First Name"
                  className="infoInput"
                  name="firstname"
                  value={data.firstname}
                  onChange={handleChange}
                  pattern="[A-Za-z]{1,32}"
                  title="First name wrong format"
                />
              </div>
              <div>
                <input
                  required
                  type="text"
                  placeholder="Last Name"
                  className="infoInput"
                  name="lastname"
                  value={data.lastname}
                  onChange={handleChange}
                  pattern="[A-Za-z]{1,32}"
                  title="Last name wrong format"
                />
              </div>
            </>
          )}

          <div>
            <input
              required
              type="email"
              placeholder="Email"
              className="infoInput"
              name="username"
              value={data.username}
              onChange={handleChange}
              title="Email wrong format"
            />
            {isSignUp && (<button 
              className="button infoButton"
              type="button"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>)}
          </div>
          
          <div>
            <input
              required
              type="password"
              className="infoInput"
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
              pattern=".{4,}"
              title="Password must be at least 4 characters long"
            />
            {isSignUp && (
              <input
                required
                type="password"
                className="infoInput"
                name="confirmpass"
                placeholder="Confirm Password"
                onChange={handleChange}
                pattern=".{4,}"
                title="Password must be at least 4 characters long"
              />
            )}
          </div>

          {isSignUp && (<div>
            <input 
              type="text"
              placeholder="OTP"
              className="infoInput"
              name="otp"
              value={data.otp}
              onChange={handleChange}
            />
          </div>)}

          <span
            style={{
              color: "red",
              fontSize: "12px",
              alignSelf: "flex-end",
              marginRight: "5px",
              display: confirmPass ? "none" : "block",
            }}
          >
            *Confirm password is not same
          </span>

          {errorMessage && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errorMessage}
            </span>
          )}

          <div>
            <span
              style={{
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                resetForm();
                setIsSignUp((prev) => !prev);
              }}
            >
              {isSignUp
                ? "Already have an account Login"
                : "Don't have an account Sign up"}
            </span>
            <button
              className="button infoButton"
              type="Submit"
              // disabled={loading}
            >
              {isSignUp ? "SignUp" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
