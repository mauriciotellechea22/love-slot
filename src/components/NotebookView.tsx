import React, { useState, useEffect } from 'react';
import type { AppData } from './SlotView';

type Note = {
    id: number;
    date: string;
    author: 'Maira' | 'Mauri';
    text: string;
};

type NotebookProps = {
    currentPlayer: 'Maira' | 'Mauri';
};

export default function NotebookView({ currentPlayer }: NotebookProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [draft, setDraft] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('loveSlotNotes');
        if (saved) {
            setNotes(JSON.parse(saved));
        }
    }, []);

    const saveNote = () => {
        if (!draft.trim()) return;
        const newNote: Note = {
            id: Date.now(),
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            author: currentPlayer,
            text: draft
        };
        const newNotes = [newNote, ...notes];
        setNotes(newNotes);
        localStorage.setItem('loveSlotNotes', JSON.stringify(newNotes));
        setDraft('');
    };

    const deleteNote = (id: number) => {
        const filtered = notes.filter(n => n.id !== id);
        setNotes(filtered);
        localStorage.setItem('loveSlotNotes', JSON.stringify(filtered));
    };

    return (
        <div className="notebook-view">
            <h2>📖 Nuestro Cuaderno</h2>
            <p className="subtitle">Déjale una nota sorpresa para cuando abra la app.</p>

            <div className="compose-area">
                <textarea
                    placeholder={`Escribe un mensaje romántico o caliente jugando como ${currentPlayer}...`}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                />
                <button className="send-btn" onClick={saveNote}>💌 Dejar Nota</button>
            </div>

            <div className="notes-list">
                {notes.length === 0 && <p className="empty-state">No hay notas todavía. ¡Sé el/la primera en escribir!</p>}
                {notes.map(note => (
                    <div key={note.id} className={`note-card ${note.author === 'Maira' ? 'maira-note' : 'mauri-note'}`}>
                        <div className="note-header">
                            <span className="author">{note.author}</span>
                            <span className="date">{note.date}</span>
                        </div>
                        <p className="note-body">{note.text}</p>
                        {note.author === currentPlayer && (
                            <button className="delete-note" onClick={() => deleteNote(note.id)}>🗑️</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
