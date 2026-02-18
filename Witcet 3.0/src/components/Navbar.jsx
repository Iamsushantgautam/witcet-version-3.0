import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Form, Button, Dropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

// Navigation component for the top of the page
const Navigation = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navbarRef = useRef(null);
    const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

    const toggleDesktopSearch = () => {
        setDesktopSearchOpen(!desktopSearchOpen);
        if (!desktopSearchOpen) {
            setTimeout(() => {
                document.getElementById('desktop-search-input')?.focus();
            }, 100);
        }
    };

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };

        loadUser();

        // Listen for user profile updates
        window.addEventListener('userUpdate', loadUser);
        return () => window.removeEventListener('userUpdate', loadUser);
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
        window.location.reload();
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
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const navLinks = [
        { label: 'Home', path: '/', },
        { label: 'AKTU notes', path: '/notes', },
        { label: 'Quantums', path: '/quantums', },
        { label: 'Last 5Year PYQ', path: '/pyqs', },
        { label: 'Updates', path: '/updates', },
        { label: 'Tools', path: '/tools', },
        { label: 'Offers', path: '/offers', },
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
                        className="custom-toggler d-lg-none"
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
                    <Nav className="mx-auto">
                        {navLinks.map((link) => (
                            <Nav.Link
                                key={link.path}
                                as={NavLink}
                                to={link.path}
                                onClick={() => setExpanded(false)}
                                className="nav-link-custom"
                            >
                                {link.icon && <i className={`fas ${link.icon} me-2`}></i>}
                                {link.label}
                            </Nav.Link>
                        ))}
                    </Nav>

                    <div className="d-flex align-items-center gap-3">
                        <Form className="d-flex search-form d-none d-lg-flex align-items-center" onSubmit={handleSearch}>
                            <div className={`desktop-search-container ${desktopSearchOpen ? 'open' : ''}`}>
                                <Form.Control
                                    type="search"
                                    id="desktop-search-input"
                                    name="search"
                                    placeholder="Search here..."
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    // Prevent closing when clicking inside
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <Button
                                variant={desktopSearchOpen ? "success" : "outline-success"}
                                className={`search-btn ${desktopSearchOpen ? 'active' : ''}`}
                                onClick={toggleDesktopSearch}
                                type={desktopSearchOpen && searchQuery ? "submit" : "button"}
                            >
                                <i className={`fas ${desktopSearchOpen ? 'fa-search' : 'fa-search'}`}></i>
                            </Button>
                        </Form>

                        {user ? (
                            <Dropdown align="end" className="d-none d-lg-block">
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center gap-2 rounded-pill border px-3">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center overflow-hidden" style={{ width: 30, height: 30, fontSize: '0.9rem' }}>
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            user.name?.charAt(0)?.toUpperCase()
                                        )}
                                    </div>
                                    <span className="fw-medium text-dark">{user.name?.split(' ')[0]}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="shadow-sm border-0 mt-2">
                                    <Dropdown.Item as={Link} to="/profile">
                                        <i className="fas fa-user me-2 text-muted"></i> Profile
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <div className="d-none d-lg-flex gap-2">
                                <Button as={Link} to="/login" variant="outline-primary" className="rounded-pill px-4 fw-bold">
                                    Login
                                </Button>
                            </div>
                        )}

                        {/* Mobile Auth Links */}
                        <div className="d-lg-none w-100 mt-3 border-top pt-3">
                            {user ? (
                                <div className="px-1">
                                    <div className="d-flex align-items-center gap-3 mb-3 px-3">
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm overflow-hidden" style={{ width: 48, height: 48, fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            {user.profilePicture ? (
                                                <img src={user.profilePicture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                user.name?.charAt(0)?.toUpperCase()
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '1rem' }}>{user.name}</div>
                                            <small className="text-muted d-block text-truncate" style={{ fontSize: '0.85rem' }}>@{user.username || 'user'}</small>
                                        </div>
                                    </div>

                                    <Nav.Link
                                        as={NavLink}
                                        to="/profile"
                                        onClick={() => setExpanded(false)}
                                        className="nav-link-custom"
                                    >
                                        <i className="far fa-user-circle me-3 text-center" style={{ width: 24 }}></i>
                                        Profile
                                    </Nav.Link>

                                    <Nav.Link
                                        onClick={handleLogout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            margin: '0.25rem 0.75rem',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            color: '#dc3545',
                                            fontSize: '0.95rem',
                                            fontWeight: '500',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <i className="fas fa-sign-out-alt me-3 text-center" style={{ width: 24 }}></i>
                                        Logout
                                    </Nav.Link>

                                    <div className="mt-3 pt-3 border-top d-flex align-items-center justify-content-between px-4 pb-2">
                                        <span className="text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>WITCET PRO</span>
                                        <span className="text-success" style={{ fontSize: '0.5rem' }}>●</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-grid gap-2 px-4 pb-3">
                                    <Button as={Link} to="/login" variant="primary" className="rounded-pill fw-bold py-2 shadow-sm" onClick={() => setExpanded(false)}>
                                        Login / Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
};

export default Navigation;
