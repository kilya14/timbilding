// src/sections/SignUpForm.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../features/requests/requestsSlice";
// если картинка лежит в src/assets/images
import timeIllustration from "../assets/images/time-zone.png";

const API_URL = "http://localhost:5001"; // backend из папки server

export default function SignUpForm() {
    const dispatch = useDispatch();
    const programs = useSelector((s) => s.programs.items || []);

    const defaultProgramId = programs.length > 0 ? programs[0].id : "";

    const [form, setForm] = useState({
        org: "",
        count: "",
        date: "",
        email: "",
        phone: "",
        comment: "",
        programId: defaultProgramId
    });

    const [ok, setOk] = useState(false);
    const [error, setError] = useState("");

    const onChange = (field) => (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.org || !form.email || !form.phone) {
            setError("Заполните организацию, email и телефон.");
            return;
        }

        const payload = {
            org: form.org,
            people: +form.count || 0,
            email: form.email,
            phone: form.phone,
            wish: form.date,
            comment: form.comment,
            programId: form.programId
        };

        try {
            // 1. отправляем на backend
            const res = await fetch(`${API_URL}/api/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ошибка сервера");
            }

            // 2. локально сохраняем в Redux (как журнал заявок)
            dispatch(addRequest(payload));

            // 3. сброс формы + сообщение "отправлено"
            setOk(true);
            setForm({
                org: "",
                count: "",
                date: "",
                email: "",
                phone: "",
                comment: "",
                programId: defaultProgramId
            });
            setTimeout(() => setOk(false), 2000);
        } catch (err) {
            console.error("Ошибка отправки заявки", err);
            setError(err.message || "Не удалось отправить заявку. Попробуйте ещё раз.");
        }
    };

    return (
        <section id="signup" className="py-4 py-md-5 bg-light">
            <div className="container">
                <div className="row g-4 align-items-center">
                    <div className="col-12 col-lg-6">
                        <h2 className="hand" style={{ fontSize: "clamp(28px,3.2vw,46px)" }}>
                            Время <span className="fw-normal">записаться</span>
                        </h2>

                        <form className="d-grid gap-2" onSubmit={onSubmit}>
                            <input
                                className="form-pill"
                                placeholder="Наименование организации:"
                                value={form.org}
                                onChange={onChange("org")}
                            />

                            <div className="d-flex gap-2 flex-wrap">
                                <input
                                    className="form-pill flex-fill"
                                    placeholder="Количество участников:"
                                    value={form.count}
                                    onChange={onChange("count")}
                                />
                                <input
                                    className="form-pill flex-fill"
                                    placeholder="Желаемая дата:"
                                    value={form.date}
                                    onChange={onChange("date")}
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
                                    <option key={p.id} value={p.id}>
                                        {p.title}
                                    </option>
                                ))}
                                {programs.length === 0 && (
                                    <option value="">Программы пока не добавлены</option>
                                )}
                            </select>

                            <div className="form-check small">
                                <input className="form-check-input" type="checkbox" id="agree" required />
                                <label className="form-check-label" htmlFor="agree">
                                    Соглашаюсь на обработку персональных данных
                                </label>
                            </div>

                            <div>
                                <button className="cta" type="submit">
                                    Отправить
                                </button>
                            </div>

                            {ok && (
                                <div className="alert alert-success py-2 mb-0">
                                    Заявка отправлена
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger py-2 mb-0">
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="col-12 col-lg-6 text-center">
                        <img
                            src={timeIllustration}
                            className="img-fluid"
                            alt="Иллюстрация времени"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
