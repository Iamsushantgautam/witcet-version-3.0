import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FileText, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import './Dashboard.css';
import './Toggle.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState({ notes: 0, activeNotes: 0, inactiveNotes: 0 });
    const [notes, setNotes] = useState([]);
    const [detailedNotes, setDetailedNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'available', 'unavailable'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [notesRes, detailedNotesRes] = await Promise.all([
                api.get('/notes'),
                api.get('/detailed-notes')
            ]);

            const fetchedNotes = notesRes.data;
            const activeCount = fetchedNotes.filter(n => n.notesPagePath === 'true').length;

            setStatsData({
                notes: fetchedNotes.length,
                activeNotes: activeCount,
                inactiveNotes: fetchedNotes.length - activeCount
            });
            setNotes(fetchedNotes);
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

    const handleToggleStatus = async (note, type = 'note') => {
        let field, currentValue, newValue;

        if (type === 'quantum') {
            field = 'quantumActive';
            currentValue = note.quantumActive;
        } else if (type === 'pyq') {
            field = 'pyqActive';
            currentValue = note.pyqActive;
        } else {
            field = 'notesPagePath';
            currentValue = note.notesPagePath;
        }

        newValue = currentValue === 'true' ? 'false' : 'true';

        try {
            // Optimistic update
            const updatedNotes = notes.map(n =>
                n._id === note._id ? { ...n, [field]: newValue } : n
            );
            setNotes(updatedNotes);

            // API call
            await api.put(`/notes/${note._id}`, { ...note, [field]: newValue });
        } catch (err) {
            console.error(`Error updating ${type} status:`, err);
            // Revert on error
            setNotes(notes);
            alert("Failed to update status");
        }
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch =
            note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.notesCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.tag?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' ? true :
                filterStatus === 'available' ? (note.notesPagePath === 'true') :
                    filterStatus === 'unavailable' ? (note.notesPagePath !== 'true') : true;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="dashboard-container">
            {/* Header */}
            <h1 className="dashboard-heading">Welcome, Admin</h1>

            {/* Stats Card */}
            {/* Stats Cards */}
            <div className="stats-grid mb-5">
                <div className="stat-card">
                    <div className="stat-icon bg-primary/10 text-primary">
                        <FileText size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Total Notes</div>
                        <div className="stat-value">{statsData.notes}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-success/10 text-success">
                        <FileText size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Available Notes</div>
                        <div className="stat-value">{statsData.activeNotes}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-secondary/10 text-secondary">
                        <FileText size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Not Available</div>
                        <div className="stat-value">{statsData.inactiveNotes}</div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <div className="search-wrapper flex-grow-1">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="🔍 Search notes..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="status-filter search-input"
                    style={{ maxWidth: '200px' }}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Notes</option>
                    <option value="available">Available Only</option>
                    <option value="unavailable">Not Available Only</option>
                </select>
                <button onClick={() => navigate('/add-note')} className="btn-add-note">
                    ➕ Add New
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
                            <div className="d-flex flex-column gap-2 mb-3 mt-3 bg-white/5 p-2 rounded-lg border border-white/5">
                                {/* Note Status */}
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex flex-column">
                                        <span className="small text-muted">Note:</span>
                                        <span className={`tiny-text ${hasDetailedNote(note.notesCode) ? 'text-success' : 'text-secondary'}`} style={{ fontSize: '0.7rem' }}>
                                            {hasDetailedNote(note.notesCode) ? '• Available' : '• Not Available'}
                                        </span>
                                    </div>
                                    <div className="toggle-wrapper m-0 scale-75">
                                        <label className="switch m-0" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={note.notesPagePath === 'true'}
                                                onChange={() => handleToggleStatus(note, 'note')}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>

                                {/* Quantum Status */}
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex flex-column">
                                        <span className="small text-muted">Quantum:</span>
                                        <span className={`tiny-text ${note.quantumLink ? 'text-success' : 'text-secondary'}`} style={{ fontSize: '0.7rem' }}>
                                            {note.quantumLink ? '• Available' : '• Not Available'}
                                        </span>
                                    </div>
                                    <div className="toggle-wrapper m-0 scale-75">
                                        <label className={`switch m-0 ${!note.quantumLink ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => !note.quantumLink && e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={note.quantumActive === 'true' && note.quantumLink}
                                                onChange={() => note.quantumLink && handleToggleStatus(note, 'quantum')}
                                                disabled={!note.quantumLink}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>

                                {/* PYQ Status */}
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex flex-column">
                                        <span className="small text-muted">PYQ:</span>
                                        <span className={`tiny-text ${note.pyqLink ? 'text-success' : 'text-secondary'}`} style={{ fontSize: '0.7rem' }}>
                                            {note.pyqLink ? '• Available' : '• Not Available'}
                                        </span>
                                    </div>
                                    <div className="toggle-wrapper m-0 scale-75">
                                        <label className={`switch m-0 ${!note.pyqLink ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={(e) => !note.pyqLink && e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={note.pyqActive === 'true' && note.pyqLink}
                                                onChange={() => note.pyqLink && handleToggleStatus(note, 'pyq')}
                                                disabled={!note.pyqLink}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>


                            <div className="note-actions">
                                <button onClick={() => handleEdit(note._id)} className="btn-edit">
                                    <Edit size={14} />
                                    Edit
                                </button>
                                {hasDetailedNote(note.notesCode) && (
                                    <button
                                        onClick={() => navigate(`/edit-detailed-notes/${getDetailedNoteId(note.notesCode)}`)}
                                        className="btn-detailed-note"
                                    >
                                        <Edit size={14} />
                                        Edit Details
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
