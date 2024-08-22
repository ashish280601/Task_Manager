import { Route, Routes, Navigate } from "react-router-dom";

import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import Dashboard from "../Dashboard";
import Tasks from "../components/tasks/Tasks";

import React from 'react'

const RoutesConfig = () => {
    // const isAuth = status;
    const isAuth = false;

    return (
        <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />}>
                <Route path="task" element={<Tasks />} />
            </Route>
        </Routes>
    )
}

export default RoutesConfig


