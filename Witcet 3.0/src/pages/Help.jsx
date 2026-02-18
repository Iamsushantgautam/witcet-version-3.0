import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Help.css';

const Help = () => {
    return (
        <div className="help-page">
            <header className="help-header">
                <Container>
                    <h1>Help Center</h1>
                    <p className="lead">Find answers to common questions and get support.</p>
                </Container>
            </header>

            <Container className="help-container">
                {/* Support Cards */}
                <Row className="mb-5 g-4 justify-content-center">
                    <Col md={4}>
                        <div className="support-card">
                            <div className="support-icon">
                                <i className="fa fa-envelope"></i>
                            </div>
                            <h5>Contact Support</h5>
                            <p className="text-muted small mb-3">Need direct assistance? Send us a message.</p>
                            <Link to="/contact" className="btn btn-outline-primary rounded-pill px-4">
                                Contact Us
                            </Link>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="support-card">
                            <div className="support-icon">
                                <i className="fab fa-telegram"></i>
                            </div>
                            <h5>Community</h5>
                            <p className="text-muted small mb-3">Join our Telegram channel for quick updates.</p>
                            <a href="https://t.me/+mKi_iF1EsEg2MDU1" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-pill px-4">
                                Join Now
                            </a>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="support-card">
                            <div className="support-icon">
                                <i className="fa fa-bug"></i>
                            </div>
                            <h5>Report Issue</h5>
                            <p className="text-muted small mb-3">Found a bug or broken link? Let us know.</p>
                            <Link to="/feedback" className="btn btn-outline-primary rounded-pill px-4">
                                Feedback
                            </Link>
                        </div>
                    </Col>
                </Row>

                {/* FAQ Section */}
                <div className="faq-section mb-5">
                    <h2>Frequently Asked Questions</h2>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>How do I download notes or question papers?</Accordion.Header>
                            <Accordion.Body>
                                To download resources, browse to the respective section (Notes, Quantums, or PYQs). Click on the card of the subject you are interested in. You will find a "Download" button which will either open the PDF directly or start the download process.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Are the resources on Witcet free?</Accordion.Header>
                            <Accordion.Body>
                                Yes! All notes, quantums, and previous year question papers provided on Witcet are completely free for students to access and download.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>I found a broken link or missing file.</Accordion.Header>
                            <Accordion.Body>
                                We apologize for the inconvenience. Please use the <Link to="/contact">Contact Page</Link> or the <Link to="/feedback">Feedback Form</Link> to report the specific subject and link that is not working. We will fix it as soon as possible.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Can I contribute notes to the website?</Accordion.Header>
                            <Accordion.Body>
                                Absolutely! We welcome contributions from the community. If you have high-quality notes or recent question papers that you'd like to share, please contact us via Telegram or the Contact form.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>How often is the content updated?</Accordion.Header>
                            <Accordion.Body>
                                We strive to update our content regularly, especially during exam seasons. You can check the <Link to="/updates">Updates Page</Link> to see the latest additions and announcements.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                {/* Contact Details Card (New Addition) */}
                <div className="contact-details-card">
                    <div className="contact-details-title">
                        <i className="fa fa-envelope"></i> Contact Details
                    </div>
                    <p className="mb-4 text-muted">
                        If you need additional help or have questions that aren't covered here, feel free to reach out to us through any of the following channels:
                    </p>

                    <div className="contact-icon-row">
                        <div className="contact-icon-box">
                            <i className="fa fa-envelope"></i>
                        </div>
                        <div>
                            <span className="contact-section-title">Email:</span>
                            <a href="mailto:witcet@zohomail.in" className="contact-link">witcet@zohomail.in</a>
                            <a href="mailto:witcet.help@gmail.com" className="contact-link">witcet.help@gmail.com</a>
                        </div>
                    </div>

                    <div className="contact-icon-row">
                        <div className="contact-icon-box">
                            <i className="fab fa-telegram"></i>
                        </div>
                        <div>
                            <span className="contact-section-title">Telegram Channel:</span>
                            <a href="https://t.me/+mKi_iF1EsEg2MDU1" target="_blank" rel="noopener noreferrer" className="contact-link">
                                <i className="fab fa-telegram-plane me-1"></i> Join our Telegram Channel
                            </a>
                        </div>
                    </div>

                    <p className="contact-note">
                        Note: For instant support and quick responses, we recommend joining our Telegram channel. We aim to respond to all email inquiries within 24-48 hours.
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default Help;
