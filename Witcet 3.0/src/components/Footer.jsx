import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="text-center text-lg-start text-dark mt-5" style={{ backgroundColor: '#ECEFF1' }}>
            {/* Section: Social media */}
            <section className="d-flex justify-content-between p-4 text-white" style={{ backgroundColor: '#00BFFF' }}>
                <Container className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="me-5">
                        <span>Get connected with us on social networks:</span>
                    </div>
                    <div>
                        <a href="https://www.youtube.com/@witcet" className="text-white me-4" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="https://www.instagram.com/wit_cet/" className="text-white me-4" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </Container>
            </section>

            {/* Section: Links */}
            <section className="">
                <Container className="text-center text-md-start mt-5">
                    <Row className="mt-3">
                        {/* Grid column */}
                        <Col md={3} lg={4} xl={3} className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold">Witcet</h6>
                            <hr
                                className="mb-4 mt-0 d-inline-block mx-auto"
                                style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px', opacity: 1 }}
                            />
                            <p>
                                We offer expert guidance, interactive study materials, and practice tests to help you excel in exams.
                            </p>
                        </Col>

                        {/* Grid column: Products */}
                        <Col md={2} lg={2} xl={2} className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold">Products</h6>
                            <hr
                                className="mb-4 mt-0 d-inline-block mx-auto"
                                style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px', opacity: 1 }}
                            />
                            <p><a href="/notes" className="text-dark text-decoration-none hover-link">AKTU Notes</a></p>
                            <p><a href="/pyqs" className="text-dark text-decoration-none hover-link">B.Tech PYQs</a></p>
                            <p><a href="/quantums" className="text-dark text-decoration-none hover-link">Quantums</a></p>
                            <p><a href="/updates" className="text-dark text-decoration-none hover-link">Updates</a></p>
                        </Col>

                        {/* Grid column: About */}
                        <Col md={2} lg={2} xl={2} className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold">About</h6>
                            <hr
                                className="mb-4 mt-0 d-inline-block mx-auto"
                                style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px', opacity: 1 }}
                            />
                            <p><a href="/about" className="text-dark text-decoration-none hover-link">About Us</a></p>
                            <p><a href="/policy" className="text-dark text-decoration-none hover-link">Policy</a></p>
                            <p><a href="/feedback" className="text-dark text-decoration-none hover-link">Feedback</a></p>
                            <p><a href="/contact" className="text-dark text-decoration-none hover-link">Contact Us</a></p>
                            <p><a href="/help" className="text-dark text-decoration-none hover-link">Help</a></p>
                        </Col>

                        {/* Grid column: Contact */}
                        <Col md={4} lg={3} xl={3} className="mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold">Contact</h6>
                            <hr
                                className="mb-4 mt-0 d-inline-block mx-auto"
                                style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px', opacity: 1 }}
                            />
                            <p>
                                <a className="btn btn-primary rounded-pill px-4 me-md-2" href="https://t.me/+mKi_iF1EsEg2MDU1" target="_blank" rel="noopener noreferrer">
                                    Join our Telegram Channel
                                </a>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Copyright */}
            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2025 Copyright: <a className="text-dark fw-bold text-decoration-none" href="/">Witcet</a>
            </div>
        </footer>
    );
};

export default Footer;
