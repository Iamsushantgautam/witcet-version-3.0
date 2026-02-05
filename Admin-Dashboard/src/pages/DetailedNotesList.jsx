import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, Edit, Trash2, FileText, Plus } from 'lucide-react';
import './DetailedNotesList.css';

const DetailedNotesList = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/detailed-notes');
            setNotes(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching detailed notes:', err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this detailed note?')) return;
        try {
            await api.delete(`/detailed-notes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
            alert('Detailed note deleted successfully!');
        } catch (err) {
            console.error('Error deleting detailed note:', err);
            alert('Failed to delete detailed note. Please try again.');
        }
    };

    const filteredNotes = notes.filter(note =>
        note.notesTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.notesCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.introTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="detailed-notes-container">
            <h2 className="detailed-notes-heading">Detailed Notes List</h2>

            {/* Search and Add Button */}
            <div className="search-container">
                <div className="search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="🔍 Search detailed notes..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => navigate('/add-detailed-notes')} className="btn-add-note">
                    <Plus size={18} />
                    Add Detailed Note
                </button>
            </div>

            {/* Notes List */}
            {loading ? (
                <div className="loading-state">Loading detailed notes...</div>
            ) : filteredNotes.length === 0 ? (
                <div className="empty-state">
                    {searchTerm ? 'No detailed notes match your search.' : 'No detailed notes added yet. Click "Add Detailed Note" to get started.'}
                </div>
            ) : (
                <div className="detailed-notes-grid">
                    {filteredNotes.map((note) => (
                        <div key={note._id} className="detailed-note-card">
                            <div className="note-header">
                                <div className="note-icon">
                                    <FileText size={24} />
                                </div>
                                <div className="note-info-header">
                                    <h3 className="note-title">{note.notesTitle}</h3>
                                    {note.notesCode && (
                                        <span className="note-code">{note.notesCode}</span>
                                    )}
                                </div>
                            </div>

                            <p className="note-intro">{note.introTitle}</p>

                            <div className="units-list">
                                <h4 className="units-title">Units ({note.units?.length || 0})</h4>
                                {note.units && note.units.length > 0 ? (
                                    <ul className="units-items">
                                        {note.units.map((unit, index) => (
                                            <li key={index} className="unit-item">
                                                <span className="unit-number">{index + 1}.</span>
                                                {unit.unitTitle}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-units">No units added</p>
                                )}
                            </div>

                            <div className="note-actions">
                                <button className="btn-edit">
                                    <Edit size={14} />
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(note._id)} className="btn-delete">
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DetailedNotesList;
