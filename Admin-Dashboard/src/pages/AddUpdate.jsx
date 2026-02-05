import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Save } from 'lucide-react';
import './AddUpdate.css';

const AddUpdate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        imageUrl: '',
        pdfLink: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/updates', formData);
            alert('Update added successfully!');
            navigate('/updates');
        } catch (err) {
            console.error('Error adding update:', err);
            setError(err.response?.data?.message || 'Failed to add update. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-update-container">
            <div className="form-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="form-title">Add Update</h2>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="update-form">
                <div className="form-group">
                    <label className="form-label">Title</label>
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
                    <label className="form-label">Description</label>
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
                        <label className="form-label">Date</label>
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
                        <label className="form-label">Time</label>
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
                    <label className="form-label">Image URL (Google Drive or Direct Link)</label>
                    <input
                        type="text"
                        name="imageUrl"
                        className="form-input"
                        placeholder="https://drive.google.com/..."
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">PDF Link (Google Drive or Direct Link)</label>
                    <input
                        type="text"
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
                        <span>Make this update active</span>
                    </label>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save Update'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUpdate;
