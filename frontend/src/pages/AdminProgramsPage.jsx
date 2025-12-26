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
    const [viewProgram, setViewProgram] = useState(null); // для модального окна просмотра

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        slug: "",
        title: "",
        categoryId: "",
        shortDescription: "",
        fullDescription: "",
        minParticipants: "10",
        maxParticipants: "100",
        recommendedParticipants: "20",
        durationMinutes: "",
        location: "outdoor",
        difficulty: "medium",
        physicalActivity: "medium",
        coverImage: "",
        basePrice: "",
        pricePerPerson: "",
        position: "0",
        active: true,
        featured: false,
        goalsText: "",
        structureText: "",
        includedText: "",
        tagsText: "",
        suitableForText: "",
        outcomesText: ""
    });

    const loadCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            console.error("Ошибка загрузки категорий", err);
        }
    };

    const loadPrograms = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`${API_URL}/api/admin/programs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
        loadCategories();
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
            categoryId: "",
            shortDescription: "",
            fullDescription: "",
            minParticipants: "10",
            maxParticipants: "100",
            recommendedParticipants: "20",
            durationMinutes: "",
            location: "outdoor",
            difficulty: "medium",
            physicalActivity: "medium",
            coverImage: "",
            basePrice: "",
            pricePerPerson: "",
            position: "0",
            active: true,
            featured: false,
            goalsText: "",
            structureText: "",
            includedText: "",
            tagsText: "",
            suitableForText: "",
            outcomesText: ""
        });
    };

    const handleEditClick = (p) => {
        setEditId(p._id);
        setForm({
            slug: p.slug || "",
            title: p.title || "",
            categoryId: p.categoryId?._id || p.categoryId || "",
            shortDescription: p.shortDescription || "",
            fullDescription: p.fullDescription || "",
            minParticipants: String(p.minParticipants ?? 10),
            maxParticipants: String(p.maxParticipants ?? 100),
            recommendedParticipants: String(p.recommendedParticipants ?? 20),
            durationMinutes: p.durationMinutes ? String(p.durationMinutes) : "",
            location: p.location || "outdoor",
            difficulty: p.difficulty || "medium",
            physicalActivity: p.physicalActivity || "medium",
            coverImage: p.coverImage || "",
            basePrice: p.basePrice ? String(p.basePrice) : "",
            pricePerPerson: p.pricePerPerson ? String(p.pricePerPerson) : "",
            position: String(p.position ?? 0),
            active: p.active !== undefined ? p.active : true,
            featured: p.featured || false,
            goalsText: Array.isArray(p.goals) ? p.goals.join("\n") : "",
            structureText: Array.isArray(p.structure) ? p.structure.join("\n") : "",
            includedText: Array.isArray(p.included) ? p.included.join("\n") : "",
            tagsText: Array.isArray(p.tags) ? p.tags.join(", ") : "",
            suitableForText: Array.isArray(p.suitableFor) ? p.suitableFor.join("\n") : "",
            outcomesText: Array.isArray(p.outcomes) ? p.outcomes.join("\n") : ""
        });
        setSaveError("");
        setSaveOk(false);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить программу?");
        if (!ok) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/programs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка удаления программы");
            }
            setItems((prev) => prev.filter((p) => p._id !== id));
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
            categoryId: form.categoryId || undefined,
            shortDescription: form.shortDescription.trim() || undefined,
            fullDescription: form.fullDescription.trim() || undefined,
            minParticipants: form.minParticipants ? Number(form.minParticipants) : 10,
            maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : 100,
            recommendedParticipants: form.recommendedParticipants ? Number(form.recommendedParticipants) : 20,
            durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
            location: form.location || "outdoor",
            difficulty: form.difficulty || "medium",
            physicalActivity: form.physicalActivity || "medium",
            coverImage: form.coverImage.trim() || undefined,
            basePrice: form.basePrice ? Number(form.basePrice) : undefined,
            pricePerPerson: form.pricePerPerson ? Number(form.pricePerPerson) : undefined,
            position: form.position ? Number(form.position) : 0,
            active: form.active,
            featured: form.featured || false,
            goals: form.goalsText
                ? form.goalsText.split("\n").map((s) => s.trim()).filter(Boolean)
                : undefined,
            structure: form.structureText
                ? form.structureText.split("\n").map((s) => s.trim()).filter(Boolean)
                : undefined,
            included: form.includedText
                ? form.includedText.split("\n").map((s) => s.trim()).filter(Boolean)
                : undefined,
            tags: form.tagsText
                ? form.tagsText.split(",").map((s) => s.trim()).filter(Boolean)
                : undefined,
            suitableFor: form.suitableForText
                ? form.suitableForText.split("\n").map((s) => s.trim()).filter(Boolean)
                : undefined,
            outcomes: form.outcomesText
                ? form.outcomesText.split("\n").map((s) => s.trim()).filter(Boolean)
                : undefined
        };

        try {
            setSaving(true);

            let url = `${API_URL}/api/admin/programs`;
            let method = "POST";

            if (editId) {
                url = `${API_URL}/api/admin/programs/${editId}`;
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
                                <div className="col-12 col-md-3">
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
                                <div className="col-12 col-md-5">
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
                                <div className="col-12 col-md-4">
                                    <label className="form-label small mb-1">Категория</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.categoryId}
                                        onChange={onChange("categoryId")}
                                    >
                                        <option value="">Без категории</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                    </select>
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
                                <div className="col-12">
                                    <label className="form-label small mb-1">
                                        Полное описание
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={3}
                                        placeholder="Детальное описание программы..."
                                        value={form.fullDescription}
                                        onChange={onChange("fullDescription")}
                                    />
                                </div>

                                <div className="col-6 col-md-2">
                                    <label className="form-label small mb-1">Мин. участников</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="10"
                                        value={form.minParticipants}
                                        onChange={onChange("minParticipants")}
                                    />
                                </div>
                                <div className="col-6 col-md-2">
                                    <label className="form-label small mb-1">Макс. участников</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="100"
                                        value={form.maxParticipants}
                                        onChange={onChange("maxParticipants")}
                                    />
                                </div>
                                <div className="col-6 col-md-2">
                                    <label className="form-label small mb-1">Рекоменд.</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="20"
                                        value={form.recommendedParticipants}
                                        onChange={onChange("recommendedParticipants")}
                                    />
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">
                                        Длительность (мин)
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="180"
                                        value={form.durationMinutes}
                                        onChange={onChange("durationMinutes")}
                                    />
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">Локация</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.location}
                                        onChange={onChange("location")}
                                    >
                                        <option value="indoor">В помещении</option>
                                        <option value="outdoor">На улице</option>
                                        <option value="online">Онлайн</option>
                                        <option value="hybrid">Гибрид</option>
                                    </select>
                                </div>

                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">Сложность</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.difficulty}
                                        onChange={onChange("difficulty")}
                                    >
                                        <option value="easy">Легкая</option>
                                        <option value="medium">Средняя</option>
                                        <option value="hard">Сложная</option>
                                    </select>
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">Физ. активность</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.physicalActivity}
                                        onChange={onChange("physicalActivity")}
                                    >
                                        <option value="low">Низкая</option>
                                        <option value="medium">Средняя</option>
                                        <option value="high">Высокая</option>
                                    </select>
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">
                                        Базовая цена (руб)
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="50000"
                                        value={form.basePrice}
                                        onChange={onChange("basePrice")}
                                    />
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">
                                        Цена за чел. (руб)
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="2000"
                                        value={form.pricePerPerson}
                                        onChange={onChange("pricePerPerson")}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Обложка (URL изображения)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="https://..."
                                        value={form.coverImage}
                                        onChange={onChange("coverImage")}
                                    />
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">
                                        Позиция (сортировка)
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="0"
                                        value={form.position}
                                        onChange={onChange("position")}
                                    />
                                </div>
                                <div className="col-6 col-md-3">
                                    <label className="form-label small mb-1">
                                        Видимость
                                    </label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.active ? "true" : "false"}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                active: e.target.value === "true"
                                            }))
                                        }
                                    >
                                        <option value="true">Показать</option>
                                        <option value="false">Скрыть</option>
                                    </select>
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Цели программы (каждая с новой строки)
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={3}
                                        placeholder={`Сплочение команды\nРазвитие коммуникации\nПовышение мотивации`}
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
                                        placeholder={`Знакомство и разминка\nОсновная часть - квест\nПодведение итогов`}
                                        value={form.structureText}
                                        onChange={onChange("structureText")}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Что включено (каждый пункт с новой строки)
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={3}
                                        placeholder={`Ведущий программы\nВсе необходимое оборудование\nРеквизит и материалы`}
                                        value={form.includedText}
                                        onChange={onChange("includedText")}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Для кого подходит (каждый пункт с новой строки)
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={3}
                                        placeholder={`Офисные команды\nОтделы продаж\nIT-компании`}
                                        value={form.suitableForText}
                                        onChange={onChange("suitableForText")}
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Ожидаемые результаты (каждый с новой строки)
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={3}
                                        placeholder={`Улучшение взаимопонимания\nПовышение уровня доверия\nУкрепление команды`}
                                        value={form.outcomesText}
                                        onChange={onChange("outcomesText")}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label small mb-1">
                                        Теги (через запятую)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="квест, командная работа, активный отдых"
                                        value={form.tagsText}
                                        onChange={onChange("tagsText")}
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
                                                className="btn btn-sm btn-outline-info"
                                                onClick={() => setViewProgram(p)}
                                                title="Просмотр"
                                            >
                                                👁
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleEditClick(p)}
                                                title="Редактировать"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(p._id)}
                                                title="Удалить"
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

                {/* Модальное окно просмотра программы */}
                {viewProgram && (
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        onClick={() => setViewProgram(null)}
                    >
                        <div
                            className="modal-dialog modal-lg modal-dialog-scrollable"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Просмотр программы: {viewProgram.title}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setViewProgram(null)}
                                    />
                                </div>
                                <div className="modal-body">
                                    {viewProgram.coverImage && (
                                        <img
                                            src={viewProgram.coverImage}
                                            alt={viewProgram.title}
                                            className="img-fluid rounded mb-3"
                                            style={{ maxHeight: 300, objectFit: "cover", width: "100%" }}
                                        />
                                    )}

                                    <div className="row g-3">
                                        <div className="col-12">
                                            <strong>Slug:</strong>{" "}
                                            <span className="text-muted">{viewProgram.slug}</span>
                                        </div>
                                        <div className="col-12">
                                            <strong>Категория:</strong>{" "}
                                            {viewProgram.categoryId?.title || (
                                                <span className="text-muted">—</span>
                                            )}
                                        </div>
                                        <div className="col-12">
                                            <strong>Краткое описание:</strong>
                                            <p className="mb-0 text-muted">
                                                {viewProgram.shortDescription || "—"}
                                            </p>
                                        </div>
                                        <div className="col-12">
                                            <strong>Полное описание:</strong>
                                            <p className="mb-0 text-muted">
                                                {viewProgram.fullDescription || "—"}
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <strong>Продолжительность:</strong>{" "}
                                            {viewProgram.duration || "—"}
                                        </div>
                                        <div className="col-6">
                                            <strong>Участники:</strong>{" "}
                                            {viewProgram.recommendedParticipants
                                                ? `от ${viewProgram.recommendedParticipants} чел.`
                                                : "—"}
                                        </div>
                                        <div className="col-6">
                                            <strong>Цена:</strong>{" "}
                                            {viewProgram.basePrice || "—"}
                                        </div>
                                        <div className="col-6">
                                            <strong>Формат:</strong>{" "}
                                            {viewProgram.format || "—"}
                                        </div>
                                        <div className="col-6">
                                            <strong>Позиция:</strong> {viewProgram.position ?? 0}
                                        </div>
                                        <div className="col-6">
                                            <strong>Видимость:</strong>{" "}
                                            {viewProgram.active ? (
                                                <span className="badge bg-success">Показать</span>
                                            ) : (
                                                <span className="badge bg-secondary">Скрыть</span>
                                            )}
                                        </div>

                                        {Array.isArray(viewProgram.goals) &&
                                            viewProgram.goals.length > 0 && (
                                                <div className="col-12">
                                                    <strong>Цели программы:</strong>
                                                    <ul className="mb-0 small text-muted">
                                                        {viewProgram.goals.map((g, i) => (
                                                            <li key={i}>{g}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        {Array.isArray(viewProgram.structure) &&
                                            viewProgram.structure.length > 0 && (
                                                <div className="col-12">
                                                    <strong>Структура программы:</strong>
                                                    <ol className="mb-0 small text-muted">
                                                        {viewProgram.structure.map((s, i) => (
                                                            <li key={i}>{s}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                            handleEditClick(viewProgram);
                                            setViewProgram(null);
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setViewProgram(null)}
                                    >
                                        Закрыть
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
