import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
            setMessage(`OTP sent to ${email}. Valid for 5 minutes.`);
            setStep(2);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to send OTP. User may not exist.';
            const errorDetail = err.response?.data?.error ? ` Details: ${JSON.stringify(err.response.data.error)}` : '';
            setError(errorMsg + errorDetail);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            await axios.post(`${apiUrl}/api/auth/reset-password`, {
                email,
                otp,
                newPassword
            });

            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
            <Card className="shadow start-card border-0" style={{ maxWidth: '450px', width: '100%', borderRadius: '15px' }}>
                <Card.Body className="p-4 p-md-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-primary">
                            {step === 1 ? 'Forgot Password' : 'Reset Password'}
                        </h2>
                        <p className="text-muted">
                            {step === 1 ? 'Enter email to receive OTP' : 'Enter OTP to reset password'}
                        </p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}

                    {step === 1 ? (
                        <Form onSubmit={handleSendOtp}>
                            <Form.Group className="mb-4">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 py-2 rounded-pill fw-bold"
                                disabled={loading}
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleResetPassword}>
                            <Form.Group className="mb-3">
                                <Form.Label>Enter OTP</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 py-2 rounded-pill fw-bold"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Form>
                    )}

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-decoration-none text-muted small">
                            <i className="fas fa-arrow-left me-1"></i> Back to Login
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPassword;
