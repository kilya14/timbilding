// src/sections/Hero.jsx
import React from "react";
import mainpic from "../assets/images/main-image.png";

export default function Hero() {
    const scrollToForm = () => {
        const el = document.getElementById("signup");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="py-4 py-md-5">
            <div className="container text-center">
                <img src={mainpic} className="img-fluid hero-img" alt="Hero иллюстрация" />
                <div className="mt-3">
                    <button className="cta" type="button" onClick={scrollToForm}>
                        Подать заявку
                    </button>
                </div>
                <p className="hand tagline mt-3">Говорим. Слушаем. Действуем. Вместе</p>
            </div>
        </section>
    );
}
