import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Hero = () => {
    return (
        <section className="hero-section py-5">
            <Container>
                <Row className="flex-lg-row-reverse align-items-center g-5">
                    <Col xs={10} sm={8} lg={6} className="mx-auto">
                        <img
                            src="/images/header2.png"
                            className="d-block mx-lg-auto img-fluid header_img animate-fade-in"
                            alt="WITCET Education"
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x400?text=Witcet+Education';
                            }}
                        />
                    </Col>
                    <Col lg={6}>
                        <div className="lc-block mb-3 animate-fade-in">
                            <h4 className="fw-bold display-6">Admit Your Dream University Through WITCET</h4>
                        </div>
                        <div className="lc-block mb-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <p className="lead text-secondary">
                                Unlock your potential with WITCET, the best online education platform for top scores and success.
                                We offer expert guidance, interactive study materials, and practice tests to help you excel in exams.
                                Best Education Site For Online Schooling. Get top score by learning India's largest content provider.
                            </p>
                        </div>
                        <div className="lc-block d-grid gap-2 d-md-flex justify-content-md-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
