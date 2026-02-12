import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Modal,
    Form,
    Alert,
    Spinner,
    Badge,
    InputGroup
} from 'react-bootstrap';
import {
    Edit,
    Trash2,
    Plus,
    ExternalLink,
    Link,
    Wrench,
    Info
} from 'lucide-react';
import './ManageTools.css';

const ManageTools = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTool, setEditingTool] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        icon: '',
        isActive: true,
        tag: 'Resource', // Default tag
        order: ''
    });

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/tools?admin=true`);
            if (!response.ok) throw new Error('Failed to fetch tools');
            const data = await response.json();
            setTools(data);
        } catch (err) {
            console.error('Error fetching tools:', err);
            setError('Failed to load tools');
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (tool = null) => {
        if (tool) {
            setEditingTool(tool);
            setFormData({
                title: tool.title,
                description: tool.description,
                link: tool.link,
                icon: tool.icon || '',
                isActive: tool.isActive,
                tag: tool.tag || 'Resource',
                order: tool.order || ''
            });
        } else {
            setEditingTool(null);
            setFormData({
                title: '',
                description: '',
                link: '',
                icon: '',
                isActive: true,
                tag: 'Resource',
                order: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTool(null);
        setFormData({
            title: '',
            description: '',
            link: '',
            icon: '',
            isActive: true,
            tag: 'Resource',
            order: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'order' ? (value === '' ? '' : parseInt(value)) : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            const url = editingTool
                ? `${API_BASE_URL}/api/tools/${editingTool._id}`
                : `${API_BASE_URL}/api/tools`;

            const method = editingTool ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save tool');
            }

            setSuccess(editingTool ? 'Tool updated successfully!' : 'Tool created successfully!');
            handleCloseModal();
            fetchTools();
        } catch (err) {
            console.error('Error saving tool:', err);
            setError(err.message || 'Failed to save tool');
        }
    };

    const handleToggleStatus = async (toolId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}/toggle`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to toggle tool status');

            setSuccess('Tool status updated!');
            fetchTools();
        } catch (err) {
            console.error('Error toggling tool status:', err);
            setError('Failed to update tool status');
        }
    };

    const handleDelete = async (toolId) => {
        if (!window.confirm('Are you sure you want to delete this tool?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete tool');

            setSuccess('Tool deleted successfully!');
            fetchTools();
        } catch (err) {
            console.error('Error deleting tool:', err);
            setError('Failed to delete tool');
        }
    };

    const getIconPreview = (tool) => {
        if (tool.faviconUrl) {
            return tool.faviconUrl;
        }
        if (tool.icon && tool.icon !== '/images/default-tool-icon.png') {
            return `${API_BASE_URL}${tool.icon}`;
        }
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d6efd"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
    };

    return (
        <Container fluid className="manage-tools-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">
                        <Wrench size={24} className="me-3" />
                        Manage Tools
                    </h2>
                    <p className="page-subtitle">Add, edit, and manage useful tools and resources for users</p>
                </div>
                <Button
                    variant="primary"
                    className="add-btn"
                    onClick={() => handleShowModal()}
                >
                    <Plus size={18} className="me-2" />
                    Add New Tool
                </Button>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)} className="mt-3">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess(null)} className="mt-3">
                    {success}
                </Alert>
            )}

            <Card className="tools-card mt-4">
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3 text-muted">Loading tools...</p>
                        </div>
                    ) : tools.length === 0 ? (
                        <div className="text-center py-5">
                            <Wrench size={48} className="text-muted mb-3" />
                            <h4 className="text-muted">No tools yet</h4>
                            <p className="text-muted">Click "Add New Tool" to create your first tool</p>
                        </div>
                    ) : (
                        <Table responsive hover className="tools-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>Icon</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Link</th>
                                    <th style={{ width: '100px' }}>Order</th>
                                    <th style={{ width: '100px' }}>Status</th>
                                    <th style={{ width: '200px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tools.map((tool) => (
                                    <tr key={tool._id}>
                                        <td>
                                            <img
                                                src={getIconPreview(tool)}
                                                alt={tool.title}
                                                className="tool-icon-preview"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d6efd"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <strong>{tool.title}</strong>
                                        </td>
                                        <td className="description-cell">{tool.description}</td>
                                        <td>
                                            <a
                                                href={tool.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="tool-link"
                                            >
                                                <ExternalLink size={16} className="me-1" />
                                                Visit
                                            </a>
                                        </td>
                                        <td className="text-center">
                                            <Badge bg="secondary">{tool.order}</Badge>
                                        </td>
                                        <td>
                                            <div className="form-check form-switch status-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`switch-${tool._id}`}
                                                    checked={tool.isActive}
                                                    onChange={() => handleToggleStatus(tool._id)}
                                                    style={{ cursor: 'pointer', width: '3em', height: '1.5em' }}
                                                />
                                                <label className="form-check-label ms-2" htmlFor={`switch-${tool._id}`}>
                                                    {tool.isActive ? 'On' : 'Off'}
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => handleShowModal(tool)}
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(tool._id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Add/Edit Tool Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingTool ? <Edit size={20} className="me-2" /> : <Plus size={20} className="me-2" />}
                        {editingTool ? 'Edit Tool' : 'Add New Tool'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Tool Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., ChatGPT"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Description <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Brief description of the tool..."
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tag / Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="tag"
                                value={formData.tag}
                                onChange={handleInputChange}
                                placeholder="e.g., Resource, Education, AI"
                            />
                            <Form.Text className="text-muted">
                                Short tag displayed on the tool card (default: Resource)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Tool URL <span className="text-danger">*</span>
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <Link size={16} />
                                </InputGroup.Text>
                                <Form.Control
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                    required
                                />
                            </InputGroup>
                            <Form.Text className="text-muted">
                                <Info size={14} className="me-1" />
                                The system will automatically fetch the favicon from this URL
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Custom Icon URL (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                name="icon"
                                value={formData.icon}
                                onChange={handleInputChange}
                                placeholder="/images/custom-icon.png"
                            />
                            <Form.Text className="text-muted">
                                Leave empty to use the default icon or fetched favicon
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Display Order</Form.Label>
                            <Form.Control
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleInputChange}
                                min="0"
                                placeholder="Auto"
                            />
                            <Form.Text className="text-muted">
                                Leave blank to automatically assign the next available number (end of list)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="modal-tool-status"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    style={{ cursor: 'pointer', width: '3em', height: '1.5em' }}
                                />
                                <label className="form-check-label ms-3 mt-1" htmlFor="modal-tool-status">
                                    {formData.isActive ? 'Active (Visible to users)' : 'Inactive (Hidden)'}
                                </label>
                            </div>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingTool ? <Edit size={18} className="me-2" /> : <Plus size={18} className="me-2" />}
                            {editingTool ? 'Update Tool' : 'Add Tool'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageTools;
