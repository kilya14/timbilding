import React, { useState, useRef, useEffect } from "react";
const [open, setOpen] = useState(false);
const navRef = useRef(null);
useEffect(()=>{
    const onClick = (e)=>{ if(navRef.current && !navRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", onClick); return ()=>document.removeEventListener("click", onClick);
},[]);
return (
    <header className="topbar sticky-top">
        <nav className="navbar navbar-expand-lg container py-2" ref={navRef}>
            <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                <img src="/assets/logo.png" width={40} height={40} alt="Лого"/>ТИМБИЛДИНГ
            </Link>
            <button className="navbar-toggler" type="button" aria-label="Меню" onClick={()=>setOpen(s=>!s)}>
                <span className="navbar-toggler-icon"/>
            </button>
            <div className={`collapse navbar-collapse ${open?"show":""}`}>
                <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 position-relative">
                    <li className="nav-item"><a className="nav-link" href="#about">О компании</a></li>
                    <li className="nav-item"><a className="nav-link" href="#why">Преимущества</a></li>
                    <li className="nav-item dropdown" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>
                        <Link className="nav-link" to="/programs/hungry-games">Программы ▾</Link>
                        <div className="mega">
                            <div className="layer">
                                <div className="row g-2 text-white">
                                    <div className="col-12 col-md-4"><span className="chip">Популярное</span><div className="small mt-1 text-white-50">Цепная реакция</div></div>
                                    <div className="col-12 col-md-4"><span className="chip">Квесты</span><div className="small mt-1 text-white-50">Голодные игры</div></div>
                                    <div className="col-12 col-md-4"><span className="chip">Кулинария</span><div className="small mt-1 text-white-50">Свой ресторан</div></div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item"><a className="nav-link" href="#contacts">Контакты</a></li>
                </ul>
            </div>
        </nav>
    </header>
);
}


function Footer(){
    return (
        <footer className="py-4" id="footer">
            <div className="container">
                <div className="row g-3 align-items-center">
                    <div className="col-12 col-lg-4">
                        <div className="bg-white rounded-4 p-3 d-flex align-items-center gap-3 shadow-sm">
                            <img src="/assets/logo.png" width={44} height={44} alt="Лого"/>
                            <div className="small">Профессиональная организация тимбилдингов и кейс‑сессий.</div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4"><div className="small">Свяжитесь с нами: +7 (495) 123‑45‑67 | 8 (800) 505‑00‑00</div></div>
                    <div className="col-12 col-lg-4"><div className="small text-lg-end">ТИМБИЛДИНГ © 2025</div></div>
                </div>
            </div>
        </footer>
    );
}


export default function Layout(){
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}