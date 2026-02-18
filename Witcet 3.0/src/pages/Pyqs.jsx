import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Nav, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../styles/AllNotes.css'; // Reusing the standard landscape card styles
import '../styles/Tools.css';
import { SkeletonGrid } from '../components/Skeleton';
import SearchBar from '../components/SearchBar';

const Pyqs = () => {
    const [pyqs, setPyqs] = useState([]);
    const [filteredPyqs, setFilteredPyqs] = useState([]);
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
        const fetchPyqs = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
                const response = await axios.get(`${apiUrl}/api/notes`);

                // Filter items that have PYQ data (Link and Title)
                const allPyqs = response.data
                    .filter(item => item.pyqTitle && item.pyqLink);

                setPyqs(allPyqs);
                setFilteredPyqs(allPyqs);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching PYQs:", err);
                setError("Failed to load PYQs. Please try again later.");
                setLoading(false);
            }
        };

        fetchPyqs();
    }, []);

    // Filter logic
    useEffect(() => {
        let result = pyqs;

        // 1. Filter by Category
        if (activeCategory !== 'all') {
            result = result.filter(item => item.tag === activeCategory);
        }

        // 2. Filter by Search Term
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.pyqTitle.toLowerCase().includes(lowerTerm)
            );
        }

        // 3. Filter only active PYQs
        // Check if pyqLink exists AND pyqActive is true
        result = result.filter(note =>
            note.pyqLink &&
            (note.pyqActive === 'true' || note.pyqActive === true)
        );

        setFilteredPyqs(result);
    }, [searchTerm, activeCategory, pyqs]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    // Helper to determine image source
    const getImgSrc = (note) => {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';

        // 1. Check for PYQ Image
        if (note.pyqImage && note.pyqImage !== 'undefined' && note.pyqImage !== 'null' && note.pyqImage.trim() !== '') {
            return note.pyqImage.startsWith('http') ? note.pyqImage : `${apiUrl}/images/${note.pyqImage}`;
        }

        // 2. Check for Note Image (Fallback 1)
        if (note.imagePath && note.imagePath !== 'undefined' && note.imagePath !== 'null' && note.imagePath.trim() !== '') {
            return note.imagePath.startsWith('http') ? note.imagePath : `${apiUrl}/images/${note.imagePath}`;
        }

        // 3. Default Fallback
        return '/images/domo-pyqs.png';
    };

    if (error) return (
        <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    return (
        <div className="all-notes-page py-4">
            <Container>
                <h2 className="text-center text-primary mb-4 fw-bold display-6">Previous Year Question Papers</h2>

                {/* Search Bar */}
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search question papers..."
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

                {/* PYQs Grid */}
                {loading ? (
                    <SkeletonGrid count={6} />
                ) : (
                    <Row id="notesContainer" className="g-4">
                        {filteredPyqs.length > 0 ? (
                            filteredPyqs.map((item) => (
                                <Col md={6} lg={4} key={item._id} className="notice-item">
                                    <Card className="h-100 note-card custom-card">
                                        <div className="card-img-wrapper">
                                            <Card.Img
                                                variant="top"
                                                src={getImgSrc(item)}
                                                alt={item.pyqTitle}
                                                className="h-100 w-100 object-fit-cover"
                                                onError={(e) => {
                                                    e.target.src = '/images/domo-pyqs.png';
                                                }}
                                            />
                                        </div>
                                        <Card.Body className="d-flex flex-column justify-content-between p-3 text-center">
                                            <Card.Title className="fw-bold mb-3 mt-2 note-title">{item.pyqTitle}</Card.Title>
                                            <div className="mt-auto">
                                                <a
                                                    href={item.pyqLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary custom-download-btn px-4 py-2"
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
                                <p className="text-muted fs-5">No question papers found matching your criteria.</p>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Pyqs;
