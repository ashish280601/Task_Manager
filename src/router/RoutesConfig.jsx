import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import Dashboard from "../Dashboard";
import Tasks from "../components/tasks/Tasks";
import Navbar from "../components/navbar/Navbar";

import React from 'react';

const RoutesConfig = () => {
    const [toggleAuth, setToggleAuth] = useState(true);
    const { isSession } = useSelector((state) => state.auth);
    const isAuthenticated = isSession.success;
    console.log("isAuthenticated", isAuthenticated);

    return (
        <React.Fragment>
            {/* Move Navbar outside of the Routes */}
            <Navbar />
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<SignIn onToggleAuth={setToggleAuth}/>} />
                <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}>
                    <Route path="task" element={<Tasks />} />
                </Route>
            </Routes>
        </React.Fragment>
    );
}

export default RoutesConfig;
