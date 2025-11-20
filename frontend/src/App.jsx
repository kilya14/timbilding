import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./sections/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProgramPage from "./pages/ProgramPage.jsx";
import AdminRequestsPage from "./pages/AdminRequestsPage.jsx";
import AdminProgramsPage from "./pages/AdminProgramsPage.jsx";



export default function App(){
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/programs/:slug" element={<ProgramPage />} />
                <Route path="/admin/requests" element={<AdminRequestsPage />} />
                <Route path="/admin/programs" element={<AdminProgramsPage />} />

            </Route>
        </Routes>
    );
}