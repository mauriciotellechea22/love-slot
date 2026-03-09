import React, { useState } from 'react';

const TAREAS_JUEGOS = [
    "Besa mi cuello por 30 segundos", "¿Cuál es tu fantasía más sucia conmigo?",
    "Baila sensualmente para mi sin música por 1 minuto", "¿Qué es lo que más te gusta de mi cuerpo?",
    "Manda una foto atrevida ahora mismo a mi teléfono", "Quítame una prenda con los dientes",
    "Dime al oído qué me harías si estuviéramos solos en un cine",
    "Acaríciame por debajo de la ropa por 1 minuto", "Chupa mi dedo provócame",
    "¿Cuándo fue la última vez que te masturbaste pensando en mí?"
];

const PREGUNTAS_PROBABLE = [
    "¿Quién es más probable que se quede dormido primero después de?",
    "¿Quién es más probable que proponga hacerlo en un lugar público?",
    "¿Quién es más probable que tome la iniciativa hoy?",
    "¿Quién es más probable que se ría en medio de un beso?",
    "¿Quién hace más ruido?"
];

export default function GamesView() {
    const [activeGame, setActiveGame] = useState<'menu' | 'truth' | 'probable'>('menu');
    const [cardText, setCardText] = useState("");

    const playTruth = () => {
        setActiveGame('truth');
        nextTruthCard();
    };

    const nextTruthCard = () => {
        setCardText(TAREAS_JUEGOS[Math.floor(Math.random() * TAREAS_JUEGOS.length)]);
    };

    const playProbable = () => {
        setActiveGame('probable');
        nextProbableCard();
    };

    const nextProbableCard = () => {
        setCardText(PREGUNTAS_PROBABLE[Math.floor(Math.random() * PREGUNTAS_PROBABLE.length)]);
    };

    if (activeGame === 'truth') {
        return (
            <div className="game-screen">
                <h2>🔥 Reto Picante</h2>
                <div className="game-card">
                    <p>{cardText}</p>
                </div>
                <button className="primary-btn mt" onClick={nextTruthCard}>Siguiente Tarjeta</button>
                <button className="back-btn mt" onClick={() => setActiveGame('menu')}>⬅ Volver</button>
            </div>
        );
    }

    if (activeGame === 'probable') {
        return (
            <div className="game-screen">
                <h2>👉 ¿Quién es más probable? 👈</h2>
                <p className="subtitle">Ambos deben señalar al otro (o a sí mismos) a la cuenta de 3</p>
                <div className="game-card soft-card">
                    <p>{cardText}</p>
                </div>
                <button className="primary-btn mt" onClick={nextProbableCard}>Siguiente Tarjeta</button>
                <button className="back-btn mt" onClick={() => setActiveGame('menu')}>⬅ Volver</button>
            </div>
        );
    }

    return (
        <div className="games-menu">
            <h2>Modo Juegos de Pareja</h2>
            <p>Seleccionen un mini-juego para empezar</p>

            <div className="game-list">
                <button className="game-btn spicy" onClick={playTruth}>
                    <span className="icon">😈</span>
                    <div>
                        <h3>Verdad o Reto Caliente</h3>
                        <p>Preguntas incómodas y retos físicos para encender la chispa.</p>
                    </div>
                </button>

                <button className="game-btn fun" onClick={playProbable}>
                    <span className="icon">🤔</span>
                    <div>
                        <h3>¿Quién es más probable?</h3>
                        <p>Señala al culpable. Risas aseguradas.</p>
                    </div>
                </button>
            </div>
        </div>
    );
}
