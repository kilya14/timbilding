// src/app/Layout.jsx
import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import footerLogo from "../assets/images/footer-logo.png";

function Header() {
    const [open, setOpen] = useState(false);             // мобильное меню
    const [programsOpen, setProgramsOpen] = useState(false); // дропдаун "Программы"
    const navRef = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (!navRef.current) return;
            if (!navRef.current.contains(e.target)) {
                setOpen(false);
                setProgramsOpen(false);
            }
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    const handleNavClick = () => {
        setOpen(false);
        setProgramsOpen(false);
    };

    return (
        <header className="topbar sticky-top">
            <nav
                className="navbar navbar-expand-lg container py-2 navbar-dark"
                ref={navRef}
            >
                <Link
                    className="navbar-brand d-flex align-items-center gap-2"
                    to="/"
                    onClick={handleNavClick}
                >
                    <img src={logo} width={50} height={40} alt="Лого" style={{ objectFit: 'contain' }} />
                    <span className="fw-bold">ТИМБИЛДИНГ</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    aria-label="Меню"
                    onClick={() => setOpen((s) => !s)}
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="/#about"
                                onClick={handleNavClick}
                            >
                                О компании
                            </a>
                        </li>

                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="/#why"
                                onClick={handleNavClick}
                            >
                                Преимущества
                            </a>
                        </li>

                        {/* Ссылка на каталог программ */}
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/catalog"
                                onClick={handleNavClick}
                            >
                                Программы
                            </Link>
                        </li>

                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="/#contacts"
                                onClick={handleNavClick}
                            >
                                Контакты
                            </a>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link small"
                                to="/admin"
                                onClick={handleNavClick}
                            >
                                Админка
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

function Footer() {
    return (
        <footer className="py-4" id="footer">
            <div className="container">
                <div className="row g-3 align-items-center">
                    <div className="col-12 col-lg-4">
                        <div className="bg-white rounded-4 p-3 d-flex align-items-center gap-3 shadow-sm">
                            <img src={footerLogo} width={60} height={56} alt="Лого" style={{ objectFit: 'contain' }} />
                            <div className="small">
                                Профессиональная организация тимбилдингов и кейс-сессий.
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="small">
                            Свяжитесь с нами: +7 (495) 123-45-67 | 8 (800) 505-00-00
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="small text-lg-end">ТИМБИЛДИНГ © 2025</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}
