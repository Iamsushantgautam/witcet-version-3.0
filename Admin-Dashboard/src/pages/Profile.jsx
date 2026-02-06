import { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Save, Lock, Smartphone, Monitor, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: 'Administrator',
        email: 'admin@witcet.com',
        role: 'Admin',
        createdAt: new Date().toLocaleDateString()
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...userData });

    // Password Change State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    // Sessions Data (Persisted in localStorage for demo)
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem('profile_sessions');
        return saved ? JSON.parse(saved) : [
            { id: 1, device: 'Windows PC', browser: 'Chrome', location: 'India', active: true, lastActive: 'Now' },
            { id: 2, device: 'iPhone', browser: 'Safari', location: 'India', active: false, lastActive: '2 days ago' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('profile_sessions', JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
        // Load user data from localStorage or API usually
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserData({
                    name: user.name || 'Administrator',
                    email: user.email || 'admin@witcet.com',
                    role: user.role || 'Admin',
                    createdAt: new Date().toLocaleDateString()
                });
                setEditData({
                    name: user.name || 'Administrator',
                    email: user.email || 'admin@witcet.com',
                    role: user.role || 'Admin',
                    createdAt: new Date().toLocaleDateString()
                });
            } catch (err) {
                console.error('Error parsing user data:', err);
            }
        }
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditData({ ...userData });
        setIsEditing(false);
    };

    const handleSave = () => {
        setUserData({ ...editData });
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.name = editData.name;
        storedUser.email = editData.email;
        localStorage.setItem('user', JSON.stringify(storedUser));
        setIsEditing(false);
        // Here you would typically call api.put('/users/profile', editData)
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }

        try {
            await api.post('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            alert('Password successfully changed');
            setShowPasswordForm(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password');
        }
    };

    const deleteSession = (sessionId) => {
        if (window.confirm('Are you sure you want to remove this session?')) {
            setSessions(sessions.filter(s => s.id !== sessionId));
        }
    };

    return (
        <div className="profile-container">
            <h2 className="profile-heading">Profile</h2>

            <div className="profile-grid">
                {/* Left Column: Profile Info */}
                <div className="profile-main">
                    <div className="profile-card">
                        <div className="profile-avatar-section">
                            <div className="profile-avatar">
                                <User size={48} />
                            </div>
                            <h3 className="profile-name">{userData.name}</h3>
                            <p className="profile-role-badge">{userData.role}</p>
                        </div>

                        <div className="profile-details">
                            <div className="profile-field">
                                <div className="field-label">
                                    <User size={18} />
                                    <span>Full Name</span>
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />
                                ) : (
                                    <div className="field-value">{userData.name}</div>
                                )}
                            </div>

                            <div className="profile-field">
                                <div className="field-label">
                                    <Mail size={18} />
                                    <span>Email Address</span>
                                </div>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={editData.email}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />
                                ) : (
                                    <div className="field-value">{userData.email}</div>
                                )}
                            </div>

                            <div className="profile-field">
                                <div className="field-label">
                                    <Shield size={18} />
                                    <span>Role</span>
                                </div>
                                <div className="field-value">
                                    <span className="role-badge">{userData.role}</span>
                                </div>
                            </div>

                            <div className="profile-field">
                                <div className="field-label">
                                    <Calendar size={18} />
                                    <span>Member Since</span>
                                </div>
                                <div className="field-value">{userData.createdAt}</div>
                            </div>
                        </div>

                        <div className="profile-actions">
                            {isEditing ? (
                                <>
                                    <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                                    <button onClick={handleSave} className="btn-save">
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEdit} className="btn-edit-profile">
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="profile-card mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="card-title m-0">Security</h3>
                            <button
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                className="btn-text"
                            >
                                {showPasswordForm ? 'Cancel' : 'Change Password'}
                            </button>
                        </div>

                        {showPasswordForm && (
                            <form onSubmit={handlePasswordChange} className="password-form">
                                {passwordError && <div className="text-danger mb-3 small">{passwordError}</div>}
                                <div className="form-group mb-3">
                                    <label className="small text-muted mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="small text-muted mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="small text-muted mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Update Password</button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Column: Sessions */}
                <div className="profile-sidebar">
                    <div className="profile-card">
                        <h3 className="card-title mb-4">Active Sessions</h3>
                        <div className="sessions-list">
                            {sessions.map(session => (
                                <div key={session.id} className="session-item">
                                    <div className="session-icon">
                                        {session.device.toLowerCase().includes('phone') ? <Smartphone size={20} /> : <Monitor size={20} />}
                                    </div>
                                    <div className="session-info">
                                        <div className="session-device">
                                            {session.device} <span className="text-muted">• {session.browser}</span>
                                        </div>
                                        <div className="session-meta">
                                            {session.location} • {session.lastActive}
                                        </div>
                                        {session.active && <span className="badge bg-success-subtle text-success small mt-1">Current Session</span>}
                                    </div>
                                    <button
                                        className="btn-icon-danger"
                                        onClick={() => deleteSession(session.id)}
                                        title="Revoke Session"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="stat-card mt-4">
                        <div className="stat-info w-100">
                            <div className="stat-label-small">Total Sessions</div>
                            <div className="stat-value-small">{sessions.length}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
