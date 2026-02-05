import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-page">
            <Container>
                {/* Header Section */}
                <div className="about-header">
                    <h1>About Us</h1>
                    <p className="lead">We are dedicated to providing quality education and resources.</p>
                </div>

                {/* Content Section */}
                <div className="about-content">
                    {/* Left Column: Image */}
                    <div className="about-image-wrapper">
                        <img
                            src="https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg?w=996&t=st=1708023456~exp=1708024056~hmac=3d7bc1708023456"
                            alt="Team Collaboration"
                            className="about-image"
                            onError={(e) => {
                                // Fallback if external image fails
                                e.target.src = 'https://via.placeholder.com/600x400?text=About+Us+Team';
                            }}
                        />
                    </div>

                    {/* Right Column: Text */}
                    <div className="about-text-content">
                        <div className="about-section">
                            <h2>Our Mission</h2>
                            <p>
                                Our goal is to create an educational platform that helps students and
                                learners to access quality resources efficiently.
                            </p>
                        </div>

                        <div className="about-section">
                            <h2>Our Vision</h2>
                            <p>
                                We aim to bridge the gap between knowledge and accessibility by providing
                                a user-friendly interface and high-quality content.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default About;
