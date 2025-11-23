// src/pages/AdminLoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config.js";
import { setAdminToken } from "../utils/adminAuth.js";

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!login || !password) {
            setError("Введите логин и пароль");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, password })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка авторизации");
            }

            const data = await res.json();
            if (!data.token) {
                throw new Error("Токен не получен");
            }

            setAdminToken(data.token);
            navigate("/admin", { replace: true });
        } catch (err) {
            console.error("Ошибка логина", err);
            setError(err.message || "Не удалось войти");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-4 py-md-5">
            <div className="container" style={{ maxWidth: 480 }}>
                <h1 className="h4 mb-3">Вход в админ-панель</h1>
                <p className="small text-muted mb-3">
                    Используйте логин и пароль, заданные в .env
                    (ADMIN_LOGIN / ADMIN_PASSWORD).
                </p>

                <form className="d-grid gap-2" onSubmit={onSubmit}>
                    <div>
                        <label className="form-label small mb-1">Логин</label>
                        <input
                            type="text"
                            className="form-control"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="form-label small mb-1">Пароль</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <div className="alert alert-danger py-2 mb-0">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="btn btn-primary mt-2"
                        disabled={loading}
                    >
                        {loading ? "Входим..." : "Войти"}
                    </button>
                    <div className="small mt-2">
                        <Link to="/">← На сайт</Link>
                    </div>
                </form>
            </div>
        </section>
    );
}
