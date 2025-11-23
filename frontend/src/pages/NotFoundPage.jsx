// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <h1 className="h3 mb-2">Страница не найдена</h1>
                <p className="text-muted">
                    Возможно, ссылка устарела или была указана с ошибкой.
                </p>
                <Link to="/" className="btn btn-secondary mt-2">
                    На главную
                </Link>
            </div>
        </section>
    );
}
