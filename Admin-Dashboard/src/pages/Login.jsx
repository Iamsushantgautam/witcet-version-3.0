import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page bg-light min-vh-100 d-flex align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md={5} lg={4}>
                        <Card className="shadow-lg border-0 rounded-4">
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary">Witcet Admin</h2>
                                    <p className="text-muted">Sign in to your account</p>
                                </div>

                                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label className="small fw-semibold">Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="password">
                                        <Form.Label className="small fw-semibold">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 py-2 fw-bold text-uppercase tracking-wider"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </Form>

                                <div className="text-center mt-4">
                                    <a href="#" className="text-decoration-none small text-muted">Forgot password?</a>
                                </div>
                            </Card.Body>
                        </Card>
                        <p className="text-center mt-4 text-muted small">
                            © 2026 Witcet Admin Platform. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
            <style dangerouslySetInnerHTML={{
                __html: `
                .login-page {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }
                .card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                }
                .btn-primary {
                    background: #6366f1;
                    border: none;
                }
                .btn-primary:hover {
                    background: #4f46e5;
                }
                .text-primary {
                    color: #6366f1 !important;
                }
            `}} />
        </div>
    );
};

export default Login;
