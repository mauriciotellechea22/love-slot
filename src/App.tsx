import React, { useState, useEffect, useRef } from 'react';
import SlotView from './components/SlotView';
import GamesView from './components/GamesView';
import NotebookView from './components/NotebookView';
import NavBar from './components/NavBar';
import type { AppData } from './components/SlotView';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase imports
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const MAX_SPINS = 3;
const ROOM_ID = 'pareja1'; // Hardcoded room for now

const DEFAULT_MAIRA_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=Maira&backgroundColor=ff007f";
const DEFAULT_MAURI_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=Mauri&backgroundColor=00e5ff";

export default function App() {
  const [activeTab, setActiveTab] = useState<'slots' | 'games' | 'notebook'>('slots');
  const [currentPlayer, setCurrentPlayer] = useState<'Maira' | 'Mauri'>('Maira');
  const [appData, setAppData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showHistory, setShowHistory] = useState(false);
  const mairaInputRef = useRef<HTMLInputElement>(null);
  const mauriInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const roomRef = doc(db, 'rooms', ROOM_ID);

    const unsubscribe = onSnapshot(roomRef, async (docSnap) => {
      const today = new Date().toDateString();

      if (docSnap.exists()) {
        const data = docSnap.data() as AppData;
        let needsUpdate = false;

        // Daily reset logic
        if (data.date !== today) {
          const lastDate = new Date(data.date);
          const currentDate = new Date(today);
          const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) data.streak += 1;
          else data.streak = 1;

          data.date = today;
          data.Maira = MAX_SPINS;
          data.Mauri = MAX_SPINS;
          needsUpdate = true;
        }

        // Migrations
        if (data.mairaCoins === undefined) { data.mairaCoins = 0; needsUpdate = true; }
        if (data.mauriCoins === undefined) { data.mauriCoins = 0; needsUpdate = true; }
        if (data.mairaAvatar === undefined) { data.mairaAvatar = DEFAULT_MAIRA_AVATAR; needsUpdate = true; }
        if (data.mauriAvatar === undefined) { data.mauriAvatar = DEFAULT_MAURI_AVATAR; needsUpdate = true; }

        if (needsUpdate) {
          try {
            await setDoc(roomRef, data, { merge: true });
          } catch (e: any) {
            console.error("Error setting doc update:", e);
            alert("Error de permisos en Firebase al inicializar la base de datos.");
          }
        } else {
          setAppData(data);
        }
      } else {
        // Init remote database if it doesn't exist
        const initialData: AppData = {
          date: today, Maira: MAX_SPINS, Mauri: MAX_SPINS,
          streak: 1, lastPlayDate: today, history: [], lastWeekly: null,
          mairaCoins: 0, mauriCoins: 0,
          mairaAvatar: DEFAULT_MAIRA_AVATAR,
          mauriAvatar: DEFAULT_MAURI_AVATAR
        };
        // Try reading from local storage once to migrate old data to cloud
        const localData = localStorage.getItem('loveSlotDataV4');
        const finalData = localData ? { ...initialData, ...JSON.parse(localData) } : initialData;

        try {
          await setDoc(roomRef, finalData);
        } catch (e: any) {
          console.error("Error creating initial DB:", e);
          alert("Error de Base de Datos. Es probable que debas configurar tus 'Reglas' de Firestore a 'Modo de prueba' o true.");
        }
        setAppData(finalData);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firebase sync error:", error);
      setIsLoading(false); // At least let it load something, or show error
    });

    return () => unsubscribe();
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

  const saveAppData = async (newData: AppData) => {
    // Optimistic UI update
    setAppData(newData);
    // Sync to cloud
    const roomRef = doc(db, 'rooms', ROOM_ID);
    try {
      await setDoc(roomRef, newData, { merge: true });
    } catch (e: any) {
      console.error(e);
      alert("La base de datos de Firebase no permite guardar. Verifica las Reglas en Google Console.");
    }
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

    // Check size limit (e.g. 500kb max for firestore document limits)
    if (file.size > 500 * 1024) {
      alert("La imagen es muy pesada. Trata de subir una foto de menos de 500KB.");
      return;
    }

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

  if (isLoading) return <div className="loading-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexDirection: 'column' }}>
    <div className="spinner" style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>💖</div>
    <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Conectando celulares en 3, 2, 1...</p>
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>;

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
                {/* Note: NotebookView will need to be refactored to read from Firestore subcollections or from appData */}
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
