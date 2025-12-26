import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./sections/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ProgramPage from "./pages/ProgramPage.jsx";
import AdminRequestsPage from "./pages/AdminRequestsPage.jsx";
import AdminProgramsPage from "./pages/AdminProgramsPage.jsx";
import AdminCategoriesPage from "./pages/AdminCategoriesPage.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";



export default function App(){
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/programs/:slug" element={<ProgramPage />} />
                <Route path="/admin" element={<AdminHomePage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                <Route path="/admin/requests" element={<AdminRequestsPage />} />
                <Route path="/admin/programs" element={<AdminProgramsPage />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                <Route path="*" element={<NotFoundPage />} />


            </Route>
        </Routes>
    );
}