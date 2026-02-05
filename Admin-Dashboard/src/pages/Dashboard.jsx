import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FileText, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState({ notes: 0, detailedNotes: 0, updates: 0, users: 0 });
    const [notes, setNotes] = useState([]);
    const [detailedNotes, setDetailedNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, notesRes, detailedNotesRes] = await Promise.all([
                api.get('/stats'),
                api.get('/notes'),
                api.get('/detailed-notes')
            ]);
            setStatsData(statsRes.data);
            setNotes(notesRes.data);
            setDetailedNotes(detailedNotesRes.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-note/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
            // Update stats
            setStatsData(prev => ({ ...prev, notes: prev.notes - 1 }));
        } catch (err) {
            console.error("Error deleting note:", err);
            alert('Failed to delete note. Please try again.');
        }
    };

    const hasDetailedNote = (noteCode) => {
        if (!noteCode) return false;
        return detailedNotes.some(dn =>
            dn.notesCode?.toLowerCase() === noteCode.toLowerCase()
        );
    };

    const getDetailedNoteId = (noteCode) => {
        if (!noteCode) return null;
        const detailedNote = detailedNotes.find(dn =>
            dn.notesCode?.toLowerCase() === noteCode.toLowerCase()
        );
        return detailedNote?._id;
    };

    const filteredNotes = notes.filter(note =>
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.notesCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tag?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            {/* Header */}
            <h1 className="dashboard-heading">Welcome, Admin</h1>

            {/* Stats Card */}
            <div className="stat-card">
                <div className="stat-icon">
                    <FileText size={28} />
                </div>
                <div className="stat-content">
                    <div className="stat-label">Total Notes</div>
                    <div className="stat-value">{statsData.notes}</div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <div className="search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="🔍 Search notes..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => navigate('/add-note')} className="btn-add-note">
                    ➕ Add New Note
                </button>
            </div>

            {/* Latest Notes Section */}
            <div className="section-header">
                <h2 className="section-title">Latest Notes</h2>
            </div>

            {loading ? (
                <div className="loading-state">Loading notes...</div>
            ) : filteredNotes.length === 0 ? (
                <div className="empty-state">
                    {searchTerm ? 'No notes match your search.' : 'No notes added yet. Click "Add New Note" to get started.'}
                </div>
            ) : (
                <div className="notes-grid">
                    {filteredNotes.map((note) => (
                        <div key={note._id} className="note-card-light">
                            {hasDetailedNote(note.notesCode) && (
                                <div className="detailed-note-badge">
                                    📚 Has Detailed Notes
                                </div>
                            )}
                            {note.imagePath && (
                                <div className="note-card-image">
                                    <img src={note.imagePath} alt={note.title} />
                                </div>
                            )}
                            <h3 className="note-title-light">{note.title}</h3>
                            <p className="note-info">
                                <strong>Code:</strong> {note.notesCode || 'N/A'}
                            </p>
                            <p className="note-info">
                                <strong>Page:</strong> {note.notesPagePath || 'N/A'}
                            </p>
                            {note.quantumLink && (
                                <p className="note-info">
                                    <strong>Quantum:</strong>{' '}
                                    <a href={note.quantumLink} target="_blank" rel="noopener noreferrer" className="quantum-link">
                                        {note.title} Quantum
                                    </a>
                                </p>
                            )}
                            <div className="note-actions">
                                <button onClick={() => handleEdit(note._id)} className="btn-edit">
                                    <Edit size={14} />
                                    Edit
                                </button>
                                {hasDetailedNote(note.notesCode) && (
                                    <button
                                        onClick={() => navigate(`/detailed-notes`)}
                                        className="btn-detailed-note"
                                    >
                                        <BookOpen size={14} />
                                        View Details
                                    </button>
                                )}
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

export default Dashboard;
