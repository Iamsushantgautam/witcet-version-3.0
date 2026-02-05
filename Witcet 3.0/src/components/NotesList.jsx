import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const NotesList = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for immediate preview in case backend is not ready


    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                // Fetching from the production Render API
                const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
                const response = await axios.get(`${apiUrl}/api/notes`);

                // Processing: Take last 9, and reverse them to show newest first
                const fetchedNotes = Array.isArray(response.data)
                    ? response.data.slice(-9).reverse()
                    : [];

                setNotes(fetchedNotes);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching notes:', err);
                setError('Failed to load notes. Please try again later.');
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-secondary">Fetching latest notes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-5 text-center">
                <div className="alert alert-danger shadow-sm rounded-4">{error}</div>
            </Container>
        );
    }

    return (
        <section className="notes-section py-5">
            <Container>
                <div className="section-header text-center mb-5">
                    <h2 className="fw-bold display-5 gradient-text">Latest AKTU Notes</h2>
                    <p className="text-secondary">Explore the most recent additions to our library</p>
                </div>

                <Row id="notesContainer" className="g-4">
                    {notes.map((note) => (
                        <Col md={6} lg={4} key={note._id} className="notice-item" data-category={note.tag}>
                            <Card className="h-100 shadow-sm border-0 note-card animate-fade-in">
                                <div className="card-img-container">
                                    <Card.Img
                                        variant="top"
                                        src={note.imagePath?.startsWith('http')
                                            ? note.imagePath
                                            : `${import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com' || 'http://localhost:5000'}/images/${note.imagePath}`
                                        }
                                        alt={note.title}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Notes+Preview';
                                        }}
                                    />
                                </div>
                                <Card.Body className="d-flex flex-column justify-content-between p-4">
                                    <Card.Title className="text-center fw-bold mb-3">{note.title}</Card.Title>
                                    <div className="text-center mt-auto">
                                        <Button
                                            href={`/notes/${note.notesCode}`}
                                            className="btn-download rounded-pill px-4 py-2"
                                        >
                                            <i className="fa fa-download me-2"></i> Download
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="text-center mt-5">
                    <Button href="/notes" variant="outline-primary" className="rounded-pill px-5">
                        View All Notes
                    </Button>
                </div>
            </Container>
        </section>
    );
};

export default NotesList;
