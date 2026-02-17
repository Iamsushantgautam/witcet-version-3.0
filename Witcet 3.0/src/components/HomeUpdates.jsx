import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Updates.css';

const HomeUpdates = () => {
    const navigate = useNavigate();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
                const response = await axios.get(`${apiUrl}/api/updates`);

                // Filter active and sort by date descending, then take top 3
                const latestUpdates = response.data
                    .filter(u => u.isActive)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 3);

                setUpdates(latestUpdates);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching updates:", err);
                setError("Failed to load updates.");
                setLoading(false);
            }
        };

        fetchUpdates();
    }, []);

    if (loading) return (
        <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
        </div>
    );

    if (error || updates.length === 0) return null;

    return (
        <section className="home-updates-section py-5" style={{ background: '#fff' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <span className="badge bg-primary-soft text-primary mb-2 px-3 py-2 rounded-pill fw-bold" style={{ background: 'rgba(13, 110, 253, 0.1)' }}>
                            <i className="fas fa-bullhorn me-2"></i> WHAT'S NEW
                        </span>
                        <h2 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Latest Updates & News</h2>
                    </div>
                    <Button
                        variant="link"
                        className="text-decoration-none fw-bold p-0"
                        onClick={() => navigate('/updates')}
                        style={{ color: '#0d6efd' }}
                    >
                        View All <i className="fas fa-arrow-right ms-1"></i>
                    </Button>
                </div>

                <Row className="g-4">
                    {updates.map((update) => (
                        <Col lg={4} md={6} key={update._id}>
                            <Card className="h-100 border-0 shadow-sm hover-up overflow-hidden" style={{ borderRadius: '24px', transition: 'all 0.3s ease' }}>

                                <Card.Body className="d-flex flex-column p-4">
                                    <div className="d-flex align-items-center mb-3 text-muted" style={{ fontSize: '0.85rem' }}>
                                        <i className="far fa-calendar-alt me-2 text-primary"></i>
                                        {new Date(update.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <h5 className="fw-bold mb-3" style={{ fontSize: '1.2rem', color: '#1e293b', lineHeight: '1.4' }}>
                                        {update.title}
                                    </h5>
                                    <p className="text-muted small mb-4 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                                        {update.description}
                                    </p>

                                    <div className="d-flex flex-wrap gap-2 mt-auto">
                                        {update.imageUrl && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="rounded-pill px-3 fw-bold flex-grow-1"
                                                onClick={() => window.open(update.imageUrl, '_blank')}
                                            >
                                                <i className="fas fa-image me-1"></i> View Image
                                            </Button>
                                        )}
                                        {update.pdfLink && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="rounded-pill px-3 fw-bold flex-grow-1"
                                                onClick={() => window.open(update.pdfLink, '_blank')}
                                            >
                                                <i className="fas fa-file-pdf me-1"></i> View PDF
                                            </Button>
                                        )}

                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-up:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1) !important;
                }
                .hover-up:hover .update-card-img {
                    transform: scale(1.1);
                }
                .bg-primary-soft {
                    background: rgba(13, 110, 253, 0.1);
                }
            `}} />
        </section>
    );
};

export default HomeUpdates;
