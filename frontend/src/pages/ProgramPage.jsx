// src/pages/ProgramPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../config.js";
import SignUpForm from "../sections/SignUpForm.jsx";

export default function ProgramPage() {
    const { slug } = useParams();

    const programs = useSelector((s) => s.programs.items || []);
    const baseProgram = programs.find((p) => p.slug === slug) || null;

    const [program, setProgram] = useState(baseProgram);
    const [loading, setLoading] = useState(!baseProgram);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setError("");

            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/programs/${slug}`);
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
                if (!cancelled) {
                    setProgram(data);
                }
            } catch (e) {
                console.error("Ошибка загрузки программы:", e);
                if (!baseProgram && !cancelled) {
                    setError("Не удалось загрузить программу");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [slug, baseProgram]);

    if (!program && error) {
        return (
            <div className="py-4 py-md-5">
                <div className="container">
                    <div className="mb-3">
                        <Link
                            to="/"
                            className="small text-muted text-decoration-none"
                        >
                            ← На главную
                        </Link>
                    </div>
                    <h1 className="h3 mb-3">Программа</h1>
                    <p className="text-muted mb-3">{error}</p>
                </div>
            </div>
        );
    }

    if (!program && !loading) {
        return (
            <div className="py-4 py-md-5">
                <div className="container">
                    <div className="mb-3">
                        <Link
                            to="/"
                            className="small text-muted text-decoration-none"
                        >
                            ← На главную
                        </Link>
                    </div>
                    <h1 className="h3 mb-3">Программа не найдена</h1>
                    <p className="text-muted">
                        Возможно, ссылка устарела или программа ещё не добавлена.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-4 py-md-5">
            <div className="container">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <Link
                        to="/"
                        className="small text-muted text-decoration-none"
                    >
                        ← На главную
                    </Link>
                    {loading && (
                        <span className="small text-muted">Обновляем данные…</span>
                    )}
                </div>

                <div className="row g-4 align-items-start">
                    <div className="col-12 col-lg-8">
                        <h1 className="mb-2">{program.title}</h1>

                        {program.shortDescription && (
                            <p className="text-muted">{program.shortDescription}</p>
                        )}

                        <div className="row g-2 mb-3">
                            {program.duration && (
                                <div className="col-12 col-md-4">
                                    <div className="small text-muted">Продолжительность</div>
                                    <div className="fw-semibold">{program.duration}</div>
                                </div>
                            )}
                            {program.peopleFrom && (
                                <div className="col-12 col-md-4">
                                    <div className="small text-muted">
                                        Количество участников
                                    </div>
                                    <div className="fw-semibold">
                                        от {program.peopleFrom} человек
                                    </div>
                                </div>
                            )}
                            {program.priceFrom && (
                                <div className="col-12 col-md-4">
                                    <div className="small text-muted">Стоимость</div>
                                    <div className="fw-semibold">
                                        {program.priceFrom}
                                    </div>
                                </div>
                            )}
                        </div>

                        {Array.isArray(program.goals) &&
                            program.goals.length > 0 && (
                                <div className="mb-4">
                                    <h2 className="h5 mb-2">
                                        Для чего подходит программа
                                    </h2>
                                    <ul className="small text-muted mb-0">
                                        {program.goals.map((g, idx) => (
                                            <li key={idx}>{g}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        {Array.isArray(program.structure) &&
                            program.structure.length > 0 && (
                                <div className="mb-4">
                                    <h2 className="h5 mb-2">Как проходит мероприятие</h2>
                                    <ol className="small text-muted mb-0">
                                        {program.structure.map((step, idx) => (
                                            <li key={idx}>{step}</li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="p-3 rounded-4 bg-light">
                            <div className="small text-muted mb-1">Формат</div>
                            <div className="fw-semibold mb-2">
                                {program.format || "Корпоративный тимбилдинг"}
                            </div>

                            <button
                                type="button"
                                className="cta w-100 mb-2"
                                onClick={() => {
                                    const formBlock =
                                        document.getElementById("signup");
                                    if (formBlock) {
                                        formBlock.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                    }
                                }}
                            >
                                Оставить заявку
                            </button>

                            <div className="small text-muted">
                                Мы подберём формат под задачи вашей команды и
                                согласуем детали.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <SignUpForm />
            </div>
        </div>
    );
}
