import React from 'react';
import './Navbar.css';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { OTPRequests } from '../../slice/authSlice';
import { useDispatch } from 'react-redux';

const Navbar = ({ isAuthenticated }) => {
  const userInfo = JSON.parse(sessionStorage.getItem("userData"));
  const userID = userInfo?.userID
  const dispatch = useDispatch();
  const userName = userInfo?.name || null;
  const userImg = userInfo?.userImg || null;
  console.log("userName", userName);

  const handleOTPRequest = async () => {
    try {
      const res = await dispatch(OTPRequests({ userID })).unwrap();
      console.log("OTP request component", res);
      // navigate("/otp/verify"); 
    } catch (error) {
      console.error("Error while requesting otp verfiy", error);
    }
  };

  const handleSignOut = async () => {
    try {
      sessionStorage.clear();
      toast.success("Logout Successful", {
        autoClose: 3000,
        position: "bottom-right"
      })
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to logout", {
        position: "bottom-right",
        autoClose: 3000
      })
    }
  };
  return (
    <div className="navbar">
      <div className="logo">
        {/* Placeholder for your logo image */}
        <img src="https://www.shutterstock.com/image-vector/clipboard-tick-marks-cogwheel-symbolising-260nw-784327627.jpg" alt="logo" />
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <div className="user-info">
              <img src={userImg} alt={userName} />
              <h6>{userName}</h6>
            </div>
            <button className="nav-button">
              <Link to="/otp-verify" onClick={handleOTPRequest}>Forget Password</Link>
            </button>
            <button className="nav-button" style={{ backgroundColor: "red" }} onClick={handleSignOut}>Logout</button>
          </>
        ) : (
          <>
            <button className="nav-button">
              <Link to="/login">Login</Link>
            </button>
            <button className="nav-button">
              <Link to="/signup">Signup</Link>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
