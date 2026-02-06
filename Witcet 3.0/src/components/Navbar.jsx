import React from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button } from 'react-bootstrap';
import InstallButton from './InstallButton';

const Navigation = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary nav_custom py-3" sticky="top">
            <Container fluid className="px-lg-5">
                <Navbar.Brand href="/">
                    <img
                        className="nav-logo"
                        src="/images/Logo.png"
                        alt="Logo"
                        style={{ height: '40px' }}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x50?text=Witcet';
                        }}
                    />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarSupportedContent" className="menu_btn" />

                <Navbar.Collapse id="navbarSupportedContent">
                    <Nav className="me-auto mb-2 mb-lg-0">
                        <Nav.Link href="/" className="px-3">Home</Nav.Link>
                        <Nav.Link href="/notes" className="px-3">AKTU notes</Nav.Link>
                        <Nav.Link href="/quantums" className="px-3">quantums</Nav.Link>
                        <Nav.Link href="/pyqs" className="px-3">Last 5Year PYQ</Nav.Link>
                        <Nav.Link href="/updates" className="px-3">Updates</Nav.Link>
                        <Nav.Link href="/contact" className="px-3">Contact</Nav.Link>
                    </Nav>

                    <div className="d-flex ms-auto align-items-center">
                        <Form className="d-flex me-2">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2 rounded-pill bg-white/10 text-white border-white/20"
                                aria-label="Search"
                            />
                            <Button variant="outline-success" className="rounded-pill px-4">Search</Button>
                        </Form>

                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
