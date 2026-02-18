import React from 'react';
import '../styles/Tools.css';

const SearchBar = ({ value, onChange, placeholder = "Search...", className = "mb-5" }) => {
    return (
        <div className={`tools-search-container ${className}`}>
            <i className="fas fa-search tools-search-icon"></i>
            <input
                type="text"
                id="tools-search-input"
                name="search"
                className="tools-search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ paddingLeft: '54px' }}
            />
        </div>
    );
};

export default SearchBar;
