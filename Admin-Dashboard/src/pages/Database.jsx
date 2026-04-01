import { useState } from 'react';
import api from '../utils/api';
import { Database as DbIcon, Download, Loader2, AlertTriangle, ShieldCheck, Clock, FileJson, Eye, X } from 'lucide-react';
import './Database.css';

const Database = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [previewData, setPreviewData] = useState(null);
    const [previewTitle, setPreviewTitle] = useState('');

    const handleBackup = async (collectionName = null, isPreview = false) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Call backup endpoint with optional collection filter
            const res = await api.get(`/admin/backup${collectionName ? `?collection=${collectionName}` : ''}`, {
                responseType: isPreview ? 'json' : 'blob' 
            });

            if (isPreview) {
                setPreviewData(res.data);
                setPreviewTitle(collectionName || 'Full Database');
                setLoading(false);
                return;
            }

            // Create download link
            const url = window.URL.createObjectURL(new Blob([res.data]));
            //... keep existing download logic ...
            const link = document.createElement('a');
            link.href = url;
            const filename = `${collectionName ? collectionName.toLowerCase() : 'witcet'}_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            setSuccess('Backup downloaded successfully!');
        } catch (err) {
            console.error('Backup failed:', err);
            setError('Failed to generate database backup. Please check server logs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="database-page p-4">
            <div className="page-header mb-4">
                <div className="d-flex align-items-center">
                    <div className="header-icon-bg me-3">
                        <DbIcon size={24} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="m-0 fw-bold">Database Management</h2>
                        <p className="text-muted m-0">Securely export and backup your system data</p>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <ShieldCheck size={32} className="text-success me-3" />
                                <div>
                                    <h4 className="m-0 fw-bold">Full System Backup</h4>
                                    <p className="text-muted m-0">Download all collections in a single JSON file</p>
                                </div>
                            </div>

                            <div className="alert alert-info border-0 bg-light-info mb-4">
                                <div className="d-flex">
                                    <AlertTriangle className="text-info me-3" size={24} />
                                    <div>
                                        <h6 className="fw-bold mb-1">Backup Information:</h6>
                                        <ul className="m-0 ps-3 small">
                                            <li>Includes all Notes, Users, Admins, and Site Updates.</li>
                                            <li>Format: portable JSON (standard database interchange).</li>
                                            <li>Contains sensitive data. Store this file securely!</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="alert alert-danger border-0 mb-4 d-flex align-items-center">
                                    <AlertTriangle className="me-2" size={18} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success border-0 mb-4 d-flex align-items-center">
                                    <ShieldCheck className="me-2" size={18} />
                                    {success}
                                </div>
                            )}

                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-primary d-flex align-items-center py-2 px-4 fw-bold"
                                    onClick={() => handleBackup()}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin me-2" size={20} />
                                    ) : (
                                        <Download className="me-2" size={20} />
                                    )}
                                    {loading ? 'Processing Data...' : 'Download Full Backup'}
                                </button>
                                <button 
                                    className="btn btn-outline-primary d-flex align-items-center py-2 px-3 fw-bold"
                                    onClick={() => handleBackup(null, true)}
                                    disabled={loading}
                                >
                                    <Eye className="me-2" size={20} />
                                    Preview
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Targeted Collection Backup</h5>
                            <p className="text-muted small mb-4">Download individual data tables for precise data management.</p>
                            
                            <div className="row g-3">
                                {[
                                    { name: 'Note', label: 'Primary Notes' },
                                    { name: 'User', label: 'Registered Users' },
                                    { name: 'Admin', label: 'Dashboard Admins' },
                                    { name: 'DetailedNote', label: 'Detailed Articles' },
                                    { name: 'Update', label: 'Site Notifications' },
                                    { name: 'Tool', label: 'Dashboard Tools' },
                                    { name: 'Offer', label: 'Promotional Offers' }
                                ].map((col) => (
                                    <div key={col.name} className="col-md-6">
                                        <div className="collection-item p-3 border rounded d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="m-0 fw-bold">{col.label}</h6>
                                                <small className="text-muted">{col.name}</small>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn btn-sm btn-light"
                                                    onClick={() => handleBackup(col.name, true)}
                                                    disabled={loading}
                                                    title="Preview"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button 
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleBackup(col.name)}
                                                    disabled={loading}
                                                >
                                                    <Download size={14} className="me-1" />
                                                    JSON
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

            {/* PREVIEW MODAL */}
            {previewData && (
                <div className="image-preview-overlay" onClick={() => setPreviewData(null)}>
                    <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
                            <h5 className="m-0 fw-bold">Preview: {previewTitle}</h5>
                            <button className="btn btn-link link-dark p-0" onClick={() => setPreviewData(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <pre className="json-preview">
                                {JSON.stringify(previewData, null, 2)}
                            </pre>
                        </div>
                        <div className="modal-footer p-3 border-top">
                            <button className="btn btn-secondary" onClick={() => setPreviewData(null)}>Close</button>
                            <button className="btn btn-primary" onClick={() => handleBackup(previewTitle === 'Full Database' ? null : previewTitle)}>
                                <Download size={16} className="me-2" />
                                Download This Export
                            </button>
                        </div>
                    </div>
                </div>
            )}
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-primary text-white">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3">Security Note</h5>
                            <p className="small m-0">Backups are restricted to Super Administrators. Every backup attempt is logged for security monitoring.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Database;
