import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Target, Eye, Users, Award, BookOpen, Heart } from 'lucide-react';
import '../styles/About.css';

const About = () => {
    const values = [
        {
            icon: <Target className="value-icon-target" />,
            title: 'Our Mission',
            description: 'To democratize access to high-quality educational materials by providing a localized, efficient, and student-first platform for notes and guidance.'
        },
        {
            icon: <Eye className="value-icon-eye" />,
            title: 'Our Vision',
            description: 'To become the definitive digital companion for every student’s academic journey, bridging the gap between knowledge and accessibility.'
        },
        {
            icon: <Heart className="value-icon-heart" />,
            title: 'Our Core Values',
            description: 'We believe in community-driven growth, technical excellence, and maintaining the highest standards of accuracy for our learning resources.'
        }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero">
                <Container>
                    <div className="hero-glass-card">
                        <span className="hero-badge">Since 2024</span>
                        <h1 className="hero-title">Empowering the Next <br/>Generation of <span>Learners</span></h1>
                        <p className="hero-lead">We are building the future of digital education—one note at a time.</p>
                    </div>
                </Container>
            </div>

            {/* Impact Pillars Section */}
            <div className="impact-pillars-section">
                <Container>
                    <div className="pillars-grid">
                        <div className="pillar-item animate-grid-item" style={{ animationDelay: '0.1s' }}>
                            <div className="pillar-icon-box blue">
                                <BookOpen size={28} />
                            </div>
                            <h3>Verified Quality</h3>
                            <p>Every resource on our platform undergoes a rigorous verification process to ensure accuracy and relevance.</p>
                        </div>
                        <div className="pillar-item animate-grid-item" style={{ animationDelay: '0.2s' }}>
                            <div className="pillar-icon-box purple">
                                <Users size={28} />
                            </div>
                            <h3>Student Growth</h3>
                            <p>We measure our success not by numbers, but by the tangible academic progress of our community members.</p>
                        </div>
                        <div className="pillar-item animate-grid-item" style={{ animationDelay: '0.3s' }}>
                            <div className="pillar-icon-box rose">
                                <Award size={28} />
                            </div>
                            <h3>Innovation Driven</h3>
                            <p>From AI-powered search to interactive tools, we continuously evolve to meet modern educational needs.</p>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main Content Sections */}
            <Container className="main-content-container">
                <Row className="align-items-center g-5 section-py">
                    <Col lg={6}>
                        <div className="about-content-visual">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                                alt="Modern Team"
                                className="img-main"
                            />
                            <div className="floating-badge top-right">
                                <Award size={20} />
                                <span>Premier Resource Provider</span>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="about-text-content">
                            <h2 className="section-title">The Witcet Story</h2>
                            <p className="section-desc">
                                Witcet was born from a simple realization: students shouldn't have to struggle to find reliable, high-quality study materials in a digital age. 
                                Starting as a localized repository, we have evolved into a comprehensive ecosystem that supports thousands of learners every single day.
                            </p>
                            <p className="section-desc">
                                Our platform leverages modern technology to organize, verify, and distribute academic resources with unprecedented speed and accuracy.
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Values Grid */}
                <div className="values-section section-py">
                    <h2 className="text-center section-title mb-5">Why Choose Witcet?</h2>
                    <Row className="g-4">
                        {values.map((v, i) => (
                            <Col md={4} key={i}>
                                <div className="value-card">
                                    <div className="value-icon-wrapper">{v.icon}</div>
                                    <h3 className="value-title">{v.title}</h3>
                                    <p className="value-desc">{v.description}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default About;
