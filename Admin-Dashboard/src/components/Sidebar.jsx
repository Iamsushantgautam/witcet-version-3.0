import { NavLink, useNavigate } from 'react-router-dom';
import {
    Home,
    FileText,
    PlusCircle,
    Zap,
    FileCheck,
    User,
    FilePlus,
    List,
    Bell,
    LogOut,
    X // Import Close Icon
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: <Home size={18} />, label: 'Home', path: '/' },
        { icon: <PlusCircle size={18} />, label: 'Add Note', path: '/add-note' },
        { icon: <Zap size={18} />, label: 'Quantum', path: '/quantum' },
        { icon: <FileCheck size={18} />, label: 'PYQs', path: '/pyqs' },
        { icon: <User size={18} />, label: 'Profile', path: '/profile' },
        { icon: <FilePlus size={18} />, label: 'Add Detailed Notes', path: '/add-detailed-notes' },
        { icon: <List size={18} />, label: 'Detailed Notes List', path: '/detailed-notes' },
        { icon: <Bell size={18} />, label: 'Updates', path: '/updates' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <aside className={`sidebar-light ${isOpen ? 'show' : ''}`}>
            <div className="sidebar-header d-flex justify-content-between align-items-center">
                <h2 className="sidebar-title">Admin Panel</h2>
                {/* Close Button for Mobile */}
                <button
                    className="btn btn-link text-white d-lg-none p-0"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                        onClick={() => onClose && onClose()} // Close drawer when link clicked
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
