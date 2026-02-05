import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/Feedback.css';

const Feedback = () => {
    return (
        <div className="feedback-page">
            <header className="feedback-header">
                <Container>
                    <h1>We Value Your Feedback</h1>
                    <p className="lead">Help us improve your experience on Witcet</p>
                </Container>
            </header>

            <div className="feedback-container">
                <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLScRDbXUBFCWMHSS49S3trJX7oMKQmvkyaIMuFClEsE5QVE0hg/viewform?embedded=true"
                    className="feedback-iframe"
                    title="Witcet Feedback Form"
                >
                    Loading…
                </iframe>
            </div>
        </div>
    );
};

export default Feedback;
