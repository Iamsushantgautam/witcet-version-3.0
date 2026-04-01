import { X } from 'lucide-react';
import Gallery from '../pages/Gallery';
import './GalleryModal.css';

const GalleryModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="gallery-modal-overlay" onClick={onClose}>
            <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="gallery-modal-header">
                    <h3>Select Image from Gallery</h3>
                    <button className="close-modal" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="gallery-modal-body">
                    <Gallery 
                        onSelect={(url) => {
                            onSelect(url);
                            onClose();
                        }} 
                        isModal={true} 
                    />
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;
