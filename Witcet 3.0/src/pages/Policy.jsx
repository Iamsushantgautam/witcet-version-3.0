import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/Policy.css';

const Policy = () => {
    const [activeSection, setActiveSection] = useState('introduction');

    const sections = [
        { id: 'introduction', title: 'Introduction', icon: 'fa-info-circle' },
        { id: 'information', title: 'Information We Collect', icon: 'fa-database' },
        { id: 'usage', title: 'How We Use Your Data', icon: 'fa-cogs' },
        { id: 'disclaimer', title: 'Content Disclaimer', icon: 'fa-exclamation-triangle' },
        { id: 'third-party', title: 'Third-Party Links', icon: 'fa-link' },
        { id: 'updates', title: 'Policy Updates', icon: 'fa-sync-alt' },
        { id: 'contact', title: 'Contact Us', icon: 'fa-envelope' }
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="policy-page pb-5">
            <header className="policy-header">
                <Container>
                    <h1>Privacy Policy & Terms</h1>
                    <p className="lead">Transparency about how we handle your data and our rules</p>
                    <div className="last-updated">
                        <i className="far fa-calendar-alt me-2"></i>
                        Last Updated: February 2026
                    </div>
                </Container>
            </header>

            <Container className="my-5">
                <Row className="g-4">
                    {/* Left Sidebar Navigation */}
                    <Col lg={3} md={12}>
                        <div className="policy-sidebar sticky-top">
                            <h5 className="sidebar-title mb-3">Quick Navigation</h5>
                            <nav className="policy-nav">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                                        onClick={() => scrollToSection(section.id)}
                                    >
                                        <i className={`fas ${section.icon} me-2`}></i>
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </Col>

                    {/* Right Content */}
                    <Col lg={9} md={12}>
                        <div className="policy-content">
                            {/* Section 1 */}
                            <div id="introduction" className="policy-card">
                                <div className="card-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <h2>1. Introduction</h2>
                                <p>
                                    Welcome to <strong>Witcet</strong>. We are committed to protecting your privacy and ensuring you have a positive experience on our website.
                                    This policy outlines our practices regarding data collection, use, and disclosure of your information.
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div id="information" className="policy-card">
                                <div className="card-icon">
                                    <i className="fas fa-database"></i>
                                </div>
                                <h2>2. Information We Collect</h2>
                                <p>We collect minimal information to provide you with the best experience:</p>
                                <ul>
                                    <li>
                                        <strong>Usage Data:</strong> Information on how the Service is accessed and used (e.g., page views, download statistics).
                                    </li>
                                    <li>
                                        <strong>Communication Data:</strong> If you contact us, we may keep a record of that correspondence.
                                    </li>
                                    <li>
                                        <strong>Cookies:</strong> We use cookies to enhance user experience and analyze traffic.
                                    </li>
                                </ul>
                            </div>

                            {/* Section 3 */}
                            <div id="usage" className="policy-card">
                                <div className="card-icon">
                                    <i className="fas fa-cogs"></i>
                                </div>
                                <h2>3. How We Use Your Information</h2>
                                <p>The information we collect is used solely for:</p>
                                <ul>
                                    <li>Providing and maintaining our Service.</li>
                                    <li>Improving educational content based on popularity and demand.</li>
                                    <li>Responding to your comments, questions, and requests.</li>
                                    <li>Analyzing usage patterns to enhance user experience.</li>
                                </ul>
                            </div>

                            {/* Section 4 */}
                            <div id="disclaimer" className="policy-card highlight">
                                <div className="card-icon warning">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <h2>4. Content Disclaimer</h2>
                                <p>
                                    The educational materials (notes, question papers, quantum series) provided on Witcet are for <strong>educational purposes only</strong>.
                                    We do not claim ownership of official university documents (like PYQs). They are shared to assist students in their studies.
                                </p>
                                <p className="text-muted small mb-0">
                                    If you believe any content violates copyright, please contact us immediately.
                                </p>
                            </div>

                            {/* Section 5 */}
                            <div id="third-party" className="policy-card">
                                <div className="card-icon">
                                    <i className="fas fa-link"></i>
                                </div>
                                <h2>5. Third-Party Links</h2>
                                <p>
                                    Our Service may contain links to third-party websites or services that are not owned or controlled by Witcet.
                                    We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party websites or services.
                                </p>
                            </div>

                            {/* Section 6 */}
                            <div id="updates" className="policy-card">
                                <div className="card-icon">
                                    <i className="fas fa-sync-alt"></i>
                                </div>
                                <h2>6. Updates to This Policy</h2>
                                <p>
                                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                                    You are advised to review this Privacy Policy periodically for any changes.
                                </p>
                            </div>

                            {/* Section 7 */}
                            <div id="contact" className="policy-card">
                                <div className="card-icon">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <h2>7. Contact Us</h2>
                                <p>
                                    If you have any questions about this Privacy Policy or our practices, please don't hesitate to contact us:
                                </p>
                                <div className="contact-methods">
                                    <a href="/contact" className="contact-method-link">
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Contact Form
                                    </a>
                                    <a href="mailto:witcet@zohomail.in" className="contact-method-link">
                                        <i className="fas fa-envelope me-2"></i>
                                        Email Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Policy;
