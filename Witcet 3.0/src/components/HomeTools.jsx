import React, { useState, useEffect } from 'react';
import { Container, Carousel, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Tools.css';

const HomeTools = () => {
    const navigate = useNavigate();
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chunkSize, setChunkSize] = useState(3);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetchTools();
        updateChunkSize();
        window.addEventListener('resize', updateChunkSize);
        return () => window.removeEventListener('resize', updateChunkSize);
    }, []);

    const updateChunkSize = () => {
        if (window.innerWidth < 768) setChunkSize(1);
        else if (window.innerWidth < 1200) setChunkSize(2);
        else setChunkSize(3);
    };

    const fetchTools = async () => {
        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            const response = await fetch(`${apiUrl}/api/tools`);
            if (!response.ok) throw new Error('Failed to fetch tools');
            const data = await response.json();
            // Only show active tools and maybe limit or sort them
            setTools(data.filter(tool => tool.isActive !== false));
        } catch (err) {
            console.error('Error fetching tools:', err);
            setError('Failed to load tools');
        } finally {
            setLoading(false);
        }
    };

    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const getIconUrl = (tool) => {
        if (tool.faviconUrl) return tool.faviconUrl;
        if (tool.icon && tool.icon !== '/images/default-tool-icon.png') {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://admin-witcet.onrender.com';
            return `${apiUrl}${tool.icon}`;
        }
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d6efd"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
    };

    const toolChunks = chunkArray(tools, chunkSize);

    return (
        <section className="home-tools-section py-5" style={{ background: '#ffffff' }}>
            <Container>
                <div className="text-center mb-5">
                    <span className="header-badge mb-3 d-inline-block">
                        <i className="fas fa-tools me-2"></i> Useful Resources
                    </span>
                    <h2 className="fw-bold fs-1 mb-2" style={{ color: '#0f172a' }}>Top Developer Tools</h2>
                    <p className="text-muted mb-4">A curated list of handpicked resources to boost your productivity.</p>
                    <Button
                        variant="outline-primary"
                        className="rounded-pill px-4 fw-bold"
                        onClick={() => navigate('/tools')}
                    >
                        View All Tools <i className="fas fa-arrow-right ms-2"></i>
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center">{error}</Alert>
                ) : tools.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">No tools available right now.</p>
                    </div>
                ) : (
                    <Carousel
                        activeIndex={index}
                        onSelect={handleSelect}
                        className="home-tools-carousel pb-5"
                        interval={4000} // Auto move every 4s
                        indicators={toolChunks.length > 1}
                        controls={toolChunks.length > 1}
                    >
                        {toolChunks.map((chunk, chunkIndex) => (
                            <Carousel.Item key={chunkIndex}>
                                <div className="d-flex justify-content-center gap-4 px-2">
                                    {chunk.map((tool) => (
                                        <div
                                            key={tool._id}
                                            style={{
                                                flex: `0 0 calc(${100 / chunkSize}% - 1.5rem)`,
                                                maxWidth: `calc(${100 / chunkSize}% - 1.5rem)`
                                            }}
                                        >
                                            <a
                                                href={tool.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="tool-card h-100"
                                                style={{ border: '1px solid #e2e8f0' }}
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
                                        </div>
                                    ))}
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
            </Container>
        </section>
    );
};

export default HomeTools;
