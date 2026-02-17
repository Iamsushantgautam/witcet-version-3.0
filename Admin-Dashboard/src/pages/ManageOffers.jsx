import { useState, useEffect } from 'react';
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
    InputGroup,
    Dropdown,
    Tab,
    Tabs
} from 'react-bootstrap';
import {
    Plus,
    Edit,
    Trash2,
    Calendar,
    Users,
    Tag,
    Image,
    CheckCircle,
    XCircle,
    Upload,
    DollarSign,
    Target
} from 'lucide-react';
import api from '../utils/api';
import './ManageOffers.css';

const ManageOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const initialFormState = {
        title: '',
        description: '',
        offerType: 'percentage', // percentage, fixed_amount, voucher
        promoCode: '',
        voucherCode: '',
        discountValue: '',
        maxDiscountLimit: '',
        minPurchaseAmount: 0,
        currency: 'INR',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'active',
        totalUsageLimit: '',
        perUserUsageLimit: 1,
        balanceAmount: '',
        isSingleUse: false,
        applicableCategories: '', // Comma separated string for UI
        applicableCourses: '', // Comma separated string for UI
        userEligibility: 'all',
        userEligibility: 'all',
        bannerImage: '',
        redeemLink: '', // New field
        redeemSteps: '', // New field for instructions
        offerDetails: '', // New field for detailed terms
        priorityOrder: 0
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/offers');
            setOffers(response.data);
        } catch (err) {
            console.error('Error fetching offers:', err);
            setError('Failed to load offers');
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (offer = null) => {
        setError(null);
        setSuccess(null);
        if (offer) {
            setEditingOffer(offer);
            setFormData({
                ...offer,
                startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
                endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
                applicableCategories: offer.applicableCategories?.join(', ') || '',
                applicableCourses: offer.applicableCourses?.join(', ') || ''
            });
        } else {
            setEditingOffer(null);
            setFormData(initialFormState);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingOffer(null);
        setFormData(initialFormState);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append('image', file);
        uploadData.append('folder', 'witcet/offers'); // Folder for offers

        try {
            // Adjust endpoint if needed based on AddNote.jsx or verify upload route
            const res = await api.post('/upload/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, bannerImage: res.data.url }));
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // Prepare data
            const dataToSend = {
                ...formData,
                applicableCategories: formData.applicableCategories.split(',').map(s => s.trim()).filter(Boolean),
                applicableCourses: formData.applicableCourses.split(',').map(s => s.trim()).filter(Boolean),
                // Ensure empty strings are null/undefined for numbers if cleared
                totalUsageLimit: formData.totalUsageLimit || undefined,
                maxDiscountLimit: formData.maxDiscountLimit || undefined,
                balanceAmount: formData.balanceAmount || undefined,
                discountValue: Number(formData.discountValue),
                minPurchaseAmount: Number(formData.minPurchaseAmount),
                perUserUsageLimit: Number(formData.perUserUsageLimit),
                priorityOrder: Number(formData.priorityOrder)
            };

            if (editingOffer) {
                await api.put(`/offers/${editingOffer._id}`, dataToSend);
                setSuccess('Offer updated successfully!');
            } else {
                await api.post('/offers', dataToSend);
                setSuccess('Offer created successfully!');
            }

            handleCloseModal();
            fetchOffers();
        } catch (err) {
            console.error('Error saving offer:', err);
            setError(err.response?.data?.message || 'Failed to save offer');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;
        try {
            await api.delete(`/offers/${id}`);
            setSuccess('Offer deleted successfully!');
            fetchOffers();
        } catch (err) {
            console.error('Error deleting offer:', err);
            setError('Failed to delete offer');
        }
    };

    // Helper to format currency
    const formatCurrency = (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
    };

    return (
        <Container fluid className="manage-offers-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">
                        <Tag size={28} className="me-2" />
                        Manage Offers & Vouchers
                    </h2>
                    <p className="page-subtitle">Create and manage discounts, promo codes, and vouchers</p>
                </div>
                <Button variant="primary" onClick={() => handleShowModal()}>
                    <Plus size={18} className="me-2" />
                    Create Offer
                </Button>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

            <Card className="offers-card mt-4">
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3 text-muted">Loading offers...</p>
                        </div>
                    ) : offers.length === 0 ? (
                        <div className="text-center py-5">
                            <Tag size={48} className="text-muted mb-3" />
                            <h4 className="text-muted">No offers found</h4>
                            <p className="text-muted">Create your first offer to get started</p>
                        </div>
                    ) : (
                        <Table responsive hover className="offers-table">
                            <thead>
                                <tr>
                                    <th>Banner</th>
                                    <th>Title / Code</th>
                                    <th>Type</th>
                                    <th>Discount</th>
                                    <th>Usage</th>
                                    <th>Status</th>
                                    <th>Dates</th>
                                    <th>Redeem Link</th>
                                    <th>Tracking</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.map((offer) => (
                                    <tr key={offer._id}>
                                        <td>
                                            {offer.bannerImage ? (
                                                <img src={offer.bannerImage} alt="Banner" className="offer-banner-preview" />
                                            ) : (
                                                <div className="offer-banner-preview d-flex align-items-center justify-content-center text-muted">No Img</div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="fw-bold">{offer.title}</div>
                                            <small className="text-muted font-monospace">
                                                {offer.offerType === 'voucher' ? offer.voucherCode : offer.promoCode || '-'}
                                            </small>
                                        </td>
                                        <td>
                                            <Badge bg={offer.offerType === 'voucher' ? 'info' : 'secondary'} className="text-uppercase">
                                                {offer.offerType.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-success">
                                                {offer.offerType === 'percentage' ? `${offer.discountValue}%` : formatCurrency(offer.discountValue, offer.currency)}
                                            </div>
                                            {offer.offerType === 'percentage' && offer.maxDiscountLimit && (
                                                <small className="text-muted">Max: {formatCurrency(offer.maxDiscountLimit, offer.currency)}</small>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column small">
                                                <span>Used: <strong>{offer.totalUsageCount}</strong></span>
                                                {offer.totalUsageLimit && <span>Limit: {offer.totalUsageLimit}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            {offer.status === 'active' ? (
                                                <Badge bg="success" className="status-badge"><CheckCircle size={12} className="me-1" /> Active</Badge>
                                            ) : (
                                                <Badge bg="danger" className="status-badge"><XCircle size={12} className="me-1" /> Inactive</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <div className="small text-muted">
                                                <div>Start: {new Date(offer.startDate).toLocaleDateString()}</div>
                                                {offer.endDate && <div>End: {new Date(offer.endDate).toLocaleDateString()}</div>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="small text-truncate" style={{ maxWidth: '150px' }} title={offer.redeemLink}>
                                                {offer.redeemLink ? (
                                                    <a href={offer.redeemLink.startsWith('http') ? offer.redeemLink : `#`} target="_blank" rel="noopener noreferrer">
                                                        {offer.redeemLink}
                                                    </a>
                                                ) : '-'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                                                <div>Created: {new Date(offer.createdAt).toLocaleDateString()}</div>
                                                <div>Updated: {new Date(offer.updatedAt).toLocaleDateString()}</div>
                                                <div>By: User ID: {offer.createdBy || 'Unknown'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button size="sm" variant="outline-primary" onClick={() => handleShowModal(offer)}>
                                                    <Edit size={14} />
                                                </Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(offer._id)}>
                                                    <Trash2 size={14} />
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

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0">
                        <Tabs defaultActiveKey="basic" className="px-3 pt-3 border-bottom-0">
                            <Tab eventKey="basic" title="Basic Info" className="p-3">
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Offer Title *</Form.Label>
                                            <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Summer Sale" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Redeem Link / Target URL</Form.Label>
                                            <Form.Control type="text" name="redeemLink" value={formData.redeemLink} onChange={handleInputChange} placeholder="/notes or https://website.com/course" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief details..." />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Offer Type *</Form.Label>
                                            <Form.Select name="offerType" value={formData.offerType} onChange={handleInputChange} required>
                                                <option value="percentage">Percentage Discount</option>
                                                <option value="fixed_amount">Fixed Amount</option>
                                                <option value="voucher">Voucher (Credit/Gift)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Banner Image (Optional)</Form.Label>
                                            <div className="upload-wrapper">
                                                <Form.Control type="text" name="bannerImage" value={formData.bannerImage} onChange={handleInputChange} placeholder="Image URL" />
                                                <label className="btn btn-outline-secondary btn-sm d-flex align-items-center">
                                                    <Upload size={14} className="me-1" /> {uploadingImage ? '...' : 'Upload'}
                                                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                                                </label>
                                            </div>
                                            {formData.bannerImage && (
                                                <img src={formData.bannerImage} alt="Preview" className="image-preview-large mt-2" />
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Priority Order (Homepage)</Form.Label>
                                            <Form.Control type="number" name="priorityOrder" value={formData.priorityOrder} onChange={handleInputChange} placeholder="0" />
                                            <Form.Text className="text-muted">Higher numbers appear first.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="details" title="Values & Codes" className="p-3">
                                <Row className="g-3">
                                    {formData.offerType === 'voucher' ? (
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Voucher Code (Optional)</Form.Label>
                                                <Form.Control type="text" name="voucherCode" value={formData.voucherCode} onChange={handleInputChange} placeholder="UNIQUE-CODE" className="font-monospace text-uppercase" />
                                            </Form.Group>
                                        </Col>
                                    ) : (
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Promo Code (Optional)</Form.Label>
                                                <Form.Control type="text" name="promoCode" value={formData.promoCode} onChange={handleInputChange} placeholder="SUMMER20" className="font-monospace text-uppercase" />
                                            </Form.Group>
                                        </Col>
                                    )}

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>{formData.offerType === 'percentage' ? 'Percentage Value (%)' : 'Discount Amount'}</Form.Label>
                                            <InputGroup>
                                                {formData.offerType !== 'percentage' && <InputGroup.Text>{formData.currency}</InputGroup.Text>}
                                                <Form.Control type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} required step="0.01" />
                                                {formData.offerType === 'percentage' && <InputGroup.Text>%</InputGroup.Text>}
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>

                                    {formData.offerType === 'percentage' && (
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Max Discount Limit</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text>{formData.currency}</InputGroup.Text>
                                                    <Form.Control type="number" name="maxDiscountLimit" value={formData.maxDiscountLimit} onChange={handleInputChange} placeholder="No Limit" />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    )}

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Min Purchase Amount</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>{formData.currency}</InputGroup.Text>
                                                <Form.Control type="number" name="minPurchaseAmount" value={formData.minPurchaseAmount} onChange={handleInputChange} placeholder="0" />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>

                                    {formData.offerType === 'voucher' && (
                                        <>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Initial Balance</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text>{formData.currency}</InputGroup.Text>
                                                        <Form.Control type="number" name="balanceAmount" value={formData.balanceAmount} onChange={handleInputChange} placeholder="Same as value" />
                                                    </InputGroup>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Check
                                                    type="switch"
                                                    id="isSingleUse"
                                                    label="Single Use Only?"
                                                    name="isSingleUse"
                                                    checked={formData.isSingleUse}
                                                    onChange={(e) => setFormData({ ...formData, isSingleUse: e.target.checked })}
                                                    className="mt-4"
                                                />
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </Tab>

                            <Tab eventKey="limits" title="Limits & Dates" className="p-3">
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>End Date (Optional)</Form.Label>
                                            <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Total Usage Limit (Global)</Form.Label>
                                            <Form.Control type="number" name="totalUsageLimit" value={formData.totalUsageLimit} onChange={handleInputChange} placeholder="Unlimited" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Per User Limit</Form.Label>
                                            <Form.Control type="number" name="perUserUsageLimit" value={formData.perUserUsageLimit} onChange={handleInputChange} placeholder="1" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="eligibility" title="Applicability" className="p-3">
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>User Eligibility</Form.Label>
                                            <Form.Select name="userEligibility" value={formData.userEligibility} onChange={handleInputChange}>
                                                <option value="all">All Users</option>
                                                <option value="new_users">New Users Only</option>
                                                <option value="existing_users">Existing Users Only</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Applicable Categories (Comma separated IDs/Names)</Form.Label>
                                            <Form.Control type="text" name="applicableCategories" value={formData.applicableCategories} onChange={handleInputChange} placeholder="e.g. Science, Mathematics" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Applicable Courses (Comma separated IDs/Codes)</Form.Label>
                                            <Form.Control type="text" name="applicableCourses" value={formData.applicableCourses} onChange={handleInputChange} placeholder="e.g. BCS101, PHY202" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="redeem" title="Redeem & Details" className="p-3">
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold text-primary">How to Redeem Steps</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                name="redeemSteps"
                                                value={formData.redeemSteps}
                                                onChange={handleInputChange}
                                                placeholder="Step 1: Go to the website...&#10;Step 2: Add items to cart...&#10;Step 3: Apply code during checkout..."
                                            />
                                            <Form.Text className="text-muted">
                                                Provide clear, step-by-step instructions. These will be shown to users in a popup.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold text-primary">Offer Details / Terms & Conditions</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                name="offerDetails"
                                                value={formData.offerDetails}
                                                onChange={handleInputChange}
                                                placeholder="- Valid for new users only&#10;- Expires on..."
                                            />
                                            <Form.Text className="text-muted">
                                                Additional details, T&C, or fine print.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    {/* Additional fields for more details can be added here if schema supports them */}
                                    <Col md={12}>
                                        <Alert variant="info" className="mt-3 mb-0">
                                            <i className="bi bi-info-circle me-2"></i>
                                            <strong>Tip:</strong> You can format the text with line breaks to make it list-like.
                                        </Alert>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button variant="primary" type="submit">
                            {editingOffer ? 'Update Offer' : 'Create Offer'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageOffers;
