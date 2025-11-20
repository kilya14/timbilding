// src/pages/AdminRequestsPage.jsx
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5001";

const STATUS_OPTIONS = [
    { value: "new", label: "Новая" },
    { value: "in_progress", label: "В работе" },
    { value: "done", label: "Завершена" }
];

export default function AdminRequestsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [savingId, setSavingId] = useState(null); // id заявки, по которой меняем статус

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`${API_URL}/api/requests`);
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка загрузки заявок");
            }
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error("Ошибка загрузки заявок", err);
            setError(err.message || "Не удалось загрузить заявки");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            setSavingId(id);
            setError("");

            const res = await fetch(`${API_URL}/api/requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка обновления статуса");
            }

            const updated = await res.json();

            // Обновляем в стейте
            setItems((prev) =>
                prev.map((item) => (item._id === updated._id ? updated : item))
            );
        } catch (err) {
            console.error("Ошибка обновления статуса", err);
            setError(err.message || "Не удалось обновить статус");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="h4 mb-1">Заявки</h1>
                        <div className="small text-muted">
                            Простой список без авторизации — для учебного проекта.
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={loadRequests}
                    >
                        Обновить
                    </button>
                </div>

                {loading && <div className="text-muted small mb-3">Загрузка...</div>}
                {error && <div className="alert alert-danger py-2">{error}</div>}

                {!loading && !error && items.length === 0 && (
                    <div className="text-muted small">Пока нет ни одной заявки.</div>
                )}

                {!loading && !error && items.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-sm align-middle">
                            <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Организация</th>
                                <th>Контакты</th>
                                <th>Участники</th>
                                <th>Программа</th>
                                <th>Комментарий</th>
                                <th style={{ width: 160 }}>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((r) => (
                                <tr key={r._id}>
                                    <td className="small">
                                        {r.createdAt
                                            ? new Date(r.createdAt).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td className="small">{r.org}</td>
                                    <td className="small">
                                        <div>{r.phone}</div>
                                        <div className="text-muted">{r.email}</div>
                                    </td>
                                    <td className="small">
                                        {r.people || 0}
                                        {r.wish && (
                                            <div className="text-muted">
                                                дата: {r.wish}
                                            </div>
                                        )}
                                    </td>
                                    <td className="small">
                                        {r.programId || (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                    <td className="small">
                                        {r.comment || (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                    <td className="small">
                                        <div className="d-flex align-items-center gap-2">
                                            <select
                                                className="form-select form-select-sm"
                                                value={r.status || "new"}
                                                onChange={(e) =>
                                                    updateStatus(r._id, e.target.value)
                                                }
                                                disabled={savingId === r._id}
                                            >
                                                {STATUS_OPTIONS.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {savingId === r._id && (
                                                <span className="small text-muted">
                                                        ...
                                                    </span>
                                            )}
                                        </div>
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
