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
                    <NavLink to="#">Best Sellers</NavLink>
                    <NavLink to="#">Gift Ideas</NavLink>
                    <NavLink to="#">New Releases</NavLink>
                    <NavLink to="#">Today's Deals</NavLink>
                    <NavLink to="#">Customer Service</NavLink>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="navbar-main">
                {/* Navigation Links */}
                <nav className="navbar-links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/fashion">Fashion</NavLink>
                    <NavLink to="/electronic">Electronic</NavLink>
                    <NavLink to="/jewellery">Jewellery</NavLink>
                </nav>

                {/* Dropdown categories */}
                <div className="navbar-dropdown">
                    <button className="dropdown-button">All Categories</button>
                    <div className="dropdown-menu">
                        <NavLink to="#">Action</NavLink>
                        <NavLink to="#">Another action</NavLink>
                        <NavLink to="#">Something else</NavLink>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="navbar-search">
                    <input type="text" placeholder="Search..." />
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
                        <NavLink to="#">
                            <i className="fa fa-shopping-cart"></i> <span>Cart</span>
                        </NavLink>
                        <NavLink to="#">
                            <i className="fa fa-user"></i> <span>Account</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
};
