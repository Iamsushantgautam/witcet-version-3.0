import { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Save } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState({
        name: 'Administrator',
        email: 'admin@witcet.com',
        role: 'Admin',
        createdAt: new Date().toLocaleDateString()
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...userData });

    useEffect(() => {
        // Load user data from localStorage
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
        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.name = editData.name;
        storedUser.email = editData.email;
        localStorage.setItem('user', JSON.stringify(storedUser));
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="profile-container">
            <h2 className="profile-heading">Profile</h2>

            <div className="profile-card">
                {/* Avatar Section */}
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        <User size={48} />
                    </div>
                    <h3 className="profile-name">{userData.name}</h3>
                    <p className="profile-role-badge">{userData.role}</p>
                </div>

                {/* Details Section */}
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

                {/* Action Buttons */}
                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="btn-cancel">
                                Cancel
                            </button>
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

            {/* Stats Cards */}
            <div className="profile-stats">
                <div className="stat-card-small">
                    <div className="stat-icon-small">📝</div>
                    <div className="stat-info">
                        <div className="stat-label-small">Total Sessions</div>
                        <div className="stat-value-small">12</div>
                    </div>
                </div>
                <div className="stat-card-small">
                    <div className="stat-icon-small">⚡</div>
                    <div className="stat-info">
                        <div className="stat-label-small">Last Login</div>
                        <div className="stat-value-small">Today</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
