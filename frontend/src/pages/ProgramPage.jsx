// src/pages/ProgramPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SignUpForm from "../sections/SignUpForm.jsx";

export default function ProgramPage() {
    const { slug } = useParams();

    // Берём программы из Redux
    const programs = useSelector((s) => s.programs.items || []);

    // Предполагаем, что в программе есть поле slug; если нет — временный fallback
    let program = programs.find((p) => p.slug === slug);

    if (!program && slug === "hungry-games") {
        // Fallback, чтобы страница точно работала даже до финальной настройки programsSlice
        program = {
            id: "hungry-games",
            slug: "hungry-games",
            title: "Голодные игры",
            shortDescription: "Командный квест по мотивам культовой антиутопии.",
            duration: "от 2 до 4 часов",
            peopleFrom: 20,
            priceFrom: "от 8000 руб./чел",
            format: "Выездной офлайн-квест",
            goals: [
                "Сплочение команды через совместное прохождение испытаний",
                "Развитие стратегического мышления и командного взаимодействия",
                "Проработка лидерства и распределения ролей в стрессовых условиях"
            ],
            structure: [
                "Вводная часть: знакомство с правилами и легендой",
                "Формирование команд и распределение ролей",
                "Серия испытаний и раундов с усложнением задач",
                "Финальная часть: совместный разбор, обратная связь, фиксация инсайтов"
            ]
        };
    }

    if (!program) {
        return (
            <div className="container py-5">
                <h1 className="h3 mb-3">Программа не найдена</h1>
                <p className="text-muted">Возможно, она была удалена или ссылка указана неверно.</p>
                <Link to="/" className="btn btn-secondary mt-2">На главную</Link>
            </div>
        );
    }

    return (
        <div className="py-4 py-md-5">
            <div className="container">
                {/* Хлебные крошки / возврат */}
                <div className="mb-3">
                    <Link to="/" className="small text-muted text-decoration-none">
                        ← На главную
                    </Link>
                </div>

                {/* Заголовок и основные параметры */}
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
                                    <div className="small text-muted">Количество участников</div>
                                    <div className="fw-semibold">от {program.peopleFrom} человек</div>
                                </div>
                            )}
                            {program.priceFrom && (
                                <div className="col-12 col-md-4">
                                    <div className="small text-muted">Стоимость</div>
                                    <div className="fw-semibold">{program.priceFrom}</div>
                                </div>
                            )}
                        </div>

                        {/* Цели / задачи программы */}
                        {program.goals && program.goals.length > 0 && (
                            <div className="mb-4">
                                <h2 className="h5 mb-2">Для чего подходит программа</h2>
                                <ul className="small text-muted mb-0">
                                    {program.goals.map((g, idx) => (
                                        <li key={idx}>{g}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Структура проведения */}
                        {program.structure && program.structure.length > 0 && (
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

                    {/* Боковая колонка с CTA */}
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
                                    const formBlock = document.getElementById("signup");
                                    if (formBlock) {
                                        formBlock.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                            >
                                Оставить заявку
                            </button>

                            <div className="small text-muted">
                                Мы подберём формат под задачи вашей команды и согласуем детали.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Реиспользуем уже готовую форму заявки прямо на странице программы */}
            <div className="mt-4">
                <SignUpForm />
            </div>
        </div>
    );
}
