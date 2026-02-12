import { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
            setSuccess('OTP has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. Check your OTP and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page bg-light min-vh-100 d-flex align-items-center py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                            <div className="bg-primary p-4 text-center text-white">
                                <KeyRound size={48} className="mb-2 opacity-75" />
                                <h3 className="fw-bold mb-0">Reset Password</h3>
                                <p className="mb-0 opacity-75 small">Securely recover your Witcet account</p>
                            </div>
                            <Card.Body className="p-4 p-md-5">
                                {error && <Alert variant="danger" className="py-2 small d-flex align-items-center gap-2">
                                    <span>{error}</span>
                                </Alert>}
                                {success && <Alert variant="success" className="py-2 small d-flex align-items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    <span>{success}</span>
                                </Alert>}

                                {step === 1 ? (
                                    <Form onSubmit={handleRequestOtp}>
                                        <div className="text-center mb-4">
                                            <p className="text-muted">Enter your email address and we'll send you an OTP to reset your password.</p>
                                        </div>
                                        <Form.Group className="mb-4" controlId="email">
                                            <Form.Label className="small fw-semibold text-muted">Email Address</Form.Label>
                                            <div className="position-relative">
                                                <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                                <Form.Control
                                                    type="email"
                                                    placeholder="admin@witcet.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="py-2 ps-5"
                                                />
                                            </div>
                                        </Form.Group>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="w-100 py-2 fw-bold text-uppercase tracking-wider mb-3"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending OTP...' : 'Send OTP'}
                                        </Button>
                                    </Form>
                                ) : (
                                    <Form onSubmit={handleResetPassword}>
                                        <div className="text-center mb-4">
                                            <p className="text-muted">We've sent an OTP to <strong>{email}</strong></p>
                                        </div>
                                        <Form.Group className="mb-3" controlId="otp">
                                            <Form.Label className="small fw-semibold text-muted">Enter OTP</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="6-digit code"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                                className="py-2 text-center fw-bold letter-spacing-2"
                                                maxLength={6}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="newPassword">
                                            <Form.Label className="small fw-semibold text-muted">New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                className="py-2"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-4" controlId="confirmPassword">
                                            <Form.Label className="small fw-semibold text-muted">Confirm New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="py-2"
                                            />
                                        </Form.Group>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="w-100 py-2 fw-bold text-uppercase tracking-wider mb-3"
                                            disabled={loading}
                                        >
                                            {loading ? 'Resetting...' : 'Reset Password'}
                                        </Button>
                                    </Form>
                                )}

                                <div className="text-center mt-2">
                                    <Link
                                        to="/login"
                                        className="text-decoration-none text-muted small d-flex align-items-center justify-content-center gap-1 mx-auto"
                                    >
                                        <ArrowLeft size={14} />
                                        Back to Login
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <style dangerouslySetInnerHTML={{
                __html: `
                .forgot-password-page {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }
                .bg-primary {
                    background: #6366f1 !important;
                }
                .btn-primary {
                    background: #6366f1;
                    border: none;
                }
                .btn-primary:hover {
                    background: #4f46e5;
                }
                .letter-spacing-2 {
                    letter-spacing: 4px;
                }
            `}} />
        </div>
    );
};

export default ForgotPassword;
