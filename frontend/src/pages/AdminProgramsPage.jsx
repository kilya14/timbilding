// src/pages/AdminProgramsPage.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../config.js";

export default function AdminProgramsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // создание
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [createOk, setCreateOk] = useState(false);

    // редактирование
    const [editing, setEditing] = useState(null); // объект программы или null
    const [editError, setEditError] = useState("");
    const [editOk, setEditOk] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

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

    const [editForm, setEditForm] = useState({
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

    const onEditChange = (field) => (e) => {
        const value = e.target.value;
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreateError("");
        setCreateOk(false);

        if (!form.slug.trim() || !form.title.trim()) {
            setCreateError("Нужно заполнить slug и название.");
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
            setCreating(true);
            const res = await fetch(`${API_URL}/api/programs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка создания программы");
            }

            const created = await res.json();
            setItems((prev) => [created, ...prev]);

            setCreateOk(true);
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

            setTimeout(() => setCreateOk(false), 2000);
        } catch (err) {
            console.error("Ошибка создания программы", err);
            setCreateError(err.message || "Не удалось создать программу");
        } finally {
            setCreating(false);
        }
    };

    const startEdit = (p) => {
        setEditError("");
        setEditOk(false);
        setEditing(p);
        setEditForm({
            slug: p.slug || "",
            title: p.title || "",
            shortDescription: p.shortDescription || "",
            duration: p.duration || "",
            peopleFrom: p.peopleFrom || "",
            priceFrom: p.priceFrom || "",
            format: p.format || "",
            goalsText: Array.isArray(p.goals) ? p.goals.join("\n") : "",
            structureText: Array.isArray(p.structure) ? p.structure.join("\n") : ""
        });
    };

    const cancelEdit = () => {
        setEditing(null);
        setEditError("");
        setEditOk(false);
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        if (!editing) return;

        setEditError("");
        setEditOk(false);

        if (!editForm.slug.trim() || !editForm.title.trim()) {
            setEditError("Нужно заполнить slug и название.");
            return;
        }

        const payload = {
            slug: editForm.slug.trim(),
            title: editForm.title.trim(),
            shortDescription: editForm.shortDescription.trim() || undefined,
            duration: editForm.duration.trim() || undefined,
            priceFrom: editForm.priceFrom.trim() || undefined,
            format: editForm.format.trim() || undefined,
            peopleFrom: editForm.peopleFrom ? Number(editForm.peopleFrom) : undefined,
            goals: editForm.goalsText
                ? editForm.goalsText
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [],
            structure: editForm.structureText
                ? editForm.structureText
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : []
        };

        try {
            setSavingEdit(true);
            const res = await fetch(`${API_URL}/api/programs/${editing._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка обновления программы");
            }

            const updated = await res.json();
            setItems((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
            setEditOk(true);
            setTimeout(() => setEditOk(false), 2000);
        } catch (err) {
            console.error("Ошибка обновления программы", err);
            setEditError(err.message || "Не удалось обновить программу");
        } finally {
            setSavingEdit(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить программу?")) return;
        try {
            setDeletingId(id);
            const res = await fetch(`${API_URL}/api/programs/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка удаления программы");
            }
            setItems((prev) => prev.filter((p) => p._id !== id));
            if (editing && editing._id === id) {
                cancelEdit();
            }
        } catch (err) {
            console.error("Ошибка удаления программы", err);
            alert(err.message || "Не удалось удалить программу");
        } finally {
            setDeletingId(null);
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
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={loadPrograms}
                    >
                        Обновить
                    </button>
                </div>

                {/* Форма создания новой программы */}
                <div className="mb-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <h2 className="h6 mb-3">Новая программа</h2>
                            <form className="row g-2" onSubmit={handleCreate}>
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
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Выездной квест для команд по мотивам антиутопии..."
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
                                    <label className="form-label small mb-1">Формат</label>
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
                                        disabled={creating}
                                    >
                                        {creating ? "Сохраняем..." : "Добавить программу"}
                                    </button>
                                    {createOk && (
                                        <span className="small text-success">
                      Программа добавлена
                    </span>
                                    )}
                                </div>

                                {createError && (
                                    <div className="col-12">
                                        <div className="alert alert-danger py-2 mb-0">
                                            {createError}
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
                    <div className="table-responsive mb-4">
                        <table className="table table-sm align-middle">
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th>Slug</th>
                                <th>Формат</th>
                                <th>Участники</th>
                                <th>Продолжительность</th>
                                <th>Цена</th>
                                <th style={{ width: 150 }}>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((p) => (
                                <tr key={p._id}>
                                    <td className="small">{p.title}</td>
                                    <td className="small text-muted">{p.slug}</td>
                                    <td className="small">
                                        {p.format || <span className="text-muted">—</span>}
                                    </td>
                                    <td className="small">
                                        {p.peopleFrom ? (
                                            <>от {p.peopleFrom} чел.</>
                                        ) : (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                    <td className="small">
                                        {p.duration || <span className="text-muted">—</span>}
                                    </td>
                                    <td className="small">
                                        {p.priceFrom || <span className="text-muted">—</span>}
                                    </td>
                                    <td className="small">
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => startEdit(p)}
                                            >
                                                Изменить
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(p._id)}
                                                disabled={deletingId === p._id}
                                            >
                                                {deletingId === p._id ? "..." : "Удалить"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Форма редактирования выбранной программы */}
                {editing && (
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h2 className="h6 mb-0">
                                    Редактирование программы: {editing.title}
                                </h2>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={cancelEdit}
                                >
                                    Закрыть
                                </button>
                            </div>

                            <form className="row g-2" onSubmit={handleEditSave}>
                                <div className="col-12 col-md-4">
                                    <label className="form-label small mb-1">Slug *</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editForm.slug}
                                        onChange={onEditChange("slug")}
                                    />
                                </div>
                                <div className="col-12 col-md-8">
                                    <label className="form-label small mb-1">Название *</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editForm.title}
                                        onChange={onEditChange("title")}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label small mb-1">
                                        Краткое описание
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editForm.shortDescription}
                                        onChange={onEditChange("shortDescription")}
                                    />
                                </div>

                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">
                                        Продолжительность
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editForm.duration}
                                        onChange={onEditChange("duration")}
                                    />
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">
                                        От скольки человек
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={editForm.peopleFrom}
                                        onChange={onEditChange("peopleFrom")}
                                    />
                                </div>
                                <div className="col-12 col-md-3">
                                    <label className="form-label small mb-1">
                                        Цена (кратко)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editForm.priceFrom}
                                        onChange={onEditChange("priceFrom")}
                                    />
                                </div>
                                <div className="col-12 col-md-3">
                                    <label className="form-label small mb-1">Формат</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editForm.format}
                                        onChange={onEditChange("format")}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Цели программы (каждая с новой строки)
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={3}
                                        value={editForm.goalsText}
                                        onChange={onEditChange("goalsText")}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Структура (каждый шаг с новой строки)
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={3}
                                        value={editForm.structureText}
                                        onChange={onEditChange("structureText")}
                                    />
                                </div>

                                <div className="col-12 d-flex align-items-center gap-2 mt-1">
                                    <button
                                        type="submit"
                                        className="btn btn-sm btn-primary"
                                        disabled={savingEdit}
                                    >
                                        {savingEdit ? "Сохраняем..." : "Сохранить изменения"}
                                    </button>
                                    {editOk && (
                                        <span className="small text-success">
                      Изменения сохранены
                    </span>
                                    )}
                                </div>

                                {editError && (
                                    <div className="col-12">
                                        <div className="alert alert-danger py-2 mb-0">
                                            {editError}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
