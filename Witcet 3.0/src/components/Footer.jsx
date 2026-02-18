import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="text-center text-lg-start bg-light text-muted pt-4 mt-5 border-top">
            {/* Section: Social media */}
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom container">
                <div className="me-5 d-none d-lg-block">
                    <span>Get connected with us on social networks:</span>
                </div>
                <div>
                    <a href="https://www.youtube.com/@witcet" className="me-4 text-reset text-decoration-none" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-youtube text-danger fs-5"></i>
                    </a>
                    <a href="https://www.instagram.com/wit_cet/" className="me-4 text-reset text-decoration-none" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram text-danger fs-5"></i>
                    </a>
                </div>
            </section>

            {/* Section: Links */}
            <section className="">
                <Container className="text-center text-md-start mt-5">
                    <Row className="mt-3">
                        <Col md={3} lg={4} xl={3} className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <img src="https://witcet.com/wp-content/uploads/2025/01/witcet-logo-2.png" alt="" />Witcet
                            </h6>
                            <p>
                                We offer expert guidance, interactive study materials, and practice tests to help you excel in exams.
                            </p>
                        </Col>

                        <Col md={2} lg={2} xl={2} className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Products</h6>
                            <p><Link to="/notes" className="text-reset text-decoration-none">AKTU Notes</Link></p>
                            <p><Link to="/pyqs" className="text-reset text-decoration-none">B.Tech PYQs</Link></p>
                            <p><Link to="/quantums" className="text-reset text-decoration-none">Quantums</Link></p>
                            <p><Link to="/updates" className="text-reset text-decoration-none">Updates</Link></p>
                            <p><Link to="/tools" className="text-reset text-decoration-none">Tools</Link></p>
                            <p><Link to="/offers" className="text-reset text-decoration-none">Offers</Link></p>
                        </Col>

                        <Col md={3} lg={2} xl={2} className="mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
                            <p><Link to="/about" className="text-reset text-decoration-none">About Us</Link></p>
                            <p><Link to="/policy" className="text-reset text-decoration-none">Policy</Link></p>
                            <p><Link to="/feedback" className="text-reset text-decoration-none">Feedback</Link></p>
                            <p><Link to="/contact" className="text-reset text-decoration-none">Contact Us</Link></p>
                            <p><Link to="/help" className="text-reset text-decoration-none">Help</Link></p>
                        </Col>

                        <Col md={4} lg={3} xl={3} className="mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                            <p>
                                <i className="fas fa-envelope me-3"></i>
                                witcet@zohomail.in
                            </p>
                            <div className="mt-3">
                                <Button
                                    variant="primary"
                                    href="https://t.me/+mKi_iF1EsEg2MDU1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-pill btn-sm fw-bold"
                                >
                                    <i className="fab fa-telegram-plane me-2"></i> Telegram Channel
                                </Button>                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Copyright */}
            <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2025 Copyright:
                <Link className="text-reset fw-bold ms-1 text-decoration-none" to="/">Witcet</Link>
            </div>
        </footer>
    );
};

export default Footer;
