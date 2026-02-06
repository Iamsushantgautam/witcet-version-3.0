import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Nav, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../styles/AllNotes.css'; // Common styles for tabs/search
import '../styles/Quantums.css'; // Specific card styles

import { SkeletonGrid } from './Skeleton';

const Quantums = () => {
    const [quantums, setQuantums] = useState([]);
    const [filteredQuantums, setFilteredQuantums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    // Categories configuration
    const categories = [
        { id: 'all', label: 'All' },
        { id: '3rd_year', label: '📢 3rd Year' },
        { id: '2nd_year', label: '📝 2nd Year' },
        { id: '1st_year', label: '📅 1st Year' }
    ];

    useEffect(() => {
        const fetchQuantums = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
                const response = await axios.get(`${apiUrl}/api/notes`);

                // Filter only items that have quantum data
                const allQuantums = response.data
                    .filter(item => item.quantumTitle && item.quantumLink);

                setQuantums(allQuantums);
                setFilteredQuantums(allQuantums);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching quantums:", err);
                setError("Failed to load quantums. Please try again later.");
                setLoading(false);
            }
        };

        fetchQuantums();
    }, []);

    // Filter logic
    useEffect(() => {
        let result = quantums;

        // 1. Filter by Category
        if (activeCategory !== 'all') {
            result = result.filter(item => item.tag === activeCategory);
        }

        // 2. Filter by Search Term
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.quantumTitle.toLowerCase().includes(lowerTerm)
            );
        }

        // 3. Filter only active quantums
        // Check if quantumLink exists AND quantumActive is true
        result = result.filter(note =>
            note.quantumLink &&
            (note.quantumActive === 'true' || note.quantumActive === true)
        );

        setFilteredQuantums(result);
    }, [searchTerm, activeCategory, quantums]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    if (error) return (
        <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    return (
        <div className="quantum-page py-4">
            <Container>
                <h2 className="text-center text-primary mb-4 fw-bold display-6">Quantums</h2>

                {/* Search Bar */}
                <Row className="mb-4">
                    <Col md={7} className="mx-auto">
                        <div className="search-wrapper position-relative">
                            <i className="fa fa-search position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }}></i>
                            <Form.Control
                                type="text"
                                placeholder="Search quantums..."
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

                {/* Quantums Grid */}
                {loading ? (
                    <SkeletonGrid count={6} />
                ) : (
                    <Row id="notesContainer" className="g-4">
                        {filteredQuantums.length > 0 ? (
                            filteredQuantums.map((item) => (
                                <Col md={6} lg={4} key={item._id} className="notice-item">
                                    <Card className="h-100 quantum-card border-0">
                                        <div className="quantum-img-wrapper">
                                            <Card.Img
                                                variant="top"
                                                src={item.quantumImagePath && item.quantumImagePath !== 'undefined'
                                                    ? (item.quantumImagePath.startsWith('http')
                                                        ? item.quantumImagePath
                                                        : `${import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com' || 'http://localhost:5000'}/images/${item.quantumImagePath}`)
                                                    : '/images/domo-q.png'
                                                }
                                                alt={item.quantumTitle}
                                                className="quantum-img"
                                                onError={(e) => {
                                                    e.target.src = '/images/domo-q.png';
                                                }}
                                            />
                                        </div>
                                        <Card.Body className="d-flex flex-column justify-content-between p-3 text-center">
                                            <Card.Title className="quantum-title">{item.quantumTitle}</Card.Title>
                                            <div className="mt-auto">
                                                <a
                                                    href={item.quantumLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary quantum-download-btn"
                                                >
                                                    <i className="fa fa-download me-2"></i> Download
                                                </a>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center py-5">
                                <p className="text-muted fs-5">No quantums found matching your criteria.</p>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Quantums;
