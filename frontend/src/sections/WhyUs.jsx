import React from "react";


export default function WhyUs(){
    return (
        <section id="why" className="py-4 py-md-5">
            <div className="container">
                <h2 className="why-title mb-3">Говорим. Слушаем. Действуем. Вместе</h2>
                <div className="row g-4 align-items-start">
                    <div className="col-12 col-lg-4">
                        <div className="text-muted small">Почему выбирают нас?</div>
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="benefit border">
                                    <h5 className="fw-bold">1. Индивидуальный подход</h5>
                                    <div className="small">Диагностика задач, интервью и кастомные решения.</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="benefit orange">
                                    <h5 className="fw-bold">2. Эффект после мероприятия</h5>
                                    <div className="small">Инструменты для ежедневной работы.</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="benefit border">
                                    <h5 className="fw-bold">3. Команда экспертов</h5>
                                    <div className="small">Бизнес‑психолог, фасилитатор, сценарист.</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="benefit orange">
                                    <h5 className="fw-bold">4. Измеримые результаты</h5>
                                    <div className="small">Оценка динамики, рекомендации по внедрению.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}