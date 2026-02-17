import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { SkeletonGrid } from './Skeleton';
import '../styles/AllNotes.css';
import '../styles/Tools.css';

const Search = () => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({ notes: [], quantums: [], pyqs: [], tools: [], offers: [] });
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

            // Parallel fetch for better performance
            const [notesResponse, toolsResponse, offersResponse] = await Promise.all([
                axios.get(`${apiUrl}/api/notes`),
                axios.get(`${apiUrl}/api/tools`),
                axios.get(`${apiUrl}/api/offers/active`)
            ]);

            const data = notesResponse.data;
            const toolsData = toolsResponse.data;
            const offersData = offersResponse.data;
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

            // Tools Filter
            const tools = toolsData.filter(tool =>
                (tool.isActive) &&
                (tool.title?.toLowerCase().includes(lowerTerm) ||
                    tool.description?.toLowerCase().includes(lowerTerm) ||
                    (tool.tag && tool.tag.toLowerCase().includes(lowerTerm)))
            );

            // Offers Filter
            const offers = offersData.filter(offer =>
                offer.title?.toLowerCase().includes(lowerTerm) ||
                (offer.description && offer.description.toLowerCase().includes(lowerTerm)) ||
                (offer.promoCode && offer.promoCode.toLowerCase().includes(lowerTerm)) ||
                (offer.voucherCode && offer.voucherCode.toLowerCase().includes(lowerTerm))
            );

            setResults({ notes, quantums, pyqs, tools, offers });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const hasResults = results.notes.length > 0 || results.quantums.length > 0 || results.pyqs.length > 0 || results.tools.length > 0 || results.offers.length > 0;

    const getIconUrl = (tool) => {
        if (tool.faviconUrl) return tool.faviconUrl;
        if (tool.icon && tool.icon !== '/images/default-tool-icon.png') {
            return `${import.meta.env.VITE_API_URL}${tool.icon}`;
        }
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d6efd"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    const renderOfferCard = (offer) => (
        <Col md={6} lg={4} key={offer._id} className="mb-4">
            <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                    <Card.Img
                        variant="top"
                        src={offer.bannerImage || 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                        alt={offer.title}
                        className="h-100 w-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; }}
                    />
                    <div className="position-absolute top-0 end-0 m-2 badge bg-danger">
                        {offer.offerType === 'percentage' ? `${offer.discountValue}% OFF` :
                            offer.offerType === 'fixed_amount' ? `FLAT ${formatCurrency(offer.discountValue)} OFF` : 'VOUCHER'}
                    </div>
                </div>
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold fs-6 mb-2">{offer.title}</Card.Title>
                    <Card.Text className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {offer.description}
                    </Card.Text>
                    <Button as={Link} to="/offers" variant="outline-danger" size="sm" className="w-100 rounded-pill">
                        View Offer
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );

    const renderToolCard = (tool) => (
        <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="tool-card h-100 text-decoration-none"
            key={tool._id}
            style={{ minHeight: '300px' }} // Ensure consistent height in grid
        >
            <div className="tool-content-wrapper">
                <div className="tool-icon-container">
                    <img
                        src={getIconUrl(tool)}
                        alt={tool.title}
                        className="tool-icon"
                        onError={(e) => {
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d6efd"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                        }}
                    />
                </div>
                <div className="tool-text-content">
                    <h3 className="tool-name">{tool.title}</h3>
                    <span className="tool-badge">{tool.tag || 'RESOURCE'}</span>
                </div>
            </div>

            <p className="tool-description">{tool.description}</p>

            <div className="tool-footer mt-auto">
                <span className="visit-btn">
                    Visit Website <i className="fas fa-external-link-alt"></i>
                </span>
            </div>
        </a>
    );

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
                        {results.offers.length > 0 && (
                            <section className="mb-5">
                                <h4 className="border-bottom pb-2 mb-4 text-secondary"><i className="fas fa-tags me-2"></i>Offers & Coupons</h4>
                                <Row>
                                    {results.offers.map(offer => renderOfferCard(offer))}
                                </Row>
                            </section>
                        )}

                        {results.tools.length > 0 && (
                            <section className="mb-5">
                                <h4 className="border-bottom pb-2 mb-4 text-secondary"><i className="fas fa-toolbox me-2"></i>Tools & Resources</h4>
                                <div className="tools-grid">
                                    {results.tools.map(tool => renderToolCard(tool))}
                                </div>
                            </section>
                        )}

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
