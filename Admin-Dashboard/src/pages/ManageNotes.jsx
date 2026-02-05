import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Plus, Edit2, Trash2, ExternalLink, FileText } from 'lucide-react';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import AddNote from './AddNote';

const ManageNotes = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes');
            setNotes(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching notes:", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.notesCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showAddForm) {
        return (
            <AddNote
                onCancel={() => setShowAddForm(false)}
                onSuccess={() => {
                    setShowAddForm(false);
                    fetchNotes();
                }}
            />
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h2 className="text-white fw-bold mb-1">Manage Notes</h2>
                    <p className="text-slate-400 small">Organize and maintain your study materials</p>
                </div>
                <Button
                    onClick={() => setShowAddForm(true)}
                    className="btn-gradient-primary d-flex align-items-center gap-2 px-4 py-2"
                >
                    <Plus size={18} />
                    <span>Add New Note</span>
                </Button>
            </div>

            <div className="glass p-4 mb-5">
                <div className="position-relative">
                    <Search className="position-absolute top-50 translate-middle-y ms-3 text-slate-500" size={18} />
                    <Form.Control
                        type="text"
                        placeholder="Search by title, code, or tag..."
                        className="bg-white/5 border-white/10 text-white ps-5 py-3 rounded-xl search-input-focus"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading notes...</div>
            ) : (
                <Row>
                    {filteredNotes.map((note) => (
                        <Col key={note._id} lg={4} md={6} className="mb-4">
                            <Card className="premium-note-card border-0">
                                <Card.Body className="p-4 d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                            <FileText size={20} />
                                        </div>
                                        <Badge bg="none" className="border border-indigo-500/30 text-indigo-400 fw-bold px-2 py-1">
                                            {note.notesCode || 'CODE'}
                                        </Badge>
                                    </div>

                                    <Card.Title className="text-white fw-bold mb-2">{note.title}</Card.Title>
                                    <Card.Text className="text-slate-400 small flex-grow-1">
                                        <div className="mb-1"><strong>Path:</strong> {note.notesPagePath}</div>
                                        {note.tag && <div><strong>Tag:</strong> {note.tag}</div>}
                                    </Card.Text>

                                    <div className="mt-4 pt-4 border-t border-white/5 d-flex gap-2">
                                        <Button variant="outline-light" className="flex-grow-1 border-white/10 hover:bg-white/5 d-flex align-items-center justify-content-center gap-2 text-xs py-2">
                                            <Edit2 size={14} />
                                            <span>Edit</span>
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => handleDelete(note._id)}
                                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 d-flex align-items-center justify-content-center px-3"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    {filteredNotes.length === 0 && (
                        <Col className="text-center py-5">
                            <p className="text-slate-500">No notes found matching your search.</p>
                        </Col>
                    )}
                </Row>
            )}

        </div>
    );
};

export default ManageNotes;
