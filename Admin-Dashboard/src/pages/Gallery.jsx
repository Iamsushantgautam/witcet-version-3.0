import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Copy, Check, ExternalLink, Loader2, Image as ImageIcon, Search, Upload, X, Plus, Trash2 } from 'lucide-react';
import './Gallery.css';

const Gallery = ({ onSelect, isModal = false }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFolder, setActiveFolder] = useState('All');
    const [previewImage, setPreviewImage] = useState(null);
    const [folders, setFolders] = useState(['All']);
    
    // Undo state
    const [undoImg, setUndoImg] = useState(null);
    const [showUndo, setShowUndo] = useState(false);
    const [undoTimer, setUndoTimer] = useState(null);

    // Upload state
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadData, setUploadData] = useState({
        file: null,
        folder: 'notes-poster', // Default subfolder
        newFolder: ''
    });
    const [uploadProgress, setUploadProgress] = useState('');

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const res = await api.get('/upload/gallery?folder=witcet');
            const fetchedImages = res.data.images || [];
            setImages(fetchedImages);
            
            // Extract unique subfolders
            const extractedFolders = new Set(['All']);
            fetchedImages.forEach(img => {
                const parts = img.public_id.split('/');
                if (parts.length > 2 && parts[0] === 'witcet') { 
                    extractedFolders.add(parts[1]);
                } else {
                    extractedFolders.add('Other');
                }
            });
            setFolders(Array.from(extractedFolders).sort());
        } catch (err) {
            console.error('Error fetching gallery:', err);
            setError('Failed to fetch images');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (e, img) => {
        e.stopPropagation(); // Avoid triggering select/preview
        
        // If there's an existing undo timer, process it immediately
        if (undoTimer) {
            processRealDelete();
        }

        setUndoImg(img);
        setShowUndo(true);
        setImages(images.filter(i => i.public_id !== img.public_id));
        
        const timer = setTimeout(() => {
            processRealDelete(img.public_id);
        }, 6000);
        
        setUndoTimer(timer);
    };

    const processRealDelete = async (public_id) => {
        const idToDelete = public_id || (undoImg?.public_id);
        if (!idToDelete) return;

        try {
            await api.delete(`/upload/delete?public_id=${encodeURIComponent(idToDelete)}`);
        } catch (err) {
            console.error('Real delete failed:', err);
        } finally {
            setUndoImg(null);
            setShowUndo(false);
            setUndoTimer(null);
        }
    };

    const undoDelete = () => {
        if (undoImg) {
            setImages([undoImg, ...images]);
            clearTimeout(undoTimer);
            setUndoImg(null);
            setShowUndo(false);
            setUndoTimer(null);
        }
    };

    const copyToClipboard = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadData.file) return;

        setUploading(true);
        setUploadProgress('Uploading to Cloudinary...');

        const formData = new FormData();
        formData.append('image', uploadData.file);
        
        // Final folder path: witcet/subfolder
        const subfolder = uploadData.folder === 'new' ? uploadData.newFolder : uploadData.folder;
        const fullFolder = `witcet/${subfolder || 'others'}`.replace(/\/+$/, ''); // Clean up slashes
        
        formData.append('folder', fullFolder);

        try {
            await api.post('/upload/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadProgress('Success!');
            setTimeout(() => {
                setIsUploadModalOpen(false);
                setUploadData({ file: null, folder: 'notes-poster', newFolder: '' });
                setUploadProgress('');
                fetchGallery(); // Refresh images
            }, 1500);
        } catch (err) {
            console.error('Upload failed:', err);
            setUploadProgress('Error: Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const filteredImages = images.filter(img => {
        const matchesSearch = img.public_id.toLowerCase().includes(searchTerm.toLowerCase());
        const parts = img.public_id.split('/');
        const imgFolder = (parts.length > 2 && parts[0] === 'witcet') ? parts[1] : 'Other';
        const matchesFolder = activeFolder === 'All' || imgFolder === activeFolder;
        return matchesSearch && matchesFolder;
    });

    if (loading) {
        return (
            <div className="gallery-loading">
                <Loader2 className="animate-spin" size={40} />
                <p>Loading gallery...</p>
            </div>
        );
    }

    return (
        <div className={`gallery-container ${isModal ? 'in-modal' : ''}`}>
            {!isModal && (
                <div className="gallery-header">
                    <div className="header-info">
                        <h2>Image Gallery</h2>
                        <p>Total {images.length} images in 'witcet'</p>
                    </div>
                    
                    <div className="header-actions">
                        <div className="search-box">
                            <Search size={20} />
                            <input 
                                type="text" 
                                placeholder="Search images..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn-upload-primary" onClick={() => setIsUploadModalOpen(true)}>
                            <Plus size={20} />
                            <span>Upload Image</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="folder-filters">
                {folders.map(folder => (
                    <button 
                        key={folder}
                        className={`filter-btn ${activeFolder === folder ? 'active' : ''}`}
                        onClick={() => setActiveFolder(folder)}
                    >
                        {folder}
                    </button>
                ))}
            </div>

            {error && <div className="error-alert">{error}</div>}

            <div className="gallery-grid">
                {filteredImages.length > 0 ? (
                    filteredImages.map((img) => (
                        <div key={img.public_id} className="gallery-item">
                            <div className="image-wrapper" onClick={() => onSelect ? onSelect(img.url) : setPreviewImage(img.url)}>
                                <img src={img.url} alt={img.public_id} loading="lazy" />
                                <div className="image-overlay">
                                    {onSelect && (
                                        <button className="btn-select">Select Image</button>
                                    )}
                                </div>
                            </div>
                            <div className="image-info">
                                <span className="image-name" title={img.public_id}>
                                    {img.public_id.replace(/^witcet\//, '')}
                                </span>
                                <div className="image-actions">
                                    <div className="action-btns-group">
                                        <button 
                                            className={`btn-copy ${copiedId === img.public_id ? 'copied' : ''}`}
                                            onClick={() => copyToClipboard(img.url, img.public_id)}
                                            title="Copy URL"
                                        >
                                            {copiedId === img.public_id ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                        {!onSelect && (
                                            <button 
                                                className="btn-delete-item"
                                                onClick={(e) => handleDelete(e, img)}
                                                title="Delete Image"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <span className="image-meta">{img.format.toUpperCase()} • {img.width}x{img.height}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-images">
                        <ImageIcon size={48} />
                        <p>No images found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>

            {/* Undo Toast */}
            {showUndo && (
                <div className="gallery-undo-toast">
                    <div className="undo-content">
                        <div className="undo-icon"><Trash2 size={18} /></div>
                        <div className="undo-text">
                            <strong>Image removed</strong>
                            <span>{undoImg?.public_id.split('/').pop()}</span>
                        </div>
                    </div>
                    <button className="btn-undo-action" onClick={undoDelete}>UNDO</button>
                </div>
            )}

            {/* Full-size Preview Lightbox */}
            {previewImage && (
                <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
                    <div className="preview-content" onClick={e => e.stopPropagation()}>
                        <button className="btn-close-preview" onClick={() => setPreviewImage(null)}><X size={24} /></button>
                        <img src={previewImage} alt="Full size preview" />
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="image-preview-overlay" onClick={() => !uploading && setIsUploadModalOpen(false)}>
                    <div className="upload-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Upload New Image</h3>
                            {!uploading && <button className="close-upload" onClick={() => setIsUploadModalOpen(false)}><X size={24} /></button>}
                        </div>
                        
                        <form onSubmit={handleUpload} className="upload-form">
                            <div className="form-group">
                                <label>Selected File</label>
                                <input 
                                    type="file" 
                                    onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})} 
                                    accept="image/*"
                                    required
                                    disabled={uploading}
                                />
                                {uploadData.file && <p className="file-hint">Ready: {uploadData.file.name}</p>}
                            </div>
                            
                            <div className="form-group">
                                <label>Target Subfolder</label>
                                <select 
                                    value={uploadData.folder} 
                                    onChange={(e) => setUploadData({...uploadData, folder: e.target.value})}
                                    disabled={uploading}
                                >
                                    {folders.filter(f => f !== 'All' && f !== 'Other').map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                    <option value="new">+ Create New Folder</option>
                                </select>
                            </div>

                            {uploadData.folder === 'new' && (
                                <div className="form-group">
                                    <label>New Folder Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., promotional-banners"
                                        value={uploadData.newFolder}
                                        onChange={(e) => setUploadData({...uploadData, newFolder: e.target.value})}
                                        required
                                        disabled={uploading}
                                    />
                                </div>
                            )}

                            <div className="modal-actions">
                                {uploadProgress && <div className="progress-text">{uploadProgress}</div>}
                                <button type="submit" className="btn-confirm-upload" disabled={uploading || !uploadData.file}>
                                    {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                    Upload Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
;
