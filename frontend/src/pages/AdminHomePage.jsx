// src/pages/AdminHomePage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHomePage() {
    const navigate = useNavigate();
    const isAdmin = !!localStorage.getItem("adminToken");

    const logout = () => {
        localStorage.removeItem("adminToken");
        navigate("/");
    };

    return (
        <section className="py-4 py-md-5">
            <div className="container" style={{ maxWidth: 720 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="h4 mb-1">Админ-панель</h1>
                        <div className="small text-muted">
                            Управление программами и заявками.
                        </div>
                    </div>
                    <div className="text-end small">
                        {isAdmin ? (
                            <>
                                <div className="mb-1 text-success">
                                    Вы авторизованы как администратор
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={logout}
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="btn btn-sm btn-outline-primary"
                            >
                                Войти
                            </Link>
                        )}
                    </div>
                </div>

                {!isAdmin && (
                    <div className="alert alert-warning py-2 small">
                        Для полноценного доступа к админке сначала{" "}
                        <Link to="/admin/login">авторизуйтесь</Link>.
                    </div>
                )}

                <div className="row g-3">
                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex flex-column">
                                <h2 className="h6">Заявки</h2>
                                <p className="small text-muted flex-grow-1">
                                    Список заявок с формы «Подать заявку»:
                                    статусы, контакты, желаемые даты.
                                </p>
                                <Link
                                    to="/admin/requests"
                                    className="btn btn-sm btn-outline-secondary mt-2"
                                >
                                    Открыть заявки
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex flex-column">
                                <h2 className="h6">Программы</h2>
                                <p className="small text-muted flex-grow-1">
                                    Каталог программ тимбилдинга. Можно добавлять
                                    новые программы, смотреть список.
                                </p>
                                <Link
                                    to="/admin/programs"
                                    className="btn btn-sm btn-outline-secondary mt-2"
                                >
                                    Открыть программы
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body d-flex flex-column">
                                <h2 className="h6">На сайт</h2>
                                <p className="small text-muted flex-grow-1">
                                    Вернуться на публичную главную страницу с
                                    витриной квестов и формой заявки.
                                </p>
                                <Link
                                    to="/"
                                    className="btn btn-sm btn-outline-secondary mt-2"
                                >
                                    На главную
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
