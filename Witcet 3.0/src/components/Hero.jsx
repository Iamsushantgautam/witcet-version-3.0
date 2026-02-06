import React, { useRef, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

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

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setTransform({ rotateX, rotateY, scale: 1.05 });
    };

    const handleMouseLeave = () => {
        setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    };

    return (
        <section className="hero-section pt-5">
            <Container>
                <Row className="flex-lg-row-reverse align-items-center g-5">
                    <Col xs={10} sm={8} lg={6} className="mx-auto">
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
                                className="d-block mx-lg-auto img-fluid header_img"
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
                                    transformStyle: 'preserve-3d',
                                    filter: 'drop-shadow(0 20px 40px rgba(0, 191, 255, 0.3))'
                                }}
                            />
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="lc-block mb-3">
                            <h4 className="fw-bold display-6">Admit Your Dream University Through WITCET</h4>
                        </div>
                        <div className="lc-block mb-3">
                            <p className="lead text-secondary">
                                Unlock your potential with WITCET, the best online education platform for top scores and success.
                                We offer expert guidance, interactive study materials, and practice tests to help you excel in exams.
                                Best Education Site For Online Schooling. Get top score by learning India's largest content provider.
                            </p>
                        </div>
                        <div className="lc-block d-grid gap-2 d-md-flex justify-content-md-start">
                            <Button
                                href="https://t.me/+mKi_iF1EsEg2MDU1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="header_btn px-5 py-3 rounded-pill border-0 shadow-lg"
                                style={{ backgroundColor: '#00BFFF', fontWeight: '600' }}
                            >
                                Join our Telegram Channel
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Hero;
