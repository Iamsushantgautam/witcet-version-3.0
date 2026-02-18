import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

// Navigation component for the top of the page
const Navigation = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const navbarRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setExpanded(false);
            setMobileSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleMobileSearch = () => {
        setMobileSearchOpen(!mobileSearchOpen);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setExpanded(false);
                setMobileSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'AKTU notes', path: '/notes' },
        { label: 'Quantums', path: '/quantums' },
        { label: 'Last 5Year PYQ', path: '/pyqs' },
        { label: 'Updates', path: '/updates' },
        { label: 'Tools', path: '/tools' },
        { label: 'Offers', path: '/offers' },

    ];

    return (
        <Navbar expand="lg" variant="light" className="custom-navbar" expanded={expanded} ref={navbarRef}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    <img
                        src="/images/Logo.png"
                        alt="Witcet Logo"
                        className="navbar-logo"
                    />
                </Navbar.Brand>

                <div className="d-flex align-items-center gap-2">
                    {/* Mobile Search Icon */}
                    <Button
                        variant="link"
                        className="mobile-search-btn d-lg-none"
                        onClick={handleMobileSearch}
                    >
                        <i className={`fas ${mobileSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
                    </Button>

                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        onClick={() => setExpanded(!expanded)}
                        className="custom-toggler"
                    />
                </div>

                {/* Mobile Search Form - appears below navbar on mobile */}
                {mobileSearchOpen && (
                    <Form className="mobile-search-form d-lg-none" onSubmit={handleSearch}>
                        <Form.Control
                            type="search"
                            id="mobile-search-input"
                            name="search"
                            placeholder="Search title, tag, code..."
                            className="mobile-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <Button
                            variant="link"
                            type="submit"
                            className="mobile-search-submit text-success p-0"
                        >
                            <i className="fas fa-search" style={{ fontSize: '1.2rem' }}></i>
                        </Button>
                    </Form>
                )}

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {navLinks.map((link) => (
                            <Nav.Link
                                key={link.path}
                                as={Link}
                                to={link.path}
                                onClick={() => setExpanded(false)}
                                className="nav-link-custom"
                            >
                                {link.label}
                            </Nav.Link>
                        ))}
                    </Nav>

                    <Form className="d-flex search-form d-none d-lg-flex" onSubmit={handleSearch}>
                        <Form.Control
                            type="search"
                            id="desktop-search-input"
                            name="search"
                            placeholder="Search title, tag, code..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            variant="outline-success"
                            type="submit"
                            className="search-btn"
                        >
                            <i className="fas fa-search"></i>
                        </Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
