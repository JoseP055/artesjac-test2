import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/layout.css';

export const Navbar = () => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const triggerPoint = window.innerHeight * 0.25;
            setIsSticky(scrollY > triggerPoint);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`navbar ${isSticky ? 'sticky' : ''}`}>
            {/* Top Links */}
            <div className="navbar-top">
                <div className="navbar-top-links">
                    <NavLink to="#">Featured Art</NavLink>
                    <NavLink to="#">Craft Ideas</NavLink>
                    <NavLink to="#">New Arrivals</NavLink>
                    <NavLink to="#">Special Offers</NavLink>
                    <NavLink to="#">Help Center</NavLink>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="navbar-main">
                {/* Navigation Links */}
                <nav className="navbar-links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/textile">Textile</NavLink>
                    <NavLink to="/art">Handmade Art</NavLink>
                    <NavLink to="/digital-art">Digital Art</NavLink>
                </nav>

                {/* Dropdown categories */}
                <div className="navbar-dropdown">
                    <button className="dropdown-button">All Categories</button>
                    <div className="dropdown-menu">
                        <NavLink to="#">Paintings</NavLink>
                        <NavLink to="#">Ceramics</NavLink>
                        <NavLink to="#">Sculptures</NavLink>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="navbar-search">
                    <input type="text" placeholder="Search for art or crafts..." />
                    <button>
                        <i className="fa fa-search"></i>
                    </button>
                </div>

                {/* Language and Cart */}
                <div className="navbar-actions">
                    <div className="language-selector">
                        <button className="language-button">
                            <img src="/images/flag-uk.png" className="language-flag" alt="EN" /> English <i className="fa fa-angle-down"></i>
                        </button>
                        <div className="language-menu">
                            <NavLink to="#">
                                <img src="/images/flag-france.png" className="language-flag" alt="FR" /> French
                            </NavLink>
                        </div>
                    </div>

                    <div className="navbar-user">
                        <NavLink to="/cart">
                            <i className="fa fa-shopping-cart"></i> <span>Cart</span>
                        </NavLink>
                        <NavLink to="/account">
                            <i className="fa fa-user"></i> <span>Account</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
};
