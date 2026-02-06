import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Download } from 'lucide-react';
import './PYQs.css';
import './Toggle.css';

const PYQs = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes');
            // Filter notes that have PYQ links
            const pyqNotes = res.data.filter(note => note.pyqLink || note.pyqTitle);
            setNotes(pyqNotes);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching PYQs:', err);
            setLoading(false);
        }
    };

    const handleToggleStatus = async (note) => {
        const newStatus = note.pyqActive === 'true' ? 'false' : 'true';
        try {
            // Optimistic update
            const updatedNotes = notes.map(n =>
                n._id === note._id ? { ...n, pyqActive: newStatus } : n
            );
            setNotes(updatedNotes);

            // API call
            await api.put(`/notes/${note._id}`, { ...note, pyqActive: newStatus });
        } catch (err) {
            console.error("Error updating status:", err);
            // Revert on error
            setNotes(notes);
            alert("Failed to update status");
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.pyqTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.notesCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pyq-container">
            <h2 className="pyq-heading">Previous Year Questions (PYQs)</h2>

            {/* Search Bar */}
            <div className="search-wrapper-pyq">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="🔍 Search PYQs..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* PYQ Cards Grid */}
            {loading ? (
                <div className="loading-state">Loading PYQs...</div>
            ) : filteredNotes.length === 0 ? (
                <div className="empty-state">
                    {searchTerm ? 'No PYQs match your search.' : 'No previous year question papers available.'}
                </div>
            ) : (
                <div className="pyq-grid">
                    {filteredNotes.slice().reverse().map((note) => (
                        <div key={note._id} className="pyq-card">

                            <div className="pyq-card-body">
                                {/* <h5 className="pyq-card-title">{note.title}</h5> */}
                                <p className="pyq-card-title">{note.pyqTitle || 'Previous Year Questions'}</p>
                                <div className="mb-2 d-flex align-items-center justify-content-between">
                                    <strong style={{ fontSize: '0.8rem' }}>Active:</strong>
                                    <div className="toggle-wrapper m-0">
                                        <label className="switch scale-75 m-0" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={note.pyqActive === 'true'}
                                                onChange={() => handleToggleStatus(note)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                {note.pyqLink ? (
                                    <a
                                        href={note.pyqLink}
                                        className="btn-pyq"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Download size={16} />
                                        View PYQ
                                    </a>
                                ) : (
                                    <button className="btn-pyq disabled" disabled>
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

export default PYQs;
