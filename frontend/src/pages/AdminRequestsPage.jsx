// src/pages/AdminRequestsPage.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../config.js";
import { Navigate } from "react-router-dom";
import { getAdminToken } from "../utils/adminAuth.js";


const STATUS_OPTIONS = [
    { value: "new",         label: "Новая" },
    { value: "in_progress", label: "В обработке" },
    { value: "waiting",     label: "Ждём подтверждения" },
    { value: "confirmed",   label: "Подтверждена" },
    { value: "cancelled",   label: "Отменена" },
    { value: "finished",    label: "Завершена" }
];

export default function AdminRequestsPage() {

    const token = getAdminToken();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [savingId, setSavingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRequest, setSelectedRequest] = useState(null);
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }
    const loadRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${API_URL}/api/admin/requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить заявку?");
        if (!ok) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/requests/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка удаления заявки");
            }

            setItems((prev) => prev.filter((r) => r._id !== id));
            if (selectedRequest?._id === id) {
                setSelectedRequest(null);
            }
        } catch (err) {
            console.error("Ошибка удаления заявки", err);
            alert(err.message || "Не удалось удалить заявку");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            setSavingId(id);
            setError("");

            const res = await fetch(`${API_URL}/api/admin/requests/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка обновления статуса");
            }

            const updated = await res.json();

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

    // применяем фильтр по статусу
    const filteredItems =
        statusFilter === "all"
            ? items
            : items.filter((r) => (r.status || "new") === statusFilter);

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                {/* Заголовок + кнопка обновления + фильтр */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                    <div>
                        <h1 className="h4 mb-1">Заявки</h1>
                        <div className="small text-muted">
                            Список заявок с формы «Подать заявку».
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <select
                            className="form-select form-select-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Все статусы</option>
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <a href="/admin" className="btn btn-sm btn-outline-secondary">
                            В админ-панель
                        </a>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={loadRequests}
                        >
                            Обновить
                        </button>
                    </div>
                </div>

                {loading && <div className="text-muted small mb-3">Загрузка...</div>}
                {error && <div className="alert alert-danger py-2">{error}</div>}

                {!loading && !error && filteredItems.length === 0 && (
                    <div className="text-muted small">
                        {items.length === 0
                            ? "Пока нет ни одной заявки."
                            : "Нет заявок с таким статусом."}
                    </div>
                )}

                {!loading && !error && filteredItems.length > 0 && (
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
                                <th style={{ width: 100 }}>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredItems.map((r) => (
                                <tr key={r._id}>
                                    <td className="small">
                                        {r.createdAt
                                            ? new Date(
                                                r.createdAt
                                            ).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td className="small">{r.companyName || r.org}</td>
                                    <td className="small">
                                        <div>{r.phone}</div>
                                        <div className="text-muted">{r.email}</div>
                                    </td>
                                    <td className="small">
                                        {r.participantsCount || r.people || 0}
                                        {(r.eventDate || r.wish) && (
                                            <div className="text-muted">
                                                дата: {r.eventDate || r.wish}
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
                                        <div className="d-flex align-items-center gap-1">
                                            <select
                                                className="form-select form-select-sm"
                                                value={r.status || "new"}
                                                onChange={(e) =>
                                                    updateStatus(
                                                        r._id,
                                                        e.target.value
                                                    )
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
                                    <td className="small">
                                        <div className="d-flex gap-1">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => setSelectedRequest(r)}
                                            >
                                                👁
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(r._id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Модалка детального просмотра/редактирования */}
                {selectedRequest && (
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        onClick={() => setSelectedRequest(null)}
                    >
                        <div
                            className="modal-dialog modal-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Детали заявки #{selectedRequest._id?.slice(-6)}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSelectedRequest(null)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="bg-light rounded p-3">
                                                <div className="row g-2">
                                                    <div className="col-md-6">
                                                        <strong className="small">Организация:</strong>
                                                        <div>{selectedRequest.companyName || selectedRequest.org}</div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <strong className="small">Дата создания:</strong>
                                                        <div>
                                                            {selectedRequest.createdAt
                                                                ? new Date(selectedRequest.createdAt).toLocaleString("ru-RU")
                                                                : "—"}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <strong className="small">Email:</strong>
                                                        <div>
                                                            <a href={`mailto:${selectedRequest.email}`}>{selectedRequest.email}</a>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <strong className="small">Телефон:</strong>
                                                        <div>
                                                            <a href={`tel:${selectedRequest.phone}`}>{selectedRequest.phone}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="row g-2">
                                                <div className="col-md-4">
                                                    <strong className="small text-muted">Программа:</strong>
                                                    <div>{selectedRequest.programId || "—"}</div>
                                                </div>
                                                <div className="col-md-4">
                                                    <strong className="small text-muted">Желаемая дата:</strong>
                                                    <div>{selectedRequest.eventDate || selectedRequest.wish || "—"}</div>
                                                </div>
                                                <div className="col-md-4">
                                                    <strong className="small text-muted">Участники:</strong>
                                                    <div>{selectedRequest.participantsCount || selectedRequest.people || 0} чел.</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <strong className="small text-muted">Текущий статус:</strong>
                                            <div className="mt-1">
                                                <span className={`badge ${
                                                    (selectedRequest.status || "new") === "new" ? "bg-info" :
                                                    (selectedRequest.status || "new") === "confirmed" ? "bg-success" :
                                                    (selectedRequest.status || "new") === "cancelled" ? "bg-danger" :
                                                    "bg-secondary"
                                                }`}>
                                                    {STATUS_OPTIONS.find((o) => o.value === (selectedRequest.status || "new"))?.label || "—"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <strong className="small text-muted">Комментарий клиента:</strong>
                                            <div className="p-2 bg-light rounded mt-1">
                                                {selectedRequest.comment || <em className="text-muted">Нет комментария</em>}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="small text-muted mb-1">
                                                <strong>Комментарий менеджера:</strong>
                                            </label>
                                            <textarea
                                                className="form-control form-control-sm"
                                                rows={4}
                                                placeholder="Добавьте комментарий для внутреннего использования..."
                                                value={selectedRequest.managerComment || selectedRequest.managerNote || ""}
                                                onChange={(e) =>
                                                    setSelectedRequest((prev) => ({
                                                        ...prev,
                                                        managerComment: e.target.value
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setSelectedRequest(null)}
                                    >
                                        Закрыть
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={async () => {
                                            try {
                                                const res = await fetch(
                                                    `${API_URL}/api/admin/requests/${selectedRequest._id}`,
                                                    {
                                                        method: "PATCH",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            Authorization: `Bearer ${token}`
                                                        },
                                                        body: JSON.stringify({
                                                            managerComment: selectedRequest.managerComment || selectedRequest.managerNote
                                                        })
                                                    }
                                                );

                                                if (res.ok) {
                                                    const updated = await res.json();
                                                    setItems((prev) =>
                                                        prev.map((item) =>
                                                            item._id === updated._id ? updated : item
                                                        )
                                                    );
                                                    setSelectedRequest(null);
                                                    alert("Заявка обновлена");
                                                } else {
                                                    throw new Error("Ошибка обновления");
                                                }
                                            } catch (err) {
                                                alert("Не удалось сохранить: " + err.message);
                                            }
                                        }}
                                    >
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
