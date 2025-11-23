// src/pages/AdminProgramsPage.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API_URL } from "../config.js";
import { getAdminToken } from "../utils/adminAuth.js";

export default function AdminProgramsPage() {
    const token = getAdminToken();
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveOk, setSaveOk] = useState(false);

    const [editId, setEditId] = useState(null); // null = создаём, не null = редактируем

    const [form, setForm] = useState({
        slug: "",
        title: "",
        shortDescription: "",
        duration: "",
        peopleFrom: "",
        priceFrom: "",
        format: "",
        goalsText: "",
        structureText: ""
    });

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

    const onChange = (field) => (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setEditId(null);
        setForm({
            slug: "",
            title: "",
            shortDescription: "",
            duration: "",
            peopleFrom: "",
            priceFrom: "",
            format: "",
            goalsText: "",
            structureText: ""
        });
    };

    const handleEditClick = (p) => {
        setEditId(p._id);
        setForm({
            slug: p.slug || "",
            title: p.title || "",
            shortDescription: p.shortDescription || "",
            duration: p.duration || "",
            peopleFrom: p.peopleFrom || "",
            priceFrom: p.priceFrom || "",
            format: p.format || "",
            goalsText: Array.isArray(p.goals) ? p.goals.join("\n") : "",
            structureText: Array.isArray(p.structure)
                ? p.structure.join("\n")
                : ""
        });
        setSaveError("");
        setSaveOk(false);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить программу?");
        if (!ok) return;
        try {
            const res = await fetch(`${API_URL}/api/programs/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка удаления программы");
            }
            setItems((prev) => prev.filter((p) => p._id !== id));
            // если удаляем редактируемую — сброс формы
            if (editId === id) {
                resetForm();
            }
        } catch (err) {
            console.error("Ошибка удаления программы", err);
            alert(err.message || "Не удалось удалить программу");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveError("");
        setSaveOk(false);

        if (!form.slug.trim() || !form.title.trim()) {
            setSaveError("Нужно заполнить slug и название.");
            return;
        }

        const payload = {
            slug: form.slug.trim(),
            title: form.title.trim(),
            shortDescription: form.shortDescription.trim() || undefined,
            duration: form.duration.trim() || undefined,
            priceFrom: form.priceFrom.trim() || undefined,
            format: form.format.trim() || undefined,
            peopleFrom: form.peopleFrom ? Number(form.peopleFrom) : undefined,
            goals: form.goalsText
                ? form.goalsText
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : undefined,
            structure: form.structureText
                ? form.structureText
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : undefined
        };

        try {
            setSaving(true);

            let url = `${API_URL}/api/programs`;
            let method = "POST";

            if (editId) {
                url = `${API_URL}/api/programs/${editId}`;
                method = "PATCH";
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(
                    data.message ||
                    (editId
                        ? "Ошибка обновления программы"
                        : "Ошибка создания программы")
                );
            }

            const saved = await res.json();

            if (editId) {
                // обновляем в списке
                setItems((prev) =>
                    prev.map((p) => (p._id === saved._id ? saved : p))
                );
            } else {
                // добавляем в начало списка
                setItems((prev) => [saved, ...prev]);
            }

            setSaveOk(true);
            resetForm();
            setTimeout(() => setSaveOk(false), 2000);
        } catch (err) {
            console.error("Ошибка сохранения программы", err);
            setSaveError(err.message || "Не удалось сохранить программу");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                {/* Заголовок и кнопка обновления */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="h4 mb-1">Программы</h1>
                        <div className="small text-muted">
                            Список программ тимбилдинга из базы данных.
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <a
                            href="/admin"
                            className="btn btn-sm btn-outline-secondary"
                        >
                            В админ-панель
                        </a>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={loadPrograms}
                        >
                            Обновить
                        </button>
                    </div>
                </div>

                {/* Форма создания/редактирования программы */}
                <div className="mb-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h2 className="h6 mb-0">
                                    {editId
                                        ? "Редактирование программы"
                                        : "Новая программа"}
                                </h2>
                                {editId && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={resetForm}
                                    >
                                        Отмена
                                    </button>
                                )}
                            </div>

                            <form className="row g-2" onSubmit={handleSubmit}>
                                <div className="col-12 col-md-4">
                                    <label className="form-label small mb-1">
                                        Slug (латиницей, для URL) *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="hungry-games"
                                        value={form.slug}
                                        onChange={onChange("slug")}
                                    />
                                </div>
                                <div className="col-12 col-md-8">
                                    <label className="form-label small mb-1">
                                        Название программы *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Голодные игры"
                                        value={form.title}
                                        onChange={onChange("title")}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label small mb-1">
                                        Краткое описание
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={2}
                                        placeholder="Выездной квест для команд..."
                                        value={form.shortDescription}
                                        onChange={onChange("shortDescription")}
                                    />
                                </div>

                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">
                                        Продолжительность
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="2–4 часа"
                                        value={form.duration}
                                        onChange={onChange("duration")}
                                    />
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">
                                        От скольки человек
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="20"
                                        value={form.peopleFrom}
                                        onChange={onChange("peopleFrom")}
                                    />
                                </div>
                                <div className="col-12 col-md-3">
                                    <label className="form-label small mb-1">
                                        Цена (кратко)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="от 8000 руб./чел"
                                        value={form.priceFrom}
                                        onChange={onChange("priceFrom")}
                                    />
                                </div>
                                <div className="col-12 col-md-3">
                                    <label className="form-label small mb-1">
                                        Формат
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Выездной офлайн-квест"
                                        value={form.format}
                                        onChange={onChange("format")}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Цели программы (каждая с новой строки)
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={3}
                                        placeholder={`сплотить коллектив;\nотработать взаимодействие и доверие;`}
                                        value={form.goalsText}
                                        onChange={onChange("goalsText")}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Структура (каждый шаг с новой строки)
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={3}
                                        placeholder={`Вводная часть: легенда, цель, правила;\nОсновной блок: серия испытаний;`}
                                        value={form.structureText}
                                        onChange={onChange("structureText")}
                                    />
                                </div>

                                <div className="col-12 d-flex align-items-center gap-2 mt-1">
                                    <button
                                        type="submit"
                                        className="btn btn-sm btn-primary"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Сохраняем..."
                                            : editId
                                                ? "Сохранить изменения"
                                                : "Добавить программу"}
                                    </button>
                                    {saveOk && (
                                        <span className="small text-success">
                                            Сохранено
                                        </span>
                                    )}
                                </div>

                                {saveError && (
                                    <div className="col-12">
                                        <div className="alert alert-danger py-2 mb-0">
                                            {saveError}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Ошибки / загрузка списка */}
                {loading && <div className="text-muted small mb-3">Загрузка...</div>}
                {error && <div className="alert alert-danger py-2">{error}</div>}

                {!loading && !error && items.length === 0 && (
                    <div className="text-muted small">
                        Пока нет ни одной программы. Добавьте первую через форму выше.
                    </div>
                )}

                {/* Таблица программ */}
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
                                <th style={{ width: 140 }}>Действия</th>
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
                                            : (
                                                <span className="text-muted">—</span>
                                            )}
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
                                    <td className="small">
                                        <div className="d-flex gap-1">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleEditClick(p)}
                                            >
                                                Изменить
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(p._id)}
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
            </div>
        </section>
    );
}
