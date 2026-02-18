import React, { useState, useEffect } from 'react';
import { Container, Alert, Badge, Button, OverlayTrigger, Tooltip, Modal, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Offers.css';
import SearchBar from '../components/SearchBar';

const Offers = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [revealedCodes, setRevealedCodes] = useState({});
    const [offerIndices, setOfferIndices] = useState({}); // Track active code index per offer

    const handleNextCode = (offerId, total) => {
        setOfferIndices(prev => ({ ...prev, [offerId]: ((prev[offerId] || 0) + 1) % total }));
    };

    const handlePrevCode = (offerId, total) => {
        setOfferIndices(prev => ({ ...prev, [offerId]: ((prev[offerId] || 0) - 1 + total) % total }));
    };

    // Touch Carousel Logic
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (offerId, total) => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            handleNextCode(offerId, total); // Swipe Left -> Next
        } else if (distance < -minSwipeDistance) {
            handlePrevCode(offerId, total); // Swipe Right -> Prev
        }
    };

    // Modal State
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('steps');
    const [selectedOffer, setSelectedOffer] = useState(null);

    const handleShowOffer = (offer) => {
        setSelectedOffer(offer);
        setActiveTab('steps');
        setShowModal(true);
    };

    const toggleReveal = (id) => {
        setRevealedCodes(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchOffers();
    }, []);

    // Admin State
    const [user, setUser] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newOffer, setNewOffer] = useState({
        title: '',
        description: '',
        offerType: 'percentage',
        discountValue: '',
        promoCode: '',
        endDate: '',
        minPurchaseAmount: '',
        redeemSteps: '',
        offerDetails: ''
    });

    const handleAddOffer = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newOffer)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create offer');
            }

            setShowAddModal(false);
            setNewOffer({
                title: '',
                description: '',
                offerType: 'percentage',
                discountValue: '',
                promoCode: '',
                endDate: '',
                minPurchaseAmount: '',
                redeemSteps: '',
                offerDetails: ''
            });
            fetchOffers();
            alert('Offer created successfully!');
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/active`);
            if (!response.ok) {
                throw new Error('Failed to fetch offers');
            }
            const data = await response.json();
            setOffers(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching offers:', err);
            setError('Failed to load offers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredOffers = offers.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (offer.description && offer.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (offer.promoCode && offer.promoCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (offer.voucherCode && offer.voucherCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getBannerImage = (offer) => {
        return offer.bannerImage || 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
    };

    const formatCurrency = (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
    };

    const getDaysRemaining = (endDate) => {
        if (!endDate) return null;
        const diff = new Date(endDate) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return 'Expired';
        if (days === 0) return 'Ends Today';
        return `${days} days left`;
    };

    return (
        <Container className="offers-container">
            <div className="offers-header">
                <span className="header-badge-offers">
                    <i className="fas fa-percentage me-2"></i>
                    EXCLUSIVE DEALS
                </span>
                <h1 className="offers-title">
                    Special Offers & Coupons
                </h1>
                <p className="offers-subtitle">
                    Save big on courses and materials with our latest promo codes and vouchers.
                </p>

                {user && user.role === 'admin' && (
                    <Button variant="dark" className="my-3 shadow-sm rounded-pill px-4" onClick={() => setShowAddModal(true)}>
                        <i className="fas fa-plus-circle me-2"></i> Add New Offer
                    </Button>
                )}

                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search offers, codes..."
                    className="mt-4"
                />
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="offers-grid">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="offer-card skeleton-wrapper">
                            <div className="skeleton-banner skeleton-text"></div>
                            <div className="p-4">
                                <div className="skeleton-title-bar skeleton-text"></div>
                                <div className="skeleton-desc-bar skeleton-text"></div>
                                <div className="skeleton-desc-bar skeleton-text w-75"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredOffers.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-tag fa-3x text-muted mb-3"></i>
                    <h4 className="text-muted">No offers found</h4>
                    <p className="text-muted">Check back later for new deals!</p>
                </div>
            ) : (
                <div className="offers-grid">
                    {filteredOffers.map((offer) => {
                        const mainCodeObj = {
                            code: offer.offerType === 'voucher' ? offer.voucherCode : offer.promoCode,
                            discountValue: offer.discountValue,
                            offerType: offer.offerType,
                            expiryDate: offer.endDate,
                            minPurchaseAmount: offer.minPurchaseAmount,
                            isMain: true
                        };
                        const additionalCodes = offer.additionalPromoCodes || [];
                        const allCodes = [mainCodeObj, ...additionalCodes].filter(c => c.code);
                        const currentIndex = offerIndices[offer._id] || 0;
                        const currentCode = allCodes[currentIndex] || mainCodeObj;

                        return (
                            <div className="offer-card" key={offer._id}>
                                <div className="offer-banner-container">
                                    <Badge className="offer-type-badge">
                                        {offer.offerType === 'percentage' ? `${offer.discountValue}% OFF` :
                                            offer.offerType === 'fixed_amount' ? `FLAT ${formatCurrency(offer.discountValue)} OFF` :
                                                'VOUCHER'}
                                    </Badge>
                                    <img
                                        src={getBannerImage(offer)}
                                        alt={offer.title}
                                        className="offer-banner"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                                        }}
                                    />
                                </div>

                                <div className="offer-content">
                                    <h3 className="offer-title">{offer.title}</h3>
                                    <p className="offer-description">{offer.description}</p>

                                    {currentCode.discountValue && !currentCode.isMain && (
                                        <div className="mb-3 animate__animated animate__fadeIn">
                                            <Badge bg="light" className="border border-info text-info px-3 py-2 rounded-pill shadow-sm">
                                                <i className="fas fa-tag me-2"></i>
                                                <span className="fw-bold">
                                                    {offer.offerType === 'percentage'
                                                        ? `${currentCode.discountValue}% OFF`
                                                        : `FLAT ${formatCurrency(currentCode.discountValue)} OFF`
                                                    }
                                                </span>
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="offer-meta">
                                        <div
                                            className="promo-code-box position-relative"
                                            onTouchStart={handleTouchStart}
                                            onTouchMove={handleTouchMove}
                                            onTouchEnd={() => handleTouchEnd(offer._id, allCodes.length)}
                                        >
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                {/* Navigation - Left */}
                                                {allCodes.length > 1 && (
                                                    <button
                                                        className="btn btn-link text-muted p-0 me-2"
                                                        onClick={(e) => { e.stopPropagation(); handlePrevCode(offer._id, allCodes.length); }}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <i className="fas fa-chevron-left"></i>
                                                    </button>
                                                )}

                                                {/* Code Display */}
                                                <div className="flex-grow-1 text-center">
                                                    <div className="d-flex align-items-center justify-content-center gap-2 mb-0">
                                                        <span className="promo-code" style={{ letterSpacing: '2px', fontSize: '1.1rem' }}>
                                                            {revealedCodes[offer._id] ? currentCode.code : '••••••••'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Navigation - Right */}
                                                {allCodes.length > 1 && (
                                                    <button
                                                        className="btn btn-link text-muted p-0 ms-2"
                                                        onClick={(e) => { e.stopPropagation(); handleNextCode(offer._id, allCodes.length); }}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <i className="fas fa-chevron-right"></i>
                                                    </button>
                                                )}

                                                {/* Actions - No Tooltips */}
                                                <div className="d-flex align-items-center gap-2 ms-3 ps-3 border-start">
                                                    <button
                                                        className="copy-btn"
                                                        onClick={() => toggleReveal(offer._id)}
                                                        style={{ border: 'none', background: 'none', color: '#64748b' }}
                                                    >
                                                        <i className={`fas ${revealedCodes[offer._id] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                    </button>

                                                    {revealedCodes[offer._id] && (
                                                        <button
                                                            className="copy-btn"
                                                            onClick={() => handleCopyCode(currentCode.code, `${offer._id}_${currentIndex}`)}
                                                        >
                                                            <i className={`fas ${copiedId === `${offer._id}_${currentIndex}` ? 'fa-check' : 'fa-copy'}`}></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dots Indicator Below Box */}
                                        {allCodes.length > 1 && (
                                            <div className="d-flex gap-1 mt-2 mb-1 justify-content-center">
                                                {allCodes.map((_, idx) => (
                                                    <div key={idx}
                                                        style={{
                                                            width: '4px',
                                                            height: '4px',
                                                            borderRadius: '50%',
                                                            backgroundColor: idx === currentIndex ? '#3b82f6' : '#e2e8f0',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-dashed">
                                            <div className="offer-expiry mb-0 detail-text" style={{ fontSize: '0.8rem', minWidth: '80px' }}>
                                                <i className="far fa-clock me-1"></i>
                                                {currentCode.expiryDate ? getDaysRemaining(currentCode.expiryDate) : 'Limited Time'}
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                {currentCode.minPurchaseAmount > 0 && (
                                                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                        Min: {formatCurrency(currentCode.minPurchaseAmount)}
                                                    </small>
                                                )}

                                                {(offer.redeemSteps || offer.offerDetails) && (
                                                    <Button
                                                        variant="link"
                                                        className="p-0 text-decoration-none d-flex align-items-center gap-1"
                                                        style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600' }}
                                                        onClick={() => handleShowOffer(offer)}
                                                    >
                                                        <i className="fas fa-info-circle"></i>
                                                        Details
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <Button
                                                variant="primary"
                                                className="w-100 rounded-pill fw-bold"
                                                style={{
                                                    background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
                                                    border: 'none',
                                                    padding: '10px'
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentCode.code) {
                                                        navigator.clipboard.writeText(currentCode.code);
                                                        setCopiedId(offer._id);
                                                        setTimeout(() => setCopiedId(null), 2000);
                                                    }

                                                    const targetLink = offer.redeemLink || '/notes';
                                                    if (targetLink.startsWith('http')) {
                                                        window.open(targetLink, '_blank', 'noopener');
                                                    } else {
                                                        navigate(targetLink);
                                                    }
                                                }}
                                            >
                                                {copiedId === offer._id ? 'CODE COPIED!' : 'REDEEM NOW'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Split Layout Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                size="lg"
                dialogClassName="offer-custom-modal"
                contentClassName="offer-modal-content"
            >
                <Modal.Body className="p-0">
                    {selectedOffer && (
                        <div className="d-flex flex-column flex-md-row" style={{ minHeight: '500px' }}>
                            {/* Left Side - Image */}
                            <div className="modal-left-panel position-relative col-md-5 p-0">
                                <img
                                    src={getBannerImage(selectedOffer)}
                                    alt={selectedOffer.title}
                                    className="w-100 h-100"
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className="modal-image-overlay"></div>
                                {/* Badge */}
                                <div className="modal-badge">
                                    <div className="small fw-bold text-uppercase">Limited Time</div>
                                    <div className="fw-bold fs-5">
                                        {selectedOffer.offerType === 'percentage' ? `SAVE ${selectedOffer.discountValue}%` :
                                            selectedOffer.offerType === 'fixed_amount' ? `SAVE ${formatCurrency(selectedOffer.discountValue)}` : 'VOUCHER'}
                                    </div>
                                </div>
                                {/* Bottom Info */}
                                <div className="modal-bottom-info">
                                    <h5 className="text-white fw-bold mb-1">{selectedOffer.title}</h5>
                                    <div className="text-white-50 small">Official Partner Deal</div>
                                    <div className="text-warning small mt-1">
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star-half-alt"></i>
                                        <span className="ms-1 text-white">(4.8)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Content */}
                            <div className="modal-right-panel col-md-7 p-4 bg-white position-relative">
                                <button
                                    type="button"
                                    className="btn-close position-absolute top-0 end-0 m-4"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>

                                <h4 className="fw-bold pe-5 mb-3 pt-2">{selectedOffer.title}</h4>
                                <p className="text-muted small mb-4">{selectedOffer.description}</p>

                                {/* Tabs */}
                                <div className="d-flex border-bottom mb-4">
                                    {selectedOffer.redeemSteps && (
                                        <div
                                            className={`pb-2 px-3 cursor-pointer fw-bold ${activeTab === 'steps' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                                            style={{ marginBottom: '-1px' }}
                                            onClick={() => setActiveTab('steps')}
                                        >
                                            <i className="fas fa-list-ol me-2"></i> How to Redeem
                                        </div>
                                    )}
                                    {selectedOffer.offerDetails && (
                                        <div
                                            className={`pb-2 px-3 cursor-pointer fw-bold ${activeTab === 'details' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                                            style={{ marginBottom: '-1px' }}
                                            onClick={() => setActiveTab('details')}
                                        >
                                            <i className="fas fa-file-alt me-2"></i> Terms & Conditions
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="tab-content flex-grow-1" style={{ minHeight: '150px' }}>
                                    {activeTab === 'steps' && selectedOffer.redeemSteps && (
                                        <div className="animate__animated animate__fadeIn">
                                            <div className="d-flex flex-column gap-4">
                                                {selectedOffer.redeemSteps.split('\n').filter(step => step.trim()).map((step, index) => (
                                                    <div key={index} className="d-flex">
                                                        <div className="flex-shrink-0 me-3">
                                                            <div className="step-circle">
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold mb-1 text-dark">Step {index + 1}</h6>
                                                            <p className="text-muted small mb-0">{step.trim()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'details' && selectedOffer.offerDetails && (
                                        <div className="animate__animated animate__fadeIn">
                                            <div className="d-flex flex-column gap-3">
                                                {selectedOffer.offerDetails.split('\n').filter(detail => detail.trim()).map((detail, index) => (
                                                    <div key={index} className="d-flex align-items-start gap-3">
                                                        <i className="fas fa-check-circle text-primary mt-1"></i>
                                                        <span className="text-secondary small">{detail.trim()}</span>
                                                    </div>
                                                ))}
                                                {selectedOffer.endDate && (
                                                    <div className="d-flex align-items-center gap-3 mt-2 pt-2 border-top border-light">
                                                        <i className="far fa-calendar-alt text-primary"></i>
                                                        <span className="text-secondary small fw-bold">
                                                            Offer expires on {new Date(selectedOffer.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Warning/Info Box */}
                                <div className="alert alert-warning border-0 bg-opacity-10 d-flex align-items-start mt-3 p-3 rounded-3 mb-0" style={{ backgroundColor: '#fffbeb' }}>
                                    <i className="fas fa-info-circle text-warning mt-1 me-2"></i>
                                    <small className="text-dark opacity-75">
                                        Ensure you are logged into your account for the code to work correctly.
                                    </small>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Add Offer Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddOffer}>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Offer Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. Summer Sale"
                                        required
                                        value={newOffer.title}
                                        onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        required
                                        value={newOffer.description}
                                        onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Offer Type</Form.Label>
                                    <Form.Select
                                        value={newOffer.offerType}
                                        onChange={(e) => setNewOffer({ ...newOffer, offerType: e.target.value })}
                                    >
                                        <option value="percentage">Percentage Discount</option>
                                        <option value="fixed_amount">Fixed Amount Discount</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Discount Value</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder={newOffer.offerType === 'percentage' ? "e.g. 20 (%)" : "e.g. 500 (INR)"}
                                        required
                                        value={newOffer.discountValue}
                                        onChange={(e) => setNewOffer({ ...newOffer, discountValue: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Promo Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. SAVE20"
                                        value={newOffer.promoCode}
                                        onChange={(e) => setNewOffer({ ...newOffer, promoCode: e.target.value.toUpperCase() })}
                                    />
                                    <Form.Text className="text-muted">For generic codes.</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Expiry Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        required
                                        value={newOffer.endDate}
                                        onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Minimum Purchase (Optional)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newOffer.minPurchaseAmount}
                                        onChange={(e) => setNewOffer({ ...newOffer, minPurchaseAmount: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Redemption Steps (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Step 1...&#10;Step 2..."
                                value={newOffer.redeemSteps}
                                onChange={(e) => setNewOffer({ ...newOffer, redeemSteps: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Terms & Details (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Detail 1...&#10;Detail 2..."
                                value={newOffer.offerDetails}
                                onChange={(e) => setNewOffer({ ...newOffer, offerDetails: e.target.value })}
                            />
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="primary" type="submit" size="lg">
                                Create Offer
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Offers;
