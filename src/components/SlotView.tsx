import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. DATOS Y ARRAYS (ROMÁNTICO VS PICANTE VS EXTREMO)
// ==========================================

// --- MODO ROMÁNTICO 💖 ---
const frasesRomanticas = [
    "Tu sonrisa me ilumina el día", "Eres mi persona favorita", "Me pierdo en tus ojos",
    "Gracias por estar siempre ahí", "Haces que todo sea mejor", "Eres mi refugio seguro",
    "Me encantan tus abrazos", "Contigo todo es una aventura", "Amo cada momento a tu lado"
];
const premiosRomanticos = [
    "Vale por un masaje de pies", "Cena romántica esta noche", "Vale por un beso apasionado",
    "Día de spa en casa", "Tú eliges la película hoy", "Desayuno en la cama",
    "Paseo bajo las estrellas", "Vale por un abrazo de oso", "Postre favorito garantizado",
    "Vale por una salida al cine", "Cena cocinada por mí", "Tarde de maratón de series",
    "Vale por un helado gigante", "Masaje en la espalda de 20 min", "Una carta de amor mano a mano",
    "Un día sin quehaceres", "Tú decides qué comida pedir hoy", "Picnic romántico improvisado",
    "Desayuno sorpresa el fin de semana", "Paseo de compras juntos", "Elegir la música todo el día",
    "Noche de juegos de mesa/videojuegos", "Sesión de fotos tonta de los dos", "Vale por tu golosina favorita",
    "Te invito un café/merienda", "Tarde de abrazos en el sillón", "Caminar tomados de la mano un buen rato"
];
const tareasMairaRomanticas = [
    "Déjale una nota de amor escondida", "Dale un beso robado", "Prepárale su snack favorito",
    "Hazle un cumplido sincero", "Abrázalo por la espalda", "Dedícale una canción"
];
const tareasMauriRomanticas = [
    "Déjale una nota en el espejo", "Dale un beso de película", "Cómprale su dulce favorito",
    "Dile lo hermosa que es", "Abrázala fuerte por 1 minuto", "Invítala a bailar sin música"
];

// --- MODO PICANTE 🌶️ ---
const frasesPicantes = [
    "Me vuelves loco/a", "Hoy no se duerme", "Ese cuerpo me llama",
    "Tengo ganas de ti", "Me encanta cómo me tocas", "Te deseo ahora mismo",
    "Eres mi tentación favorita", "Quiero morderte los labios", "Pienso en ti sin ropa"
];
const premiosPicantes = [
    "Masaje con aceite caliente", "Juego de roles esta noche", "Beso en todo el cuerpo",
    "Striptease privado", "Tú mandas en la cama hoy", "Ducha juntos",
    "Vale por un 'rapidito'", "Noche de juguetes", "Cumplir una fantasía secreta",
    "Sexo oral completo", "Masaje erótico super lento y largo", "Besos en cada rincón prohibido",
    "Hazme lo que quieras por 30 min", "Hacerlo en una parte de la casa nueva",
    "Posición sexual sorpresa (tú decides)", "Sesión de 'dirty talk' intenso",
    "Atado/a o vendado/a en la cama", "Juego previo suuuuper largo garantizado",
    "Usar crema o hielo", "Permiso para grabar un video candente",
    "Mañanero salvaje garantizado", "Vale por un oral cuando y donde quieras",
    "Dominar por completo esta noche", "Noche sin nada de ropa para dormir"
];
const tareasMairaPicantes = [
    "Mándale una foto sugerente ahora", "Susúrrale al oído qué le harás hoy", "Bésale el cuello provocativamente",
    "Quítate una prenda frente a él", "Tócale disimuladamente en público"
];
const tareasMauriPicantes = [
    "Bésala apasionadamente contra la pared", "Quítale una prenda con los dientes", "Acaríciala por debajo de la ropa",
    "Mándale un mensaje muy subido de tono", "Véndale los ojos y bésala"
];

// --- MODO EXTREMO 🔥 ---
const frasesExtremas = [
    "Hoy serás mío/a por completo", "Quítate la ropa, ahora", "Me perteneces esta noche",
    "Silencio y obedece", "Prepárate para sudar", "No te resistas",
    "Acepta el castigo", "Voy a romperte (de placer)", "Esta noche mando yo"
];
const premiosExtremos = [
    "Uso de juguetes a control remoto público", "Posición Kamasutra al azar por 10 min", "Edging controlado (no te corras hasta que lo diga)",
    "Castigo: Nalgadas (tú decides cuántas)", "Uso del collar (sumisión por 2 horas)", "Sexo grabando un POV de 3 minutos",
    "Vendarte los ojos y dejarte a mi merced", "Hacerlo donde alguien pueda escucharnos (balcón/ventana abierta)",
    "Permiso absoluto para un fetiche guardado"
];
const tareasExtremasMaira = [
    "Mándame una foto tuya tocándote en los próximos 5 mins", "Cuando nos veamos, arrodíllate", "Hoy tienes prohibido usar ropa interior"
];
const tareasExtremasMauri = [
    "Envíame un audio diciéndome exactamente qué me harás", "Hazme venir 3 veces antes de que tú puedas", "Átame las manos hoy"
];

// --- SUPER JACKPOTS 🏆 ---
const superJackpots = [
    "¡FIN DE SEMANA EN UN HOTEL!",
    "¡CENA EN SU RESTAURANTE FAVORITO PAGADA!",
    "¡DÍA COMPLETO DE CONSENTIR AL OTRO SIN QUEJAS!",
    "¡VALE POR UN REGALO SORPRESA DE AMAZON!"
];
const retosSemanales = [
    "Cocinar juntos en ropa interior", "Recrear su primera cita exactamente igual",
    "Noche de masajes de 1 hora completa", "Apagar los celulares toda la tarde y solo hablar",
    "Bañarse juntos con velas y música"
];
const iconosSecretos = ["🤫", "💌", "🎁", "💖", "🔐", "🔥", "😈", "⛓️", "🍑"];

const MAX_SPINS = 3;
const REEL_HEIGHT = 55;

type Player = 'Maira' | 'Mauri';
export type AppData = {
    date: string; Maira: number; Mauri: number; streak: number;
    lastPlayDate: string; history: Array<{ date: string; player: Player; desc: string }>;
    lastWeekly: string | null;
};

type Mode = 'romantico' | 'picante' | 'extremo';

type SlotViewProps = {
    currentPlayer: Player;
    appData: AppData;
    saveAppData: (data: AppData) => void;
    saveToHistory: (premio: string, mode: Mode, isSuper: boolean) => void;
};

export default function SlotView({ currentPlayer, appData, saveAppData, saveToHistory }: SlotViewProps) {
    const [mode, setMode] = useState<Mode>('romantico');
    const [isSpinning, setIsSpinning] = useState(false);
    const [modalType, setModalType] = useState<'result' | null>(null);
    const [modalContent, setModalContent] = useState<any>(null);
    const [isSecretRevealed, setIsSecretRevealed] = useState(false);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const reel1Ref = useRef<HTMLDivElement>(null);
    const reel2Ref = useRef<HTMLDivElement>(null);
    const reel3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = document.documentElement;
        if (mode === 'picante') {
            document.body.className = 'spicy-mode slot-active';
            document.getElementById('theme-color-meta')?.setAttribute('content', '#1a0000');
        } else if (mode === 'extremo') {
            document.body.className = 'extreme-mode slot-active';
            document.getElementById('theme-color-meta')?.setAttribute('content', '#000000');
        } else {
            document.body.className = 'romantic-mode slot-active';
            document.getElementById('theme-color-meta')?.setAttribute('content', '#ff007f');
        }
    }, [mode]);

    useEffect(() => {
        if (!isSpinning && reel1Ref.current && reel2Ref.current) {
            if (!reel1Ref.current.querySelector('.reel-strip')) {
                const fi = mode === 'extremo' ? frasesExtremas[0] : (mode === 'picante' ? frasesPicantes[0] : frasesRomanticas[0]);
                const pi = mode === 'extremo' ? premiosExtremos[0] : (mode === 'picante' ? premiosPicantes[0] : premiosRomanticos[0]);
                reel1Ref.current.innerHTML = `<div class="reel-item">${fi}</div>`;
                reel2Ref.current.innerHTML = `<div class="reel-item">${pi}</div>`;
            }
        }
    }, [mode, isSpinning]);

    useEffect(() => {
        if (reel3Ref.current && !reel3Ref.current.innerHTML) {
            reel3Ref.current.innerHTML = `<div class="reel-item">💌</div>`;
        }
    }, []);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextCtor) audioCtxRef.current = new AudioContextCtor();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    const playTick = () => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start(); osc.stop(ctx.currentTime + 0.05);
    };

    const playWin = (isSuper = false) => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const notes = isSuper ? [523.25, 659.25, 783.99, 1046.50, 1318.51] : [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.1 + 0.05);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.1 + 0.3);
            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + 0.3);
        });
    };

    const vibrate = () => {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    };

    const spinReel = (container: HTMLDivElement, items: string[], duration: number): Promise<string> => {
        return new Promise((resolve) => {
            container.innerHTML = '';
            const strip = document.createElement('div');
            strip.className = 'reel-strip';
            const targetIndex = Math.floor(Math.random() * items.length);
            const targetItem = items[targetIndex];
            const totalItems = 30;
            for (let i = 0; i < totalItems - 1; i++) {
                const div = document.createElement('div');
                div.className = 'reel-item';
                div.innerText = items[Math.floor(Math.random() * items.length)];
                strip.appendChild(div);
            }
            const targetDiv = document.createElement('div');
            targetDiv.className = 'reel-item';
            targetDiv.innerText = targetItem;
            strip.appendChild(targetDiv);
            container.appendChild(strip);
            strip.style.transform = `translate3d(0px, 0px, 0px)`;
            void strip.offsetWidth; // Force reflow
            container.classList.add('blur');
            const tickInterval = setInterval(playTick, 100);
            strip.style.transition = `transform ${duration}ms cubic-bezier(0.15, 0.85, 0.3, 1)`;
            const targetY = -((totalItems - 1) * REEL_HEIGHT);
            strip.style.transform = `translate3d(0px, ${targetY}px, 0px)`;
            setTimeout(() => {
                clearInterval(tickInterval);
                container.classList.remove('blur');
                resolve(targetItem);
            }, duration);
        });
    };

    const handleSpin = async () => {
        if (!appData || appData[currentPlayer] <= 0 || isSpinning) return;
        initAudio(); setIsSpinning(true);

        let frases = frasesRomanticas, premios = premiosRomanticos, arrMap = mode === 'romantico' ? tareasMairaRomanticas : (mode === 'picante' ? tareasMairaPicantes : tareasExtremasMaira);
        let arrMau = mode === 'romantico' ? tareasMauriRomanticas : (mode === 'picante' ? tareasMauriPicantes : tareasExtremasMauri);

        if (mode === 'picante') { frases = frasesPicantes; premios = premiosPicantes; }
        if (mode === 'extremo') { frases = frasesExtremas; premios = premiosExtremos; }

        let isSuperJackpot = Math.random() < 0.05;
        if (isSuperJackpot) premios = superJackpots;

        if (!reel1Ref.current || !reel2Ref.current || !reel3Ref.current) return;
        const p1 = spinReel(reel1Ref.current, frases, 2000);
        const p2 = spinReel(reel2Ref.current, premios, 2500);
        const p3 = spinReel(reel3Ref.current, iconosSecretos, 3000);

        const [resFrase, resPremio, resIcono] = await Promise.all([p1, p2, p3]);
        vibrate(); playWin(isSuperJackpot);

        const newData = { ...appData };
        newData[currentPlayer] -= 1;
        saveAppData(newData);
        saveToHistory(resPremio, mode, isSuperJackpot);

        const arrayTareas = currentPlayer === 'Maira' ? arrMap : arrMau;
        const tareaSecreta = arrayTareas[Math.floor(Math.random() * arrayTareas.length)];

        setTimeout(() => {
            setModalContent({
                title: isSuperJackpot ? `🏆 ¡SUPER, ${currentPlayer}! 🏆` : `¡Jackpot, ${currentPlayer}! 🎰`,
                isSuper: isSuperJackpot,
                premio: resPremio,
                tarea: tareaSecreta,
                partner: currentPlayer === 'Maira' ? 'Mauri' : 'Maira'
            });
            setIsSecretRevealed(false);
            setModalType('result');
            setIsSpinning(false);
        }, 600);
    };

    const handleWeeklyChallenge = () => {
        if (!appData) return;
        initAudio();
        const reto = retosSemanales[Math.floor(Math.random() * retosSemanales.length)];
        const newData = { ...appData };
        newData.lastWeekly = new Date().toDateString();
        saveAppData(newData);
        saveToHistory(`RETO: ${reto}`, 'romantico', false);
        playWin(true);
        setModalContent({
            title: `🌟 ¡RETO SEMANAL! 🌟`, isSuper: true, premio: reto, tarea: null, partner: null
        });
        setModalType('result');
    };

    return (
        <div className="slot-view-container">
            <div className="mode-selector">
                <button className={mode === 'romantico' ? 'active' : ''} onClick={() => setMode('romantico')}>💖 Amor</button>
                <button className={mode === 'picante' ? 'active' : ''} onClick={() => setMode('picante')}>🌶️ Picante</button>
                <button className={mode === 'extremo' ? 'extreme active-ex' : 'extreme'} onClick={() => setMode('extremo')}>🔥 Extremo</button>
            </div>

            <div className="slot-machine mt">
                <div className="lights"></div>
                <div className="reels-container">
                    <div className="reel" ref={reel1Ref}></div>
                    <div className="reel" ref={reel2Ref}></div>
                    <div className="reel" id="reel3" ref={reel3Ref}></div>
                </div>
                <div className="controls">
                    <button id="spin-btn" onClick={handleSpin} disabled={appData[currentPlayer] <= 0 || isSpinning}>
                        {appData[currentPlayer] <= 0 ? "Vuelve mañana ❤️" : "TIRAR DE LA PALANCA"}
                    </button>
                    <p id="spins-left">{appData[currentPlayer] <= 0 ? "Sin giros" : `Giros hoy: ${appData[currentPlayer]}`}</p>
                </div>
            </div>

            <button id="weekly-btn" onClick={handleWeeklyChallenge}>🌟 Reto Semanal 🌟</button>

            {modalType === 'result' && modalContent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className={modalContent.isSuper ? 'super-jackpot-title' : ''}>{modalContent.title}</h2>
                        <div>
                            <div className="res-box prize">
                                <small>Tu Premio:</small>
                                <div className="value">{modalContent.premio}</div>
                            </div>
                            {modalContent.tarea && (
                                <div className="res-box secret">
                                    <small>Misión hacia {modalContent.partner}:</small>
                                    {!isSecretRevealed ? (
                                        <button id="reveal-btn" onClick={() => setIsSecretRevealed(true)}>🤫 Revelar Misión</button>
                                    ) : <div id="res-tarea">{modalContent.tarea}</div>}
                                </div>
                            )}
                        </div>
                        <button className="close-btn" onClick={() => setModalType(null)}>Aceptar ❤️</button>
                    </div>
                </div>
            )}
        </div>
    );
}
