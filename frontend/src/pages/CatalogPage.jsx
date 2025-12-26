// src/pages/CatalogPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_URL } from "../config.js";

export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get("category") || "all";

    const [categories, setCategories] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, [categoryFilter]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            // Загружаем категории
            const catRes = await fetch(`${API_URL}/api/public/categories`);
            if (catRes.ok) {
                const catData = await catRes.json();
                setCategories(catData);
            }

            // Загружаем программы с фильтром
            let programsUrl = `${API_URL}/api/public/programs`;
            if (categoryFilter !== "all") {
                programsUrl += `?categoryId=${categoryFilter}`;
            }

            const progRes = await fetch(programsUrl);
            if (!progRes.ok) {
                throw new Error("Ошибка загрузки программ");
            }

            const progData = await progRes.json();
            setPrograms(progData);
        } catch (err) {
            console.error("Ошибка загрузки каталога", err);
            setError(err.message || "Не удалось загрузить каталог");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId) => {
        if (categoryId === "all") {
            setSearchParams({});
        } else {
            setSearchParams({ category: categoryId });
        }
    };

    return (
        <section className="py-4 py-md-5" style={{ minHeight: '60vh' }}>
            <div className="container">
                <h1 className="h3 mb-3">Каталог программ</h1>

                {/* Фильтр по категориям */}
                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-2">
                        <button
                            className={`btn btn-sm ${
                                categoryFilter === "all"
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                            }`}
                            onClick={() => handleCategoryChange("all")}
                        >
                            Все программы
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                className={`btn btn-sm ${
                                    categoryFilter === cat._id
                                        ? "btn-primary"
                                        : "btn-outline-secondary"
                                }`}
                                onClick={() => handleCategoryChange(cat._id)}
                            >
                                {cat.icon && <span className="me-1">{cat.icon}</span>}
                                {cat.title}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                {!loading && !error && programs.length === 0 && (
                    <div className="text-center py-5 text-muted">
                        <p>В этой категории пока нет программ.</p>
                    </div>
                )}

                {!loading && !error && programs.length > 0 && (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {programs.map((p) => {
                            const locationLabels = {
                                indoor: "В помещении",
                                outdoor: "На улице",
                                online: "Онлайн",
                                hybrid: "Гибрид"
                            };

                            const difficultyLabels = {
                                easy: "Легкая",
                                medium: "Средняя",
                                hard: "Сложная"
                            };

                            return (
                                <div key={p._id} className="col">
                                    <div className="card h-100 border-0 shadow-sm rounded-4">
                                        {p.coverImage && (
                                            <img
                                                src={p.coverImage}
                                                className="card-img-top rounded-top-4"
                                                alt={p.title}
                                                style={{ height: 220, objectFit: "cover" }}
                                            />
                                        )}
                                        <div className="card-body d-flex flex-column">
                                            <div className="mb-2">
                                                {p.categoryId?.title && (
                                                    <span className="badge bg-primary bg-opacity-10 text-primary small me-2">
                                                        {p.categoryId.title}
                                                    </span>
                                                )}
                                                {p.difficulty && (
                                                    <span className="badge bg-secondary bg-opacity-10 text-secondary small">
                                                        {difficultyLabels[p.difficulty] || p.difficulty}
                                                    </span>
                                                )}
                                            </div>

                                            <h5 className="card-title h6 mb-2">{p.title}</h5>

                                            {p.shortDescription && (
                                                <p className="card-text small text-muted mb-3">
                                                    {p.shortDescription.length > 120
                                                        ? p.shortDescription.substring(0, 120) + "..."
                                                        : p.shortDescription}
                                                </p>
                                            )}

                                            <div className="mb-3 small text-muted">
                                                {p.durationMinutes && (
                                                    <div className="mb-1">
                                                        <strong>⏱️ Длительность:</strong>{" "}
                                                        {Math.floor(p.durationMinutes / 60)} ч{" "}
                                                        {p.durationMinutes % 60 > 0 && `${p.durationMinutes % 60} мин`}
                                                    </div>
                                                )}
                                                {p.recommendedParticipants && (
                                                    <div className="mb-1">
                                                        <strong>👥 Участники:</strong> {p.minParticipants || 10}–{p.maxParticipants || 100} чел.
                                                    </div>
                                                )}
                                                {p.location && (
                                                    <div className="mb-1">
                                                        <strong>📍 Локация:</strong>{" "}
                                                        {locationLabels[p.location] || p.location}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                                <Link
                                                    to={`/programs/${p.slug}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    Подробнее →
                                                </Link>
                                                {(p.pricePerPerson || p.basePrice) && (
                                                    <div className="text-end">
                                                        <div className="fw-bold text-primary">
                                                            {p.pricePerPerson
                                                                ? `от ${p.pricePerPerson.toLocaleString()} ₽/чел`
                                                                : `от ${p.basePrice.toLocaleString()} ₽`}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
