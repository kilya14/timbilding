// src/app/Layout.jsx
import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import footerLogo from "../assets/images/footer-logo.png";

function Header() {
    const [open, setOpen] = useState(false);        // состояние раскрытия меню на мобилке
    const navRef = useRef(null);

    // Закрытие меню по клику вне
    useEffect(() => {
        const onClick = (e) => {
            if (!navRef.current) return;
            if (!navRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    return (
        <header className="topbar sticky-top">
            {/* Важно: navbar-dark, чтобы отображалась иконка тогглера */}
            <nav className="navbar navbar-expand-lg container py-2 navbar-dark" ref={navRef}>
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <img src={logo} width={167} height={133} alt="Лого" />
                    ТИМБИЛДИНГ
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
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 position-relative">
                        <li className="nav-item">
                            <a className="nav-link" href="#about">О компании</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#why">Преимущества</a>
                        </li>

                        {/* Для мегаменю лучше не трогать state, а открыть по CSS :hover */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link" to="/programs/hungry-games">Программы ▾</Link>
                            <div className="mega">
                                <div className="layer">
                                    <div className="row g-2 text-white">
                                        <div className="col-12 col-md-4">
                                            <span className="chip">Популярное</span>
                                            <div className="small mt-1 text-white-50">Цепная реакция</div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <span className="chip">Квесты</span>
                                            <div className="small mt-1 text-white-50">Голодные игры</div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <span className="chip">Кулинария</span>
                                            <div className="small mt-1 text-white-50">Свой ресторан</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="#contacts">Контакты</a>
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
                            <img src={footerLogo} width={400} height={373} alt="Лого" />
                            <div className="small">Профессиональная организация тимбилдингов и кейс-сессий.</div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="small">Свяжитесь с нами: +7 (495) 123-45-67 | 8 (800) 505-00-00</div>
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
