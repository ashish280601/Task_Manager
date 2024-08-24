import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated }) => {
  return (
    <div className="navbar">
      <div className="logo">
        {/* Placeholder for your logo image */}
        <img src="https://www.shutterstock.com/image-vector/clipboard-tick-marks-cogwheel-symbolising-260nw-784327627.jpg" alt="logo" />
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <button className="nav-button">
              <Link to="forget-password">Forget Password</Link>
            </button>
            <button className="nav-button" style={{backgroundColor:"red"}}>Logout</button>
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
