// src/sections/Contacts.jsx
import React from "react";

export function Contacts() {
    return (
        <section id="contacts" className="py-4 py-md-5">
            <div className="container">
                <h2 className="mb-3">Контакты</h2>
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <div className="p-3 rounded-4 bg-white shadow-sm">
                            <div className="small text-muted">Телефон</div>
                            <div className="h5 mb-1">+7 (996) 789-85-85</div>
                            <div className="h6">+7 (996) 789-85-75</div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="p-3 rounded-4 bg-white shadow-sm">
                            <div className="small text-muted">Email</div>
                            <div className="h6 mb-1">team@teambuilding.ru</div>
                            <div className="small text-muted">Пн–Пт: 10:00–19:00, онлайн-форматы по договорённости.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contacts;
