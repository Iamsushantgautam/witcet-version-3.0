import React, { useRef, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navigation from './Navbar';
import '../styles/Hero.css';

const Hero = () => {
    const imageRef = useRef(null);
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (centerX === 0 || centerY === 0) return;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setTransform({ rotateX, rotateY, scale: 1.05 });
    };

    const handleMouseLeave = () => {
        setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    };

    return (
        <section className="hero-section position-relative overflow-hidden bg-light">
            {/* Background Decor */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0, pointerEvents: 'none' }}>
                <div className="position-absolute top-0 end-0 bg-primary opacity-25 rounded-circle"
                    style={{ width: '40vw', height: '40vw', filter: 'blur(100px)', transform: 'translate(20%, -30%)', opacity: 0.1 }} />
                <div className="position-absolute bottom-0 start-0 bg-info opacity-25 rounded-circle"
                    style={{ width: '30vw', height: '30vw', filter: 'blur(80px)', transform: 'translate(-20%, 20%)', opacity: 0.1 }} />
            </div>

            <Container className="hero-content-container">
                <Row className="flex-lg-row-reverse align-items-center g-lg-5 g-3 py-3">
                    <Col xs={12} lg={6} className="hero_img_container">
                        <div
                            style={{
                                perspective: '1000px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <img
                                ref={imageRef}
                                src="/images/header2.png"
                                className="mx-lg-auto img-fluid header_img"
                                alt="WITCET Education"
                                loading="lazy"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x400?text=Witcet+Education';
                                }}
                                style={{
                                    transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
                                    transition: 'transform 0.3s ease-out',
                                    transformStyle: 'preserve-3d'
                                }}
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="text-center text-lg-start mb-4">
                            <span className="badge bg-light text-primary border px-3 py-2 rounded-pill mb-3 fw-bold shadow-sm">
                                🚀 #1 Education Platform
                            </span>
                            <h1 className="display-4 fw-bolder lh-1 mb-3 text-dark">
                                Admit Your <span className="text-primary" style={{ background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream University</span> Through WITCET
                            </h1>
                            <p className="lead text-secondary mb-4" style={{ lineHeight: '1.8' }}>
                                Unlock your potential with WITCET, standardizing <b>AKTU Notes</b>, <b>Quantums</b>, and <b>PYQs</b>.
                                We offer expert guidance, interactive study materials, and curated tools to help you excel in your exams.
                            </p>
                            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-lg-start">
                                <Link to="/notes" className="btn btn-primary btn-lg px-4 rounded-pill fw-bold shadow-sm hover-lift">
                                    Get Started
                                </Link>
                                <Button
                                    href="https://t.me/+mKi_iF1EsEg2MDU1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="outline-dark"
                                    className="btn-lg px-4 rounded-pill fw-bold hover-lift"
                                >
                                    Join Telegram <i className="fab fa-telegram ms-2 text-primary"></i>
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Wave Divider */}
            <div className="wave-divider-container">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="wave-divider">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;
