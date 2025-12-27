import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, History, PlusCircle } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="brand">
                    <BookOpen size={24} />
                    <span>Sistem Cerdas</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${isActive('/')}`}>
                        <LayoutDashboard size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
                        <span className="hide-mobile">Dashboard</span>
                    </Link>
                    <Link to="/input" className={`nav-link ${isActive('/input')}`}>
                        <PlusCircle size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
                        <span className="hide-mobile">Input Data</span>
                    </Link>
                    <Link to="/riwayat" className={`nav-link ${isActive('/riwayat')}`}>
                        <History size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
                        <span className="hide-mobile">Riwayat</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
