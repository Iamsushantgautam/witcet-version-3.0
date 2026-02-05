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

            <Container>
                {/* Telegram Alert */}
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <div className="telegram-alert">
                            <h4><i className="fab fa-telegram me-2"></i> Need Fast Reply?</h4>
                            <p className="mb-2">Join our Telegram channel for instant support and quick responses!</p>
                            <a
                                href="https://t.me/+mKi_iF1EsEg2MDU1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="telegram-btn"
                            >
                                <i className="fab fa-telegram me-2"></i> Join Telegram Channel
                            </a>
                        </div>
                    </Col>
                </Row>

                {/* Contact Form */}
                <Row className="justify-content-center">
                    <Col md={8} lg={7}>
                        <div className="contact-container">
                            <h2 className="contact-title">Send us a Message</h2>
                            <p className="contact-subtitle">Fill out the form below and we'll get back to you as soon as possible</p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Your Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control-custom"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Your Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control-custom"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject" className="form-label">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        className="form-control-custom"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        className="form-control-custom"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={status === 'sending'}
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin me-2"></i> Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane me-2"></i> Send Message
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Success Message */}
                            {showSuccess && (
                                <Alert variant="success" className="mt-4 text-center">
                                    <h4><i className="fas fa-check-circle me-2"></i> Message Sent Successfully!</h4>
                                    <p className="mb-0">Thank you for contacting us! We've received your message and will get back to you soon.</p>
                                </Alert>
                            )}

                            {/* Error Message */}
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
