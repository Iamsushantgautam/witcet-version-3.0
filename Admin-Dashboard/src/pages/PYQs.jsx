import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Download } from 'lucide-react';
import './PYQs.css';

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
