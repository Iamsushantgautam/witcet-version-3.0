import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Nav, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/AllNotes.css';

const AllNotes = () => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

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
                // Reverse to show newest first, matching template logic
                const allNotes = response.data.reverse();
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
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(note =>
                note.title.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredNotes(result);
    }, [searchTerm, activeCategory, notes]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    if (loading) return (
        <Container className="text-center py-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    if (error) return (
        <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    return (
        <div className="all-notes-page py-4">
            <Container>
                <h2 className="text-center text-primary mb-4 fw-bold display-6">Notes</h2>

                {/* Search Bar */}
                <Row className="mb-4">
                    <Col md={7} className="mx-auto">
                        <div className="search-wrapper position-relative">
                            <i className="fa fa-search position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }}></i>
                            <Form.Control
                                type="text"
                                placeholder="Search notices..."
                                className="search-input py-2 ps-5 border-1"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </Col>
                </Row>

                {/* Category Tabs */}
                <Nav className="justify-content-center category-tabs mb-5" variant="pills">
                    {categories.map((cat) => (
                        <Nav.Item key={cat.id} className="mx-2">
                            <Button
                                variant={activeCategory === cat.id ? 'primary' : 'link'}
                                className={`fw-medium text-decoration-none px-3 ${activeCategory === cat.id ? '' : 'text-secondary'}`}
                                onClick={() => handleCategoryClick(cat.id)}
                            >
                                {cat.label}
                            </Button>
                        </Nav.Item>
                    ))}
                </Nav>

                {/* Notes Grid */}
                <Row id="notesContainer" className="g-4">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <Col md={6} lg={4} key={note._id} className="notice-item">
                                <Card className="h-100 note-card custom-card">
                                    <div className="card-img-wrapper">
                                        <Card.Img
                                            variant="top"
                                            src={note.imagePath?.startsWith('http')
                                                ? note.imagePath
                                                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/images/${note.imagePath}`
                                            }
                                            alt={note.title}
                                            className="h-100 w-100 object-fit-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Notes+Preview';
                                            }}
                                        />
                                    </div>
                                    <Card.Body className="d-flex flex-column justify-content-between p-3 text-center">
                                        <Card.Title className="fw-bold mb-3 mt-2 note-title">{note.title}</Card.Title>
                                        <div className="mt-auto">
                                            <Link
                                                to={`/notes/${note.notesCode}`}
                                                className="btn btn-primary custom-download-btn px-4 py-2"
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
            </Container>
        </div>
    );
};

export default AllNotes;
