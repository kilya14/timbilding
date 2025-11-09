import React from "react";
export default function Hero(){
    return (
        <section className="py-4 py-md-5">
            <div className="container text-center">
                <img src="/assets/hero-people.png" className="img-fluid hero-img" alt="Hero иллюстрация" />
                <div className="mt-3"><button className="cta">Подать заявку</button></div>
                <p className="hand tagline mt-3">Говорим. Слушаем. Действуем. Вместе</p>
            </div>
        </section>
    );
}