import React, { useState, useEffect } from 'react';
import SlotView from './components/SlotView';
import GamesView from './components/GamesView';
import NotebookView from './components/NotebookView';
import NavBar from './components/NavBar';
import type { AppData } from './components/SlotView';

const MAX_SPINS = 3;

export default function App() {
  const [activeTab, setActiveTab] = useState<'slots' | 'games' | 'notebook'>('slots');
  const [currentPlayer, setCurrentPlayer] = useState<'Maira' | 'Mauri'>('Maira');
  const [appData, setAppData] = useState<AppData | null>(null);

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('loveSlotDataV3');
    const today = new Date().toDateString();

    let parsed: AppData = data ? JSON.parse(data) : {
      date: today, Maira: MAX_SPINS, Mauri: MAX_SPINS,
      streak: 1, lastPlayDate: today, history: [], lastWeekly: null
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

    setAppData(parsed);
    localStorage.setItem('loveSlotDataV3', JSON.stringify(parsed));
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
    localStorage.setItem('loveSlotDataV3', JSON.stringify(newData));
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

  if (!appData) return null;

  return (
    <div className={`app-wrapper pb-nav`}>
      <div className="container" style={{ paddingBottom: '80px', minHeight: '100vh', boxSizing: 'border-box' }}>
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

        <div className="extra-controls" style={{ justifyContent: 'center', marginBottom: '15px' }}>
          <button className="btn-small" onClick={() => setShowHistory(true)}>📜 Ver Historial</button>
        </div>

        <div className="tabs">
          <button className={`tab ${currentPlayer === 'Maira' ? 'active' : ''}`} onClick={() => setCurrentPlayer('Maira')}>Maira</button>
          <button className={`tab ${currentPlayer === 'Mauri' ? 'active' : ''}`} onClick={() => setCurrentPlayer('Mauri')}>Mauri</button>
        </div>

        {activeTab === 'slots' && (
          <SlotView
            currentPlayer={currentPlayer}
            appData={appData}
            saveAppData={saveAppData}
            saveToHistory={saveToHistory}
          />
        )}

        {activeTab === 'games' && <GamesView />}

        {activeTab === 'notebook' && <NotebookView currentPlayer={currentPlayer} />}

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
