import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { SkeletonGrid } from './Skeleton';
import '../styles/AllNotes.css';

const Search = () => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({ notes: [], quantums: [], pyqs: [] });
    const location = useLocation();
    const [query, setQuery] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || params.get('search'); // Support 'q' or 'search'
        if (q) {
            setQuery(decodeURIComponent(q));
            fetchAndSearch(decodeURIComponent(q));
        } else {
            setLoading(false);
        }
    }, [location.search]);

    const fetchAndSearch = async (searchTerm) => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            const response = await axios.get(`${apiUrl}/api/notes`);
            const data = response.data;
            const lowerTerm = searchTerm.toLowerCase();

            // Notes Filter
            const notes = data.filter(item =>
                (item.notesPagePath === 'true' || item.notesPagePath === true) &&
                (item.title?.toLowerCase().includes(lowerTerm) ||
                    item.tag?.toLowerCase().includes(lowerTerm) ||
                    item.notesCode?.toLowerCase().includes(lowerTerm))
            );

            // Quantums Filter
            const quantums = data.filter(item =>
                (item.quantumLink && (item.quantumActive === 'true' || item.quantumActive === true)) &&
                (item.quantumTitle?.toLowerCase().includes(lowerTerm) ||
                    item.tag?.toLowerCase().includes(lowerTerm) ||
                    item.notesCode?.toLowerCase().includes(lowerTerm))
            );

            // PYQs Filter
            const pyqs = data.filter(item =>
                (item.pyqLink && (item.pyqActive === 'true' || item.pyqActive === true)) &&
                (item.pyqTitle?.toLowerCase().includes(lowerTerm) ||
                    item.tag?.toLowerCase().includes(lowerTerm) ||
                    item.notesCode?.toLowerCase().includes(lowerTerm))
            );

            setResults({ notes, quantums, pyqs });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const hasResults = results.notes.length > 0 || results.quantums.length > 0 || results.pyqs.length > 0;

    const renderCard = (item, type) => {
        let title, link, imagePath, defaultImg;
        if (type === 'note') {
            title = item.title;
            link = `/notes/${item.notesCode}`;
            imagePath = item.imagePath;
            defaultImg = '/images/domo-notes.png';
        } else if (type === 'quantum') {
            title = item.quantumTitle;
            link = item.quantumLink; // External link usually
            imagePath = item.quantumImagePath;
            defaultImg = '/images/domo-q.png';
        } else {
            title = item.pyqTitle;
            link = item.pyqLink;
            imagePath = item.pyqImage || item.imagePath;
            defaultImg = '/images/domo-pyqs.png';
        }

        const imgSrc = imagePath && imagePath !== 'undefined'
            ? (imagePath.startsWith('http') ? imagePath : `${import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com'}/images/${imagePath}`)
            : defaultImg;

        return (
            <Col md={6} lg={4} key={`${type}-${item._id}`} className="mb-4">
                <Card className="h-100 note-card custom-card">
                    <div className="card-img-wrapper">
                        <Card.Img
                            variant="top"
                            src={imgSrc}
                            alt={title}
                            className="h-100 w-100 object-fit-cover"
                            onError={(e) => { e.target.src = defaultImg; }}
                        />
                    </div>
                    <Card.Body className="d-flex flex-column justify-content-between p-3 text-center">
                        <Card.Title className="fw-bold mb-3 mt-2 note-title">{title}</Card.Title>
                        <div className="mt-auto">
                            {type === 'note' ? (
                                <Link to={link} className="btn btn-primary custom-download-btn px-4 py-2">
                                    <i className="fa fa-download me-2"></i> Download
                                </Link>
                            ) : (
                                <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-primary custom-download-btn px-4 py-2">
                                    <i className="fa fa-download me-2"></i> Download
                                </a>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    return (
        <div className="search-page py-4">
            <Container>
                <h2 className="text-center text-primary mb-4 fw-bold">Search Results</h2>
                <p className="text-center text-muted mb-5">
                    Results for "<strong>{query}</strong>"
                </p>

                {loading ? (
                    <SkeletonGrid count={6} />
                ) : !hasResults ? (
                    <div className="text-center py-5">
                        <i className="fa fa-search fa-3x text-muted mb-3"></i>
                        <h4>No results found</h4>
                        <p className="text-muted">Try using different keywords or simpler terms.</p>
                        <Button variant="outline-primary" href="/">Go Home</Button>
                    </div>
                ) : (
                    <>
                        {results.notes.length > 0 && (
                            <section className="mb-5">
                                <h4 className="border-bottom pb-2 mb-4 text-secondary"><i className="fa fa-book me-2"></i>Notes</h4>
                                <Row>{results.notes.map(item => renderCard(item, 'note'))}</Row>
                            </section>
                        )}

                        {results.quantums.length > 0 && (
                            <section className="mb-5">
                                <h4 className="border-bottom pb-2 mb-4 text-secondary"><i className="fa fa-bookmark me-2"></i>Quantums</h4>
                                <Row>{results.quantums.map(item => renderCard(item, 'quantum'))}</Row>
                            </section>
                        )}

                        {results.pyqs.length > 0 && (
                            <section className="mb-5">
                                <h4 className="border-bottom pb-2 mb-4 text-secondary"><i className="fa fa-file-alt me-2"></i>Previous Year Questions</h4>
                                <Row>{results.pyqs.map(item => renderCard(item, 'pyq'))}</Row>
                            </section>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
};

export default Search;
