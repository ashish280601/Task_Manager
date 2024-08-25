import { useState } from "react";
import hostUrl from "../../../configAPI";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector, useDispatch } from "react-redux";
import loginimg from "../../assets/images/loginimg.png";
import { signUpUser, togglePasswordVisibility } from "../../slice/authSlice";
import { toast } from "react-toastify";

const SignUp = () => {
  const [signUp, setSignUp] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { togglePassword, isLoading, error } = useSelector((state) => state.auth);

  function handleChange(e) {
    const { name, value } = e.target;
    setSignUp((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRecaptchaToken(token) {
    setRecaptchaToken(token);
  }

  const handleTogglePassword = (field) => {
    dispatch(togglePasswordVisibility(field));
  };

  async function handleSignUp(e) {
    e.preventDefault();
    if (signUp.name === "" || signUp.email === "" || signUp.password === "") {
      toast.warning("Please enter all the credential details", {
        autoClose: 3000,
        position: "bottom-right"
      });
      return;
    }
    if (!recaptchaToken) {
      toast.error("Please verify the reCAPTCHA", {
        autoClose: 3000,
        position: "bottom-right"
      });
      return;
    }
    const userData = {
      fName: signUp.fName,
      lName: signUp.lName,
      email: signUp.email,
      password: signUp.password,
      profileImage,
      "g-recaptcha-response": recaptchaToken,
    };
    try {
      const res = await dispatch(signUpUser(userData)).unwrap();
      console.log("Signup component response", res);
      setSignUp({});
      setProfileImage(null);
      toast.success("Account Created Successfully", {
        autoClose: 3000,
        position: "bottom-right"
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Unable to create user account", {
        autoClose: 3000,
        position: "bottom-right"
      });
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${hostUrl}/api/auth/google`;
  };

  return (
    <>
      <section>
        <div className="login-container">
          <div className="login-box">
            <h2>SignUp</h2>
            <div className="profile-photo">
              <img src={profileImage || "https://via.placeholder.com/100?text=User+Photo"} alt="User" />
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <form onSubmit={handleSignUp}>
              <input type="text" placeholder="First Name" name="fName" value={signUp?.fName || ""} onChange={handleChange} className="input-field" />
              <input type="text" placeholder="Last Name" name="lName" value={signUp?.lName || ""} onChange={handleChange} className="input-field" />
              <input type="email" placeholder="Email" name="email" value={signUp?.email || ""} onChange={handleChange} className="input-field" />
              <div className="password-container">
                <input type={togglePassword.loginTogglePassword ? "text" : "password"} placeholder="Password" name="password" value={signUp?.password || ""} onChange={handleChange} className="input-field password-field" />
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
                  onClick={() => handleTogglePassword("loginTogglePassword")}
                  className="password-toggle-icon"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                </svg>
              </div>
              <div className="password-container">
                <input type={togglePassword.loginTogglePassword ? "text" : "password"} placeholder="Confirm Password" name="confirmPassword" value={signUp?.confirmPassword || ""} onChange={handleChange} className="input-field password-field" />
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
                  onClick={() => handleTogglePassword("loginTogglePassword")}
                  className="password-toggle-icon"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <ReCAPTCHA
                sitekey="6LfGmucpAAAAABOS1QMm4VHlS4Fvj931VNaSkUp2"
                onChange={handleRecaptchaToken}
              />
              <button type="submit" className="login-button" onClick={() => setSignUp({})}>Signup</button>
            </form>
            <p>
              Don't have an account? <Link to="/login" className="signup-link">Login</Link>
            </p>
            <button className="google-login" onClick={handleGoogleAuth}>Login with Google</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
