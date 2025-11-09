import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../features/requests/requestsSlice";


export default function SignUpForm(){
    const dispatch = useDispatch();
    const programs = useSelector((s)=>s.programs.items);
    const [form, setForm] = useState({ org:"", count:"", date:"", email:"", phone:"", comment:"", programId: programs[0]?.id||"" });
    const [ok, setOk] = useState(false);


    const onSubmit = (e) => {
        e.preventDefault();
        if(!form.org || !form.email || !form.phone) return;
        dispatch(addRequest({ org:form.org, people:+form.count||0, email:form.email, phone:form.phone, wish:form.date, comment:form.comment, programId:form.programId }));
        setOk(true); setForm({ org:"", count:"", date:"", email:"", phone:"", comment:"", programId: programs[0]?.id||"" });
        setTimeout(()=>setOk(false), 2000);
    };


    return (
        <section id="signup" className="py-4 py-md-5 bg-light">
            <div className="container">
                <div className="row g-4 align-items-center">
                    <div className="col-12 col-lg-6">
                        <h2 className="hand" style={{fontSize:'clamp(28px,3.2vw,46px)'}}>Время <span className="fw-normal">записаться</span></h2>
                        <form className="d-grid gap-2" onSubmit={onSubmit}>
                            <input className="form-pill" placeholder="Наименование организации:" value={form.org} onChange={e=>setForm(f=>({...f, org:e.target.value}))} />
                            <div className="d-flex gap-2 flex-wrap">
                                <input className="form-pill flex-fill" placeholder="Количество участников:" value={form.count} onChange={e=>setForm(f=>({...f, count:e.target.value}))} />
                                <input className="form-pill flex-fill" placeholder="Желаемая дата:" value={form.date} onChange={e=>setForm(f=>({...f, date:e.target.value}))} />
                            </div>
                            <div className="d-flex gap-2 flex-wrap">
                                <input className="form-pill flex-fill" placeholder="Электронный адрес:" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
                                <input className="form-pill flex-fill" placeholder="Телефон:" value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} />
                            </div>
                            <textarea className="form-pill" rows={3} placeholder="Комментарий:" value={form.comment} onChange={e=>setForm(f=>({...f, comment:e.target.value}))}></textarea>
                            <select className="form-pill form-select" value={form.programId} onChange={e=>setForm(f=>({...f, programId:e.target.value}))}>
                                {programs.map(p=> <option key={p.id} value={p.id}>{p.title}</option>) }
                            </select>
                            <div className="form-check small">
                                <input className="form-check-input" type="checkbox" id="agree" required/>
                                <label className="form-check-label" htmlFor="agree">Соглашаюсь на обработку персональных данных</label>
                            </div>
                            <div><button className="cta" type="submit">Отправить</button></div>
                            {ok && <div className="alert alert-success py-2 mb-0">Заявка отправлена</div>}
                        </form>
                    </div>
                    <div className="col-12 col-lg-6 text-center">
                        <img src="/assets/time-illustration.png" className="img-fluid" alt="Иллюстрация времени" />
                    </div>
                </div>
            </div>
        </section>
    );
}