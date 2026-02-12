import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { SkeletonGrid } from './Skeleton';
import axios from 'axios';
import '../styles/Updates.css';

const Updates = () => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6); // Initial show count

    // Fetch updates
    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
                const response = await axios.get(`${apiUrl}/api/updates`);

                // Filter active and sort by date descending
                const activeUpdates = response.data
                    .filter(u => u.isActive)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                setUpdates(activeUpdates);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching updates:", err);
                setError("Failed to load updates.");
                setLoading(false);
            }
        };

        fetchUpdates();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Show Back to Top button on scroll
    const [showTopBtn, setShowTopBtn] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Loading handled inline

    if (error) return (
        <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    const visibleUpdates = updates.slice(0, visibleCount);

    return (
        <section className="updates-page py-5">
            <Container>
                <Row>
                    <Col xs={12}>
                        <h2 className="text-center text-primary mb-4">
                            <i className="fa fa-bullhorn me-2"></i>Latest Updates
                        </h2>
                        <p className="text-center text-muted mb-5">Stay updated with the latest news, announcements, and important information</p>

                        {/* Results Counter & Content or Loading */}
                        {loading ? (
                            <SkeletonGrid count={6} lg={6} md={12} />
                        ) : (
                            <>
                                <div className="row mb-4">
                                    <div className="col-12 text-center">
                                        <div id="resultsCounter" className="text-muted">
                                            Showing <strong>{Math.min(visibleCount, updates.length)}</strong> of <strong>{updates.length}</strong> updates
                                        </div>
                                    </div>
                                </div>

                                <Row id="updatesContainer">
                                    {visibleUpdates.map((update, index) => (
                                        <Col lg={6} md={12} className="mb-4 update-item" key={update._id || index}>
                                            <div className="card update-card fade-in">
                                                <div className="card-body update-content">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div className="d-flex align-items-center justify-content-between w-100">
                                                            <h5 className="update-title mb-0">{update.title}</h5>
                                                        </div>
                                                    </div>

                                                    <p className="update-description">{update.description}</p>

                                                    <div className="download-buttons mb-3">
                                                        {update.imageUrl && (
                                                            <a
                                                                href={update.imageUrl}
                                                                download
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-primary me-2 download-btn image-download-btn"
                                                                title="Download Image"
                                                            >
                                                                <i className="fa fa-image me-1"></i>Download
                                                            </a>
                                                        )}
                                                        {update.pdfLink && (
                                                            <a
                                                                href={update.pdfLink}
                                                                download
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-sm btn-outline-danger download-btn pdf-download-btn"
                                                                title="Download PDF"
                                                            >
                                                                <i className="fa fa-file-pdf me-1"></i>Download
                                                            </a>
                                                        )}
                                                    </div>

                                                    <div className="update-meta mt-auto">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="update-date">
                                                                <i className="fa fa-calendar-alt text-primary me-1"></i>
                                                                {new Date(update.date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                                {update.time && (
                                                                    <span className="text-muted ms-1">at {update.time}</span>
                                                                )}
                                                            </div>
                                                            {update.author && (
                                                                <div className="update-author">
                                                                    <i className="fa fa-user text-success me-1"></i>
                                                                    {update.author}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>

                                {/* No Updates */}
                                {updates.length === 0 && (
                                    <div className="no-updates">
                                        <i className="fa fa-inbox"></i>
                                        <h4>No Updates Available</h4>
                                        <p>Check back later for the latest updates and announcements.</p>
                                    </div>
                                )}

                                {/* Load More Button */}
                                {visibleCount < updates.length && (
                                    <Row className="mt-4">
                                        <Col className="text-center">
                                            <button
                                                id="loadMoreBtn"
                                                className="btn btn-primary btn-lg"
                                                onClick={handleLoadMore}
                                            >
                                                <i className="fa fa-plus-circle me-2"></i>Load More Updates
                                            </button>
                                        </Col>
                                    </Row>
                                )}


                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Updates;
