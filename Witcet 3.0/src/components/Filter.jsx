import React from 'react';
import { Container } from 'react-bootstrap';

const Filter = () => {
    const filterItems = [
        {
            title: 'B.Tech Notes',
            href: '/notes',
            icon: '/images/notepad.png',
            bgColor: '#d1b3ff',
            isIcon: false
        },
        {
            title: 'Quantum',
            href: '/quantums',
            icon: '/images/stack-of-books.png',
            bgColor: '#ccffcc',
            isIcon: false
        },
        {
            title: 'Last 5 Year PYQ',
            href: '/pyqs',
            icon: '/images/light-bulb.png',
            bgColor: '#b3e0ff',
            isIcon: false
        },
        {
            title: 'Updates',
            href: '/updates',
            icon: 'fa fa-bell',
            bgColor: '#b3e0ff',
            isIcon: true
        },
        {
            title: 'Tools',
            href: '/tools',
            icon: 'fa fa-tools',
            bgColor: '#b3e0ff',
            isIcon: true
        }
    ];

    return (
        <Container className="custom-sc pt-lg-5 pt-3 pb-2">
            <div className="button-container d-flex justify-content-center flex-wrap gap-4">
                {filterItems.map((item, index) => (
                    <a key={index} href={item.href} className="btn btn-custom animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <span className="btn-icon" style={{ backgroundColor: item.bgColor }}>
                            {item.isIcon ? (
                                <i className={item.icon} aria-hidden="true" style={{ fontSize: '1.2rem', color: '#333' }}></i>
                            ) : (
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '📚';
                                    }}
                                />
                            )}
                        </span>
                        {item.title}
                    </a>
                ))}
            </div>
        </Container>
    );
};

export default Filter;
