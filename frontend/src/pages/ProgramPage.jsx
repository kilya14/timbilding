import React from "react";
import { useParams } from "react-router-dom";


export default function ProgramPage(){
    const { slug } = useParams();
    return (
        <section className="py-5">
            <div className="container"><h1 className="h3">Страница программы: {slug}</h1></div>
        </section>
    );
}