import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';

const TcsNqt = () => {
    return (
        <section className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Container>
                {/* Header Section */}
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-5 mb-2" style={{ color: '#0056b3' }}>TCS All India NQT Hiring</h1>
                    <h2 className="h3 text-muted fw-bold">Batch of 2026, 2025 & 2024</h2>
                    <p className="lead mt-3 text-secondary" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        Your gateway to a career with TCS. Don't miss this opportunity to kickstart your journey with Prime and Digital offers.
                    </p>
                </div>

                {/* Important Dates & Apply */}
                <Row className="justify-content-center mb-5">
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body className="p-4 p-md-5">
                                <h3 className="h4 fw-bold mb-4" style={{ color: '#334155' }}>Important Dates</h3>
                                <Row className="text-center g-4 mb-4">
                                    <Col md={4}>
                                        <div className="p-3 rounded bg-light">
                                            <span className="d-block text-muted small fw-bold text-uppercase">Registration Start</span>
                                            <span className="d-block h5 fw-bold text-primary mb-0">18 Feb 2026</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="p-3 rounded bg-light">
                                            <span className="d-block text-muted small fw-bold text-uppercase">Registration End</span>
                                            <span className="d-block h5 fw-bold text-danger mb-0">08 Mar 2026</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="p-3 rounded bg-light">
                                            <span className="d-block text-muted small fw-bold text-uppercase">Test Date</span>
                                            <span className="d-block h5 fw-bold text-success mb-0">10 Mar 2026 Onwards</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Button
                                    href="https://nextstep.tcsapps.com/indiacampus/#/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="primary"
                                    size="lg"
                                    className="px-5 rounded-pill fw-bold shadow-sm"
                                >
                                    Apply Now
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Card className="border-0 shadow-sm mb-5">
                    <Card.Body className="p-4">
                        <h2 className="h4 fw-bold mb-3" style={{ color: '#334155' }}>What is TCS NQT?</h2>
                        <p className="text-muted mb-0" style={{ lineHeight: '1.7' }}>
                            TCS NQT (National Qualifier Test) is an integrated test consisting of two sections: Foundation and Advanced.
                            It is used by TCS and other top corporates to hire fresh talent. Based on performance, candidates can qualify for
                            <span className="fw-semibold text-primary"> Prime</span>,
                            <span className="fw-semibold text-success"> Digital</span>, or
                            <span className="fw-semibold text-info"> Ninja</span> interview opportunities.
                            The NQT score is valid for 2 years.
                        </p>
                    </Card.Body>
                </Card>
                {/* Eligibility Criteria */}
                <Card className="border-0 shadow-sm mb-5">
                    <Card.Body className="p-4">
                        <h2 className="h4 fw-bold mb-4" style={{ color: '#334155' }}>Eligibility Criteria</h2>
                        <Row className="g-3">
                            <Col md={6}>
                                <div className="d-flex align-items-start">
                                    <div className="me-3 mt-1 text-primary">
                                        <i className="fas fa-graduation-cap fa-lg"></i>
                                    </div>
                                    <div>
                                        <h5 className="h6 fw-bold mb-1">Highest Qualification</h5>
                                        <p className="text-muted small mb-0">
                                            Batch of 2024, 2025 & 2026. <br />
                                            B.Tech/B.E, M.Tech/M.E, MCA, M.Sc/M.S.
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex align-items-start">
                                    <div className="me-3 mt-1 text-primary">
                                        <i className="fas fa-percentage fa-lg"></i>
                                    </div>
                                    <div>
                                        <h5 className="h6 fw-bold mb-1">Academic Aggregate</h5>
                                        <p className="text-muted small mb-0">
                                            Minimum 60% or 6 CGPA in Class X, XII, Diploma, Graduation, and Post-Graduation.
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex align-items-start">
                                    <div className="me-3 mt-1 text-primary">
                                        <i className="fas fa-history fa-lg"></i>
                                    </div>
                                    <div>
                                        <h5 className="h6 fw-bold mb-1">Backlogs & Gaps</h5>
                                        <p className="text-muted small mb-0">
                                            No active backlogs. Overall academic gap should not exceed 24 months (2 years).
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex align-items-start">
                                    <div className="me-3 mt-1 text-primary">
                                        <i className="fas fa-briefcase fa-lg"></i>
                                    </div>
                                    <div>
                                        <h5 className="h6 fw-bold mb-1">Experience & Age</h5>
                                        <p className="text-muted small mb-0">
                                            Work experience up to 2 years only. <br />
                                            Age: 18 to 28 years.
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                {/* Cutoff Trends & Selection Process */}
                <Row className="g-4 mb-5">
                    <Col lg={6}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <h2 className="h4 fw-bold mb-4" style={{ color: '#334155' }}>Expected Cutoff Trends</h2>
                                <p className="text-muted small mb-3">
                                    TCS does not officially reveal cutoffs, but based on past trends, here are the expected safety scores:
                                </p>
                                <div className="table-responsive">
                                    <table className="table table-sm table-borderless">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Section</th>
                                                <th className="text-center">Safe Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Verbal Ability</td>
                                                <td className="text-center fw-bold text-dark">75%+</td>
                                            </tr>
                                            <tr>
                                                <td>Reasoning Ability</td>
                                                <td className="text-center fw-bold text-dark">70%+</td>
                                            </tr>
                                            <tr>
                                                <td>Numerical Ability</td>
                                                <td className="text-center fw-bold text-dark">70%+</td>
                                            </tr>
                                            <tr>
                                                <td>Advanced Coding</td>
                                                <td className="text-center fw-bold text-dark">1 Q (Digital) / 2 Q (Prime)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-3 p-3 bg-light rounded border-start border-4 border-primary">
                                    <small className="d-block text-muted">
                                        <strong>Ninja:</strong> High accuracy in Foundation sections.
                                    </small>
                                    <small className="d-block text-muted mt-1">
                                        <strong>Digital:</strong> Foundation + 1 Coding Question.
                                    </small>
                                    <small className="d-block text-muted mt-1">
                                        <strong>Prime:</strong> Foundation + Both Coding Questions.
                                    </small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <h2 className="h4 fw-bold mb-4" style={{ color: '#334155' }}>Selection Process</h2>
                                <div className="timeline-box">
                                    <div className="d-flex mb-4">
                                        <div className="me-3">
                                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>1</div>
                                        </div>
                                        <div>
                                            <h5 className="h6 fw-bold mb-1">Online NQT Exam</h5>
                                            <p className="text-muted small mb-0">Integrated test (Foundation + Advanced). Performance here decides your profile interview (Ninja/Digital/Prime).</p>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-4">
                                        <div className="me-3">
                                            <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>2</div>
                                        </div>
                                        <div>
                                            <h5 className="h6 fw-bold mb-1">Technical Interview</h5>
                                            <p className="text-muted small mb-0">Questions on your Resume, Projects, OOPs, DBMS, CN, and Coding logic. Difficulty varies by profile.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex mb-4">
                                        <div className="me-3">
                                            <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>3</div>
                                        </div>
                                        <div>
                                            <h5 className="h6 fw-bold mb-1">Managerial Interview</h5>
                                            <p className="text-muted small mb-0">Situational analysis, Team fitment, and Leadership qualities assessment.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="me-3">
                                            <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>4</div>
                                        </div>
                                        <div>
                                            <h5 className="h6 fw-bold mb-1">HR Interview</h5>
                                            <p className="text-muted small mb-0">Behavioral check, documentation verification, relocation willingness, and final offer discussion.</p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* Salary Packages */}
                <Card className="border-0 shadow-sm mb-5">
                    <Card.Body className="p-4">
                        <h3 className="h4 fw-bold mb-4 mt-4" style={{ color: '#334155' }}>Launch your career with higher CTC opportunities</h3>
                        <div className="table-responsive">
                            <Table bordered hover className="align-middle text-center mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th rowSpan="2" className="align-middle">Offer Category</th>
                                        <th colSpan="2">Experience: 0 to 1 year</th>
                                        <th colSpan="2">Experience: 1 to 2 years</th>
                                    </tr>
                                    <tr>
                                        <th>CTC Range - UG</th>
                                        <th>CTC Range - PG</th>
                                        <th>CTC Range - UG</th>
                                        <th>CTC Range - PG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-bold text-primary">Prime</td>
                                        <td>9.09 LPA - 9.30 LPA</td>
                                        <td>11.59 LPA - 11.80 LPA</td>
                                        <td>9.45 LPA - 9.66 LPA</td>
                                        <td>12.05 LPA - 12.26 LPA</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-success">Digital</td>
                                        <td>7.09 LPA - 7.30 LPA</td>
                                        <td>7.39 LPA - 7.60 LPA</td>
                                        <td>7.50 LPA - 7.72 LPA</td>
                                        <td>7.82 LPA - 8.04 LPA</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-info">Ninja</td>
                                        <td>3.36 LPA</td>
                                        <td>3.53 LPA</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div className="mt-3 text-muted small">
                            * Actual Compensation basis work experience and Job location.
                        </div>
                    </Card.Body>
                </Card>

                {/* Application Process */}
                <Card className="border-0 shadow-sm mb-5">
                    <Card.Body className="p-4 p-md-5">
                        <h2 className="h4 fw-bold mb-4" style={{ color: '#334155' }}>Application Process</h2>
                        <div className="alert alert-info mb-4" role="alert">
                            <i className="fas fa-info-circle me-2"></i><strong>Note:</strong> Please go through the FAQ's before you register and fill the form.
                        </div>

                        <div className="process-steps">
                            <div className="mb-4">
                                <h5 className="fw-bold text-dark"><span className="text-primary me-2">Step 1.</span>Log in to the <a href="https://nextstep.tcsapps.com/indiacampus/#/" target="_blank" rel="noopener noreferrer" className="text-decoration-underline">TCS NextStep Portal</a></h5>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-bold text-dark"><span className="text-primary me-2">Step 2.</span>Register and Apply for the Drive</h5>
                                <ul className="list-unstyled ms-4 mt-2">
                                    <li className="mb-3">
                                        <strong>Scenario A:</strong> If you are already a registered user under TCS NextStep Portal, 'IT' category, kindly <strong>log in</strong> with your TCS Reference ID (CT/DT reference number). It is mandatory to click on <strong>'Apply For Drive'</strong> option to complete your registration.
                                    </li>
                                    <li>
                                        <strong>Scenario B:</strong> If you are a new user, kindly click on <strong>'Register Now'</strong>, choose category as <strong>"IT"</strong> and proceed to fill in your details. It is mandatory to click on <strong>'Apply For Drive'</strong> option to complete your registration.
                                    </li>
                                </ul>
                                <div className="ms-4 mt-3 fw-bold text-danger">The application form can be filled after the test results are declared.</div>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-bold text-dark"><span className="text-primary me-2">Step 3.</span>Select the skill on which you wish to be evaluated.</h5>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-bold text-dark"><span className="text-primary me-2">Step 4.</span>Select In-centre mode of test, choose your 3 preferred test centers and click 'Apply'.</h5>
                                <p className="ms-4 text-muted small mt-1 mb-0">Kindly note that allocation of test centre will depend on the centre availability.</p>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-bold text-dark"><span className="text-primary me-2">Step 5.</span>Select the 3 preferred job cities.</h5>
                            </div>

                            <div className="mb-0">
                                <h5 className="fw-bold text-dark"><span className="text-primary me-2">Step 6.</span>To confirm your status, check "Track Your Application".</h5>
                                <p className="ms-4 text-muted mt-1 mb-0">The status should reflect as <strong className="text-success">"Applied for Drive"</strong>.</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Row className="g-4">
                    {/* Exam Pattern */}
                    <Col lg={7}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <h2 className="h4 fw-bold mb-4" style={{ color: '#334155' }}>Exam Pattern</h2>
                                <div className="table-responsive">
                                    <table className="table table-bordered align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Section</th>
                                                <th>Sub-Section</th>
                                                <th className="text-center">Questions</th>
                                                <th className="text-center">Duration (mins)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Part A */}
                                            <tr>
                                                <td rowSpan="3" className="fw-bold text-secondary bg-light">
                                                    Part A<br />
                                                    <small className="fw-normal">Foundation Section</small>
                                                </td>
                                                <td>Numerical Ability</td>
                                                <td className="text-center">20</td>
                                                <td className="text-center">25</td>
                                            </tr>
                                            <tr>
                                                <td>Verbal Ability</td>
                                                <td className="text-center">25</td>
                                                <td className="text-center">25</td>
                                            </tr>
                                            <tr>
                                                <td>Reasoning Ability</td>
                                                <td className="text-center">20</td>
                                                <td className="text-center">25</td>
                                            </tr>
                                            <tr className="table-light fw-bold">
                                                <td colSpan="3">Part A Total Duration</td>
                                                <td className="text-center">75</td>
                                            </tr>

                                            {/* Part B */}
                                            <tr>
                                                <td rowSpan="2" className="fw-bold text-secondary bg-light">
                                                    Part B<br />
                                                    <small className="fw-normal">Advanced Section</small>
                                                </td>
                                                <td>Advanced Quantitative & Reasoning Ability</td>
                                                <td className="text-center">20</td>
                                                <td className="text-center">25</td>
                                            </tr>
                                            <tr>
                                                <td>Advanced Coding</td>
                                                <td className="text-center">2</td>
                                                <td className="text-center">90</td>
                                            </tr>
                                            <tr className="table-light fw-bold">
                                                <td colSpan="3">Part B Total Duration</td>
                                                <td className="text-center">115</td>
                                            </tr>
                                        </tbody>
                                        <tfoot className="table-dark">
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold">Total Test Duration</td>
                                                <td className="text-center fw-bold">190</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Syllabus */}
                    <Col lg={5}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <h2 className="h4 fw-bold mb-4" style={{ color: '#334155' }}>Syllabus Highlights</h2>
                                <ul className="list-unstyled">
                                    <li className="mb-4">
                                        <div className="d-flex align-items-center mb-2">
                                            <Badge bg="primary" className="me-2 p-2 rounded-circle"><i className="fas fa-calculator"></i></Badge>
                                            <strong className="text-dark">Foundation Section</strong>
                                        </div>
                                        <p className="text-muted small ms-4 ps-2 border-start border-2">
                                            Numerical, Verbal, and Reasoning ability focusing on speed and accuracy. Includes Arithmetic, Grammar, Reading Comprehension, Logic Puzzles.
                                        </p>
                                    </li>
                                    <li className="mb-4">
                                        <div className="d-flex align-items-center mb-2">
                                            <Badge bg="success" className="me-2 p-2 rounded-circle"><i className="fas fa-brain"></i></Badge>
                                            <strong className="text-dark">Advanced Quant & Reasoning</strong>
                                        </div>
                                        <p className="text-muted small ms-4 ps-2 border-start border-2">
                                            Higher-level problem solving, heuristic thinking, and advanced logical reasoning scenarios.
                                        </p>
                                    </li>
                                    <li className="mb-0">
                                        <div className="d-flex align-items-center mb-2">
                                            <Badge bg="danger" className="me-2 p-2 rounded-circle"><i className="fas fa-code"></i></Badge>
                                            <strong className="text-dark">Advanced Coding</strong>
                                        </div>
                                        <p className="text-muted small ms-4 ps-2 border-start border-2">
                                            Hands-on coding problems requiring efficient algorithms and data structures understanding.
                                        </p>
                                    </li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Resource Link - Updated text */}
                <div className="mt-5 text-center">
                    <Card className="border-0 bg-white shadow-sm d-inline-block mx-auto" style={{ maxWidth: '800px', width: '100%' }}>
                        <Card.Body className="p-5">
                            <h3 className="h4 fw-bold mb-3" style={{ color: '#1e293b' }}>Ready to Start Your Preparation?</h3>
                            <p className="text-muted mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                This course is free on YouTube and is also offered by GeeksforGeeks. Get the complete preparation roadmap including detailed videos, MCQs, and question banks.
                            </p>
                            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                                <Button
                                    variant="danger"
                                    href="https://youtube.com/playlist?list=PLqM7alHXFySEgUZPe57fURJrIt6rXZisW&si=MF4SclJijlTMwQMq"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-pill px-4 shadow-sm"
                                >
                                    <i className="fab fa-youtube me-2"></i> Aptitude Playlist
                                </Button>
                                <Button
                                    variant="danger"
                                    href="https://youtube.com/playlist?list=PLqM7alHXFySErksMR-z2wxFMTDV-uiDUO&si=wUf_D5MjwkG6OZS1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-pill px-4 shadow-sm"
                                >
                                    <i className="fab fa-youtube me-2"></i> Verbal Playlist
                                </Button>
                                <Button
                                    variant="danger"
                                    href="https://youtube.com/playlist?list=PLqM7alHXFySFSlR00usGeOFRpcFUVYkMp&si=qGj8i_u2UuSJVGEE"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-pill px-4 shadow-sm"
                                >
                                    <i className="fab fa-youtube me-2"></i> Coding Playlist
                                </Button>
                            </div>
                            <Button
                                variant="primary"
                                size="lg"
                                href="https://www.geeksforgeeks.org/interview-prep/tcs-nqt-preparation-guide-2026-videos-mcqs-questions-bank/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 rounded-pill fw-bold shadow-sm"
                            >
                                GFG Preparation Guide <i className="fas fa-external-link-alt ms-2 small"></i>
                            </Button>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </section>
    );
};

export default TcsNqt;
