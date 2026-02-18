import React, { useState, useEffect } from 'react';
import { Container, Carousel, Modal, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Offers.css';

const HomeOffers = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chunkSize, setChunkSize] = useState(3);
    const [index, setIndex] = useState(0);

    // Filter/Search states are not needed for home page, just show active offers
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
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('steps');
    const [selectedOffer, setSelectedOffer] = useState(null);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchOffers();
        updateChunkSize();
        window.addEventListener('resize', updateChunkSize);
        return () => window.removeEventListener('resize', updateChunkSize);
    }, []);

    const updateChunkSize = () => {
        if (window.innerWidth < 768) setChunkSize(1);
        else if (window.innerWidth < 1200) setChunkSize(2);
        else setChunkSize(3);
    };

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            const response = await fetch(`${apiUrl}/api/offers/active`);
            if (!response.ok) throw new Error('Failed to fetch offers');
            const data = await response.json();
            setOffers(data);
        } catch (err) {
            console.error('Error fetching offers:', err);
        } finally {
            setLoading(false);
        }
    };

    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const handleShowOffer = (offer) => {
        setSelectedOffer(offer);
        setActiveTab('steps'); // Default to steps or based on content logic
        setShowModal(true);
    };

    const toggleReveal = (id) => {
        setRevealedCodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCopyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

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

    const offerChunks = chunkArray(offers, chunkSize);

    return (
        <section className="home-offers-section">
            <Container>
                <div className="text-center mb-5">
                    <span className="header-badge-offers mb-3 d-inline-block">Limited Time Deals</span>
                    <h2 className="fw-bold fs-1 mb-2" style={{ color: '#0f172a' }}>Exclusive Offers for You</h2>
                    <p className="text-muted mb-4">Grab the best discounts on our premium courses and materials.</p>
                    <Button
                        variant="outline-primary"
                        className="rounded-pill px-4 fw-bold"
                        onClick={() => navigate('/offers')}
                    >
                        View All Offers <i className="fas fa-arrow-right ms-2"></i>
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">No active offers at the moment. Check back soon!</p>
                    </div>
                ) : (
                    <Carousel
                        activeIndex={index}
                        onSelect={handleSelect}
                        className="home-offers-carousel pb-5"
                        interval={5000} // Auto move every 5s
                        indicators={offerChunks.length > 1}
                        controls={offerChunks.length > 1}
                    >
                        {offerChunks.map((chunk, chunkIndex) => (
                            <Carousel.Item key={chunkIndex}>
                                <div className="d-flex justify-content-center gap-4 px-2">
                                    {chunk.map((offer) => {
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
                                            <div key={offer._id} style={{ flex: `0 0 calc(${100 / chunkSize}% - 1.5rem)`, maxWidth: `calc(${100 / chunkSize}% - 1.5rem)` }}>
                                                <div className="offer-card h-100">
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
                                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; }}
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
                                                                {offer.loginRequired && !user ? (
                                                                    <div className="d-flex align-items-center justify-content-center w-100 py-1">
                                                                        <Button
                                                                            variant="link"
                                                                            className="text-primary fw-bold text-decoration-none p-0"
                                                                            onClick={() => navigate('/login')}
                                                                            style={{ fontSize: '0.9rem' }}
                                                                        >
                                                                            <i className="fas fa-lock me-2"></i>
                                                                            Login to see code
                                                                        </Button>
                                                                    </div>
                                                                ) : (
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

                                                                        {/* Actions - No Tooltips for consistency with main page */}
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
                                                                )}
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
                                                                        if (offer.loginRequired && !user) {
                                                                            navigate('/login');
                                                                            return;
                                                                        }
                                                                        if (currentCode.code) {
                                                                            navigator.clipboard.writeText(currentCode.code);
                                                                            setCopiedId(`${offer._id}_${currentIndex}`);
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
                                                                    {copiedId === `${offer._id}_${currentIndex}` ? 'CODE COPIED!' : 'REDEEM NOW'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}

                {/* Shared Modal Logic */}
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
                                    <div className="modal-badge">
                                        <div className="small fw-bold text-uppercase">Limited Time</div>
                                        <div className="fw-bold fs-5">
                                            {selectedOffer.offerType === 'percentage' ? `SAVE ${selectedOffer.discountValue}%` :
                                                selectedOffer.offerType === 'fixed_amount' ? `SAVE ${formatCurrency(selectedOffer.discountValue)}` : 'VOUCHER'}
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

                                    <div className="tab-content flex-grow-1" style={{ minHeight: '150px' }}>
                                        {activeTab === 'steps' && selectedOffer.redeemSteps && (
                                            <div className="animate__animated animate__fadeIn">
                                                <div className="d-flex flex-column gap-4">
                                                    {selectedOffer.redeemSteps.split('\n').filter(step => step.trim()).map((step, index) => (
                                                        <div key={index} className="d-flex">
                                                            <div className="flex-shrink-0 me-3">
                                                                <div className="step-circle">{index + 1}</div>
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
            </Container>
        </section>
    );
};

export default HomeOffers;
