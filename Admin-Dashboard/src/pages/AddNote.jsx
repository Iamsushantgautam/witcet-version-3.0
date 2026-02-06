import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Upload, X } from 'lucide-react';
import './AddNote.css';
import './Toggle.css';

const AddNote = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        notesCode: '',
        notesPagePath: '',
        imagePath: '',
        quantumTitle: '',
        quantumImagePath: '',
        quantumLink: '',
        tag: '',
        pyqLink: '',
        pyqImage: '',
        pyqTitle: '',
        quantumActive: 'true',
        pyqActive: 'true'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingQuantumImage, setUploadingQuantumImage] = useState(false);
    const [uploadingPyqImage, setUploadingPyqImage] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = async (e, fieldName, setUploading, folder) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        formDataUpload.append('folder', folder);

        try {
            const res = await api.post('/upload/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFormData(prev => ({
                ...prev,
                [fieldName]: res.data.url
            }));
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const clearImage = (fieldName) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: ''
        }));
    };

    const convertToDownloadableLink = (link) => {
        if (!link) return '';
        try {
            // Regex to extract file ID from Google Drive link
            const idMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
            }
            return link;
        } catch (e) {
            console.error("Error converting link:", e);
            return link;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Convert links before sending
        const dataToSend = {
            ...formData,
            quantumLink: convertToDownloadableLink(formData.quantumLink),
            pyqLink: convertToDownloadableLink(formData.pyqLink)
        };

        try {
            await api.post('/notes', dataToSend);
            alert('Note added successfully!');
            navigate('/');
        } catch (err) {
            console.error('Error adding note:', err);
            setError(err.response?.data?.message || 'Failed to add note. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-note-container">
            <div className="form-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="form-title">Add Note</h2>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="note-form">
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                        name="title"
                        type="text"
                        className="form-input"
                        required
                        placeholder="Note title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Notes Code</label>
                    <input
                        name="notesCode"
                        type="text"
                        className="form-input"
                        required
                        placeholder="BCS 111"
                        value={formData.notesCode}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Notes Active (Notes Page Path)</label>
                    <div className="toggle-wrapper">
                        <label className="switch">
                            <input
                                type="checkbox"
                                name="notesPagePath"
                                checked={formData.notesPagePath === 'true'}
                                onChange={(e) => setFormData({ ...formData, notesPagePath: e.target.checked ? 'true' : 'false' })}
                            />
                            <span className="slider round"></span>
                        </label>
                        <span className="toggle-label">{formData.notesPagePath === 'true' ? 'Active' : 'Inactive'}</span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Image Path (Google Drive link or Upload)</label>
                    <div className="upload-wrapper">
                        <input
                            name="imagePath"
                            type="text"
                            className="form-input"
                            placeholder="https://drive.google.com/..."
                            value={formData.imagePath}
                            onChange={handleChange}
                        />
                        <div className="upload-actions">
                            <label className="btn-upload">
                                <Upload size={16} />
                                {uploadingImage ? 'Uploading...' : 'Upload'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'imagePath', setUploadingImage, 'witcet/notes-poster')}
                                    disabled={uploadingImage}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {formData.imagePath && (
                                <button
                                    type="button"
                                    className="btn-clear"
                                    onClick={() => clearImage('imagePath')}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                    {formData.imagePath && (
                        <div className="image-preview-small">
                            <img src={formData.imagePath} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group flex-grow-1">
                        <label className="form-label">Quantum Title</label>
                        <input
                            name="quantumTitle"
                            type="text"
                            className="form-input"
                            required
                            placeholder="Quantum Title"
                            value={formData.quantumTitle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group" style={{ minWidth: '150px' }}>
                        <label className="form-label">Quantum Active</label>
                        <div className="toggle-wrapper" style={{ marginTop: '10px' }}>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="quantumActive"
                                    checked={formData.quantumActive === 'true'}
                                    onChange={(e) => setFormData({ ...formData, quantumActive: e.target.checked ? 'true' : 'false' })}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="toggle-label">{formData.quantumActive === 'true' ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Quantum Image Path (Upload)</label>
                        <div className="upload-wrapper">
                            <input
                                name="quantumImagePath"
                                type="text"
                                className="form-input"
                                placeholder="https://drive.google.com/..."
                                value={formData.quantumImagePath}
                                onChange={handleChange}
                            />
                            <div className="upload-actions">
                                <label className="btn-upload">
                                    <Upload size={16} />
                                    {uploadingQuantumImage ? 'Uploading...' : 'Upload'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'quantumImagePath', setUploadingQuantumImage, 'witcet/quantum-images')}
                                        disabled={uploadingQuantumImage}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                {formData.quantumImagePath && (
                                    <button
                                        type="button"
                                        className="btn-clear"
                                        onClick={() => clearImage('quantumImagePath')}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        {formData.quantumImagePath && (
                            <div className="image-preview-small">
                                <img src={formData.quantumImagePath} alt="Quantum Preview" />
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Quantum Link</label>
                        <input
                            name="quantumLink"
                            type="text"
                            className="form-input"
                            placeholder="https://quantumlink.com/..."
                            value={formData.quantumLink}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Tags</label>
                    <input
                        name="tag"
                        type="text"
                        className="form-input"
                        required
                        placeholder="JavaScript, Arrays, Functions"
                        value={formData.tag}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">PYQ Link</label>
                        <input
                            name="pyqLink"
                            type="text"
                            className="form-input"
                            placeholder="https://example.com/pyq.pdf"
                            value={formData.pyqLink}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">PYQ Image (Upload)</label>
                        <div className="upload-wrapper">
                            <input
                                name="pyqImage"
                                type="text"
                                className="form-input"
                                placeholder="https://drive.google.com/..."
                                value={formData.pyqImage}
                                onChange={handleChange}
                            />
                            <div className="upload-actions">
                                <label className="btn-upload">
                                    <Upload size={16} />
                                    {uploadingPyqImage ? 'Uploading...' : 'Upload'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'pyqImage', setUploadingPyqImage, 'witcet/pyqs-images')}
                                        disabled={uploadingPyqImage}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                {formData.pyqImage && (
                                    <button
                                        type="button"
                                        className="btn-clear"
                                        onClick={() => clearImage('pyqImage')}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        {formData.pyqImage && (
                            <div className="image-preview-small">
                                <img src={formData.pyqImage} alt="PYQ Preview" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group flex-grow-1">
                        <label className="form-label">PYQ Title</label>
                        <input
                            name="pyqTitle"
                            type="text"
                            className="form-input"
                            placeholder="PYQ Title"
                            value={formData.pyqTitle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group" style={{ minWidth: '150px' }}>
                        <label className="form-label">PYQ Active</label>
                        <div className="toggle-wrapper" style={{ marginTop: '10px' }}>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="pyqActive"
                                    checked={formData.pyqActive === 'true'}
                                    onChange={(e) => setFormData({ ...formData, pyqActive: e.target.checked ? 'true' : 'false' })}
                                />
                                <span className="slider round"></span>
                            </label>
                            <span className="toggle-label">{formData.pyqActive === 'true' ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Note'}
                </button>
            </form>
        </div>
    );
};

export default AddNote;
