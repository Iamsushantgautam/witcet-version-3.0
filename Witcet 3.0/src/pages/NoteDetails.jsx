import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../styles/NoteDetails.css'; // We'll create some basic styles

const NoteDetails = () => {
    const { notesCode } = useParams();
    const [detailedNote, setDetailedNote] = useState(null);
    const [noteInfo, setNoteInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

                // 1. Fetch Detailed Note content (Units, Intro)
                // We assume there is a generic route or we search by code. 
                // Since we just added /code/:notesCode to detailedNoteRoutes, we use that.
                const detailedRes = await axios.get(`${apiUrl}/api/detailed-notes/code/${notesCode}`);

                // 2. Fetch Basic Note Info (Links, Titles, Image)
                // We'll search through all notes to find the matching one, 
                // or if we added a specific route we'd use that. 
                // For now, fetching all and finding is safest without modifying existing noteRoutes logic too much, 
                // though querying just one is better performance-wise.
                // Let's rely on finding one instance from the main notes list logic if needed, 
                // but better: let's fetch all (cached usually) or implement a specific search in basic notes too 
                // if performance matters. For now: fetch all and find.
                const basicRes = await axios.get(`${apiUrl}/api/notes`);
                const basicInfo = basicRes.data.find(n => n.notesCode === notesCode);

                if (!detailedRes.data && !basicInfo) {
                    throw new Error('Note not found');
                }

                setDetailedNote(detailedRes.data);
                setNoteInfo(basicInfo || {}); // Fallback if basic info not found but detailed is
                setLoading(false);
            } catch (err) {
                console.error("Error fetching note details:", err);
                setError("Could not load note details. It might not exist yet.");
                setLoading(false);
            }
        };

        if (notesCode) fetchData();
    }, [notesCode]);

    if (loading) return (
        <Container className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    if (error) return (
        <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    if (!detailedNote) return <Container className="py-5"><Alert variant="warning">Content coming soon!</Alert></Container>;

    return (
        <div className="note-details-page py-5">
            <Container>
                {/* Header Section */}
                <div className="text-center mb-5">
                    <h1 className="main-title mb-2">{noteInfo?.title || detailedNote.notesTitle}</h1>
                    <p className="note-code-text mb-0">{detailedNote.notesCode}</p>
                </div>

                {/* Main Content Card */}
                <div className="main-card px-4 py-5 px-md-5">

                    {/* Section 1: Detailed Notes / Units */}
                    <div className="mb-5">
                        <h2 className="section-title mb-4">
                            {detailedNote.introTitle || `${detailedNote.notesCode} Notes`}
                        </h2>

                        <div className="units-list">
                            {detailedNote.units && detailedNote.units.map((unit, index) => (
                                <div key={index} className="resource-item d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                    <a href={unit.pdfLink} target="_blank" rel="noopener noreferrer" className="resource-link text-dark text-decoration-none">
                                        {unit.unitTitle}
                                    </a>
                                    <div className="owner-text mt-2 mt-md-0">
                                        Owner: <span>{unit.ownerName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: PYQ & Quantum */}
                    {(noteInfo?.pyqLink || noteInfo?.quantumLink) && (
                        <div className="mt-5">
                            <h2 className="section-title mb-4">
                                Last 6 Year Question Paper and Quantum
                            </h2>

                            <div className="resources-list d-flex flex-column gap-3">
                                {/* PYQ */}
                                {noteInfo?.pyqLink && (
                                    <div className="resource-item">
                                        <a href={noteInfo.pyqLink} target="_blank" rel="noopener noreferrer" className="resource-link text-dark text-decoration-none">
                                            {noteInfo?.pyqTitle || `${detailedNote.notesCode} PYQs 2024-2017`}
                                        </a>
                                    </div>
                                )}

                                {/* Quantum */}
                                {noteInfo?.quantumLink && (
                                    <div className="resource-item">
                                        <a href={noteInfo.quantumLink} target="_blank" rel="noopener noreferrer" className="resource-link text-dark text-decoration-none">
                                            {noteInfo?.quantumTitle || `${detailedNote.notesCode} Quantum`}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default NoteDetails;
