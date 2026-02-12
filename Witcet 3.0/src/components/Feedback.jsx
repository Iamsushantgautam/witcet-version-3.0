import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import '../styles/Feedback.css';

const Feedback = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: '',
        category: '',
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

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('rating', formData.rating);
        data.append('category', formData.category);
        data.append('message', formData.message);
        data.append('_subject', 'New Feedback from Witcet');
        data.append('_template', 'box');
        data.append('_captcha', 'false');

        try {
            const response = await fetch('https://formsubmit.co/ajax/witcet@zohomail.in', {
                method: 'POST',
                body: data
            });

            const result = await response.json();

            if (result.success === 'true' || response.ok) {
                setStatus('success');
                setShowSuccess(true);
                setFormData({ name: '', email: '', rating: '', category: '', message: '' });

                setTimeout(() => {
                    setShowSuccess(false);
                    setStatus('idle');
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatus('error');
        }
    };

    return (
        <div className="feedback-page pb-5">
            <header className="feedback-header">
                <Container>
                    <h1>We Value Your Feedback</h1>
                    <p className="lead">Help us improve your experience on Witcet</p>
                </Container>
            </header>

            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col lg={8} md={10}>
                        <div className="feedback-form-card bg-white p-4 p-md-5 rounded-3 shadow-sm">
                            <h2 className="feedback-title text-center mb-2">Share Your Thoughts</h2>
                            <p className="feedback-subtitle text-center mb-4">Your feedback helps us create a better experience for everyone!</p>

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

                                <Row>
                                    <Col md={6}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="rating" className="form-label small text-muted">Rate Your Experience</label>
                                            <select
                                                id="rating"
                                                name="rating"
                                                className="form-select form-select-lg bg-light border-0"
                                                required
                                                value={formData.rating}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Rating</option>
                                                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                                <option value="4">⭐⭐⭐⭐ Good</option>
                                                <option value="3">⭐⭐⭐ Average</option>
                                                <option value="2">⭐⭐ Poor</option>
                                                <option value="1">⭐ Very Poor</option>
                                            </select>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="category" className="form-label small text-muted">Feedback Category</label>
                                            <select
                                                id="category"
                                                name="category"
                                                className="form-select form-select-lg bg-light border-0"
                                                required
                                                value={formData.category}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Bug Report">🐛 Bug Report</option>
                                                <option value="Feature Request">💡 Feature Request</option>
                                                <option value="General Feedback">💬 General Feedback</option>
                                                <option value="Suggestion">🚀 Suggestion</option>
                                                <option value="Other">📝 Other</option>
                                            </select>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="form-group mb-4">
                                    <label htmlFor="message" className="form-label small text-muted">Your Feedback</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        className="form-control form-control-lg bg-light border-0"
                                        placeholder="Tell us what you think..."
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-info btn-lg w-100 fw-bold text-white"
                                    disabled={status === 'sending'}
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin me-2"></i> Sending...
                                        </>
                                    ) : (
                                        <>
                                            Submit Feedback <i className="fas fa-paper-plane ms-2"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            {showSuccess && (
                                <Alert variant="success" className="mt-4 text-center">
                                    <i className="fas fa-check-circle me-2"></i> Thank you for your feedback!
                                </Alert>
                            )}

                            {status === 'error' && (
                                <Alert variant="danger" className="mt-4 text-center">
                                    Failed to submit feedback. Please try again.
                                </Alert>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Feedback;
