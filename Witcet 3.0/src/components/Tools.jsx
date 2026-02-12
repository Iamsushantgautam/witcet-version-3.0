import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import '../styles/Tools.css';
import SearchBar from './SearchBar';

const Tools = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tools`);
            if (!response.ok) {
                throw new Error('Failed to fetch tools');
            }
            const data = await response.json();
            setTools(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching tools:', err);
            setError('Failed to load tools. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleToolClick = (link) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    const getIconUrl = (tool) => {
        // Prioritize favicon, then custom icon, then default
        if (tool.faviconUrl) {
            return tool.faviconUrl;
        }
        if (tool.icon && tool.icon !== '/images/default-tool-icon.png') {
            return `${import.meta.env.VITE_API_URL}${tool.icon}`;
        }
        // Return a default SVG icon as fallback
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d6efd"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
    };

    const filteredTools = tools.filter(tool =>
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tool.tag && tool.tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Container className="tools-container">
            <div className="tools-header">
                <span className="header-badge">
                    <i className="fas fa-rocket me-2"></i>
                    CURATED RESOURCES
                </span>
                <h1 className="tools-title">
                    Essential Developer Tools
                </h1>
                <p className="tools-subtitle">
                    A handpicked collection of high-quality tools, libraries, and resources to help you build better software, faster.
                </p>

                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search tools, resources, tags..."
                    className="mt-4"
                />
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="tools-grid">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="tool-card skeleton-wrapper">
                            <div className="tool-content-wrapper">
                                <div className="skeleton-icon skeleton-wrapper"></div>
                                <div className="tool-text-content w-100">
                                    <div className="skeleton-title skeleton-wrapper"></div>
                                    <div className="skeleton-badge skeleton-wrapper"></div>
                                </div>
                            </div>
                            <div className="skeleton-desc skeleton-wrapper"></div>
                            <div className="skeleton-desc skeleton-wrapper" style={{ width: '80%' }}></div>
                            <div className="skeleton-btn skeleton-wrapper"></div>
                        </div>
                    ))}
                </div>
            ) : filteredTools.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 className="text-muted">No tools found matching "{searchTerm}"</h4>
                    <p className="text-muted">Try adjusting your search terms</p>
                </div>
            ) : (
                <div className="tools-grid">
                    {filteredTools.map((tool) => (
                        <a
                            href={tool.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tool-card"
                            key={tool._id}
                        >
                            <div className="tool-content-wrapper">
                                <div className="tool-icon-container">
                                    <img
                                        src={getIconUrl(tool)}
                                        alt={tool.title}
                                        className="tool-icon"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d6efd"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                                        }}
                                    />
                                </div>
                                <div className="tool-text-content">
                                    <h3 className="tool-name">{tool.title}</h3>
                                    <span className="tool-badge">{tool.tag || 'RESOURCE'}</span>
                                </div>
                            </div>

                            <p className="tool-description">{tool.description}</p>

                            <div className="tool-footer">
                                <span className="visit-btn">
                                    Visit Website <i className="fas fa-external-link-alt"></i>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default Tools;
