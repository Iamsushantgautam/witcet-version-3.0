import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';

            const response = await axios.post(`${apiUrl}/api/auth/login`, {
                identifier,
                password
            });

            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Reload user data or redirect
            navigate('/');
            // Force reload to update navbar
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
            <Card className="shadow start-card border-0" style={{ maxWidth: '450px', width: '100%', borderRadius: '15px' }}>
                <Card.Body className="p-4 p-md-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-primary">Login</h2>
                        <p className="text-muted">Welcome back to Witcet</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="loginIdentifier">
                            <Form.Label>Email or Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="identifier"
                                placeholder="Enter email or username"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="loginPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </Button>
                            </InputGroup>
                            <div className="text-end mt-2">
                                <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#6366f1', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-2 rounded-pill fw-bold"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </Form>

                    <div className="text-center mt-4">
                        <p className="mb-0">
                            Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Sign Up</Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
