// src/sections/SignUpForm.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../config.js";
import timeImg from "../assets/images/time-zone.png";

export default function SignUpForm() {
    // берём дефолтные программы из Redux (на случай, если API недоступно)
    const programsStore = useSelector((s) => s.programs.items || []);
    const [apiPrograms, setApiPrograms] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch(`${API_URL}/api/public/programs`);
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setApiPrograms(data);
                }
            } catch (e) {
                console.error("Ошибка загрузки программ в форме заявки:", e);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // выбираем источник: API → Redux → дефолт
    const programs =
        apiPrograms.length > 0
            ? apiPrograms
            : programsStore.length > 0
                ? programsStore
                : [
                    {
                        slug: "hungry-games",
                        title: "Голодные игры"
                    }
                ];

    const [form, setForm] = useState({
        companyName: "",
        participantsCount: "",
        eventDate: "",
        email: "",
        phone: "",
        comment: "",
        programId: programs[0]?.slug || ""
    });
    const [ok, setOk] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (field) => (e) => {
        const value = e.target.value;
        setForm((f) => ({ ...f, [field]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setOk(false);

        if (!form.companyName || !form.email || !form.phone) {
            setError("Заполните организацию, email и телефон");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/public/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: form.companyName,
                    participantsCount: Number(form.participantsCount) || 0,
                    eventDate: form.eventDate,
                    email: form.email,
                    phone: form.phone,
                    comment: form.comment,
                    programId: form.programId
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка отправки заявки");
            }

            await res.json();
            setOk(true);
            setForm({
                companyName: "",
                participantsCount: "",
                eventDate: "",
                email: "",
                phone: "",
                comment: "",
                programId: programs[0]?.slug || ""
            });
            setTimeout(() => setOk(false), 2500);
        } catch (err) {
            console.error("Ошибка отправки заявки", err);
            setError(err.message || "Не удалось отправить заявку");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="signup" className="py-4 py-md-5 bg-light">
            <div className="container">
                <div className="row g-4 align-items-center">
                    <div className="col-12 col-lg-6">
                        <h2
                            className="hand"
                            style={{ fontSize: "clamp(28px,3.2vw,46px)" }}
                        >
                            Время <span className="fw-normal">записаться</span>
                        </h2>
                        <form className="d-grid gap-2" onSubmit={onSubmit}>
                            <input
                                className="form-pill"
                                placeholder="Наименование организации:"
                                value={form.companyName}
                                onChange={onChange("companyName")}
                            />
                            <div className="d-flex gap-2 flex-wrap">
                                <input
                                    className="form-pill flex-fill"
                                    placeholder="Количество участников:"
                                    value={form.participantsCount}
                                    onChange={onChange("participantsCount")}
                                />
                                <input
                                    className="form-pill flex-fill"
                                    placeholder="Желаемая дата:"
                                    value={form.eventDate}
                                    onChange={onChange("eventDate")}
                                />
                            </div>
                            <div className="d-flex gap-2 flex-wrap">
                                <input
                                    className="form-pill flex-fill"
                                    placeholder="Электронный адрес:"
                                    value={form.email}
                                    onChange={onChange("email")}
                                />
                                <input
                                    className="form-pill flex-fill"
                                    placeholder="Телефон:"
                                    value={form.phone}
                                    onChange={onChange("phone")}
                                />
                            </div>
                            <textarea
                                className="form-pill"
                                rows={3}
                                placeholder="Комментарий:"
                                value={form.comment}
                                onChange={onChange("comment")}
                            />
                            <select
                                className="form-pill form-select"
                                value={form.programId}
                                onChange={onChange("programId")}
                            >
                                {programs.map((p) => (
                                    <option key={p.slug || p.id} value={p.slug || p.id}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                            <div className="form-check small">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="agree"
                                    required
                                />
                                <label className="form-check-label" htmlFor="agree">
                                    Соглашаюсь на обработку персональных данных
                                </label>
                            </div>
                            <div>
                                <button className="cta" type="submit" disabled={loading}>
                                    {loading ? "Отправка..." : "Отправить"}
                                </button>
                            </div>
                            {error && (
                                <div className="alert alert-danger py-2 mb-0">{error}</div>
                            )}
                            {ok && (
                                <div className="alert alert-success py-2 mb-0">
                                    Заявка отправлена
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="col-12 col-lg-6 text-center">
                        <img
                            src={timeImg}
                            className="img-fluid"
                            alt="Иллюстрация времени"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
