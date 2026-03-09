import React from 'react';

type NavBarProps = {
    activeTab: 'slots' | 'games' | 'notebook';
    setActiveTab: (tab: 'slots' | 'games' | 'notebook') => void;
};

export default function NavBar({ activeTab, setActiveTab }: NavBarProps) {
    return (
        <div className="bottom-nav">
            <button
                className={`nav-item ${activeTab === 'slots' ? 'active' : ''}`}
                onClick={() => setActiveTab('slots')}
            >
                <span className="icon">🎰</span>
                <span className="label">Slots</span>
            </button>
            <button
                className={`nav-item ${activeTab === 'games' ? 'active' : ''}`}
                onClick={() => setActiveTab('games')}
            >
                <span className="icon">🎲</span>
                <span className="label">Juegos</span>
            </button>
            <button
                className={`nav-item ${activeTab === 'notebook' ? 'active' : ''}`}
                onClick={() => setActiveTab('notebook')}
            >
                <span className="icon">📖</span>
                <span className="label">Cuaderno</span>
            </button>
        </div>
    );
}
