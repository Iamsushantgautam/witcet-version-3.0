import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Save } from 'lucide-react';
import './AddUpdate.css';

const EditUpdate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        imageUrl: '',
        pdfLink: '',
        isActive: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUpdate();
    }, [id]);

    const fetchUpdate = async () => {
        try {
            const res = await api.get(`/updates/${id}`);
            const update = res.data;
            setFormData({
                title: update.title || '',
                description: update.description || '',
                date: update.date ? new Date(update.date).toISOString().split('T')[0] : '',
                time: update.time || '',
                imageUrl: update.imageUrl || '',
                pdfLink: update.pdfLink || '',
                isActive: update.isActive !== undefined ? update.isActive : true
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching update:', err);
            setError('Failed to load update. Please try again.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await api.put(`/updates/${id}`, formData);
            alert('Update modified successfully!');
            navigate('/updates');
        } catch (err) {
            console.error('Error updating:', err);
            setError(err.response?.data?.message || 'Failed to update. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="add-update-container">
                <div className="loading-state">Loading update...</div>
            </div>
        );
    }

    return (
        <div className="add-update-container">
            <div className="form-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="form-title">✏️ Edit Update</h2>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="update-form">
                <div className="form-group">
                    <label className="form-label">📝 Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-input"
                        placeholder="e.g., New Feature Release"
                        required
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">📖 Description</label>
                    <textarea
                        name="description"
                        className="form-textarea"
                        placeholder="Describe the update..."
                        rows="4"
                        required
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">📅 Date</label>
                        <input
                            type="date"
                            name="date"
                            className="form-input"
                            required
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">⏰ Time</label>
                        <input
                            type="time"
                            name="time"
                            className="form-input"
                            required
                            value={formData.time}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">🖼️ Image URL (Google Drive or Direct Link)</label>
                    <input
                        type="url"
                        name="imageUrl"
                        className="form-input"
                        placeholder="https://drive.google.com/..."
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                    {formData.imageUrl && (
                        <div className="current-image-preview">
                            <p className="preview-label"><strong>Current Image:</strong></p>
                            <img src={formData.imageUrl} alt="Current" className="preview-img" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">📄 PDF Link (Google Drive or Direct Link)</label>
                    <input
                        type="url"
                        name="pdfLink"
                        className="form-input"
                        placeholder="https://drive.google.com/..."
                        value={formData.pdfLink}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isActive"
                            className="form-checkbox"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        <span>🔄 Active Status (Enable/Disable this update)</span>
                    </label>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={saving}>
                        <Save size={16} />
                        {saving ? 'Updating...' : '✅ Update'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUpdate;
