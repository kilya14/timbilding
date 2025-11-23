// src/pages/AdminHomePage.jsx
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { getAdminToken, clearAdminToken } from "../utils/adminAuth.js";

export default function AdminHomePage() {
    const token = getAdminToken();

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    const onLogout = () => {
        clearAdminToken();
        window.location.href = "/admin/login";
    };

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="h4 mb-1">Админ-панель</h1>
                        <div className="small text-muted">
                            Управление заявками и программами.
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Link to="/" className="btn btn-sm btn-outline-secondary">
                            На сайт
                        </Link>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={onLogout}
                        >
                            Выйти
                        </button>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-12 col-md-4">
                        <div className="card shadow-sm rounded-4 border-0 h-100">
                            <div className="card-body">
                                <h5 className="card-title">Заявки</h5>
                                <p className="card-text small text-muted">
                                    Список заявок с формы «Подать заявку»,
                                    смена статусов.
                                </p>
                                <Link
                                    to="/admin/requests"
                                    className="btn btn-sm btn-primary"
                                >
                                    Перейти
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card shadow-sm rounded-4 border-0 h-100">
                            <div className="card-body">
                                <h5 className="card-title">Программы</h5>
                                <p className="card-text small text-muted">
                                    Список программ тимбилдинга, добавление новых.
                                </p>
                                <Link
                                    to="/admin/programs"
                                    className="btn btn-sm btn-primary"
                                >
                                    Перейти
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* На будущее можно добавить ещё карточки: "Контакты", "Настройки" и т.п. */}
                </div>
            </div>
        </section>
    );
}
