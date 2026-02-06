import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search } from 'lucide-react';
import './Quantum.css';
import './Toggle.css';

const Quantum = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes');
            setNotes(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching notes:', err);
            setLoading(false);
        }
    };

    const handleToggleStatus = async (note) => {
        const newStatus = note.quantumActive === 'true' ? 'false' : 'true';
        try {
            // Optimistic update
            const updatedNotes = notes.map(n =>
                n._id === note._id ? { ...n, quantumActive: newStatus } : n
            );
            setNotes(updatedNotes);

            // API call
            await api.put(`/notes/${note._id}`, { ...note, quantumActive: newStatus });
        } catch (err) {
            console.error("Error updating status:", err);
            // Revert on error
            setNotes(notes);
            alert("Failed to update status");
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.quantumTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.notesCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="quantum-container">
            <h2 className="quantum-heading">Quantum</h2>

            {/* Search Bar */}
            <div className="search-wrapper-quantum">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="🔍 Search notes..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Quantum Cards Grid */}
            {loading ? (
                <div className="loading-state">Loading quantum notes...</div>
            ) : filteredNotes.length === 0 ? (
                <div className="empty-state">
                    {searchTerm ? 'No notes match your search.' : 'No previous year question papers available.'}
                </div>
            ) : (
                <div className="quantum-grid">
                    {filteredNotes.slice().reverse().map((note) => (
                        <div key={note._id} className="quantum-card">
                            <div className="quantum-card-body">
                                <h5 className="quantum-card-title">{note.title}</h5>
                                <p className="quantum-card-text">{note.quantumTitle || 'Quantum Study Material'}</p>
                                <div className="mb-2 d-flex align-items-center justify-content-between">
                                    <strong style={{ fontSize: '0.8rem' }}>Active:</strong>
                                    <div className="toggle-wrapper m-0">
                                        <label className="switch scale-75 m-0" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={note.quantumActive === 'true'}
                                                onChange={() => handleToggleStatus(note)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                {note.quantumLink && (
                                    <a
                                        href={note.quantumLink}
                                        className="btn-quantum"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Quantum
                                    </a>
                                )}
                                {!note.quantumLink && (
                                    <button className="btn-quantum disabled" disabled>
                                        No Link Available
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quantum;
