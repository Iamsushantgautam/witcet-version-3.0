import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/Filter.css';

const Filter = () => {
    const filterItems = [
        {
            title: 'B.Tech Notes',
            subtitle: 'Handwritten & Typed',
            href: '/notes',
            icon: '/images/notepad.png',
            bgColor: '#eff6ff', // Soft Blue
            iconColor: '#3b82f6',
            isIcon: false
        },
        {
            title: 'Quantum Series',
            subtitle: 'Quick Revision',
            href: '/quantums',
            icon: '/images/stack-of-books.png',
            bgColor: '#ecfdf5', // Soft Green
            iconColor: '#10b981',
            isIcon: false
        },
        {
            title: 'PYQ Papers',
            subtitle: 'Last 5+ Years',
            href: '/pyqs',
            icon: '/images/light-bulb.png',
            bgColor: '#fff7ed', // Soft Orange
            iconColor: '#f97316',
            isIcon: false
        },
        {
            title: 'Latest Updates',
            subtitle: 'Stay Informed',
            href: '/updates',
            icon: '/images/updates.png',
            bgColor: '#fff1f2', // Soft Rose
            iconColor: '#e11d48',
            isIcon: false
        },
        {
            title: 'Dev Tools',
            subtitle: 'Build Faster',
            href: '/tools',
            icon: 'fas fa-tools',
            bgColor: '#f5f3ff', // Soft Purple
            iconColor: '#8b5cf6',
            isIcon: true
        },
        {
            title: 'Special Offers',
            subtitle: 'Save Big',
            href: '/offers',
            icon: '/images/offers.png',
            bgColor: '#f0f9ff', // Soft Sky
            iconColor: '#0ea5e9',
            isIcon: false
        }
    ];

    return (
        <section className="filter-section">
            <Container>
                <div className="filter-grid">
                    {filterItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="filter-item-card animate-grid-item"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="filter-icon-box" style={{ backgroundColor: item.bgColor }}>
                                {item.isIcon ? (
                                    <i className={item.icon} aria-hidden="true" style={{ color: item.iconColor }}></i>
                                ) : (
                                    <img
                                        src={item.icon}
                                        alt={item.title}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            const icon = document.createElement('i');
                                            icon.className = 'fas fa-book';
                                            icon.style.color = item.iconColor;
                                            e.target.parentElement.appendChild(icon);
                                        }}
                                    />
                                )}
                            </div>
                            <h3 className="filter-title">{item.title}</h3>
                            <span className="filter-subtitle">{item.subtitle}</span>
                        </a>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Filter;
