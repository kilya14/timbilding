// src/pages/AdminProgramsPage.jsx
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5001";

export default function AdminProgramsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPrograms = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`${API_URL}/api/programs`);
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка загрузки программ");
            }
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error("Ошибка загрузки программ", err);
            setError(err.message || "Не удалось загрузить программы");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrograms();
    }, []);

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="h4 mb-1">Программы</h1>
                        <div className="small text-muted">
                            Список программ тимбилдинга (чтение из базы).
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={loadPrograms}
                    >
                        Обновить
                    </button>
                </div>

                {loading && <div className="text-muted small mb-3">Загрузка...</div>}
                {error && <div className="alert alert-danger py-2">{error}</div>}

                {!loading && !error && items.length === 0 && (
                    <div className="text-muted small">Пока нет ни одной программы.</div>
                )}

                {!loading && !error && items.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-sm align-middle">
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th>Slug</th>
                                <th>Формат</th>
                                <th>Участники</th>
                                <th>Продолжительность</th>
                                <th>Цена</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((p) => (
                                <tr key={p._id}>
                                    <td className="small">{p.title}</td>
                                    <td className="small text-muted">{p.slug}</td>
                                    <td className="small">
                                        {p.format || (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                    <td className="small">
                                        {p.peopleFrom
                                            ? `от ${p.peopleFrom} чел.`
                                            : <span className="text-muted">—</span>}
                                    </td>
                                    <td className="small">
                                        {p.duration || (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                    <td className="small">
                                        {p.priceFrom || (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
