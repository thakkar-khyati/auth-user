import React from "react";
import { Route, Routes } from 'react-router-dom';
import SignUpCustomer from "./components/Signup.customer";
import SignUpAdmin from "./components/Signup.admin";
import VerifyUser from "./components/VerifyUser";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";

function RoutesPath() {
    return (
        <Routes>
            <Route path="/" element={<SignUpCustomer />} />
            <Route path="/signUp/customer" element={<SignUpCustomer />} />
            <Route path="/signUp/admin" element={<SignUpAdmin />} />
            <Route path="/verify/:id/:token" element={<VerifyUser />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default RoutesPath;