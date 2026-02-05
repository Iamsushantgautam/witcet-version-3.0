import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search } from 'lucide-react';
import './Quantum.css';

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
