import { useState } from "react";
import hostUrl from "../../../configAPI";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector, useDispatch } from "react-redux";
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
    if (!signUp.fName || !signUp.lName || !signUp.email || !signUp.password || !signUp.confirmPassword) {
      toast.warning("Please enter all the credential details");
      return;
    }

    if (signUp.password !== signUp.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!recaptchaToken) {
      toast.error("Please verify the reCAPTCHA", {
        autoClose: 3000,
        position: "bottom-right"
      });
      return;
    }

    const formData = new FormData();
    formData.append("fName", signUp.fName);
    formData.append("lName", signUp.lName);
    formData.append("email", signUp.email);
    formData.append("password", signUp.password);
    formData.append("image", profileImage);
    formData.append("g-recaptcha-response", recaptchaToken);

    try {
      const res = await dispatch(signUpUser(formData));
      console.log("Signup component response", res);
      if (res?.payload?.success) {
        setSignUp({});
        setProfileImage(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("error while creating user", error.message);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
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
                <input type={togglePassword.signUpTogglePassword ? "password" : "text"} placeholder="Password" name="password" value={signUp?.password || ""} onChange={handleChange} className="input-field password-field" />
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
                  onClick={() => handleTogglePassword("signUpTogglePassword")}
                  className="password-toggle-icon"
                >
                  {togglePassword.signUpTogglePassword ? (
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  ) : (
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                  )}
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                </svg>
              </div>
              <div className="password-container">
                <input type={togglePassword.confirmPassword ? "password" : "text"} placeholder="Confirm Password" name="confirmPassword" value={signUp?.confirmPassword || ""} onChange={handleChange} className="input-field password-field" />
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
                  onClick={() => handleTogglePassword("confirmPassword")}
                  className="password-toggle-icon"
                >
                  {togglePassword.confirmPassword ? (
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  ) : (
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                  )}
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                </svg>
              </div>
              <ReCAPTCHA
                sitekey="6LfGmucpAAAAABOS1QMm4VHlS4Fvj931VNaSkUp2"
                onChange={handleRecaptchaToken}
              />
              <button type="submit" className="login-button">
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
            <p>
              Don't have an account? <Link to="/login" className="signup-link" onClick={() => setSignUp({})}>Login</Link>
            </p>
            <button className="google-login" onClick={handleGoogleAuth}>Login with Google</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
