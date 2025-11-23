// src/sections/ProgramsTeaser.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_URL } from "../config.js";
import cardQuest from "../assets/images/group3.png";
import programsQuiz from "../assets/images/group1.png";

export default function ProgramsTeaser() {
    // Redux как базовый источник
    const programsStore = useSelector((s) => s.programs.items || []);
    // API как более свежий источник
    const [apiPrograms, setApiPrograms] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch(`${API_URL}/api/programs`);
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setApiPrograms(data);
                }
            } catch (e) {
                console.error("Ошибка загрузки программ для витрины:", e);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // Выбор основной программы: API → Redux → дефолт
    const mainProgram =
        apiPrograms[0] ||
        programsStore[0] || {
            slug: "hungry-games",
            title: "Голодные игры"
        };

    const slug = mainProgram.slug || "hungry-games";
    const title = mainProgram.title || "Голодные игры";

    return (
        <section id="programs" className="py-4 py-md-5">
            <div className="container">
                <div className="row g-4 align-items-center">
                    <div className="col-12 col-lg-6 order-2 order-lg-1">
                        <h2 className="mb-3">
                            Выездные <span className="hand">квесты</span>
                        </h2>

                        <div
                            className="position-relative rounded-4 overflow-hidden shadow-sm"
                            style={{ maxWidth: 560 }}
                        >
                            <img src={cardQuest} className="w-100" alt={title} />
                            <div className="position-absolute top-0 start-0 m-2 chip">
                                {mainProgram.peopleFrom
                                    ? `от ${mainProgram.peopleFrom} чел.`
                                    : "от 20 чел."}
                            </div>
                            <div className="position-absolute top-0 end-0 m-2 chip">
                                {mainProgram.priceFrom || "от 8000 руб./чел"}
                            </div>
                        </div>
                        <div className="small text-muted mt-2">{title}</div>

                        <div className="mt-3 d-flex gap-2">
                            <Link to={`/programs/${slug}`} className="btn cta">
                                Подробнее
                            </Link>
                            <a href="#signup" className="btn btn-outline-secondary">
                                Подать заявку
                            </a>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 order-1 order-lg-2 text-center">
                        <img
                            src={programsQuiz}
                            className="img-fluid"
                            alt="Квесты"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
