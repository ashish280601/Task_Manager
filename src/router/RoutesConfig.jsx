import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import Dashboard from "../Dashboard";
import Tasks from "../components/tasks/Tasks";
import Navbar from "../components/navbar/Navbar";

import React from 'react';
import OTPVerify from "../components/auth/OTPVerify";
import ForgetPassword from "../components/auth/ForgetPassword";

// ProtectedRoute Component
const ProtectedRoute = ({ element, isAuthenticated }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
};

const RoutesConfig = () => {
    const [toggleAuth, setToggleAuth] = useState(true);
    const { isSession } = useSelector((state) => state.auth);
    const isAuthenticated = isSession.success;
    console.log("isAuthenticated", isAuthenticated);

    return (
        <React.Fragment>

            <Navbar isAuthenticated={isAuthenticated}  />
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<SignIn onToggleAuth={setToggleAuth} />} />
                <Route path="/task" element={<ProtectedRoute element={<Tasks />} isAuthenticated={isAuthenticated} />} />
                <Route path="/otp-verify" element={<ProtectedRoute element={<OTPVerify/>}isAuthenticated={isAuthenticated} />}/>
                <Route path="/forgetPassword" element={<ProtectedRoute element={<ForgetPassword/>} isAuthenticated={isAuthenticated}/>}/>
                <Route path="/" element={<Navigate to={isAuthenticated ? "/task" : "/login"} />} />
            </Routes>
        </React.Fragment>
    );
}

export default RoutesConfig;
