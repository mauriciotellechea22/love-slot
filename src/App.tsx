import React, { useState, useEffect, useRef } from 'react';
import SlotView from './components/SlotView';
import GamesView from './components/GamesView';
import NotebookView from './components/NotebookView';
import NavBar from './components/NavBar';
import type { AppData } from './components/SlotView';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_SPINS = 3;

const DEFAULT_MAIRA_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=Maira&backgroundColor=ff007f";
const DEFAULT_MAURI_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=Mauri&backgroundColor=00e5ff";

export default function App() {
  const [activeTab, setActiveTab] = useState<'slots' | 'games' | 'notebook'>('slots');
  const [currentPlayer, setCurrentPlayer] = useState<'Maira' | 'Mauri'>('Maira');
  const [appData, setAppData] = useState<AppData | null>(null);

  const [showHistory, setShowHistory] = useState(false);
  const mairaInputRef = useRef<HTMLInputElement>(null);
  const mauriInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const data = localStorage.getItem('loveSlotDataV4');
    const today = new Date().toDateString();

    let parsed: AppData = data ? JSON.parse(data) : {
      date: today, Maira: MAX_SPINS, Mauri: MAX_SPINS,
      streak: 1, lastPlayDate: today, history: [], lastWeekly: null,
      mairaCoins: 0, mauriCoins: 0,
      mairaAvatar: DEFAULT_MAIRA_AVATAR,
      mauriAvatar: DEFAULT_MAURI_AVATAR
    };

    if (parsed.date !== today) {
      const lastDate = new Date(parsed.date);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) parsed.streak += 1;
      else parsed.streak = 1;

      parsed.date = today;
      parsed.Maira = MAX_SPINS;
      parsed.Mauri = MAX_SPINS;
    }

    // Migrations for old users
    if (parsed.mairaCoins === undefined) parsed.mairaCoins = 0;
    if (parsed.mauriCoins === undefined) parsed.mauriCoins = 0;
    if (parsed.mairaAvatar === undefined) parsed.mairaAvatar = DEFAULT_MAIRA_AVATAR;
    if (parsed.mauriAvatar === undefined) parsed.mauriAvatar = DEFAULT_MAURI_AVATAR;

    setAppData(parsed);
    localStorage.setItem('loveSlotDataV4', JSON.stringify(parsed));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (currentPlayer === 'Maira') {
      root.style.setProperty('--active-color', 'var(--maira-color)');
      root.style.setProperty('--active-glow', 'var(--maira-glow)');
    } else {
      root.style.setProperty('--active-color', 'var(--mauri-color)');
      root.style.setProperty('--active-glow', 'var(--mauri-glow)');
    }
  }, [currentPlayer]);

  const saveAppData = (newData: AppData) => {
    setAppData(newData);
    localStorage.setItem('loveSlotDataV4', JSON.stringify(newData));
  };

  const saveToHistory = (premio: string, mode: string, isSuper: boolean) => {
    if (!appData) return;
    const newData = { ...appData };
    let icon = '💖';
    if (mode === 'picante') icon = '🌶️';
    if (mode === 'extremo') icon = '🔥';

    const superTag = isSuper ? '🏆 SUPER ' : '';
    newData.history.unshift({
      date: new Date().toLocaleDateString(),
      player: currentPlayer,
      desc: `${icon} ${superTag}${premio}`
    });
    if (newData.history.length > 15) newData.history.pop();
    saveAppData(newData);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>, player: 'Maira' | 'Mauri') => {
    const file = e.target.files?.[0];
    if (!file || !appData) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newData = { ...appData };
      if (player === 'Maira') newData.mairaAvatar = base64;
      else newData.mauriAvatar = base64;
      saveAppData(newData);
    };
    reader.readAsDataURL(file);
  };

  if (!appData) return null;

  const currentCoins = currentPlayer === 'Maira' ? appData.mairaCoins : appData.mauriCoins;

  return (
    <div className={`app-wrapper pb-nav`}>
      <div className="container" style={{ paddingBottom: '80px', minHeight: '100vh', boxSizing: 'border-box' }}>
        <div className="header-stats">
          <div style={{ position: 'relative' }} onClick={() => mairaInputRef.current?.click()}>
            <img src={appData.mairaAvatar} className={`avatar ${currentPlayer === 'Maira' ? 'active' : ''}`} alt="Maira" style={{ objectFit: 'cover' }} />
            <input type="file" ref={mairaInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleAvatarUpload(e, 'Maira')} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="streak-box" style={{ fontSize: '1rem' }}>🔥 Racha: <span>{appData.streak}</span></div>
            <div className="coins-badge" style={{ marginTop: '5px', background: 'rgba(255, 215, 0, 0.2)', padding: '4px 10px', borderRadius: '15px', color: '#ffd700', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid #ffd700' }}>
              🪙 {currentCoins} Coins
            </div>
          </div>

          <div style={{ position: 'relative' }} onClick={() => mauriInputRef.current?.click()}>
            <img src={appData.mauriAvatar} className={`avatar ${currentPlayer === 'Mauri' ? 'active' : ''}`} alt="Mauri" style={{ objectFit: 'cover' }} />
            <input type="file" ref={mauriInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => handleAvatarUpload(e, 'Mauri')} />
          </div>
        </div>

        <div className="extra-controls" style={{ justifyContent: 'center', marginBottom: '15px' }}>
          <button className="btn-small" onClick={() => setShowHistory(true)}>📜 Ver Historial</button>
        </div>

        <div className="tabs">
          <button className={`tab ${currentPlayer === 'Maira' ? 'active' : ''}`} onClick={() => setCurrentPlayer('Maira')}>Maira</button>
          <button className={`tab ${currentPlayer === 'Mauri' ? 'active' : ''}`} onClick={() => setCurrentPlayer('Mauri')}>Mauri</button>
        </div>

        <div style={{ width: '100%', position: 'relative', overflowX: 'hidden' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'slots' && (
              <motion.div key="slots" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>
                <SlotView currentPlayer={currentPlayer} appData={appData} saveAppData={saveAppData} saveToHistory={saveToHistory} />
              </motion.div>
            )}
            {activeTab === 'games' && (
              <motion.div key="games" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>
                <GamesView appData={appData} currentPlayer={currentPlayer} saveAppData={saveAppData} />
              </motion.div>
            )}
            {activeTab === 'notebook' && (
              <motion.div key="notebook" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.2 }} style={{ width: '100%' }}>
                <NotebookView currentPlayer={currentPlayer} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showHistory && (
          <div className="modal-overlay">
            <div className="modal-content history-modal">
              <h2>📜 Últimos Premios</h2>
              <div className="history-list">
                {appData.history.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#888' }}>Aún no hay premios ganados.</p>
                ) : (
                  appData.history.map((item, idx) => (
                    <div key={idx} className="history-item">
                      <small>{item.date} - <span style={{ color: 'var(--active-color)' }}>{item.player}</span></small><br />
                      {item.desc}
                    </div>
                  ))
                )}
              </div>
              <button className="close-btn" onClick={() => setShowHistory(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>

      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
