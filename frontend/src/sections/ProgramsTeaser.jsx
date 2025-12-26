import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config.js";
import cardQuest from "../assets/images/group3.png";
import programsQuiz from "../assets/images/group1.png";

function toNum(v) {
    if (v === null || v === undefined) return null;
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    if (typeof v === "string") {
        const n = Number(v.replace(/\s/g, "").replace(",", "."));
        return Number.isFinite(n) ? n : null;
    }
    return null;
}

function formatPeople(program) {
    const val = program?.recommendedParticipants ?? program?.peopleFrom ?? program?.minParticipants;
    const n = toNum(val);
    if (n !== null) return `от ${n} чел.`;
    if (typeof val === "string" && val.trim()) return `от ${val} чел.`;
    return "от 10 чел.";
}

function formatPrice(program) {
    const val = program?.pricePerPerson ?? program?.basePrice ?? program?.priceFrom ?? program?.price;
    if (val === null || val === undefined || val === "") return "Цена по запросу";

    if (typeof val === "string" && /(руб|₽|сом|kzt|\$|€)/i.test(val)) return val;

    const n = toNum(val);
    if (n === null) return "Цена по запросу";

    return `от ${new Intl.NumberFormat("ru-RU").format(Math.round(n))} ₽/чел`;
}

function formatDuration(program) {
    // в твоих данных duration выглядит как "2" (часы) — делаем "2 ч"
    const val = program?.duration ?? program?.durationHours ?? program?.durationMinutes;
    if (val === null || val === undefined || val === "") return null;

    if (typeof val === "string" && /(мин|ч)/i.test(val)) return val;

    const n = toNum(val);
    if (n === null) return null;

    // если похоже на минуты (больше 10) — покажем в мин
    if (n > 10) return `${n} мин`;
    return `${n} ч`;
}

function normalizeProgram(p) {
    return {
        _id: p?._id,
        slug: (p?.slug ?? "").toString().trim(),
        title: (p?.title ?? p?.name ?? "").toString().trim(),
        shortDescription: p?.shortDescription ?? p?.description ?? "",
        coverImage: p?.coverImage ?? p?.image ?? p?.imageUrl ?? "",
        position: toNum(p?.position) ?? 0,
        active: p?.active !== false,
        raw: p,
    };
}

function sortPrograms(a, b) {
    if (a.position !== b.position) return a.position - b.position;
    return a.title.localeCompare(b.title, "ru");
}

export default function ProgramsTeaser() {
    const [raw, setRaw] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true);

                // ВАЖНО: один публичный источник
                const res = await fetch(`${API_URL}/api/public/programs`, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                const arr = Array.isArray(data) ? data : Array.isArray(data?.programs) ? data.programs : [];
                setRaw(arr);
            } catch (e) {
                if (e.name !== "AbortError") console.error("ProgramsTeaser load error:", e);
                setRaw([]);
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    const programs = useMemo(() => {
        return (raw || [])
            .map(normalizeProgram)
            .filter((p) => p.active)
            .filter((p) => p.slug.length >= 2)
            .filter((p) => p.title.length >= 2)
            // убираем мусор типа title="d"
            .filter((p) => !/^[a-zA-Zа-яА-Я]$/.test(p.title))
            .sort(sortPrograms);
    }, [raw]);

    if (loading) {
        return (
            <section id="programs" className="py-4 py-md-5">
                <div className="container text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            </section>
        );
    }

    if (!programs.length) {
        return (
            <section id="programs" className="py-4 py-md-5">
                <div className="container">
                    <h2 className="mb-3" style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
                        Наши <span className="hand text-primary">программы</span>
                    </h2>
                    <div className="text-muted">
                        Программы временно недоступны.{" "}
                        <Link to="/catalog" className="text-decoration-none">
                            Перейти в каталог →
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="programs" className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="container">
                <div className="row g-4 align-items-start">
                    {/* Левая часть: сетка карточек */}
                    <div className="col-12 col-lg-6">
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                            <h2 className="mb-0" style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
                                Наши <span className="hand text-primary">программы</span>
                            </h2>
                            <Link to="/catalog" className="btn btn-outline-secondary">
                                Каталог
                            </Link>
                        </div>

                        <div className="row g-3">
                            {programs.map((p) => {
                                const people = formatPeople(p.raw);
                                const price = formatPrice(p.raw);
                                const dur = formatDuration(p.raw);

                                return (
                                    <div className="col-12 col-md-6" key={p._id || p.slug}>
                                        <Link to={`/programs/${p.slug}`} className="text-decoration-none">
                                            <div className="program-card shadow-lg rounded-4 overflow-hidden bg-white">
                                                <div className="position-relative">
                                                    <img
                                                        src={p.coverImage || cardQuest}
                                                        alt={p.title}
                                                        className="w-100"
                                                        style={{ height: 220, objectFit: "cover", display: "block" }}
                                                        onError={(e) => (e.currentTarget.src = cardQuest)}
                                                    />

                                                    <div className="program-card__chips">
                                                        <span className="program-card__chip">{people}</span>
                                                        {dur ? <span className="program-card__chip">{dur}</span> : null}
                                                        <span className="program-card__chip">{price}</span>
                                                    </div>

                                                    <div
                                                        className="position-absolute bottom-0 start-0 end-0 p-3"
                                                        style={{
                                                            background:
                                                                "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))",
                                                        }}
                                                    >
                                                        <div className="text-white fw-bold">{p.title}</div>
                                                        {p.shortDescription ? (
                                                            <div className="text-white-50 small mt-1">
                                                                {String(p.shortDescription).slice(0, 90)}
                                                                {String(p.shortDescription).length > 90 ? "…" : ""}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="p-3 d-flex justify-content-between align-items-center">
                                                    <div className="text-muted small">Подробнее</div>
                                                    <div className="text-primary fw-semibold">→</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Правая часть: иллюстрация */}
                    <div className="col-12 col-lg-6 text-center">
                        <img
                            src={programsQuiz}
                            className="img-fluid"
                            alt="Тимбилдинг программы"
                            style={{ maxHeight: 600, borderRadius: 28 }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
