import React from 'react';
import './Skeleton.css';
import { Row, Col, Card } from 'react-bootstrap';

const Skeleton = ({ type, style }) => {
    return <div className={`skeleton ${type}`} style={style}></div>;
};

export const SkeletonCard = () => {
    return (
        <Card className="h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
            <Skeleton type="skeleton-image" />
            <div className="d-flex flex-column justify-content-between p-3 text-center h-100">
                <div className="w-100 d-flex flex-column align-items-center mt-2">
                    <Skeleton type="skeleton-title" />
                    <Skeleton type="skeleton-text" />
                </div>
                <div className="mt-auto w-100 d-flex justify-content-center">
                    <Skeleton type="skeleton-btn" />
                </div>
            </div>
        </Card>
    );
};

export const SkeletonGrid = ({ count = 6, lg = 4, md = 6 }) => {
    return (
        <Row className="g-4">
            {[...Array(count)].map((_, index) => (
                <Col md={md} lg={lg} key={index}>
                    <SkeletonCard />
                </Col>
            ))}
        </Row>
    );
};

export default Skeleton;
