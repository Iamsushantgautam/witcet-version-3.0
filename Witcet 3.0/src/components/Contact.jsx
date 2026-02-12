import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import '../styles/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // Prepare form data for FormSubmit
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('subject', formData.subject);
        data.append('message', formData.message);
        data.append('_subject', 'New Contact Form Submission from Witcet');
        data.append('_template', 'box');
        data.append('_captcha', 'false');

        try {
            const response = await fetch('https://formsubmit.co/ajax/witcet@zohomail.in', {
                method: 'POST',
                body: data
            });

            const result = await response.json();

            if (result.success === 'true' || response.ok) { // FormSubmit API behavior check
                setStatus('success');
                setShowSuccess(true);
                setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                    setStatus('idle');
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <div className="contact-page pb-5">
            {/* Header */}
            <header className="contact-header">
                <Container>
                    <h1>Contact US</h1>
                    <p className="lead">Get the assistance you need to make the most of Witcet</p>
                </Container>
            </header>

            <Container className="my-5">
                <Row className="g-5">
                    {/* Left Side: Contact Details */}
                    <Col lg={5} md={12} className="contact-details-col">
                        <div className="contact-info-card p-4 h-100">
                            <h2 className="mb-4 text-white">Contact Information</h2>
                            <p className="mb-5 text-white-50">Fill up the form and our Team will get back to you within 24 hours.</p>

                            <div className="contact-item mb-4 d-flex align-items-start">
                                <div className="icon-circle me-3">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div>
                                    <h5 className="text-white mb-1">Email</h5>
                                    <p className="text-white-50 mb-0">witcet@zohomail.in</p>
                                </div>
                            </div>

                            <div className="contact-item mb-4 d-flex align-items-start">
                                <div className="icon-circle me-3">
                                    <i className="fab fa-telegram-plane"></i>
                                </div>
                                <div>
                                    <h5 className="text-white mb-2">Telegram</h5>
                                    <a href="https://t.me/+mKi_iF1EsEg2MDU1" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-sm rounded-pill px-3">
                                        Join Channel <i className="fas fa-paper-plane ms-2"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Side: Contact Form */}
                    <Col lg={7} md={12}>
                        <div className="contact-form-card bg-white p-4 p-md-5 rounded-3 shadow-sm h-100">
                            <h2 className="contact-title text-start mb-2">Send us a Message</h2>
                            <p className="contact-subtitle text-start mb-4">We'd love to hear from you!</p>

                            <form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="name" className="form-label small text-muted">Your Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className="form-control form-control-lg bg-light border-0"
                                                placeholder="John Doe"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="email" className="form-label small text-muted">Your Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control form-control-lg bg-light border-0"
                                                placeholder="john@example.com"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <div className="form-group mb-3">
                                    <label htmlFor="subject" className="form-label small text-muted">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        className="form-control form-control-lg bg-light border-0"
                                        placeholder="Project Inquiry"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label htmlFor="message" className="form-label small text-muted">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        className="form-control form-control-lg bg-light border-0"
                                        placeholder="Write your message here..."
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100 fw-bold"
                                    disabled={status === 'sending'}
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin me-2"></i> Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message <i className="fas fa-paper-plane ms-2"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Status Messages */}
                            {showSuccess && (
                                <Alert variant="success" className="mt-4 text-center">
                                    <i className="fas fa-check-circle me-2"></i> Message Sent Successfully!
                                </Alert>
                            )}

                            {status === 'error' && (
                                <Alert variant="danger" className="mt-4 text-center">
                                    Failed to send message. Please try again.
                                </Alert>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Contact;
