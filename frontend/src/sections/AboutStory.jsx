import React from "react";
import mainpic from "../assets/images/main-image.png";

export default function AboutStory(){
    return (
        <section id="about" className="py-4 py-md-5 bg-light">
            <div className="container">
                <h2 className="text-center mb-1">Расскажем немного о <span className="hand">нашей компании</span></h2>
                <p className="text-center text-muted">Основатель: Артём Волков, бывший руководитель отдела разработки в крупной IT‑компании.</p>
                <div className="row g-3 mt-2">
                    {/* Пролог — широкая серая карточка */}
                    <div className="col-12">
                        <div className="p-3 rounded-4" style={{background:'#F4F5F6'}}>
                            <h5 className="fw-bold mb-1">Пролог: Совершенно пробелданный пикник</h5>
                            <p className="small text-muted mb-0">Точный копирайт возьмём из макета, сейчас — заглушка для вёрстки.</p>
                        </div>
                    </div>


                    {/* Завязка — карточка с иконкой слева (двухколоночная) */}
                    <div className="col-12">
                        <div className="p-3 rounded-4 d-flex flex-column flex-md-row align-items-md-center gap-3" style={{background:'#F4F5F6'}}>
                            <div className="flex-shrink-0 text-center" style={{width:120}}>
                                <img  alt="Идея" className="img-fluid"/>
                            </div>
                            <div className="flex-fill">
                                <h5 className="fw-bold mb-1">Завязка: Идея, рождённая в степи</h5>
                                <p className="small text-muted mb-0">Карточка с лампочкой слева, как на скрине; текст уточним из ТЗ.</p>
                            </div>
                        </div>
                    </div>


                    {/* Развитие — широкая с картинкой справа */}
                    <div className="col-12">
                        <div className="p-3 rounded-4 d-flex flex-column flex-md-row justify-content-between gap-3" style={{background:'#F4F5F6'}}>
                            <div className="flex-fill order-2 order-md-1">
                                <h5 className="fw-bold mb-1">Развитие: Первый «живой» эксперимент</h5>
                                <p className="small text-muted mb-0">Широкий блок, в правой колонке — иллюстрация. Контент заменим на финальный.</p>
                            </div>
                            <div className="flex-shrink-0 order-1 order-md-2 text-center" style={{width:220}}>
                                <img src="./../assets/images/app1.png" alt="Эксперимент" className="img-fluid"/>
                            </div>
                        </div>
                    </div>


                    {/* Кульминация — финальный блок */}
                    <div className="col-12">
                        <div className="p-3 rounded-4" style={{background:'#F4F5F6'}}>
                            <h5 className="fw-bold mb-1">Кульминация: Рождение «Тимбилдинга»</h5>
                            <p className="small text-muted mb-0">Финальный текст; подключим точный текст из макета.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}