// src/pages/ProgramPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../config.js";

export default function ProgramPage() {
    const { slug } = useParams();
    const programsFromRedux = useSelector((s) => s.programs.items || []);

    const baseProgram = programsFromRedux.find(
        (p) => p.slug === slug || p.code === slug
    );

    const [program, setProgram] = useState(baseProgram || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (slug) {
            load();
        }
    }, [slug]);

    async function load() {
        setError("");

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/public/programs/${slug}`);
            if (!res.ok) {
                if (!baseProgram) {
                    if (res.status === 404) {
                        setError("Программа не найдена");
                    } else {
                        setError("Ошибка загрузки программы");
                    }
                }
                return;
            }

            const data = await res.json();
            setProgram(data);
        } catch (err) {
            console.error("Ошибка загрузки программы", err);
            if (!baseProgram) {
                setError("Не удалось загрузить программу");
            }
        } finally {
            setLoading(false);
        }
    }

    if (error) {
        return (
            <div className="py-5 text-center">
                <div className="container">
                    <h2 className="mb-3">{error}</h2>
                    <Link to="/catalog" className="btn btn-primary">
                        Вернуться в каталог
                    </Link>
                </div>
            </div>
        );
    }

    if (!program || !program.title) {
        return (
            <div className="py-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>
            </div>
        );
    }

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

    const activityLabels = {
        low: "Низкая",
        medium: "Средняя",
        high: "Высокая"
    };

    return (
        <div className="py-4 py-md-5" style={{ minHeight: '60vh' }}>
            <div className="container">
                <nav className="mb-4 d-flex justify-content-between align-items-center" aria-label="breadcrumb">
                    <div className="d-flex gap-2 align-items-center small">
                        <Link to="/" className="text-decoration-none text-muted">
                            Главная
                        </Link>
                        <span className="text-muted">/</span>
                        <Link to="/catalog" className="text-decoration-none text-muted">
                            Каталог
                        </Link>
                        <span className="text-muted">/</span>
                        <span className="text-dark">{program.title}</span>
                    </div>
                    {loading && (
                        <span className="small text-muted">Обновляем данные…</span>
                    )}
                </nav>

                <div className="row g-4 align-items-start">
                    <div className="col-12 col-lg-8">
                        {program.coverImage && (
                            <img
                                src={program.coverImage}
                                alt={program.title}
                                className="img-fluid rounded-4 mb-4"
                                style={{ maxHeight: 400, width: '100%', objectFit: 'cover' }}
                            />
                        )}

                        <div className="mb-3">
                            {program.categoryId?.title && (
                                <span className="badge bg-primary me-2">
                                    {program.categoryId.title}
                                </span>
                            )}
                            {program.difficulty && (
                                <span className="badge bg-secondary me-2">
                                    {difficultyLabels[program.difficulty] || program.difficulty}
                                </span>
                            )}
                            {program.location && (
                                <span className="badge bg-info">
                                    {locationLabels[program.location] || program.location}
                                </span>
                            )}
                        </div>

                        <h1 className="h3 mb-3">{program.title}</h1>

                        {program.shortDescription && (
                            <p className="lead text-muted mb-4">{program.shortDescription}</p>
                        )}

                        {program.fullDescription && (
                            <div className="mb-4">
                                <p style={{ whiteSpace: 'pre-line' }}>{program.fullDescription}</p>
                            </div>
                        )}

                        <div className="row g-3 mb-4">
                            {program.durationMinutes && (
                                <div className="col-6 col-md-3">
                                    <div className="border rounded-3 p-3 text-center">
                                        <div className="fs-4 mb-1">⏱️</div>
                                        <div className="small text-muted">Длительность</div>
                                        <div className="fw-bold">
                                            {Math.floor(program.durationMinutes / 60)} ч{" "}
                                            {program.durationMinutes % 60 > 0 && `${program.durationMinutes % 60} мин`}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {program.minParticipants && program.maxParticipants && (
                                <div className="col-6 col-md-3">
                                    <div className="border rounded-3 p-3 text-center">
                                        <div className="fs-4 mb-1">👥</div>
                                        <div className="small text-muted">Участники</div>
                                        <div className="fw-bold">{program.minParticipants}–{program.maxParticipants} чел.</div>
                                    </div>
                                </div>
                            )}
                            {program.physicalActivity && (
                                <div className="col-6 col-md-3">
                                    <div className="border rounded-3 p-3 text-center">
                                        <div className="fs-4 mb-1">💪</div>
                                        <div className="small text-muted">Активность</div>
                                        <div className="fw-bold">
                                            {activityLabels[program.physicalActivity] || program.physicalActivity}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(program.pricePerPerson || program.basePrice) && (
                                <div className="col-6 col-md-3">
                                    <div className="border rounded-3 p-3 text-center bg-primary bg-opacity-10">
                                        <div className="fs-4 mb-1">💰</div>
                                        <div className="small text-muted">Стоимость</div>
                                        <div className="fw-bold text-primary">
                                            {program.pricePerPerson
                                                ? `от ${program.pricePerPerson.toLocaleString()} ₽/чел`
                                                : `от ${program.basePrice.toLocaleString()} ₽`}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {Array.isArray(program.goals) && program.goals.length > 0 && (
                            <div className="mb-4">
                                <h2 className="h5 mb-3">🎯 Цели программы</h2>
                                <ul className="list-unstyled">
                                    {program.goals.map((g, i) => (
                                        <li key={i} className="mb-2 d-flex align-items-start">
                                            <span className="text-primary me-2">✓</span>
                                            <span>{g}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {Array.isArray(program.structure) && program.structure.length > 0 && (
                            <div className="mb-4">
                                <h2 className="h5 mb-3">📋 Структура мероприятия</h2>
                                <ol className="ps-3">
                                    {program.structure.map((s, i) => (
                                        <li key={i} className="mb-2">{s}</li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {Array.isArray(program.included) && program.included.length > 0 && (
                            <div className="mb-4">
                                <h2 className="h5 mb-3">📦 Что входит в программу</h2>
                                <ul className="list-unstyled">
                                    {program.included.map((item, i) => (
                                        <li key={i} className="mb-2 d-flex align-items-start">
                                            <span className="text-success me-2">✓</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {Array.isArray(program.outcomes) && program.outcomes.length > 0 && (
                            <div className="mb-4">
                                <h2 className="h5 mb-3">🎁 Ожидаемые результаты</h2>
                                <div className="row g-2">
                                    {program.outcomes.map((outcome, i) => (
                                        <div key={i} className="col-12 col-md-6">
                                            <div className="p-3 bg-light rounded-3">
                                                <small>{outcome}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {Array.isArray(program.suitableFor) && program.suitableFor.length > 0 && (
                            <div className="mb-4">
                                <h2 className="h5 mb-3">👔 Для кого подходит</h2>
                                <div className="d-flex flex-wrap gap-2">
                                    {program.suitableFor.map((item, i) => (
                                        <span key={i} className="badge bg-secondary bg-opacity-10 text-dark py-2 px-3">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="p-4 rounded-4 bg-light sticky-top" style={{ top: '2rem' }}>
                            <h3 className="h5 mb-3">Оставить заявку</h3>

                            {(program.pricePerPerson || program.basePrice) && (
                                <div className="mb-3">
                                    <div className="h4 text-primary mb-0">
                                        {program.pricePerPerson
                                            ? `от ${program.pricePerPerson.toLocaleString()} ₽/чел`
                                            : `от ${program.basePrice.toLocaleString()} ₽`}
                                    </div>
                                </div>
                            )}

                            <a
                                href="/#signup"
                                className="btn btn-primary w-100 mb-3"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = "/#signup";
                                }}
                            >
                                Подать заявку
                            </a>

                            <div className="small text-muted">
                                <div className="mb-2">
                                    <strong>📞 Телефон:</strong><br />
                                    +7 (495) 123-45-67
                                </div>
                                <div className="mb-2">
                                    <strong>📧 Email:</strong><br />
                                    info@teambuilding.ru
                                </div>
                                <div>
                                    Свяжитесь с нами для уточнения деталей и персонального предложения
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
