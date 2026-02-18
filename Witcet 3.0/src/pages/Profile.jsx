import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const fileInputRef = useRef(null);

    // Profile inputs
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');

    // Password inputs
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            const response = await axios.get(`${apiUrl}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data);
            setName(response.data.name);
            setUsername(response.data.username || '');
        } catch (err) {
            console.error('Profile fetch error:', err);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError('Failed to load profile data.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const token = localStorage.getItem('token');
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            const response = await axios.put(
                `${apiUrl}/api/auth/me/profile`,
                { name, username },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage('Profile updated successfully!');
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('userUpdate'));
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            await axios.put(
                `${apiUrl}/api/auth/me/password`,
                { currentPassword, newPassword },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size too large (max 5MB)');
            return;
        }

        // Optimistic UI update or loading state
        // We'll reuse 'loading' or add a specific one? Let's assume loading is okay or add new one?
        // Reuse message for now
        setMessage('Uploading image...');

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'witcet/users');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            const token = localStorage.getItem('token');

            // 1. Upload Image
            const uploadRes = await axios.post(`${apiUrl}/api/upload/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            const imageUrl = uploadRes.data.url;

            // 2. Update Profile with new Image URL
            const updateRes = await axios.put(
                `${apiUrl}/api/auth/me/profile`,
                { profilePicture: imageUrl },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setUser(updateRes.data.user);
            localStorage.setItem('user', JSON.stringify(updateRes.data.user));
            window.dispatchEvent(new Event('userUpdate'));
            setMessage('Profile picture updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to upload profile picture');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;

    const formattedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Unknown';

    return (
        <div className="profile-section">
            <Container>
                {message && <Alert variant="success" className="mb-4 shadow-sm border-0" dismissible onClose={() => setMessage('')}>{message}</Alert>}
                {error && <Alert variant="danger" className="mb-4 shadow-sm border-0" dismissible onClose={() => setError('')}>{error}</Alert>}

                <Row className="g-4">
                    {/* Left Column - User Card */}
                    <Col lg={4}>
                        <div className="profile-card p-4 text-center">
                            <div className="profile-avatar-container">
                                <div className="profile-avatar" style={{ overflow: 'hidden' }}>
                                    {user?.profilePicture ? (
                                        <img src={user.profilePicture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        user?.name?.charAt(0)?.toUpperCase()
                                    )}
                                </div>
                                <div className="edit-avatar-badge" onClick={() => fileInputRef.current?.click()} title="Change Profile Picture">
                                    <i className="fas fa-camera" style={{ fontSize: '0.9rem' }}></i>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    hidden
                                    accept="image/*"
                                />
                            </div>

                            <h3 className="profile-name">{user?.name}</h3>
                            <div className="profile-email">{user?.email}</div>

                            <div className="role-badge mb-1">
                                {user?.role === 'admin' ? 'ADMINISTRATOR' : 'STUDENT MEMBER'}
                            </div>

                            <div className="profile-divider"></div>

                            <div className="member-since-label">MEMBER SINCE</div>
                            <div className="member-since-date">{formattedDate}</div>

                            <button onClick={handleLogout} className="logout-link bg-transparent border-0 w-100 justify-content-center mt-3">
                                <i className="fas fa-sign-out-alt"></i> Logout from Account
                            </button>
                        </div>


                    </Col>

                    {/* Right Column - Content */}
                    <Col lg={8}>
                        <div className="profile-card profile-content-card">
                            {/* Navigation Tabs */}
                            <div className="profile-tabs">
                                <div
                                    className={`profile-tab-item ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    PROFILE
                                </div>
                                <div
                                    className={`profile-tab-item ${activeTab === 'security' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('security')}
                                >
                                    SECURITY
                                </div>
                                <div
                                    className={`profile-tab-item ${activeTab === 'preferences' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('preferences')}
                                >
                                    PREFERENCES
                                </div>
                            </div>

                            {/* Profile Tab Content */}
                            {activeTab === 'profile' && (
                                <div className="animate__animated animate__fadeIn">
                                    <h4 className="section-title">Personal Information</h4>
                                    <p className="section-subtitle">Update your personal details and how others see you on the platform.</p>

                                    <Form onSubmit={handleUpdateProfile}>
                                        <Row className="mb-4">
                                            <Col md={6}>
                                                <Form.Group controlId="fullName">
                                                    <Form.Label className="form-label-custom">FULL NAME</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="fullName"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="form-control-line"
                                                        placeholder="Your Full Name"
                                                        required
                                                        style={{ fontWeight: 'bold' }} // Bold as in image
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="username">
                                                    <Form.Label className="form-label-custom">USERNAME</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="username"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        className="form-control-line"
                                                        placeholder="Username"
                                                        required
                                                        style={{ fontWeight: 'bold' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-5 position-relative" controlId="email">
                                            <Form.Label className="form-label-custom">EMAIL ADDRESS</Form.Label>
                                            <div className="position-relative">
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="form-control-line"
                                                    style={{ paddingRight: '2rem', color: '#64748b' }}
                                                />
                                                <i className="fas fa-lock input-icon-lock"></i>
                                            </div>
                                            <div className="helper-text">
                                                <i className="fas fa-info-circle text-muted" style={{ fontSize: '0.8rem' }}></i>
                                                Email cannot be changed directly for security reasons. Contact Admin to change email.
                                            </div>
                                        </Form.Group>

                                        <div className="d-flex justify-content-end align-items-center">
                                            <button type="button" className="discard-btn" onClick={() => window.location.reload()}>
                                                Discard Changes
                                            </button>
                                            <button type="submit" className="save-btn">
                                                SAVE CHANGES
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                            )}

                            {/* Security Tab Content */}
                            {activeTab === 'security' && (
                                <div className="animate__animated animate__fadeIn">
                                    <h4 className="section-title">Security Settings</h4>
                                    <p className="section-subtitle">Manage your password and account security preferences.</p>

                                    <Form onSubmit={handleChangePassword}>
                                        <Form.Group className="mb-4" controlId="currentPassword">
                                            <Form.Label className="form-label-custom">CURRENT PASSWORD</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="currentPassword"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="form-control-line"
                                                placeholder="Enter current password"
                                                required
                                            />
                                        </Form.Group>

                                        <Row className="mb-5">
                                            <Col md={6}>
                                                <Form.Group controlId="newPassword">
                                                    <Form.Label className="form-label-custom">NEW PASSWORD</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="newPassword"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="form-control-line"
                                                        placeholder="Min 6 characters"
                                                        minLength={6}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="confirmPassword">
                                                    <Form.Label className="form-label-custom">CONFIRM PASSWORD</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={confirmNewPassword}
                                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                        className="form-control-line"
                                                        placeholder="Re-enter new password"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <div className="d-flex justify-content-end align-items-center">
                                            <button type="button" className="discard-btn" onClick={() => {
                                                setCurrentPassword('');
                                                setNewPassword('');
                                                setConfirmNewPassword('');
                                            }}>
                                                Discard
                                            </button>
                                            <button type="submit" className="save-btn">
                                                UPDATE PASSWORD
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                            )}

                            {/* Preferences Tab Content */}
                            {activeTab === 'preferences' && (
                                <div className="text-center py-5 text-muted animate__animated animate__fadeIn">
                                    <i className="fas fa-sliders-h fa-3x mb-3 text-light"></i>
                                    <h5>Preferences</h5>
                                    <p>Notification and display settings coming soon.</p>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Profile;
