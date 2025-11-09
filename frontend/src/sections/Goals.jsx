import React from "react";

export default function Goals(){
    return (
        <section id="goals" className="py-4 py-md-5 goals-section">
            <div className="container">
                <div className="row g-4 align-items-start">
                    <aside className="col-12 col-lg-3">
                        <div className="goals-aside">
                            Основные <span className="accent">цели</span><br/>тимбилдинга
                        </div>
                    </aside>

                    <div className="col-12 col-lg-9">
                        <div className="d-flex flex-column flex-lg-row goals-grid gap-4">
                            {/* левая колонка — 1 и 3 (617×414) */}
                            <div className="d-flex flex-column goals-col-left">
                                <div className="goal-card gray size-a">
                                    <h5 className="goal-title">1. Сплочение коллектива</h5>
                                    <ul className="goal-list">
                                        <li>формирование чувства «команды» вместо разрозненных сотрудников;</li>
                                        <li>создание атмосферы доверия и взаимной поддержки;</li>
                                        <li>преодоление барьеров между отделами и уровнями иерархии.</li>
                                    </ul>
                                </div>

                                <div className="goal-card gray size-a">
                                    <h5 className="goal-title">3. Адаптация новых сотрудников</h5>
                                    <ul className="goal-list">
                                        <li>быстрое включение новичков в коллектив;</li>
                                        <li>знакомство с ценностями и неформальными правилами;</li>
                                        <li>сокращение периода «вхождения в ритм» работы.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* правая колонка — 2 и 4 (563×327) */}
                            <div className="d-flex flex-column goals-col-right">
                                <div className="goal-card orange size-b">
                                    <h5 className="goal-title">2. Улучшение коммуникации</h5>
                                    <ul className="goal-list">
                                        <li>налаживание горизонтальных связей (сотрудник — сотрудник);</li>
                                        <li>развитие навыков открытого диалога и обратной связи;</li>
                                        <li>снижение количества недопониманий и конфликтов.</li>
                                    </ul>
                                </div>

                                <div className="goal-card orange size-b">
                                    <h5 className="goal-title">4. Повышение мотивации и вовлечённости</h5>
                                    <ul className="goal-list">
                                        <li>усиление чувства причастности к общему делу;</li>
                                        <li>демонстрация ценности каждого сотрудника;</li>
                                        <li>создание позитивного эмоционального фона.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>{/* /right */}
                </div>
            </div>
        </section>
    );
}
