import React from 'react';
import './Hero.css';

const Hero = () => (
    <section className="hero">
        <div className="hero-content">
            <h1>Chiron3D – AI‑Powered Blender Tutor</h1>
            <p className="tagline">
                Transform the Blender learning experience with a real‑time AI side‑car that guides, demos, and answers your questions.
            </p>
            <a href="/demo" className="cta-button">Explore Live Demo</a>
        </div>
        <div className="hero-visual">
            {/* Placeholder for a sleek 3‑D mockup – could be replaced with a generated image later */}
            <div className="mockup"></div>
        </div>
    </section>
);

export default Hero;
