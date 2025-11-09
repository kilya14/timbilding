import React from "react";


export default function Goals(){
    return (
        <section id="goals" className="py-4 py-md-5">
            <div className="container">
                <div className="row mt-1 g-4 align-items-start">
                    <aside className="col-12 col-lg-3 order-2 order-lg-1">
                        <div className="text-muted small">Основные цели тимбилдинга</div>
                    </aside>
                    <div className="col-12 col-lg-9 order-1 order-lg-2">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="goal">
                                    <h5 className="goals-title">1. Сплочение коллектива</h5>
                                    <div className="small">Формирование командного духа и доверия.</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="goal orange">
                                    <h5 className="goals-title">2. Улучшение коммуникации</h5>
                                    <div className="small">Навыки открытого диалога и обратной связи.</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="goal">
                                    <h5 className="goals-title">3. Адаптация новых сотрудников</h5>
                                    <div className="small">Быстрое погружение в процессы и ценности.</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="goal orange">
                                    <h5 className="goals-title">4. Повышение мотивации и вовлечённости</h5>
                                    <div className="small">Ответственность и инициативность в повседневной работе.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}