import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        {/* Placeholder for your logo image */}
        <img src="https://www.shutterstock.com/image-vector/clipboard-tick-marks-cogwheel-symbolising-260nw-784327627.jpg" alt="logo" />
      </div>
      <div className="nav-links">
        <button className="nav-button">Login</button>
        <button className="nav-button">Signup</button>
      </div>
    </div>
  );
};

export default Navbar;
