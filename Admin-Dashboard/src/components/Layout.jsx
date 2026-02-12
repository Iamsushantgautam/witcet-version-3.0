import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="app-container">
            {/* Mobile Header with Toggle */}
            <header className="mobile-header d-lg-none">
                <button className="btn btn-link text-dark p-0" onClick={toggleSidebar}>
                    <Menu size={28} />
                </button>
                <h4 className="m-0 ms-3 fw-bold text-primary">Witcet Admin</h4>
            </header>

            {/* Sidebar with Props */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Backdrop for Mobile */}
            <div
                className={`sidebar-backdrop d-lg-none ${sidebarOpen ? 'show' : ''}`}
                onClick={closeSidebar}
            ></div>

            <main className="main-content-light">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
