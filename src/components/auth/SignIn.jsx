import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector, useDispatch } from "react-redux";
import { togglePasswordVisibility, loginUser } from "../../slice/authSlice";
import { toast } from "react-toastify";
import "../auth/Auth.css";

const SignIn = () => {
  const [auth, setAuth] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { togglePassword, isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuth((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRecaptchaToken = (token) => {
    setRecaptchaToken(token);
  };

  const handleTogglePassword = () => {
    dispatch(togglePasswordVisibility("loginTogglePassword"));
  };

  const handleLoginUser = async (e) => {
    e.preventDefault();
    if (auth.email === "" || auth.password === "") {
      toast.warning("Please enter all the credential details", {
        autoClose: 3000,
        position: "bottom-right",
      });
      return;
    }
    try {
      const userData = {
        email: auth.email,
        password: auth.password,
        "g-recaptcha-response": recaptchaToken,
      };
      const data = await dispatch(loginUser(userData)).unwrap();
      console.log("Login Successful component message: ", data);
      setAuth({});
      // toast.success("Login Successful");
      navigate("/task");
    } catch (error) {
      console.error("Error while login", error);
      // toast.error("Unauthorized User");
    }
  };

  return (
    <section>
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLoginUser}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={auth.email || ""}
              onChange={handleChange}
              className="input-field"
            />
            <div className="password-container">
              <input
                type={togglePassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={auth.password || ""}
                onChange={handleChange}
                className="input-field password-field"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={handleTogglePassword}
                className="password-toggle-icon"
              >
                {togglePassword ? (
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </>
                ) : (
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </>
                )}
              </svg>
            </div>
            <ReCAPTCHA
              sitekey="6LfGmucpAAAAABOS1QMm4VHlS4Fvj931VNaSkUp2"
              onChange={handleRecaptchaToken}
            />
            <button type="submit" className="login-button">
              {isLoading ? "Login..." : "Login"}
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link" onClick={() => setAuth({})}>Signup</Link>
          </p>
          <button className="google-login">Login with Google</button>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
