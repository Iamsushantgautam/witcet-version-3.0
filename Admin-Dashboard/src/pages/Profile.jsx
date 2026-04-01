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
        // Load user data from localStorage or API
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const initData = {
                    name: user.name || 'Administrator',
                    email: user.email || 'admin@witcet.com',
                    role: user.role || 'Admin',
                    createdAt: new Date().toLocaleDateString(),
                    profilePicture: user.profilePicture || null
                };
                setUserData(initData);
                setEditData(initData);
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
        storedUser.profilePicture = editData.profilePicture;
        localStorage.setItem('user', JSON.stringify(storedUser));
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    // --- CROPPER LOGIC ---
    const [cropImage, setCropImage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showCropModal, setShowCropModal] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                setCropImage(readerEvent.target.result);
                setShowCropModal(true);
                setZoom(1);
                setCropPos({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setCropPos({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    // --- GALLERY LOGIC ---
    const [gallery, setGallery] = useState(() => {
        const saved = localStorage.getItem('profile_gallery');
        return saved ? JSON.parse(saved) : [];
    });
    const [undoItem, setUndoItem] = useState(null);
    const [showUndo, setShowUndo] = useState(false);
    const [undoTimer, setUndoTimer] = useState(null);

    useEffect(() => {
        localStorage.setItem('profile_gallery', JSON.stringify(gallery));
    }, [gallery]);

    const performCrop = () => {
        const canvas = document.createElement('canvas');
        const img = document.getElementById('crop-preview-img');
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
        ctx.clip();

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const aspectRatio = imgWidth / imgHeight;
        
        let drawWidth, drawHeight;
        if (aspectRatio > 1) {
            drawHeight = size * zoom;
            drawWidth = drawHeight * aspectRatio;
        } else {
            drawWidth = size * zoom;
            drawHeight = drawWidth / aspectRatio;
        }

        const x = (size - drawWidth) / 2 + cropPos.x;
        const y = (size - drawHeight) / 2 + cropPos.y;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
        
        // Update profile
        setEditData({ ...editData, profilePicture: croppedImage });
        
        // Add to gallery if not already there
        if (!gallery.includes(croppedImage)) {
            setGallery([croppedImage, ...gallery.slice(0, 7)]); // Keep last 8
        }
        
        setShowCropModal(false);
    };

    const deleteFromGallery = (img) => {
        if (undoTimer) clearTimeout(undoTimer);
        setUndoItem(img);
        setShowUndo(true);
        setGallery(gallery.filter(item => item !== img));
        
        const timer = setTimeout(() => {
            setShowUndo(false);
            setUndoItem(null);
        }, 6000);
        setUndoTimer(timer);
    };

    const undoDelete = () => {
        if (undoItem) {
            setGallery([undoItem, ...gallery]);
            setShowUndo(false);
            setUndoItem(null);
            if (undoTimer) clearTimeout(undoTimer);
        }
    };

    const setAsProfile = (img) => {
        setEditData({ ...editData, profilePicture: img });
        if (!isEditing) {
            // Immediate save if not in edit mode
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            storedUser.profilePicture = img;
            localStorage.setItem('user', JSON.stringify(storedUser));
            setUserData({ ...userData, profilePicture: img });
        }
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
                <div className="profile-main">
                    <div className="profile-card">
                        <div className="profile-avatar-section">
                            <div className="profile-avatar-wrapper">
                                <div className="profile-avatar" style={{ overflow: 'hidden' }}>
                                    {editData.profilePicture || userData.profilePicture ? (
                                        <img 
                                            src={isEditing ? (editData.profilePicture || userData.profilePicture) : (userData.profilePicture || editData.profilePicture)} 
                                            alt={userData.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        userData.name?.charAt(0)?.toUpperCase()
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="avatar-edit-overlay" onClick={() => document.getElementById('avatar-upload').click()}>
                                        <Smartphone size={20} />
                                        <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleFileSelect} />
                                    </div>
                                )}
                            </div>
                            <h3 className="profile-name">{userData.name}</h3>
                            <p className="profile-role-badge">{userData.role}</p>
                        </div>

                        <div className="profile-details">
                            <div className="profile-field">
                                <div className="field-label"><User size={18} /><span>Full Name</span></div>
                                {isEditing ? <input type="text" name="name" value={editData.name} onChange={handleChange} className="profile-input" /> : <div className="field-value">{userData.name}</div>}
                            </div>
                            <div className="profile-field">
                                <div className="field-label"><Mail size={18} /><span>Email Address</span></div>
                                {isEditing ? <input type="email" name="email" value={editData.email} onChange={handleChange} className="profile-input" /> : <div className="field-value">{userData.email}</div>}
                            </div>
                            <div className="profile-field">
                                <div className="field-label"><Shield size={18} /><span>Role</span></div>
                                <div className="field-value"><span className="role-badge">{userData.role}</span></div>
                            </div>
                            <div className="profile-field">
                                <div className="field-label"><Calendar size={18} /><span>Member Since</span></div>
                                <div className="field-value">{userData.createdAt}</div>
                            </div>
                        </div>

                        <div className="profile-actions">
                            {isEditing ? (
                                <>
                                    <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                                    <button onClick={handleSave} className="btn-save"><Save size={16} />Save Changes</button>
                                </>
                            ) : (
                                <button onClick={handleEdit} className="btn-edit-profile">Edit Profile</button>
                            )}
                        </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="profile-card mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="card-title m-0">Security</h3>
                            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="btn-text">
                                {showPasswordForm ? 'Cancel' : 'Change Password'}
                            </button>
                        </div>
                        {showPasswordForm && (
                            <form onSubmit={handlePasswordChange} className="password-form">
                                {passwordError && <div className="text-danger mb-3 small">{passwordError}</div>}
                                <div className="form-group mb-3">
                                    <label className="small text-muted mb-1">Current Password</label>
                                    <input type="password" destination="none" className="form-control" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="small text-muted mb-1">New Password</label>
                                    <input type="password" destination="none" className="form-control" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="small text-muted mb-1">Confirm Password</label>
                                    <input type="password" destination="none" className="form-control" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Update Password</button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="profile-sidebar">
                    {/* PHOTO GALLERY SECTION */}
                    <div className="profile-card">
                        <h3 className="card-title">Photo History</h3>
                        {gallery.length === 0 ? (
                            <p className="text-muted small">No previous profile photos yet.</p>
                        ) : (
                            <div className="profile-gallery-grid">
                                {gallery.map((img, idx) => (
                                    <div key={idx} className="gallery-item-wrapper">
                                        <img 
                                            src={img} 
                                            alt={`Gallery ${idx}`} 
                                            className="gallery-thumb" 
                                            onClick={() => setAsProfile(img)}
                                            style={{ border: (editData.profilePicture === img || userData.profilePicture === img) ? '2px solid #7c5fd9' : 'none' }}
                                        />
                                        <button 
                                            className="gallery-delete-btn"
                                            onClick={() => deleteFromGallery(img)}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="profile-card mt-4">
                        <h3 className="card-title mb-4">Active Sessions</h3>
                        <div className="sessions-list">
                            {sessions.map(session => (
                                <div key={session.id} className="session-item">
                                    <div className="session-icon">{session.device.toLowerCase().includes('phone') ? <Smartphone size={20} /> : <Monitor size={20} />}</div>
                                    <div className="session-info">
                                        <div className="session-device">{session.device} <span className="text-muted">• {session.browser}</span></div>
                                        <div className="session-meta">{session.location} • {session.lastActive}</div>
                                        {session.active && <span className="badge bg-success-subtle text-success small mt-1">Current Session</span>}
                                    </div>
                                    <button className="btn-icon-danger" onClick={() => deleteSession(session.id)} title="Revoke Session"><Trash2 size={16} /></button>
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

            {/* CROP MODAL */}
            {showCropModal && (
                <div className="crop-modal-overlay">
                    <div className="crop-modal">
                        <div className="crop-modal-header">
                            <h3>Adjust Profile Photo</h3>
                            <button onClick={() => setShowCropModal(false)} className="btn-close-modal">✕</button>
                        </div>
                        <div className="crop-modal-body">
                            <div 
                                className="crop-frame"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                            >
                                <div className="circular-mask"></div>
                                <img 
                                    id="crop-preview-img" 
                                    src={cropImage} 
                                    alt="Crop Preview" 
                                    style={{ 
                                        transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${zoom})`, 
                                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                                    }}
                                    draggable="false"
                                />
                            </div>
                            <div className="crop-controls">
                                <div className="zoom-slider-wrapper">
                                    <Smartphone size={16} />
                                    <input 
                                        type="range" min="1" max="3" step="0.1" 
                                        value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="zoom-slider"
                                    />
                                    <span className="small fw-bold">Zoom</span>
                                </div>
                            </div>
                        </div>
                        <div className="crop-modal-footer">
                            <button onClick={() => setShowCropModal(false)} className="btn-cancel-modal">Cancel</button>
                            <button onClick={performCrop} className="btn-set-crop">Set and Crop</button>
                        </div>
                    </div>
                </div>
            )}
            {/* UNDO NOTIFICATION */}
            {showUndo && (
                <div className="profile-undo-toast">
                    <div className="undo-content">
                        <Trash2 size={18} />
                        <span>Profile Photo removed</span>
                    </div>
                    <button className="btn-undo-action" onClick={undoDelete}>UNDO</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
