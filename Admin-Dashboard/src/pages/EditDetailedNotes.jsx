import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import './AddDetailedNotes.css';

const EditDetailedNotes = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        notesTitle: '',
        notesCode: '',
        introTitle: ''
    });
    const [units, setUnits] = useState([
        { unitTitle: '', ownerName: '', pdfLink: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDetailedNote();
    }, [id]);

    const fetchDetailedNote = async () => {
        try {
            const res = await api.get(`/detailed-notes/${id}`);
            const { notesTitle, notesCode, introTitle, units } = res.data;
            setFormData({ notesTitle, notesCode, introTitle });
            setUnits(units || []);
            setFetchLoading(false);
        } catch (err) {
            console.error('Error fetching detailed note:', err);
            setError('Failed to load detailed note. Please try again.');
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUnitChange = (index, field, value) => {
        const updatedUnits = [...units];
        updatedUnits[index][field] = value;
        setUnits(updatedUnits);
    };

    const addUnit = () => {
        setUnits([...units, { unitTitle: '', ownerName: '', pdfLink: '' }]);
    };

    const removeUnit = (index) => {
        if (units.length === 1) {
            alert('At least one unit is required!');
            return;
        }
        const updatedUnits = units.filter((_, i) => i !== index);
        setUnits(updatedUnits);
    };

    const moveUp = (index) => {
        if (index === 0) return;
        const updatedUnits = [...units];
        [updatedUnits[index], updatedUnits[index - 1]] = [updatedUnits[index - 1], updatedUnits[index]];
        setUnits(updatedUnits);
    };

    const moveDown = (index) => {
        if (index === units.length - 1) return;
        const updatedUnits = [...units];
        [updatedUnits[index], updatedUnits[index + 1]] = [updatedUnits[index + 1], updatedUnits[index]];
        setUnits(updatedUnits);
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

        try {
            // Convert PDF links for all units
            const processedUnits = units.map(unit => ({
                ...unit,
                pdfLink: convertToDownloadableLink(unit.pdfLink)
            }));

            const payload = {
                ...formData,
                units: processedUnits
            };
            await api.put(`/detailed-notes/${id}`, payload);
            alert('Detailed notes updated successfully!');
            navigate('/detailed-notes');
        } catch (err) {
            console.error('Error updating detailed notes:', err);
            setError(err.response?.data?.message || 'Failed to update detailed notes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="loading-state">Loading...</div>;
    }

    return (
        <div className="add-detailed-notes-container">
            <div className="form-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="form-title">Edit Detailed Notes</h2>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="detailed-notes-form">
                <div className="form-group">
                    <label className="form-label">Notes Title</label>
                    <input
                        type="text"
                        name="notesTitle"
                        className="form-input"
                        placeholder="e.g., Computer Networks"
                        required
                        value={formData.notesTitle}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Notes Code</label>
                    <input
                        type="text"
                        name="notesCode"
                        className="form-input"
                        placeholder="e.g., CN301"
                        value={formData.notesCode}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Intro Title</label>
                    <input
                        type="text"
                        name="introTitle"
                        className="form-input"
                        placeholder="e.g., Introduction to Networks"
                        required
                        value={formData.introTitle}
                        onChange={handleChange}
                    />
                </div>

                <div className="units-section">
                    <h5 className="units-heading">Units</h5>

                    <div className="units-container">
                        {units.map((unit, index) => (
                            <div key={index} className="unit-block">
                                <div className="unit-actions">
                                    <button
                                        type="button"
                                        className="btn-move"
                                        onClick={() => moveUp(index)}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-move"
                                        onClick={() => moveDown(index)}
                                        disabled={index === units.length - 1}
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-remove"
                                        onClick={() => removeUnit(index)}
                                    >
                                        <Trash2 size={16} />
                                        Remove
                                    </button>
                                </div>

                                <div className="unit-fields">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Unit Title"
                                        required
                                        value={unit.unitTitle}
                                        onChange={(e) => handleUnitChange(index, 'unitTitle', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Owner Name"
                                        required
                                        value={unit.ownerName}
                                        onChange={(e) => handleUnitChange(index, 'ownerName', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="PDF Link"
                                        required
                                        value={unit.pdfLink}
                                        onChange={(e) => handleUnitChange(index, 'pdfLink', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="button" className="btn-add-unit" onClick={addUnit}>
                        <Plus size={18} />
                        Add Unit
                    </button>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Notes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditDetailedNotes;
