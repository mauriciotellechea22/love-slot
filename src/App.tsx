/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. DATOS Y ARRAYS (ROMÁNTICO VS PICANTE)
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

// --- SUPER JACKPOTS 🏆 (5% de probabilidad) ---
const superJackpots = [
  "¡FIN DE SEMANA EN UN HOTEL!",
  "¡CENA EN SU RESTAURANTE FAVORITO PAGADA!",
  "¡DÍA COMPLETO DE CONSENTIR AL OTRO SIN QUEJAS!",
  "¡VALE POR UN REGALO SORPRESA DE AMAZON!"
];

// --- RETOS SEMANALES 🌟 ---
const retosSemanales = [
  "Cocinar juntos en ropa interior",
  "Recrear su primera cita exactamente igual",
  "Noche de masajes de 1 hora completa",
  "Apagar los celulares toda la tarde y solo hablar",
  "Bañarse juntos con velas y música"
];

const iconosSecretos = ["🤫", "💌", "🎁", "💖", "🔐", "🔥", "😈"];

const MAX_SPINS = 3;
const REEL_HEIGHT = 55;

// Types
type Player = 'Maira' | 'Mauri';
type AppData = {
  date: string;
  Maira: number;
  Mauri: number;
  streak: number;
  lastPlayDate: string;
  history: Array<{ date: string; player: Player; desc: string }>;
  lastWeekly: string | null;
};

export default function App() {
  // State
  const [currentPlayer, setCurrentPlayer] = useState<Player>('Maira');
  const [isSpicy, setIsSpicy] = useState(false);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Modals
  const [modalType, setModalType] = useState<'result' | 'history' | null>(null);
  const [modalContent, setModalContent] = useState<any>(null);
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);

  // Refs for Audio and Reels
  const audioCtxRef = useRef<AudioContext | null>(null);
  const reel1Ref = useRef<HTMLDivElement>(null);
  const reel2Ref = useRef<HTMLDivElement>(null);
  const reel3Ref = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    const data = localStorage.getItem('loveSlotDataV3');
    const today = new Date().toDateString();

    let parsed: AppData = data ? JSON.parse(data) : {
      date: today, Maira: MAX_SPINS, Mauri: MAX_SPINS,
      streak: 1, lastPlayDate: today, history: [], lastWeekly: null
    };

    // Lógica de cambio de día y racha
    if (parsed.date !== today) {
      const lastDate = new Date(parsed.date);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        parsed.streak += 1; // Jugó días consecutivos
      } else {
        parsed.streak = 1; // Perdió la racha
      }

      parsed.date = today;
      parsed.Maira = MAX_SPINS;
      parsed.Mauri = MAX_SPINS;
    }

    setAppData(parsed);
    localStorage.setItem('loveSlotDataV3', JSON.stringify(parsed));
  }, []);

  // Update CSS Variables based on player and mode
  useEffect(() => {
    const root = document.documentElement;
    if (isSpicy) {
      document.body.classList.add('spicy');
      document.getElementById('theme-color-meta')?.setAttribute('content', '#1a0000');
    } else {
      document.body.classList.remove('spicy');
      document.getElementById('theme-color-meta')?.setAttribute('content', '#ff007f');
    }

    if (currentPlayer === 'Maira') {
      root.style.setProperty('--active-color', 'var(--maira-color)');
      root.style.setProperty('--active-glow', 'var(--maira-glow)');
    } else {
      root.style.setProperty('--active-color', 'var(--mauri-color)');
      root.style.setProperty('--active-glow', 'var(--mauri-glow)');
    }

    // Update initial reel text if not spinning
    if (!isSpinning && reel1Ref.current && reel2Ref.current) {
      // Only update if empty or static content
      if (!reel1Ref.current.querySelector('.reel-strip')) {
        reel1Ref.current.innerHTML = `<div class="reel-item">${isSpicy ? frasesPicantes[0] : frasesRomanticas[0]}</div>`;
        reel2Ref.current.innerHTML = `<div class="reel-item">${isSpicy ? premiosPicantes[0] : premiosRomanticos[0]}</div>`;
      }
    }
  }, [currentPlayer, isSpicy, isSpinning]);

  // Initial Reel Setup
  useEffect(() => {
    if (reel3Ref.current && !reel3Ref.current.innerHTML) {
      reel3Ref.current.innerHTML = `<div class="reel-item">💌</div>`;
    }
  }, []);


  const saveAppData = (newData: AppData) => {
    setAppData(newData);
    localStorage.setItem('loveSlotDataV3', JSON.stringify(newData));
  };

  const saveToHistory = (premio: string, isSuper: boolean) => {
    if (!appData) return;
    const newData = { ...appData };
    const type = isSpicy ? '🌶️' : '💖';
    const superTag = isSuper ? '🏆 SUPER ' : '';
    newData.history.unshift({
      date: new Date().toLocaleDateString(),
      player: currentPlayer,
      desc: `${type} ${superTag}${premio}`
    });
    if (newData.history.length > 15) newData.history.pop();
    saveAppData(newData);
  };

  // Audio Logic
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
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

  const fireConfetti = () => {
    const colors = ['#ff007f', '#ffd700', '#00e5ff', '#ffffff', '#ff3300'];
    for (let i = 0; i < 60; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti-piece';
      conf.style.left = Math.random() * 100 + 'vw';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.animationDuration = (Math.random() * 2 + 2) + 's';
      conf.style.animationDelay = Math.random() * 1 + 's';
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 4000);
    }
  };

  // Reel Logic
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

      strip.style.transform = `translateY(0px)`;
      void strip.offsetWidth; // Force reflow

      container.classList.add('blur');

      // Sonido de tictac mientras gira
      const tickInterval = setInterval(playTick, 100);

      strip.style.transition = `transform ${duration}ms cubic-bezier(0.15, 0.85, 0.3, 1)`;
      const targetY = -((totalItems - 1) * REEL_HEIGHT);
      strip.style.transform = `translateY(${targetY}px)`;

      setTimeout(() => {
        clearInterval(tickInterval);
        container.classList.remove('blur');
        resolve(targetItem);
      }, duration);
    });
  };

  const handleSpin = async () => {
    if (!appData || appData[currentPlayer] <= 0 || isSpinning) return;

    initAudio();
    setIsSpinning(true);

    // Elegir arrays según modo
    const frases = isSpicy ? frasesPicantes : frasesRomanticas;
    let premios = isSpicy ? premiosPicantes : premiosRomanticos;
    const tareasMaira = isSpicy ? tareasMairaPicantes : tareasMairaRomanticas;
    const tareasMauri = isSpicy ? tareasMauriPicantes : tareasMauriRomanticas;

    // Lógica Super Jackpot (5% de probabilidad)
    let isSuperJackpot = Math.random() < 0.05;
    if (isSuperJackpot) {
      premios = superJackpots;
    }

    if (!reel1Ref.current || !reel2Ref.current || !reel3Ref.current) return;

    const p1 = spinReel(reel1Ref.current, frases, 2000);
    const p2 = spinReel(reel2Ref.current, premios, 2500);
    const p3 = spinReel(reel3Ref.current, iconosSecretos, 3000);

    const [resFrase, resPremio, resIcono] = await Promise.all([p1, p2, p3]);

    vibrate();
    playWin(isSuperJackpot);
    fireConfetti();

    // Guardar datos
    const newData = { ...appData };
    newData[currentPlayer] -= 1;
    saveAppData(newData);
    saveToHistory(resPremio, isSuperJackpot);

    const arrayTareas = currentPlayer === 'Maira' ? tareasMaira : tareasMauri;
    const tareaSecreta = arrayTareas[Math.floor(Math.random() * arrayTareas.length)];

    setTimeout(() => {
      setModalContent({
        title: isSuperJackpot ? `🏆 ¡SUPER JACKPOT, ${currentPlayer}! 🏆` : `¡Jackpot, ${currentPlayer}! 🎰`,
        isSuper: isSuperJackpot,
        frase: resFrase,
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
    saveToHistory(`RETO SEMANAL: ${reto}`, false);

    playWin(true);
    fireConfetti();

    setModalContent({
      title: `🌟 ¡RETO SEMANAL! 🌟`,
      isSuper: true,
      frase: "Este es un reto para cumplir juntos hoy.",
      premio: reto,
      tarea: null, // No hay secreto
      partner: null
    });
    setModalType('result');
  };

  const getWeeklyButtonState = () => {
    if (!appData) return { disabled: true, text: "Cargando..." };
    if (!appData.lastWeekly) return { disabled: false, text: "🌟 Reto Semanal de Pareja 🌟" };

    const lastW = new Date(appData.lastWeekly);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now.getTime() - lastW.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return { disabled: true, text: `Reto Semanal (Disponible en ${7 - diffDays} días)` };
    }
    return { disabled: false, text: "🌟 Reto Semanal de Pareja 🌟" };
  };

  if (!appData) return null;

  const weeklyState = getWeeklyButtonState();

  return (
    <div className="container">
      {/* Header: Avatares y Racha */}
      <div className="header-stats">
        <img
          src="https://api.dicebear.com/7.x/adventurer/svg?seed=Maira&backgroundColor=ff007f"
          className={`avatar ${currentPlayer === 'Maira' ? 'active' : ''}`}
          alt="Maira"
        />
        <div className="streak-box">🔥 Racha: <span>{appData.streak}</span></div>
        <img
          src="https://api.dicebear.com/7.x/adventurer/svg?seed=Mauri&backgroundColor=00e5ff"
          className={`avatar ${currentPlayer === 'Mauri' ? 'active' : ''}`}
          alt="Mauri"
        />
      </div>

      {/* Controles Extra */}
      <div className="extra-controls">
        <button className="btn-small" onClick={() => setModalType('history')}>📜 Historial</button>
        <div className="switch-container">
          <span>💖</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isSpicy}
              onChange={(e) => setIsSpicy(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          <span>🌶️</span>
        </div>
      </div>

      {/* Selector de Jugador */}
      <div className="tabs">
        <button
          className={`tab ${currentPlayer === 'Maira' ? 'active' : ''}`}
          onClick={() => setPlayer('Maira')}
        >
          Maira
        </button>
        <button
          className={`tab ${currentPlayer === 'Mauri' ? 'active' : ''}`}
          onClick={() => setPlayer('Mauri')}
        >
          Mauri
        </button>
      </div>

      <div className="title">
        Slot de {currentPlayer}
      </div>

      <div className="slot-machine">
        <div className="lights"></div>

        <div className="reels-container">
          <div className="reel" ref={reel1Ref}></div>
          <div className="reel" ref={reel2Ref}></div>
          <div className="reel" id="reel3" ref={reel3Ref}></div>
        </div>

        <div className="controls">
          <button
            id="spin-btn"
            onClick={handleSpin}
            disabled={appData[currentPlayer] <= 0 || isSpinning}
          >
            {appData[currentPlayer] <= 0 ? "Vuelve mañana ❤️" : "TIRAR DE LA PALANCA"}
          </button>
          <p id="spins-left">
            {appData[currentPlayer] <= 0 ? "¡Has agotado tus giros por hoy!" : `Tus giros hoy: ${appData[currentPlayer]}`}
          </p>
        </div>
      </div>

      {/* Reto Semanal */}
      <button
        id="weekly-btn"
        onClick={handleWeeklyChallenge}
        disabled={weeklyState.disabled}
      >
        {weeklyState.text}
      </button>

      {/* Modales */}
      {modalType === 'result' && modalContent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className={modalContent.isSuper ? 'super-jackpot-title' : ''}>
              {modalContent.title}
            </h2>

            <div>
              <div className="res-box prize">
                <small>Tu Premio:</small>
                <div className="value">{modalContent.premio}</div>
              </div>

              {modalContent.tarea && (
                <div className="res-box secret">
                  <small>Misión Secreta hacia {modalContent.partner}:</small>
                  {!isSecretRevealed ? (
                    <button id="reveal-btn" onClick={() => setIsSecretRevealed(true)}>
                      🤫 Revelar Misión (Que no mire)
                    </button>
                  ) : (
                    <div id="res-tarea">{modalContent.tarea}</div>
                  )}
                </div>
              )}
            </div>

            <button className="close-btn" onClick={() => setModalType(null)}>
              Aceptar y Guardar ❤️
            </button>
          </div>
        </div>
      )}

      {modalType === 'history' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>📜 Últimos Premios</h2>
            <div className="history-list">
              {appData.history.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Aún no hay premios ganados.</p>
              ) : (
                appData.history.map((item, idx) => (
                  <div key={idx} className="history-item">
                    <small>{item.date} - <span>{item.player}</span></small><br />
                    {item.desc}
                  </div>
                ))
              )}
            </div>
            <button className="close-btn" onClick={() => setModalType(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );

  function setPlayer(player: Player) {
    setCurrentPlayer(player);
  }
}
