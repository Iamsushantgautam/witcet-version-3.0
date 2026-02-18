import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Nav, Spinner, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/AllNotes.css';
import '../styles/Tools.css';

import { SkeletonGrid } from '../components/Skeleton';
import SearchBar from '../components/SearchBar';

const AllNotes = () => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const location = useLocation();

    // Sync URL search to state
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('search');
        if (q) {
            setSearchTerm(decodeURIComponent(q));
        } else {
            setSearchTerm('');
        }
    }, [location.search]);

    // Categories configuration
    const categories = [
        { id: 'all', label: 'All' },
        { id: '4th_year', label: '🎓 4th Year' },
        { id: '3rd_year', label: '📢 3rd Year' },
        { id: '2nd_year', label: '📝 2nd Year' },
        { id: '1st_year', label: '📅 1st Year' }
    ];

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/api/notes`);
                // Backend sorts by createdAt: -1 (Newest First), so no correct to reverse.
                const allNotes = response.data;
                setNotes(allNotes);
                setFilteredNotes(allNotes);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching notes:", err);
                setError("Failed to load notes. Please try again later.");
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    // Filter logic
    useEffect(() => {
        let result = notes;

        // 1. Filter by Category
        if (activeCategory !== 'all') {
            result = result.filter(note => note.tag === activeCategory);
        }

        // 2. Filter by Search Term
        // 2. Filter by Search Term
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(note =>
                note.title.toLowerCase().includes(lowerTerm) ||
                (note.tag && note.tag.toLowerCase().includes(lowerTerm)) ||
                (note.notesCode && note.notesCode.toLowerCase().includes(lowerTerm))
            );
        }

        // 3. Filter only active notes (notesPagePath === 'true')
        // Only checking this because the user asked to "only notes to user in witcet 3.0 site activete notes"
        // Assuming this means hide inactive notes entirely from the list?
        // Or maybe just disable the button? The prompt implies "only notes to user... activete notes"
        // I will filter them out of the display list so inactive notes don't show up.
        result = result.filter(note => note.notesPagePath === 'true' || note.notesPagePath === true);

        setFilteredNotes(result);
    }, [searchTerm, activeCategory, notes]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    if (error) return (
        <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    return (
        <div className="all-notes-page py-8">
            <Container>
                <h2 className="text-center text-primary mb-4 fw-bold display-6">Notes</h2>

                {/* Search Bar */}
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search notes..."
                />


                {/* Category Tabs */}
                <div className="category-grid mb-5">
                    {categories.map((cat) => (
                        <div key={cat.id} className="category-item">
                            <Button
                                variant={activeCategory === cat.id ? 'primary' : 'light'}
                                className={`w-100 fw-medium text-decoration-none py-2 ${activeCategory === cat.id ? 'shadow-sm' : 'bg-white border'}`}
                                onClick={() => handleCategoryClick(cat.id)}
                            >
                                {cat.label}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Notes Grid */}
                {loading ? (
                    <SkeletonGrid count={6} />
                ) : (
                    <Row id="notesContainer" className="g-4">
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => (
                                <Col md={6} lg={4} key={note._id} className="notice-item">
                                    <Card className="h-100 custom-card animate-fade-in">
                                        <div className="card-img-wrapper">
                                            <Card.Img
                                                variant="top"
                                                src={note.imagePath && note.imagePath !== 'undefined'
                                                    ? (note.imagePath.startsWith('http')
                                                        ? note.imagePath
                                                        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/images/${note.imagePath}`)
                                                    : '/images/domo-notes.png'
                                                }
                                                alt={note.title}
                                                onError={(e) => {
                                                    e.target.src = '/images/domo-notes.png';
                                                }}
                                            />
                                        </div>
                                        <Card.Body className="d-flex flex-column justify-content-between p-3">
                                            <Card.Title className="text-center note-title mb-3">{note.title}</Card.Title>
                                            <div className="text-center mt-auto">
                                                <Link
                                                    to={`/notes/${note.notesCode}`}
                                                    className="btn btn-primary custom-download-btn px-4 py-2 "
                                                >
                                                    <i className="fa fa-download me-2"></i> Download
                                                </Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center py-5">
                                <p className="text-muted fs-5">No notes found matching your criteria.</p>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default AllNotes;
