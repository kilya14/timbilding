// src/pages/AdminCategoriesPage.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API_URL } from "../config.js";
import { getAdminToken } from "../utils/adminAuth.js";

export default function AdminCategoriesPage() {
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

    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        slug: "",
        title: "",
        description: "",
        icon: ""
    });

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`${API_URL}/api/admin/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка загрузки категорий");
            }

            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error("Ошибка загрузки категорий", err);
            setError(err.message || "Не удалось загрузить категории");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const onChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const resetForm = () => {
        setEditId(null);
        setForm({ slug: "", title: "", description: "", icon: "" });
    };

    const handleEditClick = (cat) => {
        setEditId(cat._id);
        setForm({
            slug: cat.slug || "",
            title: cat.title || "",
            description: cat.description || "",
            icon: cat.icon || ""
        });
        setSaveError("");
        setSaveOk(false);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить категорию?");
        if (!ok) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка удаления категории");
            }

            setItems((prev) => prev.filter((c) => c._id !== id));

            if (editId === id) {
                resetForm();
            }
        } catch (err) {
            console.error("Ошибка удаления категории", err);
            alert(err.message || "Не удалось удалить категорию");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveError("");
        setSaveOk(false);

        if (!form.title.trim() || !form.slug.trim()) {
            setSaveError("Нужно заполнить название и slug.");
            return;
        }

        const payload = {
            slug: form.slug.trim(),
            title: form.title.trim(),
            description: form.description.trim() || undefined,
            icon: form.icon.trim() || undefined
        };

        try {
            setSaving(true);

            let url = `${API_URL}/api/admin/categories`;
            let method = "POST";

            if (editId) {
                url = `${API_URL}/api/admin/categories/${editId}`;
                method = "PATCH";
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(
                    data.message ||
                    (editId ? "Ошибка обновления категории" : "Ошибка создания категории")
                );
            }

            const saved = await res.json();

            if (editId) {
                setItems((prev) =>
                    prev.map((c) => (c._id === saved._id ? saved : c))
                );
            } else {
                setItems((prev) => [saved, ...prev]);
            }

            setSaveOk(true);
            resetForm();
            setTimeout(() => setSaveOk(false), 2000);
        } catch (err) {
            console.error("Ошибка сохранения категории", err);
            setSaveError(err.message || "Не удалось сохранить категорию");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="py-4 py-md-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="h4 mb-1">Категории программ</h1>
                        <div className="small text-muted">
                            Управление категориями программ тимбилдинга.
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <a href="/admin" className="btn btn-sm btn-outline-secondary">
                            В админ-панель
                        </a>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={loadCategories}
                        >
                            Обновить
                        </button>
                    </div>
                </div>

                {/* Форма создания/редактирования */}
                <div className="mb-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h2 className="h6 mb-0">
                                    {editId ? "Редактирование категории" : "Новая категория"}
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
                                    <label className="form-label small mb-1">Slug *</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="quests"
                                        value={form.slug}
                                        onChange={onChange("slug")}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label small mb-1">Название *</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Квесты"
                                        value={form.title}
                                        onChange={onChange("title")}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label small mb-1">Иконка (опционально)</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="🎯"
                                        value={form.icon}
                                        onChange={onChange("icon")}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label small mb-1">Описание</label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={2}
                                        placeholder="Краткое описание категории..."
                                        value={form.description}
                                        onChange={onChange("description")}
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
                                                : "Добавить категорию"}
                                    </button>
                                    {saveOk && (
                                        <span className="small text-success">Сохранено</span>
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

                {loading && <div className="text-muted small mb-3">Загрузка...</div>}
                {error && <div className="alert alert-danger py-2">{error}</div>}

                {!loading && !error && items.length === 0 && (
                    <div className="text-muted small">
                        Пока нет ни одной категории. Добавьте первую через форму выше.
                    </div>
                )}

                {!loading && !error && items.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-sm align-middle">
                            <thead>
                            <tr>
                                <th>Slug</th>
                                <th>Название</th>
                                <th>Иконка</th>
                                <th>Описание</th>
                                <th style={{ width: 140 }}>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((cat) => (
                                <tr key={cat._id}>
                                    <td className="small text-muted">{cat.slug}</td>
                                    <td className="small">{cat.title}</td>
                                    <td className="small">{cat.icon || "—"}</td>
                                    <td className="small">
                                        {cat.description || (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                    <td className="small">
                                        <div className="d-flex gap-1">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleEditClick(cat)}
                                            >
                                                Изменить
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(cat._id)}
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
