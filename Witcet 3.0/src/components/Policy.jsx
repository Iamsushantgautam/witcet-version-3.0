import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/Policy.css';

const Policy = () => {
    return (
        <div className="policy-page">
            <header className="policy-header">
                <Container>
                    <h1>Privacy Policy & Terms of Service</h1>
                    <p className="lead">Transparency about how we handle your data and our rules.</p>
                    <div className="last-updated">Last Updated: February 2026</div>
                </Container>
            </header>

            <div className="policy-container">
                <div className="policy-section">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to Witcet. We are committed to protecting your privacy and ensuring you have a positive experience on our website.
                        This policy outlines our practices regarding data collection, use, and disclosure of your information.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>2. Information We Collect</h2>
                    <p>
                        We collect minimal information to provide you with the best experience:
                    </p>
                    <ul>
                        <li><strong className="text-dark">Usage Data:</strong> Information on how the Service is accessed and used (e.g., page views, download statistics).</li>
                        <li><strong className="text-dark">Communication Data:</strong> If you contact us, we may keep a record of that correspondence.</li>
                        <li><strong className="text-dark">Cookies:</strong> We use cookies to enhance user experience and analyze traffic.</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h2>3. How We Use Your Information</h2>
                    <p>
                        The information we collect is used solely for:
                    </p>
                    <ul>
                        <li>Providing and maintaining our Service.</li>
                        <li>Improving educational content based on popularity and demand.</li>
                        <li>Responding to your comments, questions, and requests.</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h2>4. Content Disclaimer</h2>
                    <p>
                        The educational materials (notes, question papers, quantum series) provided on Witcet are for educational purposes only.
                        We do not claim ownership of official university documents (like PYQs). They are shared to assist students in their studies.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>5. Third-Party Links</h2>
                    <p>
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by Witcet.
                        We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>6. Updates to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>
                </div>

                <div className="policy-section">
                    <h2>7. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us via our <a href="/contact">Contact Page</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Policy;
