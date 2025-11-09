import React from "react";
import Hero from "../sections/Hero.jsx";
import Goals from "../sections/Goals.jsx";
import WhyUs from "../sections/WhyUs.jsx";
import AboutStory from "../sections/AboutStory.jsx";
import ProgramsTeaser from "../sections/ProgramsTeaser.jsx";
import SignUpForm from "../sections/SignUpForm.jsx";
import Contacts from "../sections/Contacts.jsx";


export default function HomePage(){
    return (
        <>
            <Hero />
            <Goals />
            <WhyUs />
            <AboutStory />
            <ProgramsTeaser />
            <SignUpForm />
            <Contacts />
        </>
    );
}