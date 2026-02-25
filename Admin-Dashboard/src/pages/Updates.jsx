import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Edit, Trash2, Image as ImageIcon, FileText, Power, X } from 'lucide-react';
import './Updates.css';

const Updates = () => {
    const navigate = useNavigate();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            const res = await api.get('/updates');
            setUpdates(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching updates:', err);
            setLoading(false);
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            await api.patch(`/updates/${id}`, { isActive: !currentStatus });
            setUpdates(updates.map(u =>
                u._id === id ? { ...u, isActive: !currentStatus } : u
            ));
        } catch (err) {
            console.error('Error toggling update status:', err);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this update?')) return;
        try {
            await api.delete(`/updates/${id}`);
            setUpdates(updates.filter(u => u._id !== id));
            alert('Update deleted successfully!');
        } catch (err) {
            console.error('Error deleting update:', err);
            alert('Failed to delete update. Please try again.');
        }
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    return (
        <div className="updates-container">
            <h2 className="updates-heading">Updates</h2>

            <div className="updates-header">
                <p className="updates-subtitle">Manage your updates here.</p>
                <button onClick={() => navigate('/updates/add')} className="btn-add-update">
                    <Plus size={18} />
                    Add Update
                </button>
            </div>

            {loading ? (
                <div className="loading-state">Loading updates...</div>
            ) : updates.length === 0 ? (
                <div className="empty-state-box">
                    No updates added yet. Click "Add Update" to get started.
                </div>
            ) : (
                <div className="updates-grid">
                    {updates.map((update) => (
                        <div key={update._id} className="update-card">
                            <div className="update-card-body">
                                <h5 className="update-title">{update.title}</h5>
                                <p className="update-description">{update.description}</p>

                                <div className="update-meta">
                                    <p className="update-date">
                                        <strong>Date:</strong> {new Date(update.date).toLocaleDateString()}
                                    </p>
                                    <p className="update-time">
                                        <strong>Time:</strong> {update.time}
                                    </p>
                                </div>

                                <div className="update-status">
                                    <span className={`status-badge ${update.isActive ? 'active' : 'inactive'}`}>
                                        {update.isActive ? '🟢 Active' : '🔴 Inactive'}
                                    </span>
                                </div>

                                <div className="update-links">
                                    {update.imageUrl && (
                                        <button
                                            onClick={() => openImageModal(update.imageUrl)}
                                            className="btn-link-view"
                                        >
                                            <ImageIcon size={16} />
                                            View Image
                                        </button>
                                    )}
                                    {update.pdfLink && (
                                        <a
                                            href={update.pdfLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-link-pdf"
                                        >
                                            <FileText size={16} />
                                            View PDF
                                        </a>
                                    )}
                                    {update.link && (
                                        <div style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                                            <strong>General Link:</strong> <a
                                                href={update.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary"
                                                style={{ wordBreak: 'break-all' }}
                                            >
                                                {update.link}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="update-actions">
                                    <button
                                        onClick={() => navigate(`/updates/edit/${update._id}`)}
                                        className="btn-edit-small"
                                    >
                                        <Edit size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(update._id, update.isActive)}
                                        className={`btn-toggle ${update.isActive ? 'deactivate' : 'activate'}`}
                                    >
                                        <Power size={14} />
                                        {update.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(update._id)}
                                        className="btn-delete-small"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && (
                <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="image-modal-header">
                            <h5>Update Image</h5>
                            <button onClick={() => setShowImageModal(false)} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="image-modal-body">
                            <img src={selectedImage} alt="Update" className="modal-image" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Updates;
