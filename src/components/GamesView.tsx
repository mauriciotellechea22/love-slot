import React, { useState, useEffect } from 'react';

// ==========================================
// DATA DE LOS 10 JUEGOS
// ==========================================

const VERDAD_O_RETO = [
    "Besa mi cuello por 30 segundos", "¿Cuál es tu fantasía más sucia conmigo?",
    "Baila sensualmente para mi sin música por 1 minuto", "¿Qué es lo que más te gusta de mi cuerpo?",
    "Manda una foto atrevida ahora mismo a mi teléfono", "Quítame una prenda con los dientes",
    "Dime al oído qué me harías si estuviéramos solos en un cine",
    "Acaríciame por debajo de la ropa por 1 minuto", "Chupa mi dedo provocativamente",
    "¿Cuándo fue la última vez que te masturbaste pensando en mí?"
];

const QUIEN_ES_PROBABLE = [
    "¿Quién es más probable que se quede dormido primero después del sexo?",
    "¿Quién es más probable que proponga hacerlo en un lugar público?",
    "¿Quién es más probable que tome la iniciativa hoy?",
    "¿Quién es más probable que se ría en medio de un beso?",
    "¿Quién hace más ruido?"
];

const NUNCA_NUNCA = [
    "Yo nunca nunca he fingido un orgasmo contigo.",
    "Yo nunca nunca he pensado en tener un trío.",
    "Yo nunca nunca he revisado tu celular en secreto.",
    "Yo nunca nunca he usado comida en la cama.",
    "Yo nunca nunca he mandado un mensaje o foto caliente al número equivocado."
];

const PREGUNTAS_CONEXION = [
    "Si este fuera nuestro último día juntos, ¿qué haríamos?",
    "¿Cuál es el recuerdo sexual más intenso que tienes de nosotros?",
    "¿Qué cualidad mía te frustra pero a la vez te encanta?",
    "¿Cómo te diste cuenta de que estabas enamorado/a de mí?",
    "Si pudieras cambiar una sola cosa de nuestra relación, ¿qué sería?"
];

const PRENDAS_RULETA = [
    "Quítate los calcetines/zapatos.",
    "Quítate la camiseta/blusa lentamente.",
    "Quítate los pantalones/falda.",
    "La otra persona elige qué prenda te quitas.",
    "¡Te salvaste! El otro se quita una prenda."
];

const DADOS_SEXUALES_ACCION = ["Lame", "Besa", "Muerde suavemente", "Acaricia", "Sopla", "Masajea"];
const DADOS_SEXUALES_CUERPO = ["el cuello", "los labios", "los pezones", "la entrepierna", "los muslos interiores", "las orejas"];

const ROLEPLAY_ESCENARIOS = [
    "Eres el/la profesor/a estricto/a y yo el alumno castigado.",
    "Soy tu masajista personal que se propasa.",
    "Somos dos extraños en un bar a punto de ir al baño juntos.",
    "Eres un/a policía que me acaba de detener por exceso de velocidad.",
    "Soy tu jefe/a y me estás pidiendo un aumento."
];

const RULETA_BESOS = [
    "Beso apasionado con lengua (2 mins)",
    "Beso estilo Spiderman (al revés)",
    "Beso en el cuello por 1 minuto",
    "Beso francés profundo",
    "Beso con mordida suave en el labio inferior"
];

const TOKENS_CALIENTES = [
    "🎟️ Vale por un rapidito cuando lo exijas",
    "🎟️ Vale por sexo oral esta noche",
    "🎟️ Vale por control total: Hoy haces lo que yo diga",
    "🎟️ Vale por despertarme con sexo oral mañana",
    "🎟️ Vale por un masaje de cuerpo completo con final feliz"
];

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function GamesView() {
    const [activeGame, setActiveGame] = useState<string>('menu');
    const [cardText, setCardText] = useState("");
    const [subText, setSubText] = useState("");
    const [timer, setTimer] = useState<number | null>(null);

    useEffect(() => {
        let interval: any;
        if (timer !== null && timer > 0) {
            interval = setInterval(() => setTimer(timer - 1), 1000);
        } else if (timer === 0) {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const playGame = (gameId: string, initialDataFunc: () => void) => {
        setActiveGame(gameId);
        setTimer(null);
        setSubText("");
        initialDataFunc();
    };

    const getRand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // Lógicas de Juegos
    const nextTruth = () => setCardText(getRand(VERDAD_O_RETO));
    const nextProbable = () => setCardText(getRand(QUIEN_ES_PROBABLE));
    const nextNunca = () => setCardText(getRand(NUNCA_NUNCA));
    const nextConexion = () => setCardText(getRand(PREGUNTAS_CONEXION));
    const nextPrenda = () => setCardText(getRand(PRENDAS_RULETA));
    const nextBeso = () => setCardText(getRand(RULETA_BESOS));
    const nextToken = () => setCardText(getRand(TOKENS_CALIENTES));
    const nextRoleplay = () => setCardText(getRand(ROLEPLAY_ESCENARIOS));
    const nextDados = () => {
        setCardText(`Acción: ${getRand(DADOS_SEXUALES_ACCION)}`);
        setSubText(`Dónde: ${getRand(DADOS_SEXUALES_CUERPO)}`);
    };
    const startMiradas = () => {
        setCardText("¡Parpadeaste o te reiste, pierdes! Tienes que quitarte una prenda.");
        setTimer(10); // Empieza en 10, pero es solo visual.
    };


    if (activeGame !== 'menu') {
        return (
            <div className="game-screen">
                <h2 style={{ color: 'white', marginBottom: '5px' }}>
                    {activeGame === 'truth' && '🔥 Verdad o Reto'}
                    {activeGame === 'probable' && '👉 Más Probable'}
                    {activeGame === 'nunca' && '⛔ Yo Nunca Nunca'}
                    {activeGame === 'conexion' && '❤️ Conexión Profunda'}
                    {activeGame === 'prenda' && '👗 Ruleta de Prendas'}
                    {activeGame === 'dados' && '🎲 Dados Sensuales'}
                    {activeGame === 'roleplay' && '🎭 Roleplay Express'}
                    {activeGame === 'besos' && '💋 Ruleta de Besos'}
                    {activeGame === 'miradas' && '👀 Reto de Miradas'}
                    {activeGame === 'tokens' && '🎟️ Cupones Calientes'}
                </h2>

                {activeGame === 'miradas' && timer !== null ? (
                    <div className="timer">{timer > 0 ? timer : "¡TIEMPO!"}</div>
                ) : null}

                <div className={`game-card ${['conexion', 'probable', 'nunca'].includes(activeGame) ? 'soft-card' : ''}`}>
                    <p>{cardText}</p>
                    {subText && <p style={{ marginTop: '15px', color: '#ffd700' }}>{subText}</p>}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button className="back-btn" onClick={() => setActiveGame('menu')}>⬅ Volver</button>
                    <button className="primary-btn" onClick={() => {
                        if (activeGame === 'truth') nextTruth();
                        if (activeGame === 'probable') nextProbable();
                        if (activeGame === 'nunca') nextNunca();
                        if (activeGame === 'conexion') nextConexion();
                        if (activeGame === 'prenda') nextPrenda();
                        if (activeGame === 'dados') nextDados();
                        if (activeGame === 'roleplay') nextRoleplay();
                        if (activeGame === 'besos') nextBeso();
                        if (activeGame === 'miradas') startMiradas();
                        if (activeGame === 'tokens') nextToken();
                    }}>Otra más</button>
                </div>
            </div>
        );
    }

    return (
        <div className="games-menu">
            <h2>Modo Juegos de Pareja</h2>
            <p>Seleccionen uno de los 10 mini-juegos para empezar la noche.</p>

            <div className="game-list">
                <button className="game-btn spicy" onClick={() => playGame('truth', nextTruth)}>
                    <span className="icon">😈</span> <div><h3>Verdad o Reto</h3><p>Clásico picante.</p></div>
                </button>
                <button className="game-btn fun" onClick={() => playGame('probable', nextProbable)}>
                    <span className="icon">👉</span> <div><h3>¿Quién es más probable?</h3><p>Señala al culpable.</p></div>
                </button>
                <button className="game-btn spicy" onClick={() => playGame('nunca', nextNunca)}>
                    <span className="icon">⛔</span> <div><h3>Yo Nunca Nunca</h3><p>Confesiones atrevidas.</p></div>
                </button>
                <button className="game-btn fun" onClick={() => playGame('conexion', nextConexion)}>
                    <span className="icon">❤️</span> <div><h3>Conexión Profunda</h3><p>Preguntas íntimas.</p></div>
                </button>
                <button className="game-btn spicy" onClick={() => playGame('prenda', nextPrenda)}>
                    <span className="icon">👗</span> <div><h3>Ruleta de Prendas</h3><p>Striptease al azar.</p></div>
                </button>
                <button className="game-btn spicy" onClick={() => playGame('dados', nextDados)}>
                    <span className="icon">🎲</span> <div><h3>Dados Sensuales</h3><p>Acción + Parte del cuerpo.</p></div>
                </button>
                <button className="game-btn fun" onClick={() => playGame('roleplay', nextRoleplay)}>
                    <span className="icon">🎭</span> <div><h3>Roleplay Express</h3><p>Escenarios cortos.</p></div>
                </button>
                <button className="game-btn fun" onClick={() => playGame('besos', nextBeso)}>
                    <span className="icon">💋</span> <div><h3>Ruleta de Besos</h3><p>Tipos de besos.</p></div>
                </button>
                <button className="game-btn fun" onClick={() => playGame('miradas', startMiradas)}>
                    <span className="icon">👀</span> <div><h3>Reto de Miradas</h3><p>El que ríe se quita algo.</p></div>
                </button>
                <button className="game-btn spicy" onClick={() => playGame('tokens', nextToken)}>
                    <span className="icon">🎟️</span> <div><h3>Cupones Calientes</h3><p>Saca un premio al azar.</p></div>
                </button>
            </div>
        </div>
    );
}
