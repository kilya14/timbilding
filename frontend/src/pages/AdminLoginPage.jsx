// src/pages/AdminLoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config.js";

export default function AdminLoginPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
                throw new Error(data.message || "Ошибка входа");
            }

            const data = await res.json();

            // Простейший флажок авторизации
            localStorage.setItem("adminToken", data.token || "simple-admin-token");

            // Переход в админ-панель
            navigate("/admin");
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
                <h1 className="h4 mb-3">Вход для администратора</h1>

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
                        <div className="alert alert-danger py-2 mb-0 small">
                            {error}
                        </div>
                    )}

                    <div className="mt-2">
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Входим..." : "Войти"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
